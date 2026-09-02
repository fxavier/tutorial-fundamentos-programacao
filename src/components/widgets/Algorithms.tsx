import { useEffect, useMemo, useState } from 'react';
import { WidgetShell, Stat } from './Shell';
import { SORTS, sortFrames, binarySearchSteps, type SortId } from '../../lib/sorting';

/* ------------------------------------------------ Visualizador de ordenação */

const randomArray = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<SortId>('bubble');
  const [data, setData] = useState<number[]>(() => randomArray(12));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(220);

  const frames = useMemo(() => sortFrames(data, algo), [data, algo]);
  const frame = frames[Math.min(i, frames.length - 1)];
  const meta = SORTS.find((s) => s.id === algo)!;

  useEffect(() => { setI(0); setPlaying(false); }, [algo, data]);
  useEffect(() => {
    if (!playing) return;
    if (i >= frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [playing, i, frames.length, speed]);

  const max = Math.max(...frame.array, 1);

  return (
    <WidgetShell
      title="Visualizador de ordenação"
      subtitle="Vê o algoritmo comparar e trocar, passo a passo."
      actions={
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setData(randomArray(data.length))}>Baralhar</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setI(0)}>Reiniciar</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))} disabled={i >= frames.length - 1}>Passo</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)} disabled={i >= frames.length - 1}>{playing ? 'Pausar' : 'Executar'}</button>
        </div>
      }
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-52 flex-1">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Algoritmo</span>
          <select className="field" value={algo} onChange={(e) => setAlgo(e.target.value as SortId)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="min-w-40 flex-1">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Tamanho: {data.length}</span>
          <input type="range" min={5} max={24} value={data.length} onChange={(e) => setData(randomArray(Number(e.target.value)))} className="w-full accent-brand-600" />
        </label>
        <label className="min-w-40 flex-1">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Velocidade</span>
          <input type="range" min={40} max={600} step={20} value={620 - speed} onChange={(e) => setSpeed(620 - Number(e.target.value))} className="w-full accent-brand-600" />
        </label>
      </div>

      <div className="mt-4 flex h-52 items-end gap-1 rounded-xl border border-soft surface-sunken p-3">
        {frame.array.map((v, idx) => {
          const isCompare = frame.compare.includes(idx);
          const isDone = frame.done.includes(idx);
          const color = isCompare ? (frame.swapped ? 'bg-rose-500' : 'bg-amber-500') : isDone ? 'bg-emerald-500' : 'bg-brand-500';
          return (
            <div key={idx} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className={`w-full rounded-t transition-all duration-150 ${color}`} style={{ height: `${(v / max) * 100}%` }} />
              <span className="font-mono text-[0.6rem] text-muted">{v}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 min-h-10 rounded-lg surface-sunken px-3 py-2 text-sm">{frame.note}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Stat label="Comparações" value={String(frame.comparisons)} />
        <Stat label="Movimentos" value={String(frame.swaps)} />
        <Stat label="Passo" value={`${i + 1} / ${frames.length}`} />
        <Stat label="Complexidade média" value={meta.avg} />
      </div>

      <div className="mt-3 rounded-xl border border-soft p-3 text-sm">
        <p><b className="text-strong">{meta.name}:</b> {meta.idea}</p>
        <p className="mt-1 text-xs text-muted">
          Melhor caso {meta.best} · Médio {meta.avg} · Pior {meta.worst} · Memória extra {meta.space} · {meta.stable ? 'Estável' : 'Não estável'}
        </p>
      </div>
      <p className="mt-2 text-xs text-muted">
        Legenda: <span className="text-amber-600 dark:text-amber-400">amarelo</span> = a comparar · <span className="text-rose-600 dark:text-rose-400">vermelho</span> = a trocar · <span className="text-emerald-600 dark:text-emerald-400">verde</span> = já na posição final.
      </p>
    </WidgetShell>
  );
}

/* ------------------------------------------------------ Pesquisa binária */

const SORTED = [2, 5, 8, 12, 16, 23, 38, 45, 56, 61, 72, 84, 91, 97, 99, 104];

export function BinarySearchViz() {
  const [target, setTarget] = useState(72);
  const [step, setStep] = useState(0);
  const steps = useMemo(() => binarySearchSteps(SORTED, target), [target]);
  const s = steps[Math.min(step, steps.length - 1)];
  const linear = SORTED.indexOf(target) + 1 || SORTED.length;

  return (
    <WidgetShell
      title="Pesquisa binária vs. pesquisa linear"
      subtitle="Num vetor ordenado, cortar ao meio elimina metade das hipóteses de cada vez."
      actions={
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>Reiniciar</button>
          <button className="btn btn-primary btn-sm" onClick={() => setStep((v) => Math.min(steps.length - 1, v + 1))} disabled={step >= steps.length - 1}>Próximo passo</button>
        </div>
      }
    >
      <label className="block max-w-xs">
        <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Procurar</span>
        <select className="field" value={target} onChange={(e) => { setTarget(Number(e.target.value)); setStep(0); }}>
          {[...SORTED, 7, 100].sort((a, b) => a - b).map((v) => <option key={v} value={v}>{v}{SORTED.includes(v) ? '' : ' (não existe)'}</option>)}
        </select>
      </label>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {SORTED.map((v, idx) => {
          const inRange = idx >= s.lo && idx <= s.hi;
          const isMid = idx === s.mid;
          return (
            <div key={idx} className={`flex w-12 flex-col items-center rounded-lg border py-1.5 text-xs transition ${isMid ? 'border-brand-500 bg-brand-600 font-bold text-white' : inRange ? 'border-soft surface-sunken text-strong' : 'border-dashed border-soft text-muted opacity-35'}`}>
              <span className="font-mono">{v}</span>
              <span className="text-[0.58rem] opacity-70">{idx}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-lg surface-sunken px-3 py-2 text-sm">{s.note}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label="Passos (binária)" value={`${step + 1} de ${steps.length}`} />
        <Stat label="Passos (linear)" value={String(linear)} />
        <Stat label="Máximo teórico" value={`log₂(${SORTED.length}) = ${Math.ceil(Math.log2(SORTED.length))}`} />
      </div>
      <p className="mt-2 text-xs text-muted">Num vetor de 1 000 000 de elementos: pesquisa linear até 1 000 000 comparações; pesquisa binária, no máximo 20. Mas exige o vetor <b>ordenado</b>.</p>
    </WidgetShell>
  );
}

/* -------------------------------------------------------- Big-O */

const COMPLEXITIES = [
  { id: 'O(1)', label: 'O(1) — constante', f: () => 1, color: '#10b981', ex: 'Aceder a lista[5]' },
  { id: 'O(log n)', label: 'O(log n) — logarítmica', f: (n: number) => Math.log2(n), color: '#0ea5e9', ex: 'Pesquisa binária' },
  { id: 'O(n)', label: 'O(n) — linear', f: (n: number) => n, color: '#6366f1', ex: 'Percorrer uma lista' },
  { id: 'O(n log n)', label: 'O(n log n) — linearítmica', f: (n: number) => n * Math.log2(n), color: '#a855f7', ex: 'Merge sort' },
  { id: 'O(n²)', label: 'O(n²) — quadrática', f: (n: number) => n * n, color: '#f59e0b', ex: 'Dois laços encaixados' },
  { id: 'O(2ⁿ)', label: 'O(2ⁿ) — exponencial', f: (n: number) => 2 ** n, color: '#ef4444', ex: 'Fibonacci recursivo ingénuo' },
];

export function BigOChart() {
  const [n, setN] = useState(16);
  const W = 480, H = 220, MAXN = 32;
  const scale = (v: number) => Math.min(1, Math.log10(1 + v) / Math.log10(1 + 2 ** MAXN));

  return (
    <WidgetShell title="Notação Big-O: como o custo cresce" subtitle="O eixo vertical é logarítmico — de outra forma a curva exponencial esmagaria as restantes.">
      <label className="block max-w-sm">
        <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Tamanho da entrada n = {n}</span>
        <input type="range" min={2} max={MAXN} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-brand-600" />
      </label>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full rounded-xl border border-soft surface-sunken" role="img" aria-label="Gráfico de crescimento das complexidades">
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="34" y1={H - 24 - g * (H - 44)} x2={W - 8} y2={H - 24 - g * (H - 44)} className="stroke-current opacity-10" />)}
        <line x1="34" y1={H - 24} x2={W - 8} y2={H - 24} className="stroke-current opacity-30" />
        <line x1="34" y1="10" x2="34" y2={H - 24} className="stroke-current opacity-30" />
        {COMPLEXITIES.map((c) => {
          const pts = Array.from({ length: MAXN - 1 }, (_, k) => {
            const x = k + 2;
            const px = 34 + ((x - 2) / (MAXN - 2)) * (W - 46);
            const py = H - 24 - scale(c.f(x)) * (H - 44);
            return `${px.toFixed(1)},${py.toFixed(1)}`;
          }).join(' ');
          return <polyline key={c.id} points={pts} fill="none" stroke={c.color} strokeWidth="2.2" strokeLinecap="round" />;
        })}
        <line x1={34 + ((n - 2) / (MAXN - 2)) * (W - 46)} y1="10" x2={34 + ((n - 2) / (MAXN - 2)) * (W - 46)} y2={H - 24} className="stroke-current opacity-40" strokeDasharray="4 3" />
        <text x="6" y="16" className="fill-current text-[9px] opacity-60">ops</text>
        <text x={W - 20} y={H - 8} className="fill-current text-[9px] opacity-60">n</text>
      </svg>

      <div className="mt-4 overflow-hidden rounded-xl border border-soft">
        <table className="w-full text-left text-xs">
          <thead className="surface-sunken"><tr>{['Complexidade', 'Operações com n = ' + n, 'Exemplo típico'].map((h) => <th key={h} className="px-3 py-2 font-semibold text-strong">{h}</th>)}</tr></thead>
          <tbody>
            {COMPLEXITIES.map((c) => (
              <tr key={c.id} className="border-t border-soft/60">
                <td className="px-3 py-2 font-mono font-semibold" style={{ color: c.color }}>{c.label}</td>
                <td className="px-3 py-2 font-mono">{c.f(n) > 1e12 ? c.f(n).toExponential(2) : Math.round(c.f(n)).toLocaleString('pt-PT')}</td>
                <td className="px-3 py-2 text-muted">{c.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">Com n = 32, um algoritmo O(2ⁿ) precisa de mais de 4 mil milhões de operações; o O(n log n) precisa de 160. É a diferença entre "instantâneo" e "nunca acaba".</p>
    </WidgetShell>
  );
}

/* ---------------------------------------------- Corrida de complexidades */

export function ComplexityRace() {
  const sizes = [10, 100, 1_000, 10_000, 1_000_000];
  const opsPerSecond = 1e9;
  const fmt = (ops: number) => {
    const sec = ops / opsPerSecond;
    if (sec < 1e-6) return '< 1 µs';
    if (sec < 1e-3) return `${(sec * 1e6).toFixed(0)} µs`;
    if (sec < 1) return `${(sec * 1e3).toFixed(1)} ms`;
    if (sec < 60) return `${sec.toFixed(1)} s`;
    if (sec < 3600) return `${(sec / 60).toFixed(1)} min`;
    if (sec < 86400 * 365) return `${(sec / 86400).toFixed(1)} dias`;
    return `${(sec / (86400 * 365)).toExponential(1)} anos`;
  };
  return (
    <WidgetShell title="Quanto tempo demora, na prática" subtitle="A supor mil milhões de operações por segundo — otimista para um computador atual.">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-xs">
          <thead className="surface-sunken">
            <tr><th className="px-3 py-2 font-semibold text-strong">n</th>{COMPLEXITIES.slice(0, 5).map((c) => <th key={c.id} className="px-3 py-2 font-mono font-semibold" style={{ color: c.color }}>{c.id}</th>)}</tr>
          </thead>
          <tbody className="font-mono">
            {sizes.map((n) => (
              <tr key={n} className="border-t border-soft/60">
                <td className="px-3 py-2 font-bold text-strong">{n.toLocaleString('pt-PT')}</td>
                {COMPLEXITIES.slice(0, 5).map((c) => {
                  const ops = c.f(n);
                  const bad = ops / opsPerSecond > 1;
                  return <td key={c.id} className={`px-3 py-2 ${bad ? 'font-bold text-rose-600 dark:text-rose-400' : ''}`}>{fmt(ops)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Com um milhão de elementos, O(n²) já são <b>16 minutos</b>; O(n log n) resolve em <b>20 ms</b>. Trocar o algoritmo vale mais do que trocar o computador.
      </p>
    </WidgetShell>
  );
}
