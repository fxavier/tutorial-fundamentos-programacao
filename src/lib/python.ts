/**
 * Cliente do worker de Python. Uma única instância partilhada por toda a aplicação:
 * o Pyodide são ~12 MB e demora alguns segundos a arrancar, por isso arranca à
 * primeira execução e fica em memória para as seguintes.
 */
import type { RunRequest, RunMessage } from './python.worker';

export interface PyLine { text: string; err?: boolean }
export interface PyResult { output: PyLine[]; error: string | null; ms: number }

let worker: Worker | null = null;
let cancel: (() => void) | null = null;

function get(): Worker {
  worker ??= new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
  return worker;
}

/** Mata o interpretador — a saída de emergência para um ciclo infinito. */
export function stopPython() {
  cancel?.();
  worker?.terminate();
  worker = null;
  cancel = null;
}

export function isPythonWarm() {
  return worker !== null;
}

export function runPython(req: RunRequest, onStatus?: (text: string) => void): Promise<PyResult> {
  const w = get();
  const output: PyLine[] = [];

  return new Promise<PyResult>((resolve, reject) => {
    const finish = () => { w.removeEventListener('message', onMessage); w.removeEventListener('error', onError); cancel = null; };

    const onMessage = (e: MessageEvent<RunMessage>) => {
      const m = e.data;
      if (m.type === 'status') onStatus?.(m.text);
      else if (m.type === 'out') output.push(...m.text.split('\n').map((text) => ({ text, err: m.err })));
      else { finish(); resolve({ output, error: m.error, ms: m.ms }); }
    };
    const onError = () => { finish(); resolve({ output, error: 'Não foi possível carregar o Python. Verifica a ligação à internet.', ms: 0 }); };

    cancel = () => { finish(); reject(new Error('interrompido')); };
    w.addEventListener('message', onMessage);
    w.addEventListener('error', onError);
    w.postMessage(req satisfies RunRequest);
  });
}
