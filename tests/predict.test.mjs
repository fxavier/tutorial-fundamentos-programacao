/**
 * Os exercícios do tipo 'predict' mostram código Python e pedem ao aluno a saída.
 * Este teste corre esse código com o python3 local e confirma que a resposta
 * declarada em `accept` é mesmo a que o interpretador produz — se a saída mudar,
 * o teste falha em vez de o aluno ser corrigido com uma resposta errada.
 *
 * No browser o código corre em Pyodide (CPython 3.13 em WebAssembly); aqui corre
 * no python3 do sistema. Se não houver python3, ou faltar um pacote (pandas),
 * o caso é saltado em vez de falhar.
 */
import { test, skip } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { MODULES } from '../.tmp/content.mjs';
import { normalizeAnswer } from '../.tmp/numbers.mjs';

const PY = spawnSync('python3', ['-c', 'print(1)'], { encoding: 'utf8' }).status === 0 ? 'python3' : null;

const predicts = MODULES.flatMap((m) => m.exercises.filter((e) => e.kind === 'predict'));

function temPacotes(pacotes) {
  if (!pacotes?.length) return true;
  return spawnSync(PY, ['-c', pacotes.map((p) => `import ${p}`).join(';')], { encoding: 'utf8' }).status === 0;
}

test('há exercícios de previsão para verificar', () => {
  assert.ok(predicts.length >= 8, `poucos exercícios de previsão: ${predicts.length}`);
});

for (const ex of predicts) {
  test(`${ex.id}: a saída real corresponde a accept`, (t) => {
    if (!PY) return skip('python3 não está disponível');
    if (!temPacotes(ex.packages)) return t.skip(`faltam pacotes: ${ex.packages.join(', ')}`);

    const r = spawnSync(PY, ['-c', ex.code], { encoding: 'utf8', timeout: 20000 });
    assert.equal(r.status, 0, `${ex.id}: o código rebentou:\n${r.stderr}`);

    const real = normalizeAnswer(r.stdout);
    const aceites = ex.accept.map(normalizeAnswer);
    assert.ok(
      aceites.includes(real),
      `${ex.id}: saída real ${JSON.stringify(r.stdout)} não corresponde a nenhuma de ${JSON.stringify(ex.accept)}`,
    );
  });
}
