import type { Block, Tone } from '../types';
import { RichText } from './RichText';
import { CodeBlock } from './CodeBlock';
import { Widget } from './widgets';

const TONES: Record<Tone, { label: string; icon: string; cls: string }> = {
  info: { label: 'Nota', icon: 'ℹ️', cls: 'border-sky-300/60 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10' },
  tip: { label: 'Dica', icon: '💡', cls: 'border-emerald-300/60 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10' },
  warn: { label: 'Atenção', icon: '⚠️', cls: 'border-amber-300/70 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10' },
  key: { label: 'Ideia-chave', icon: '🔑', cls: 'border-brand-300/70 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10' },
  trap: { label: 'Erro comum', icon: '🚫', cls: 'border-rose-300/70 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10' },
};

export function Callout({ tone, title, text }: { tone: Tone; title?: string; text: string }) {
  const t = TONES[tone];
  return (
    <aside className={`my-5 rounded-2xl border px-4 py-3.5 ${t.cls}`}>
      <p className="mb-1 flex items-center gap-2 text-sm font-bold text-strong">
        <span aria-hidden>{t.icon}</span>
        {title ?? t.label}
      </p>
      <p className="text-[0.925rem] leading-relaxed"><RichText text={text} /></p>
    </aside>
  );
}

function DataTable({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-soft">
        <table className="w-full border-collapse text-left text-[0.87rem]">
          <thead>
            <tr className="surface-sunken">
              {head.map((h) => (
                <th key={h} className="border-b border-soft px-3.5 py-2.5 font-semibold text-strong whitespace-nowrap">
                  <RichText text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-black/[0.015] dark:odd:bg-white/[0.02]">
                {r.map((c, j) => (
                  <td key={j} className="border-b border-soft/60 px-3.5 py-2.5 align-top">
                    <RichText text={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-2 text-xs text-muted"><RichText text={caption} /></figcaption>}
    </figure>
  );
}

function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="my-5 space-y-3">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3.5">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
          <div>
            <p className="font-semibold text-strong">{s.title}</p>
            <p className="text-[0.9rem] leading-relaxed"><RichText text={s.text} /></p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Terms({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className="my-5 grid gap-3 sm:grid-cols-2">
      {items.map((t) => (
        <div key={t.term} className="card p-3.5">
          <dt className="font-mono text-sm font-bold text-brand-700 dark:text-brand-300">{t.term}</dt>
          <dd className="mt-1 text-[0.87rem] leading-relaxed"><RichText text={t.def} /></dd>
        </div>
      ))}
    </dl>
  );
}

function Compare({ left, right }: { left: { title: string; items: string[] }; right: { title: string; items: string[] } }) {
  return (
    <div className="my-5 grid gap-4 md:grid-cols-2">
      {[left, right].map((side, i) => (
        <div key={i} className={`rounded-2xl border p-4 ${i === 0 ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/[0.07]' : 'border-rose-300/60 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/[0.07]'}`}>
          <p className="mb-2 font-bold text-strong">{side.title}</p>
          <ul className="space-y-1.5 text-[0.88rem]">
            {side.items.map((it, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden className="text-muted">{i === 0 ? '✔' : '✘'}</span>
                <span><RichText text={it} /></span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="my-3.5 leading-[1.8] text-[0.95rem]"><RichText text={block.text} /></p>;
    case 'h':
      return <h3 className="mt-8 mb-2 text-lg font-bold">{block.text}</h3>;
    case 'list':
      return block.ordered ? (
        <ol className="my-4 ml-5 list-decimal space-y-1.5 text-[0.93rem] leading-relaxed marker:text-brand-600 marker:font-semibold">
          {block.items.map((it, i) => <li key={i}><RichText text={it} /></li>)}
        </ol>
      ) : (
        <ul className="my-4 ml-5 list-disc space-y-1.5 text-[0.93rem] leading-relaxed marker:text-brand-500">
          {block.items.map((it, i) => <li key={i}><RichText text={it} /></li>)}
        </ul>
      );
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} />;
    case 'table':
      return <DataTable head={block.head} rows={block.rows} caption={block.caption} />;
    case 'callout':
      return <Callout tone={block.tone} title={block.title} text={block.text} />;
    case 'steps':
      return <Steps items={block.items} />;
    case 'terms':
      return <Terms items={block.items} />;
    case 'compare':
      return <Compare left={block.left} right={block.right} />;
    case 'widget':
      return <Widget id={block.id} props={block.props} />;
  }
}
