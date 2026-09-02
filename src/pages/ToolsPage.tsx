import { useRef, useState } from 'react';
import { Widget, WIDGET_CATALOG } from '../components/widgets';
import type { WidgetId } from '../types';

export function ToolsPage() {
  const [active, setActive] = useState<WidgetId>('base-converter');
  const current = WIDGET_CATALOG.find((w) => w.id === active)!;
  const panel = useRef<HTMLDivElement>(null);

  const select = (id: WidgetId) => {
    setActive(id);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Ferramentas interativas</h1>
        <p className="mt-2 max-w-2xl text-body">
          As {WIDGET_CATALOG.length} ferramentas do tutorial, reunidas num sítio. Usa-as para experimentar,
          conferir exercícios ou simplesmente brincar com os conceitos.
        </p>
      </header>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {WIDGET_CATALOG.map((w) => (
          <button
            key={w.id}
            onClick={() => select(w.id)}
            className={`card flex gap-3 p-3 text-left transition ${active === w.id ? 'border-brand-500 ring-2 ring-brand-500/25' : 'hover:border-brand-400'}`}
          >
            <span className="text-xl" aria-hidden>{w.icon}</span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-strong">{w.name}</span>
              <span className="block text-xs leading-snug text-muted">{w.description}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 scroll-mt-20" key={active} ref={panel}>
        <Widget id={current.id} />
      </div>
    </div>
  );
}
