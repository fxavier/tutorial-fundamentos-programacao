import { useMemo, useState } from 'react';
import { WidgetShell, Labeled } from './Shell';

/* ------------------------------------------------------ Tabela verdade */

type Node =
  | { k: 'var'; name: string }
  | { k: 'const'; v: boolean }
  | { k: 'not'; e: Node }
  | { k: 'bin'; op: 'e' | 'ou' | 'xou' | 'imp' | 'eq'; l: Node; r: Node };

function parseBool(src: string): { node: Node; vars: string[] } {
  const text = src
    .replace(/&&|\^/g, ' e ')
    .replace(/\|\|/g, ' ou ')
    .replace(/->|=>/g, ' imp ')
    .replace(/<->/g, ' eq ')
    .replace(/!/g, ' nao ')
    .replace(/\bxor\b/gi, ' xou ')
    .replace(/\band\b/gi, ' e ')
    .replace(/\bor\b/gi, ' ou ')
    .replace(/\bnot\b/gi, ' nao ');
  const toks = text.match(/[A-Za-z_][A-Za-z0-9_]*|\(|\)/g) ?? [];
  let p = 0;
  const vars: string[] = [];
  const peek = () => toks[p];
  const eat = (t: string) => (toks[p]?.toLowerCase() === t ? (p++, true) : false);

  const primary = (): Node => {
    if (eat('nao')) return { k: 'not', e: primary() };
    if (eat('(')) { const e = expr(); if (!eat(')')) throw new Error('falta um ")"'); return e; }
    const t = peek();
    if (!t) throw new Error('expressão incompleta');
    p++;
    const low = t.toLowerCase();
    if (low === 'v' || low === 'verdadeiro' || low === 'true' || low === '1') return { k: 'const', v: true };
    if (low === 'f' || low === 'falso' || low === 'false' || low === '0') return { k: 'const', v: false };
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) throw new Error(`símbolo inesperado "${t}"`);
    const name = t.toUpperCase();
    if (!vars.includes(name)) vars.push(name);
    return { k: 'var', name };
  };
  const and = (): Node => { let l = primary(); while (eat('e')) l = { k: 'bin', op: 'e', l, r: primary() }; return l; };
  const or = (): Node => { let l = and(); while (eat('ou') || eat('xou')) { const op = toks[p - 1].toLowerCase() === 'xou' ? 'xou' : 'ou'; l = { k: 'bin', op, l, r: and() }; } return l; };
  const expr = (): Node => { let l = or(); while (eat('imp') || eat('eq')) { const op = toks[p - 1].toLowerCase() === 'imp' ? 'imp' : 'eq'; l = { k: 'bin', op, l, r: or() }; } return l; };

  const node = expr();
  if (p < toks.length) throw new Error(`sobra "${toks[p]}" no fim da expressão`);
  return { node, vars: vars.sort() };
}

function evalBool(n: Node, env: Record<string, boolean>): boolean {
  switch (n.k) {
    case 'var': return env[n.name];
    case 'const': return n.v;
    case 'not': return !evalBool(n.e, env);
    case 'bin': {
      const a = evalBool(n.l, env), b = evalBool(n.r, env);
      switch (n.op) {
        case 'e': return a && b;
        case 'ou': return a || b;
        case 'xou': return a !== b;
        case 'imp': return !a || b;
        case 'eq': return a === b;
      }
    }
  }
}

const PRESETS = ['A e B', 'A ou B', 'nao A', 'A xor B', 'A e nao B', '(A ou B) e nao (A e B)', 'A -> B', 'nao (A e B)', 'nao A ou nao B'];

