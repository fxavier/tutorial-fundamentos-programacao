/** Laboratório de JavaScript/Node. Corre nativamente — não precisa de rede. */
import { createRunner } from './runner';
import type { RunRequest } from './js.worker';

export type { RunLine as JsLine, RunResult as JsResult } from './runner';

export const jsRunner = createRunner<RunRequest>(
  () => new Worker(new URL('./js.worker.ts', import.meta.url), { type: 'module' }),
  'Não foi possível arrancar o motor de JavaScript.',
);
