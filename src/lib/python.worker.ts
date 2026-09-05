/**
 * Worker que corre Python real (CPython 3.13 compilado para WebAssembly, via Pyodide).
 * Fica num worker por uma razão prática: um `while True:` de um aluno bloqueia só o
 * worker, que o interface pode terminar — na página principal congelaria o browser.
 */
const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';

/* Pyodide não traz tipos e não é uma dependência do package.json — daí o any. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Pyodide = any;

export interface RunRequest { code: string; stdin?: string; packages?: string[] }
export type RunMessage =
  | { type: 'status'; text: string }
  | { type: 'out'; text: string; err?: boolean }
  | { type: 'done'; error: string | null; ms: number };

const post = (m: RunMessage) => (self as any).postMessage(m);

/** Substitui input() para ler da caixa "Entrada" em vez de bloquear no stdin real. */
const STDIN_SHIM = [
  'import builtins as _b',
  '_it = iter(_STDIN_LINES)',
  'def _input(prompt=""):',
  '    if prompt: print(prompt, end="")',
  '    try: _v = next(_it)',
  '    except StopIteration: raise EOFError("Não há mais dados de entrada. Acrescenta linhas na caixa Entrada.")',
  '    print(_v)',
  '    return _v',
  '_b.input = _input',
].join('\n');

let booting: Promise<Pyodide> | null = null;
const installed = new Set<string>();

function boot(): Promise<Pyodide> {
  booting ??= (async () => {
    post({ type: 'status', text: 'A carregar o Python… (só na primeira execução)' });
    const { loadPyodide } = await import(/* @vite-ignore */ `${CDN}pyodide.mjs`);
    const py: Pyodide = await loadPyodide({ indexURL: CDN });
    py.setStdout({ batched: (text: string) => post({ type: 'out', text }) });
    py.setStderr({ batched: (text: string) => post({ type: 'out', text, err: true }) });
    return py;
  })();
  return booting;
}

/** Traceback do Pyodide → mensagem curta com a linha do erro. */
function shortError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lines = raw.trimEnd().split('\n');
  const last = lines[lines.length - 1] ?? raw;
  const where = lines.find((l) => l.includes('line') && l.includes('<exec>'));
  const linha = where?.match(/line (\d+)/)?.[1];
  return linha ? `${last} (linha ${linha})` : last;
}

self.onmessage = async (e: MessageEvent<RunRequest>) => {
  const { code, stdin = '', packages = [] } = e.data;
  const t0 = performance.now();
  try {
    const py = await boot();
    const faltam = packages.filter((p) => !installed.has(p));
    if (faltam.length) {
      post({ type: 'status', text: `A instalar ${faltam.join(', ')}…` });
      await py.loadPackage(faltam);
      faltam.forEach((p) => installed.add(p));
    }
    post({ type: 'status', text: '' });

    const linhas = stdin.split('\n').filter((l, i, a) => l !== '' || i < a.length - 1);
    py.globals.set('_STDIN_LINES', py.toPy(linhas));
    py.runPython(STDIN_SHIM);
    await py.runPythonAsync(code);
    post({ type: 'done', error: null, ms: Math.round(performance.now() - t0) });
  } catch (err) {
    post({ type: 'done', error: shortError(err), ms: Math.round(performance.now() - t0) });
  }
};