export function TruthTable() {
  const [expr, setExpr] = useState('(A ou B) e nao C');
  const parsed = useMemo(() => {
    try { return { ...parseBool(expr), error: null as string | null }; }
    catch (e) { return { node: null, vars: [], error: e instanceof Error ? e.message : 'erro' }; }
  }, [expr]);

  const rows = useMemo(() => {
    if (!parsed.node || parsed.vars.length === 0 || parsed.vars.length > 4) return [];
    const n = parsed.vars.length;
    return Array.from({ length: 2 ** n }, (_, i) => {
      const env: Record<string, boolean> = {};
      parsed.vars.forEach((v, j) => { env[v] = Boolean((i >> (n - 1 - j)) & 1); });
      return { env, result: evalBool(parsed.node!, env) };
    });
  }, [parsed]);

  const trues = rows.filter((r) => r.result).length;
  const kind = rows.length === 0 ? '' : trues === rows.length ? 'Tautologia (sempre verdadeira)' : trues === 0 ? 'Contradição (nunca verdadeira)' : 'Contingência (depende dos valores)';

  return (
    <WidgetShell title="Tabela verdade" subtitle="Usa e, ou, nao, xor, -> (implicação). Também aceita &&, ||, !.">
      <Labeled label="Expressão lógica">
        <input className="field" value={expr} onChange={(e) => setExpr(e.target.value)} spellCheck={false} />
      </Labeled>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button key={p} className="btn btn-ghost btn-sm font-mono" onClick={() => setExpr(p)}>{p}</button>
        ))}
      </div>

      {parsed.error && <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">Erro: {parsed.error}</p>}
      {!parsed.error && parsed.vars.length > 4 && <p className="mt-3 text-sm text-muted">Usa no máximo 4 variáveis.</p>}

      {rows.length > 0 && (
        <>
          <div className="mt-4 overflow-hidden rounded-xl border border-soft">
            <table className="w-full text-center text-sm">
              <thead className="surface-sunken">
                <tr>
                  {parsed.vars.map((v) => <th key={v} className="px-3 py-2 font-mono font-bold text-strong">{v}</th>)}
                  <th className="border-l border-soft px-3 py-2 font-mono font-bold text-brand-700 dark:text-brand-300">{expr}</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-soft/60">
                    {parsed.vars.map((v) => (
                      <td key={v} className={r.env[v] ? 'px-3 py-1.5 text-emerald-600 dark:text-emerald-400' : 'px-3 py-1.5 text-muted'}>{r.env[v] ? 'V' : 'F'}</td>
                    ))}
                    <td className={`border-l border-soft px-3 py-1.5 font-bold ${r.result ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50/60 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'}`}>
                      {r.result ? 'V' : 'F'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">{rows.length} combinações ({parsed.vars.length} variáveis → 2^{parsed.vars.length}) · {trues} verdadeiras · <b>{kind}</b></p>
        </>
      )}
    </WidgetShell>
  );
}

/* -------------------------------------------------------- Fluxogramas */

