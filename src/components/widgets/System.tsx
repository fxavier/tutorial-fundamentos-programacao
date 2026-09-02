import { useEffect, useMemo, useState } from 'react';
import { WidgetShell, Stat } from './Shell';

/* ------------------------------------------------- Memória e endereços */

const TYPES = [
  { id: 'logico', label: 'logico / boolean', size: 1, color: 'bg-emerald-500' },
  { id: 'caractere', label: 'char (1 byte)', size: 1, color: 'bg-sky-500' },
  { id: 'inteiro16', label: 'short (2 bytes)', size: 2, color: 'bg-violet-500' },
  { id: 'inteiro', label: 'int (4 bytes)', size: 4, color: 'bg-brand-500' },
  { id: 'real', label: 'double (8 bytes)', size: 8, color: 'bg-amber-500' },
];

interface Slot { name: string; type: string; size: number; color: string; start: number }

export function MemoryVisualizer() {
  const [slots, setSlots] = useState<Slot[]>([
    { name: 'idade', type: 'int (4 bytes)', size: 4, color: 'bg-brand-500', start: 0 },
    { name: 'inicial', type: 'char (1 byte)', size: 1, color: 'bg-sky-500', start: 4 },
  ]);
  const [typeId, setTypeId] = useState('inteiro');
  const [name, setName] = useState('salario');
  const total = 48;
  const used = slots.reduce((a, s) => a + s.size, 0);

  const add = () => {
    const t = TYPES.find((x) => x.id === typeId)!;
    const start = used;
    if (start + t.size > total) return;
    setSlots([...slots, { name: name.trim() || `var${slots.length + 1}`, type: t.label, size: t.size, color: t.color, start }]);
    setName('');
  };

  const cells = Array.from({ length: total }, (_, i) => slots.find((s) => i >= s.start && i < s.start + s.size));

  return (
    <WidgetShell title="Memória: variáveis, endereços e bytes" subtitle="Cada quadrado é 1 byte. Declarar uma variável é reservar bytes contíguos e dar-lhes um nome.">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-40">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Nome</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex.: total" maxLength={12} />
        </label>
        <label className="flex-1 min-w-48">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Tipo</span>
          <select className="field" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" onClick={add} disabled={used >= total}>Declarar</button>
        <button className="btn btn-ghost" onClick={() => setSlots([])}>Limpar</button>
      </div>

      <div className="mt-5 grid grid-cols-8 gap-1 sm:grid-cols-12 lg:grid-cols-16">
        {cells.map((s, i) => (
          <div
            key={i}
            title={s ? `${s.name} (${s.type}) — endereço 0x${(0x1000 + i).toString(16).toUpperCase()}` : `livre — 0x${(0x1000 + i).toString(16).toUpperCase()}`}
            className={`flex aspect-square items-center justify-center rounded-md border text-[0.55rem] font-mono transition ${s ? `${s.color} border-transparent text-white` : 'border-dashed border-soft surface-sunken text-muted'}`}
          >
            {s && i === s.start ? s.name.slice(0, 4) : ''}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Bytes usados" value={`${used} de ${total}`} />
        <Stat label="Variáveis" value={String(slots.length)} />
        <Stat label="Primeiro endereço livre" value={`0x${(0x1000 + used).toString(16).toUpperCase()}`} />
      </div>

      {slots.length > 0 && (
        <table className="mt-4 w-full text-left text-xs">
          <thead className="surface-sunken"><tr>{['Variável', 'Tipo', 'Endereço', 'Bytes'].map((h) => <th key={h} className="px-3 py-2 font-semibold text-strong">{h}</th>)}</tr></thead>
          <tbody className="font-mono">
            {slots.map((s) => (
              <tr key={s.name + s.start} className="border-t border-soft/60">
                <td className="px-3 py-1.5">{s.name}</td>
                <td className="px-3 py-1.5">{s.type}</td>
                <td className="px-3 py-1.5">0x{(0x1000 + s.start).toString(16).toUpperCase()}</td>
                <td className="px-3 py-1.5">{s.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </WidgetShell>
  );
}

/* ------------------------------------------------------ Ciclo da CPU */

const PROGRAM = [
  { addr: 0, instr: 'CARREGA A, [10]', desc: 'Lê o valor no endereço 10 para o registo A.' },
  { addr: 1, instr: 'SOMA A, [11]', desc: 'Soma ao registo A o valor no endereço 11.' },
  { addr: 2, instr: 'GUARDA [12], A', desc: 'Escreve o registo A no endereço 12.' },
  { addr: 3, instr: 'PARA', desc: 'Termina a execução.' },
];

const PHASES = [
  { id: 'busca', label: 'Busca (fetch)', text: 'A unidade de controlo lê a instrução no endereço indicado pelo PC e coloca-a no registo de instrução (IR).' },
  { id: 'descodifica', label: 'Descodifica (decode)', text: 'A instrução é traduzida em sinais: que operação, sobre que operandos.' },
  { id: 'executa', label: 'Executa (execute)', text: 'A ULA faz a operação; o resultado fica num registo ou na memória.' },
  { id: 'atualiza', label: 'Atualiza o PC', text: 'O contador de programa avança para a instrução seguinte.' },
];

export function CpuCycle() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const pc = Math.min(Math.floor(step / 4), PROGRAM.length - 1);
  const phase = step % 4;
  const maxStep = PROGRAM.length * 4 - 1;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((s) => (s >= maxStep ? (setPlaying(false), s) : s + 1)), 900);
    return () => clearTimeout(t);
  }, [playing, step, maxStep]);

  const ram = [
    { addr: 10, value: 7 },
    { addr: 11, value: 5 },
    { addr: 12, value: step >= 11 ? 12 : 0 },
  ];
  const regA = step < 3 ? 0 : step < 7 ? 7 : 12;

  return (
    <WidgetShell
      title="Como a CPU executa um programa"
      subtitle="Ciclo busca → descodifica → executa, instrução a instrução."
      actions={
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => { setStep(0); setPlaying(false); }}>Reiniciar</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setStep((s) => Math.min(maxStep, s + 1))} disabled={step >= maxStep}>Passo</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)} disabled={step >= maxStep}>{playing ? 'Pausar' : 'Executar'}</button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-3.5">
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Programa (memória)</p>
          {PROGRAM.map((p, i) => (
            <div key={i} className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition ${i === pc ? 'bg-brand-600 text-white' : 'text-muted'}`}>
              {String(p.addr).padStart(2, '0')} │ {p.instr}
            </div>
          ))}
        </div>
        <div className="card p-3.5">
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Registos</p>
          <div className="space-y-1.5 font-mono text-xs">
            <p className="flex justify-between"><span>PC</span><b>{pc}</b></p>
            <p className="flex justify-between"><span>IR</span><b className="truncate pl-2">{phase >= 1 ? PROGRAM[pc].instr : '—'}</b></p>
            <p className="flex justify-between"><span>Registo A</span><b>{regA}</b></p>
          </div>
          <p className="mt-3 mb-1 text-xs font-bold tracking-wide text-muted uppercase">Dados (RAM)</p>
          <div className="space-y-1 font-mono text-xs">
            {ram.map((r) => <p key={r.addr} className="flex justify-between"><span>[{r.addr}]</span><b>{r.value}</b></p>)}
          </div>
        </div>
        <div className="card p-3.5">
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Fase atual</p>
          <ol className="space-y-1.5">
            {PHASES.map((p, i) => (
              <li key={p.id} className={`rounded-lg px-2.5 py-1.5 text-xs transition ${i === phase ? 'bg-brand-600 font-semibold text-white' : 'text-muted'}`}>
                {i + 1}. {p.label}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs leading-relaxed">{PHASES[phase].text}</p>
          <p className="mt-2 text-xs font-semibold text-brand-700 dark:text-brand-300">{PROGRAM[pc].desc}</p>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Passo {step + 1} de {maxStep + 1} — no fim, [12] = 7 + 5 = 12.</p>
    </WidgetShell>
  );
}

/* ------------------------------------------------------- Pilha e heap */

export function StackHeap() {
  const [n, setN] = useState(4);
  const frames = useMemo(() => {
    const f: { call: string; ret: string }[] = [];
    for (let i = n; i >= 1; i--) f.push({ call: `fatorial(${i})`, ret: i <= 1 ? '1' : `${i} × fatorial(${i - 1})` });
    return f;
  }, [n]);
  const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));

  return (
    <WidgetShell title="Pilha (stack) e monte (heap)" subtitle="Cada chamada de função empilha um bloco; o heap guarda dados que sobrevivem à chamada.">
      <label className="block max-w-xs">
        <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">fatorial(n), com n =</span>
        <input type="range" min={1} max={8} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-brand-600" />
      </label>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Pilha de chamadas (topo em cima)</p>
          <div className="space-y-1.5">
            {frames.map((f, i) => (
              <div key={i} className="animate-fade-up rounded-lg border border-brand-300/60 bg-brand-50 px-3 py-2 font-mono text-xs dark:border-brand-500/30 dark:bg-brand-500/10">
                <b className="text-strong">{f.call}</b> <span className="text-muted">→ devolve {f.ret}</span>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-soft px-3 py-2 text-center font-mono text-xs text-muted">main()</div>
          </div>
          <p className="mt-2 text-xs text-muted">Profundidade: {frames.length} blocos. Resultado: <b>{fact(n)}</b>. Sem caso base, a pilha cresce até rebentar — <b>stack overflow</b>.</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Comparação</p>
          <table className="w-full text-left text-xs">
            <tbody>
              {[
                ['Onde vivem', 'Variáveis locais e parâmetros', 'Objetos, listas, strings grandes'],
                ['Tamanho', 'Pequeno e fixo (MB)', 'Grande (GB)'],
                ['Velocidade', 'Muito rápida', 'Mais lenta'],
                ['Libertação', 'Automática ao sair da função', 'Garbage collector ou manual'],
                ['Erro típico', 'Stack overflow (recursão infinita)', 'Fuga de memória (memory leak)'],
              ].map(([k, a, b]) => (
                <tr key={k} className="border-t border-soft/60">
                  <th className="py-2 pr-2 text-left font-semibold text-strong">{k}</th>
                  <td className="py-2 pr-2">{a}</td>
                  <td className="py-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[0.7rem] text-muted">Coluna do meio: pilha. Coluna da direita: heap.</p>
        </div>
      </div>
    </WidgetShell>
  );
}
