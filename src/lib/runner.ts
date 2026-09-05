/**
 * Cliente genérico de um worker que executa código e devolve linhas de saída.
 * É partilhado pelo laboratório de Python (Pyodide) e pelo de JavaScript/Node:
 * o protocolo de mensagens é o mesmo — 'status', 'out' e 'done'.
 */
export interface RunLine { text: string; err?: boolean }
export interface RunResult { output: RunLine[]; error: string | null; ms: number }

type Mensagem =
  | { type: 'status'; text: string }
  | { type: 'out'; text: string; err?: boolean }
  | { type: 'done'; error: string | null; ms: number };

export interface Runner<Req> {
  run(req: Req, onStatus?: (text: string) => void): Promise<RunResult>;
  /** Mata o interpretador — a saída de emergência para um ciclo infinito. */
  stop(): void;
}

export function createRunner<Req>(criarWorker: () => Worker, erroDeArranque: string): Runner<Req> {
  let worker: Worker | null = null;
  let cancelar: (() => void) | null = null;

  const stop = () => {
    cancelar?.();
    worker?.terminate();
    worker = null;
    cancelar = null;
  };

  return {
    stop,
    run(req, onStatus) {
      worker ??= criarWorker();
      const w = worker;
      const output: RunLine[] = [];

      return new Promise<RunResult>((resolve, reject) => {
        const limpar = () => {
          w.removeEventListener('message', aoReceber);
          w.removeEventListener('error', aoFalhar);
          cancelar = null;
        };
        const aoReceber = (e: MessageEvent<Mensagem>) => {
          const m = e.data;
          if (m.type === 'status') onStatus?.(m.text);
          else if (m.type === 'out') output.push(...m.text.split('\n').map((text) => ({ text, err: m.err })));
          else { limpar(); resolve({ output, error: m.error, ms: m.ms }); }
        };
        const aoFalhar = () => { limpar(); resolve({ output, error: erroDeArranque, ms: 0 }); };

        cancelar = () => { limpar(); reject(new Error('interrompido')); };
        w.addEventListener('message', aoReceber);
        w.addEventListener('error', aoFalhar);
        w.postMessage(req);
      });
    },
  };
}