const FLOWS = {
  sequencia: {
    label: 'Sequência',
    text: 'As instruções executam-se uma a seguir à outra, de cima para baixo. É a estrutura por omissão.',
    svg: (
      <>
        <ellipse cx="150" cy="28" rx="52" ry="18" className="fill-emerald-500" /><text x="150" y="33" textAnchor="middle" className="fill-white text-[11px] font-bold">Início</text>
        <line x1="150" y1="46" x2="150" y2="70" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="80" y="70" width="140" height="36" rx="8" className="fill-sky-500" /><text x="150" y="92" textAnchor="middle" className="fill-white text-[11px] font-semibold">ler preço</text>
        <line x1="150" y1="106" x2="150" y2="130" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="80" y="130" width="140" height="36" rx="8" className="fill-sky-500" /><text x="150" y="152" textAnchor="middle" className="fill-white text-[11px] font-semibold">total ← preço × 1.23</text>
        <line x1="150" y1="166" x2="150" y2="190" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <ellipse cx="150" cy="208" rx="52" ry="18" className="fill-rose-500" /><text x="150" y="213" textAnchor="middle" className="fill-white text-[11px] font-bold">Fim</text>
      </>
    ),
  },
  decisao: {
    label: 'Decisão (se / senão)',
    text: 'Um losango faz uma pergunta de sim ou não. Cada resposta segue um caminho diferente e depois os caminhos voltam a juntar-se.',
    svg: (
      <>
        <ellipse cx="150" cy="24" rx="46" ry="16" className="fill-emerald-500" /><text x="150" y="29" textAnchor="middle" className="fill-white text-[11px] font-bold">Início</text>
        <line x1="150" y1="40" x2="150" y2="60" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <polygon points="150,60 240,105 150,150 60,105" className="fill-amber-500" /><text x="150" y="109" textAnchor="middle" className="fill-white text-[11px] font-bold">idade ≥ 18?</text>
        <line x1="60" y1="105" x2="30" y2="105" className="stroke-current" strokeWidth="2" /><line x1="30" y1="105" x2="30" y2="170" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="240" y1="105" x2="270" y2="105" className="stroke-current" strokeWidth="2" /><line x1="270" y1="105" x2="270" y2="170" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="46" y="98" className="fill-current text-[10px] font-semibold">não</text>
        <text x="248" y="98" className="fill-current text-[10px] font-semibold">sim</text>
        <rect x="0" y="170" width="120" height="32" rx="8" className="fill-sky-500" /><text x="60" y="190" textAnchor="middle" className="fill-white text-[10px] font-semibold">"menor"</text>
        <rect x="180" y="170" width="120" height="32" rx="8" className="fill-sky-500" /><text x="240" y="190" textAnchor="middle" className="fill-white text-[10px] font-semibold">"maior de idade"</text>
        <line x1="60" y1="202" x2="60" y2="222" className="stroke-current" strokeWidth="2" /><line x1="240" y1="202" x2="240" y2="222" className="stroke-current" strokeWidth="2" />
        <line x1="60" y1="222" x2="240" y2="222" className="stroke-current" strokeWidth="2" />
        <line x1="150" y1="222" x2="150" y2="240" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <ellipse cx="150" cy="256" rx="46" ry="16" className="fill-rose-500" /><text x="150" y="261" textAnchor="middle" className="fill-white text-[11px] font-bold">Fim</text>
      </>
    ),
  },
  repeticao: {
    label: 'Repetição (enquanto)',
    text: 'A condição é testada antes de cada volta. Se for verdadeira, o corpo executa e volta ao teste; se for falsa, o laço termina. Alguma coisa dentro do corpo tem de aproximar a condição do fim.',
    svg: (
      <>
        <ellipse cx="150" cy="24" rx="46" ry="16" className="fill-emerald-500" /><text x="150" y="29" textAnchor="middle" className="fill-white text-[11px] font-bold">Início</text>
        <line x1="150" y1="40" x2="150" y2="62" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="90" y="62" width="120" height="30" rx="8" className="fill-sky-500" /><text x="150" y="81" textAnchor="middle" className="fill-white text-[10px] font-semibold">i ← 1</text>
        <line x1="150" y1="92" x2="150" y2="112" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <polygon points="150,112 235,152 150,192 65,152" className="fill-amber-500" /><text x="150" y="156" textAnchor="middle" className="fill-white text-[11px] font-bold">i ≤ 5?</text>
        <line x1="150" y1="192" x2="150" y2="212" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" /><text x="158" y="206" className="fill-current text-[10px] font-semibold">sim</text>
        <rect x="70" y="212" width="160" height="30" rx="8" className="fill-sky-500" /><text x="150" y="231" textAnchor="middle" className="fill-white text-[10px] font-semibold">escrever i; i ← i + 1</text>
        <line x1="230" y1="227" x2="285" y2="227" className="stroke-current" strokeWidth="2" /><line x1="285" y1="227" x2="285" y2="152" className="stroke-current" strokeWidth="2" /><line x1="285" y1="152" x2="237" y2="152" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="65" y1="152" x2="24" y2="152" className="stroke-current" strokeWidth="2" /><line x1="24" y1="152" x2="24" y2="268" className="stroke-current" strokeWidth="2" /><line x1="24" y1="268" x2="104" y2="268" className="stroke-current" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="30" y="145" className="fill-current text-[10px] font-semibold">não</text>
        <ellipse cx="150" cy="268" rx="46" ry="16" className="fill-rose-500" /><text x="150" y="273" textAnchor="middle" className="fill-white text-[11px] font-bold">Fim</text>
      </>
    ),
  },
} as const;

