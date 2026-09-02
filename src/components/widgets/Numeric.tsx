import { useMemo, useState } from 'react';
import { WidgetShell, Labeled, Stat } from './Shell';
import {
  parseInBase, toBase, groupBits, divisionSteps, positionalSteps,
  twosComplement, fromTwosComplement, formatBytes, float32Parts, utf8Bytes,
} from '../../lib/numbers';

/* ------------------------------------------------- Conversor de bases */

const BASES = [
  { base: 2, label: 'Binário', hint: '0 e 1' },
  { base: 8, label: 'Octal', hint: '0–7' },
  { base: 10, label: 'Decimal', hint: '0–9' },
  { base: 16, label: 'Hexadecimal', hint: '0–9, A–F' },
];

export function BaseConverter() {
  const [value, setValue] = useState<bigint>(214n);
  const [raw, setRaw] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  const set = (base: number, text: string) => {
    setRaw({ [base]: text });
    if (text.trim() === '') { setError('Escreve um número.'); return; }
    try {
      const v = parseInBase(text, base);
      if (v < 0n) { setError('Usa apenas valores positivos aqui.'); return; }
      setValue(v);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'valor inválido');
    }
  };

  const display = (base: number) => (raw[base] !== undefined ? raw[base] : toBase(value, base).toUpperCase());
  const bin = toBase(value, 2);

  return (
    <WidgetShell
      title="Conversor de bases"
      subtitle="Escreve em qualquer campo — os outros atualizam-se em tempo real."
      actions={<button className="btn btn-ghost btn-sm" onClick={() => setShowSteps((s) => !s)}>{showSteps ? 'Ocultar passos' : 'Ver passos'}</button>}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BASES.map((b) => (
          <Labeled key={b.base} label={`${b.label} (base ${b.base})`} hint={b.hint}>
            <input
              className="field"
              value={display(b.base)}
              onChange={(e) => set(b.base, e.target.value)}
              inputMode={b.base === 10 ? 'numeric' : 'text'}
              spellCheck={false}
              aria-label={b.label}
            />
          </Labeled>
        ))}
      </div>

      {error && <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Binário agrupado" value={groupBits(bin)} />
        <Stat label="Bits necessários" value={`${bin.length} bits`} />
        <Stat label="Bytes (arredondado)" value={`${Math.ceil(bin.length / 8)} byte(s)`} />
      </div>

      {showSteps && value <= 1_000_000n && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="card p-3.5">
            <p className="mb-2 text-sm font-bold text-strong">Decimal → binário (divisões sucessivas por 2)</p>
            <div className="scrollbar-thin max-h-56 overflow-y-auto font-mono text-xs">
              {divisionSteps(value, 2).map((s, i) => (
                <p key={i} className="flex justify-between border-b border-soft/60 py-1">
                  <span>{s.dividend} ÷ 2 = {s.quotient}</span>
                  <span className="font-bold text-brand-600 dark:text-brand-300">resto {s.remainder}</span>
                </p>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Lê os restos <strong>de baixo para cima</strong>: {bin}</p>
          </div>
          <div className="card p-3.5">
            <p className="mb-2 text-sm font-bold text-strong">Binário → decimal (soma das potências)</p>
            <div className="scrollbar-thin max-h-56 overflow-y-auto font-mono text-xs">
              {positionalSteps(bin, 2).map((s, i) => (
                <p key={i} className={`flex justify-between border-b border-soft/60 py-1 ${s.value ? '' : 'opacity-40'}`}>
                  <span>{s.digit} × 2^{s.power}</span>
                  <span className="font-bold text-brand-600 dark:text-brand-300">{s.product.toString()}</span>
                </p>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Soma total = {value.toString()}</p>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}

/* ------------------------------------------------------- Bits ligados */

export function BitToggler({ bits = 8 }: { bits?: number }) {
  const [on, setOn] = useState<boolean[]>(() => Array.from({ length: bits }, (_, i) => i === bits - 2 || i === bits - 5));
  const value = on.reduce((acc, b, i) => acc + (b ? 2 ** (bits - 1 - i) : 0), 0);

  return (
    <WidgetShell
      title={`Liga e desliga bits (${bits} bits)`}
      subtitle="Cada posição vale o dobro da anterior. Clica nos bits para ver o valor mudar."
      actions={
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setOn(Array(bits).fill(false))}>Zerar</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setOn(Array(bits).fill(true))}>Tudo a 1</button>
        </div>
      }
    >
      <div className="scrollbar-thin overflow-x-auto pb-2">
        <div className="flex gap-1.5">
          {on.map((b, i) => {
            const place = 2 ** (bits - 1 - i);
            return (
              <button
                key={i}
                onClick={() => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                className={`flex w-14 shrink-0 flex-col items-center rounded-xl border py-2 transition ${b ? 'border-brand-500 bg-brand-600 text-white shadow-sm' : 'border-soft surface-sunken text-muted hover:border-brand-400'}`}
                aria-pressed={b}
                aria-label={`Bit de peso ${place}`}
              >
                <span className="font-mono text-lg font-bold">{b ? 1 : 0}</span>
                <span className="mt-0.5 font-mono text-[0.6rem] opacity-80">{place}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat label="Sem sinal" value={String(value)} />
        <Stat label="Com sinal (C2)" value={String(fromTwosComplement(on.map((b) => (b ? '1' : '0')).join('')))} />
        <Stat label="Hexadecimal" value={'0x' + value.toString(16).toUpperCase().padStart(bits / 4, '0')} />
        <Stat label="Soma visível" value={on.map((b, i) => (b ? 2 ** (bits - 1 - i) : 0)).filter(Boolean).join(' + ') || '0'} />
      </div>
    </WidgetShell>
  );
}

/* --------------------------------------------- Complemento de dois */

export function TwosComplementLab() {
  const [n, setN] = useState(-42);
  const [bits, setBits] = useState(8);
  const r = twosComplement(n, bits);
  const positive = twosComplement(Math.abs(n), bits).bin;
  const inverted = positive.split('').map((c) => (c === '1' ? '0' : '1')).join('');

  return (
    <WidgetShell title="Números negativos: complemento de dois" subtitle="Como um computador guarda o sinal sem gastar um símbolo extra.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Número decimal">
          <input type="number" className="field" value={n} onChange={(e) => setN(Number(e.target.value))} />
        </Labeled>
        <Labeled label="Largura">
          <select className="field" value={bits} onChange={(e) => setBits(Number(e.target.value))}>
            {[4, 8, 16, 32].map((b) => <option key={b} value={b}>{b} bits</option>)}
          </select>
        </Labeled>
      </div>
      {!r.ok ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          Fora do intervalo representável em {bits} bits: {r.min} a {r.max}. Isto chama-se <strong>overflow</strong>.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Representação" value={groupBits(r.bin)} />
            <Stat label="Intervalo" value={`${r.min} … ${r.max}`} />
            <Stat label="Bit de sinal" value={r.bin[0] === '1' ? '1 (negativo)' : '0 (positivo)'} />
          </div>
          {n < 0 && (
            <ol className="mt-4 space-y-2 font-mono text-xs">
              <li className="card px-3 py-2">1. Escreve |{n}| = {Math.abs(n)} → <b>{groupBits(positive)}</b></li>
              <li className="card px-3 py-2">2. Inverte todos os bits → <b>{groupBits(inverted)}</b></li>
              <li className="card px-3 py-2">3. Soma 1 → <b>{groupBits(r.bin)}</b></li>
            </ol>
          )}
        </>
      )}
    </WidgetShell>
  );
}

/* ------------------------------------------- Calculadora de armazenamento */

const UNITS = [
  { id: 'B', label: 'bytes', mult: 1 },
  { id: 'KiB', label: 'KiB (1024 B)', mult: 1024 },
  { id: 'MiB', label: 'MiB', mult: 1024 ** 2 },
  { id: 'GiB', label: 'GiB', mult: 1024 ** 3 },
  { id: 'TiB', label: 'TiB', mult: 1024 ** 4 },
  { id: 'kB', label: 'kB (1000 B)', mult: 1000 },
  { id: 'MB', label: 'MB', mult: 1000 ** 2 },
  { id: 'GB', label: 'GB', mult: 1000 ** 3 },
];

const ITEMS = [
  { name: 'Carácter ASCII', bytes: 1 },
  { name: 'Inteiro de 32 bits', bytes: 4 },
  { name: 'Inteiro de 64 bits', bytes: 8 },
  { name: 'Página de texto (~2 000 caracteres)', bytes: 2000 },
  { name: 'Foto de telemóvel (JPEG 12 MP)', bytes: 4 * 1024 ** 2 },
  { name: 'Música MP3 de 4 min', bytes: 5 * 1024 ** 2 },
  { name: 'Filme 1080p (1 h 30)', bytes: 3 * 1024 ** 3 },
];

export function StorageCalculator() {
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('GiB');
  const mult = UNITS.find((u) => u.id === unit)?.mult ?? 1;
  const bytes = qty * mult;

  return (
    <WidgetShell title="Calculadora de armazenamento" subtitle="Quantos itens cabem — e porque o disco de 1 TB mostra 931 GiB.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Quantidade">
          <input type="number" min={0} step="any" className="field" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} />
        </Labeled>
        <Labeled label="Unidade">
          <select className="field" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </Labeled>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat label="Bytes exatos" value={bytes.toLocaleString('pt-PT')} />
        <Stat label="Bits" value={(bytes * 8).toLocaleString('pt-PT')} />
        <Stat label="Em base 1024" value={formatBytes(bytes, 'iec')} />
        <Stat label="Em base 1000" value={formatBytes(bytes, 'si')} />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-soft">
        <table className="w-full text-left text-sm">
          <thead className="surface-sunken">
            <tr><th className="px-3 py-2 font-semibold text-strong">Cabe aproximadamente…</th><th className="px-3 py-2 text-right font-semibold text-strong">Quantidade</th></tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => (
              <tr key={it.name} className="border-t border-soft/60">
                <td className="px-3 py-2">{it.name}</td>
                <td className="px-3 py-2 text-right font-mono">{Math.floor(bytes / it.bytes).toLocaleString('pt-PT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        O fabricante vende <b>1 TB = 1 000 000 000 000 bytes</b>; o sistema operativo mostra o mesmo espaço em TiB/GiB (base 1024) e escreve <b>931 GiB</b>. Não desaparece nada — muda a régua.
      </p>
    </WidgetShell>
  );
}

/* ----------------------------------------------------- ASCII / Unicode */

export function AsciiExplorer() {
  const [text, setText] = useState('Olá!');
  const chars = useMemo(() => Array.from(text).slice(0, 24), [text]);

  return (
    <WidgetShell title="De texto para bits" subtitle="Cada carácter é um número; cada número é uma sequência de bits.">
      <Labeled label="Escreve algo">
        <input className="field" value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
      </Labeled>
      <div className="scrollbar-thin mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead className="surface-sunken">
            <tr>
              {['Carácter', 'Code point', 'Decimal', 'Hex', 'Binário (8 bits)', 'Bytes UTF-8'].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold text-strong">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {chars.map((c, i) => {
              const cp = c.codePointAt(0) ?? 0;
              const bytes = utf8Bytes(c);
              return (
                <tr key={i} className="border-t border-soft/60">
                  <td className="px-3 py-1.5 text-base">{c === ' ' ? '␣' : c}</td>
                  <td className="px-3 py-1.5">U+{cp.toString(16).toUpperCase().padStart(4, '0')}</td>
                  <td className="px-3 py-1.5">{cp}</td>
                  <td className="px-3 py-1.5">0x{cp.toString(16).toUpperCase()}</td>
                  <td className="px-3 py-1.5">{cp < 256 ? groupBits(cp.toString(2).padStart(8, '0')) : '—'}</td>
                  <td className="px-3 py-1.5">{bytes.map((b) => b.toString(2).padStart(8, '0')).join(' ')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Total: <b>{Array.from(text).length}</b> caracteres, <b>{new TextEncoder().encode(text).length}</b> bytes em UTF-8. Repara que letras acentuadas e emojis ocupam mais do que 1 byte.
      </p>
    </WidgetShell>
  );
}

/* ------------------------------------------------------- IEEE 754 */

export function FloatBits() {
  const [v, setV] = useState(0.1);
  const p = float32Parts(v);
  const sum = 0.1 + 0.2;

  return (
    <WidgetShell title="Números com vírgula (IEEE 754)" subtitle="Porque 0.1 + 0.2 não dá exatamente 0.3.">
      <Labeled label="Número real">
        <input type="number" step="any" className="field" value={v} onChange={(e) => setV(Number(e.target.value))} />
      </Labeled>
      <div className="mt-4 flex flex-wrap gap-1 font-mono text-xs">
        <span className="rounded-l-lg bg-rose-500 px-2 py-1.5 font-bold text-white" title="sinal">{p.sign}</span>
        <span className="bg-amber-500 px-2 py-1.5 font-bold text-white" title="expoente">{p.exponent}</span>
        <span className="rounded-r-lg bg-sky-600 px-2 py-1.5 font-bold text-white" title="mantissa">{p.mantissa}</span>
      </div>
      <p className="mt-2 text-xs text-muted"><span className="text-rose-600 dark:text-rose-400">1 bit de sinal</span> · <span className="text-amber-600 dark:text-amber-400">8 bits de expoente</span> · <span className="text-sky-600 dark:text-sky-400">23 bits de mantissa</span> = 32 bits</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Valor guardado (float32)" value={String(p.stored)} />
        <Stat label="0.1 + 0.2 (float64)" value={String(sum)} />
        <Stat label="É igual a 0.3?" value={sum === 0.3 ? 'sim' : 'não'} />
      </div>
      <p className="mt-3 text-xs text-muted">
        Regra prática: <b>nunca</b> uses vírgula flutuante para dinheiro. Guarda cêntimos em inteiros ou usa um tipo decimal (<code>BigDecimal</code> em Java, <code>decimal</code> em Python/C#).
      </p>
    </WidgetShell>
  );
}
