/**
 * Os exercícios do tipo 'predict' mostram código e pedem ao aluno a saída.
 * Este teste corre esse código e confirma que a resposta declarada em `accept`
 * é mesmo a que sai — se a saída mudar, o teste falha em vez de o aluno ser
 * corrigido com uma resposta errada.
 *
 * Cada linguagem é verificada no mesmo motor que o aluno usa:
 *   - Python: o python3 do sistema (no browser é o Pyodide, o mesmo CPython 3.13).
 *     Sem python3, ou sem os pacotes de um exercício (pandas), o caso é saltado.
 *   - JavaScript: o próprio worker do laboratório, incluindo o shim de Node.
 */
import { test, skip } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { MODULES } from '../.tmp/content.mjs';
import { normalizeAnswer } from '../.tmp/numbers.mjs';

const PY = spawnSync('python3', ['-c', 'print(1)'], { encoding: 'utf8' }).status === 0 ? 'python3' : null;

/* O worker do laboratório, carregado uma vez com um `self` de mentira. */
globalThis.self = globalThis;
let aoTerminar = null;
let linhas = [];
globalThis.postMessage = (m) => {
  if (m.type === 'out') linhas.push(m.text);
  else if (m.type === 'done') aoTerminar(m);
};
await import('../.tmp/js-worker.mjs');

function correrJs(code, argv = []) {
  linhas = [];
  return new Promise((resolve) => {
    aoTerminar = (m) => resolve({ stdout: linhas.join('\n'), error: m.error });
    self.onmessage({ data: { code, argv } });
  });
}

const predicts = MODULES.flatMap((m) => m.exercises.filter((e) => e.kind === 'predict'));

function temPacotes(pacotes) {
  if (!pacotes?.length) return true;
  return spawnSync(PY, ['-c', pacotes.map((p) => `import ${p}`).join(';')], { encoding: 'utf8' }).status === 0;
}

function verificar(ex, saida) {
  const real = normalizeAnswer(saida);
  const aceites = ex.accept.map(normalizeAnswer);
  assert.ok(
    aceites.includes(real),
    `${ex.id}: saída real ${JSON.stringify(saida)} não corresponde a nenhuma de ${JSON.stringify(ex.accept)}`,
  );
}

test('há exercícios de previsão para verificar', () => {
  assert.ok(predicts.length >= 8, `poucos exercícios de previsão: ${predicts.length}`);
});

for (const ex of predicts) {
  test(`${ex.id}: a saída real corresponde a accept`, async (t) => {
    if (ex.lang === 'js') {
      const r = await correrJs(ex.code);
      assert.equal(r.error, null, `${ex.id}: o código rebentou: ${r.error}`);
      return verificar(ex, r.stdout);
    }

    if (!PY) return skip('python3 não está disponível');
    if (!temPacotes(ex.packages)) return t.skip(`faltam pacotes: ${ex.packages.join(', ')}`);

    const r = spawnSync(PY, ['-c', ex.code], { encoding: 'utf8', timeout: 20000 });
    assert.equal(r.status, 0, `${ex.id}: o código rebentou:\n${r.stderr}`);
    verificar(ex, r.stdout);
  });
}
