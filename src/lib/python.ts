/**
 * Laboratório de Python. Uma única instância partilhada por toda a aplicação: o
 * Pyodide são ~12 MB e demora alguns segundos a arrancar, por isso arranca à
 * primeira execução e fica em memória para as seguintes.
 */
import { createRunner } from './runner';
import type { RunRequest } from './python.worker';

export type { RunLine as PyLine, RunResult as PyResult } from './runner';

export const pythonRunner = createRunner<RunRequest>(
  () => new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' }),
  'Não foi possível carregar o Python. Verifica a ligação à internet.',
);