export function Flowchart() {
  const [key, setKey] = useState<keyof typeof FLOWS>('decisao');
  const f = FLOWS[key];
  return (
    <WidgetShell title="Fluxogramas: as três estruturas básicas" subtitle="Qualquer algoritmo se escreve com sequência, decisão e repetição.">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FLOWS) as (keyof typeof FLOWS)[]).map((k) => (
          <button key={k} className={`btn btn-sm ${key === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setKey(k)}>{FLOWS[k].label}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto rounded-xl border border-soft surface-sunken p-3">
          <svg viewBox="0 0 300 290" className="h-72 w-72 text-slate-400">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-current" />
              </marker>
            </defs>
            {f.svg}
          </svg>
        </div>
        <div>
          <p className="text-[0.93rem] leading-relaxed">{f.text}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><span className="mr-2 inline-block size-3 rounded-full bg-emerald-500 align-middle" />Elipse: início e fim</li>
            <li><span className="mr-2 inline-block size-3 rounded bg-sky-500 align-middle" />Retângulo: processamento</li>
            <li><span className="mr-2 inline-block size-3 rotate-45 bg-amber-500 align-middle" />Losango: decisão</li>
            <li><span className="mr-2 inline-block size-3 rounded-full bg-rose-500 align-middle" />Setas: o sentido do fluxo</li>
          </ul>
        </div>
      </div>
    </WidgetShell>
  );
}

/* -------------------------------------------------------- Teste de mesa */

interface Trace { code: string[]; cols: string[]; rows: (string | number)[][]; note: string }

const TRACES: Record<string, Trace> = {
  soma: {
    code: ['soma ← 0', 'para i de 1 ate 4 faca', '   soma ← soma + i', 'fimpara', 'escrever soma'],
    cols: ['linha', 'i', 'soma', 'saída'],
    rows: [[1, '—', 0, ''], [2, 1, 0, ''], [3, 1, 1, ''], [2, 2, 1, ''], [3, 2, 3, ''], [2, 3, 3, ''], [3, 3, 6, ''], [2, 4, 6, ''], [3, 4, 10, ''], [2, 5, 10, ''], [5, 5, 10, '10']],
    note: 'Repara que i chega a 5: é o valor que faz a condição i ≤ 4 falhar e termina o laço.',
  },
  troca: {
    code: ['a ← 3', 'b ← 8', 'tmp ← a', 'a ← b', 'b ← tmp', 'escrever a, b'],
    cols: ['linha', 'a', 'b', 'tmp', 'saída'],
    rows: [[1, 3, '—', '—', ''], [2, 3, 8, '—', ''], [3, 3, 8, 3, ''], [4, 8, 8, 3, ''], [5, 8, 3, 3, ''], [6, 8, 3, 3, '8 3']],
    note: 'Sem a variável temporária, a linha 4 destruiria o valor de a antes de o guardarmos.',
  },
  contagem: {
    code: ['n ← 13', 'passos ← 0', 'enquanto n <> 1 faca', '   se n % 2 = 0 entao n ← n / 2', '   senao n ← 3 * n + 1 fimse', '   passos ← passos + 1', 'fimenquanto'],
    cols: ['iteração', 'n', 'par?', 'passos'],
    rows: [[0, 13, 'não', 0], [1, 40, 'sim', 1], [2, 20, 'sim', 2], [3, 10, 'sim', 3], [4, 5, 'não', 4], [5, 16, 'sim', 5], [6, 8, 'sim', 6], [7, 4, 'sim', 7], [8, 2, 'sim', 8], [9, 1, '—', 9]],
    note: 'É a conjetura de Collatz. O teste de mesa mostra que 13 chega a 1 em 9 passos — mas ninguém provou que isto acontece para todos os números.',
  },
};

export function DeskCheck() {
  const [key, setKey] = useState<keyof typeof TRACES>('soma');
  const [row, setRow] = useState(1);
  const t = TRACES[key];
  const visible = t.rows.slice(0, row);

  return (
    <WidgetShell
      title="Teste de mesa"
      subtitle="A técnica mais barata de depuração: seguir o algoritmo à mão, linha a linha, anotando cada variável."
      actions={
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setRow(1)}>Reiniciar</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setRow((r) => Math.max(1, r - 1))} disabled={row <= 1}>Anterior</button>
          <button className="btn btn-primary btn-sm" onClick={() => setRow((r) => Math.min(t.rows.length, r + 1))} disabled={row >= t.rows.length}>Próximo passo</button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TRACES) as (keyof typeof TRACES)[]).map((k) => (
          <button key={k} className={`btn btn-sm ${key === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setKey(k); setRow(1); }}>
            {k === 'soma' ? 'Somar 1 a 4' : k === 'troca' ? 'Trocar dois valores' : 'Sequência de Collatz'}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <pre className="scrollbar-thin overflow-x-auto rounded-xl border border-soft surface-sunken p-3 font-mono text-xs leading-relaxed">
          {t.code.map((l, i) => <div key={i}><span className="mr-3 select-none text-muted">{i + 1}</span>{l}</div>)}
        </pre>
        <div className="overflow-hidden rounded-xl border border-soft">
          <table className="w-full text-center text-xs">
            <thead className="surface-sunken"><tr>{t.cols.map((c) => <th key={c} className="px-2 py-2 font-semibold text-strong">{c}</th>)}</tr></thead>
            <tbody className="font-mono">
              {visible.map((r, i) => (
                <tr key={i} className={`border-t border-soft/60 ${i === visible.length - 1 ? 'bg-brand-50 font-bold dark:bg-brand-500/10' : ''}`}>
                  {r.map((c, j) => <td key={j} className="px-2 py-1.5">{String(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {row >= t.rows.length && <p className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">{t.note}</p>}
    </WidgetShell>
  );
}
