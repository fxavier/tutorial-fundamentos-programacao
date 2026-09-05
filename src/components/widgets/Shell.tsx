import { useCallback, useState, type ReactNode } from 'react';
import type { Runner, RunResult } from '../../lib/runner';

export function WidgetShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="my-6 overflow-hidden rounded-2xl border border-brand-200/70 bg-gradient-to-b from-brand-50/70 to-transparent dark:border-brand-500/25 dark:from-brand-500/[0.08]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-200/60 px-4 py-3 dark:border-brand-500/20">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-strong">
            <span className="chip bg-brand-600 text-white">interativo</span>
            {title}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Labeled({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="card px-3 py-2.5">
      <p className="text-[0.68rem] font-semibold tracking-wider text-muted uppercase">{label}</p>
      <p className={`mt-0.5 break-all text-sm font-bold text-strong ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

/** Estado de uma execução: partilhado pelos laboratórios de Python e de JavaScript. */
export function useCodeRunner<Req>(runner: Runner<Req>) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<RunResult | null>(null);

  const execute = useCallback(async (req: Req) => {
    setBusy(true);
    setStatus('');
    setResult(null);
    try {
      setResult(await runner.run(req, setStatus));
    } catch {
      setResult({ output: [], error: 'Execução interrompida.', ms: 0 });
    }
    setStatus('');
    setBusy(false);
  }, [runner]);

  return { busy, status, result, execute, abort: () => runner.stop(), clear: () => setResult(null) };
}

export function ConsoleOutput({ result, busy, status, empty }: { result: RunResult | null; busy: boolean; status: string; empty?: string }) {
  return (
    <div className="scrollbar-thin h-full min-h-40 overflow-auto rounded-xl border border-soft bg-slate-950 p-3 font-mono text-[0.8rem] leading-relaxed text-slate-100">
      {busy && <div className="text-amber-300">{status || 'A executar…'}</div>}
      {!busy && result === null && <span className="text-slate-500">{empty ?? 'Clica em “Executar” para veres o resultado.'}</span>}
      {result?.output.map((l, i) => (
        <div key={i} className={`whitespace-pre-wrap ${l.err ? 'text-rose-300' : ''}`}>{l.text || ' '}</div>
      ))}
      {result?.error && (
        <div className="mt-2 rounded-lg border border-rose-500/50 bg-rose-500/10 px-2.5 py-2 text-rose-300">
          <b>Erro:</b> {result.error}
        </div>
      )}
      {result && !result.error && <div className="mt-2 text-emerald-400">✓ Terminou em {result.ms} ms.</div>}
    </div>
  );
}
