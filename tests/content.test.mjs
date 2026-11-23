import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, TRACKS, GLOSSARY } from '../.tmp/content.mjs';
import { WIDGET_IDS } from '../.tmp/widget-ids.mjs';

test('todos os módulos têm estrutura completa', () => {
  assert.equal(MODULES.length, 12);
  for (const m of MODULES) {
    assert.ok(m.id && m.title && m.subtitle && m.icon, `módulo sem metadados: ${m.id}`);
    assert.ok(m.goals.length >= 3, `${m.id}: poucos objetivos`);
    assert.ok(m.sections.length >= 4, `${m.id}: poucas secções`);
    assert.ok(m.quiz.length >= 4, `${m.id}: poucas perguntas`);
    assert.ok(m.exercises.length >= 2, `${m.id}: poucos exercícios`);
    assert.ok(m.minutes > 0);
  }
});

test('ids são únicos', () => {
  const ids = new Set();
  for (const m of MODULES) {
    assert.ok(!ids.has(m.id), `módulo duplicado: ${m.id}`);
    ids.add(m.id);
    const secs = new Set();
    for (const s of m.sections) {
      assert.ok(!secs.has(s.id), `secção duplicada em ${m.id}: ${s.id}`);
      secs.add(s.id);
    }
  }
  const qids = new Set();
  const eids = new Set();
  for (const m of MODULES) {
    for (const q of m.quiz) {
      assert.ok(!qids.has(m.id + q.id), `pergunta duplicada: ${m.id}/${q.id}`);
      qids.add(m.id + q.id);
    }
    for (const e of m.exercises) {
      assert.ok(!eids.has(e.id), `exercício duplicado globalmente: ${e.id}`);
      eids.add(e.id);
    }
  }
});

test('quizzes são válidos', () => {
  for (const m of MODULES) {
    for (const q of m.quiz) {
      assert.ok(q.options.length >= 3, `${m.id}/${q.id}: menos de 3 opções`);
      assert.ok(Number.isInteger(q.answer), `${m.id}/${q.id}: resposta não é inteiro`);
      assert.ok(q.answer >= 0 && q.answer < q.options.length, `${m.id}/${q.id}: índice de resposta fora dos limites`);
      assert.ok(q.explain.length > 20, `${m.id}/${q.id}: explicação demasiado curta`);
      assert.equal(new Set(q.options).size, q.options.length, `${m.id}/${q.id}: opções repetidas`);
    }
  }
});

test('exercícios são válidos', () => {
  for (const m of MODULES) {
    for (const e of m.exercises) {
      assert.ok(e.solution.length > 20, `${e.id}: solução demasiado curta`);
      assert.ok([1, 2, 3].includes(e.difficulty), `${e.id}: dificuldade inválida`);
      if (e.kind === 'input') {
        assert.ok(Array.isArray(e.accept) && e.accept.length > 0, `${e.id}: exercício de resposta curta sem respostas aceites`);
      }
    }
  }
});

test('blocos referem widgets existentes', () => {
  let widgetCount = 0;
  for (const m of MODULES) {
    for (const s of m.sections) {
      for (const b of s.blocks) {
        assert.ok(b.type, `${m.id}/${s.id}: bloco sem tipo`);
        if (b.type === 'widget') {
          widgetCount++;
          assert.ok(WIDGET_IDS.includes(b.id), `${m.id}/${s.id}: widget desconhecido "${b.id}"`);
        }
        if (b.type === 'table') {
          for (const row of b.rows) {
            assert.equal(row.length, b.head.length, `${m.id}/${s.id}: linha de tabela com número de colunas errado`);
          }
        }
        if (b.type === 'p' || b.type === 'h') assert.ok(b.text.length > 0);
      }
    }
  }
  assert.ok(widgetCount >= 18, `poucos widgets no conteúdo: ${widgetCount}`);
});

test('todos os widgets do catálogo são usados pelo menos uma vez', () => {
  const used = new Set();
  for (const m of MODULES) for (const s of m.sections) for (const b of s.blocks) if (b.type === 'widget') used.add(b.id);
  const naoUsados = WIDGET_IDS.filter((w) => !used.has(w));
  assert.deepEqual(naoUsados, [], `widgets nunca usados no conteúdo: ${naoUsados.join(', ')}`);
});

test('trilhas cobrem todos os módulos exatamente uma vez', () => {
  const listados = TRACKS.flatMap((t) => t.modules);
  assert.equal(listados.length, MODULES.length);
  assert.equal(new Set(listados).size, MODULES.length);
  for (const id of listados) assert.ok(MODULES.some((m) => m.id === id), `trilha refere módulo inexistente: ${id}`);
});

test('glossário aponta para módulos existentes', () => {
  for (const g of GLOSSARY) {
    assert.ok(g.term && g.def);
    if (g.module) assert.ok(MODULES.some((m) => m.id === g.module), `glossário refere módulo inexistente: ${g.module}`);
  }
  assert.equal(new Set(GLOSSARY.map((g) => g.term)).size, GLOSSARY.length, 'termos repetidos no glossário');
});
