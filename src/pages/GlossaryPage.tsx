import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GLOSSARY, MODULES } from '../content';

export function GlossaryPage() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const needle = norm(q.trim());
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((g) => norm(g.term).includes(needle) || norm(g.def).includes(needle));
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Glossário</h1>
        <p className="mt-2 text-body">Os termos que aparecem ao longo do tutorial, com ligação ao módulo onde são explicados.</p>
      </header>

      <input
        className="field mt-5 font-sans"
        placeholder="Procurar termo ou definição…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Procurar no glossário"
      />

      <p className="mt-2 text-xs text-muted">{filtered.length} de {GLOSSARY.length} termos</p>

      <dl className="mt-4 space-y-2">
        {filtered.map((g) => {
          const mod = MODULES.find((m) => m.id === g.module);
          return (
            <div key={g.term} className="card p-4">
              <dt className="flex flex-wrap items-center gap-2 font-bold text-strong">
                {g.term}
                {mod && (
                  <Link to={`/modulo/${mod.id}`} className="chip surface-sunken text-[0.65rem] text-muted hover:text-brand-600">
                    {mod.icon} módulo {mod.number}
                  </Link>
                )}
              </dt>
              <dd className="mt-1 text-[0.92rem] leading-relaxed">{g.def}</dd>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="py-8 text-center text-muted">Nenhum termo encontrado.</p>}
      </dl>
    </div>
  );
}
