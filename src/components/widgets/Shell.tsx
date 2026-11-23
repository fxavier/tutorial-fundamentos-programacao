import type { ReactNode } from 'react';

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
