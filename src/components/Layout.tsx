import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MODULES, TRACKS } from '../content';
import { useProgress, themeStore, useTheme } from '../lib/progress';

function ModuleProgress({ moduleId }: { moduleId: string }) {
  const state = useProgress();
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const done = (state.sections[moduleId] ?? []).length;
  const pct = Math.round((done / mod.sections.length) * 100);
  if (pct === 0) return null;
  return (
    <span className={`ml-auto shrink-0 text-[0.65rem] font-bold ${pct === 100 ? 'text-emerald-500' : 'text-brand-500'}`}>
      {pct === 100 ? '✓' : `${pct}%`}
    </span>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="scrollbar-thin h-full overflow-y-auto px-3 py-4">
      <div className="mb-4 space-y-0.5">
        {[
          { to: '/', label: 'Início', icon: '🏠' },
          { to: '/ferramentas', label: 'Ferramentas', icon: '🧪' },
          { to: '/glossario', label: 'Glossário', icon: '📖' },
          { to: '/progresso', label: 'Progresso', icon: '📊' },
        ].map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white' : 'text-body hover:surface-sunken hover:text-strong'}`
            }
          >
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </div>

      {TRACKS.map((track) => (
        <div key={track.id} className="mb-4">
          <p className="mb-1.5 px-3 text-[0.68rem] font-bold tracking-widest text-muted uppercase">{track.name}</p>
          <div className="space-y-0.5">
            {track.modules.map((mid) => {
              const m = MODULES.find((x) => x.id === mid)!;
              return (
                <NavLink
                  key={m.id}
                  to={`/modulo/${m.id}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-brand-600 font-semibold text-white' : 'text-body hover:surface-sunken hover:text-strong'}`
                  }
                >
                  <span aria-hidden className="text-base">{m.icon}</span>
                  <span className="min-w-0 flex-1 truncate">{m.number}. {m.title}</span>
                  <ModuleProgress moduleId={m.id} />
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-soft bg-[var(--surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[110rem] items-center gap-3 px-4">
          <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Abrir menu" aria-expanded={open}>
            ☰
          </button>
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-mono text-xs font-bold text-white">01</span>
            <span className="hidden text-sm font-bold text-strong sm:block">Fundamentos de Informática e Programação</span>
            <span className="text-sm font-bold text-strong sm:hidden">Fundamentos</span>
          </NavLink>
          <button
            className="btn btn-ghost btn-sm ml-auto"
            onClick={() => themeStore.toggle()}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[110rem]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 border-r border-soft lg:block">
          <Sidebar onNavigate={() => setOpen(false)} />
        </aside>

        {open && (
          <>
            <div className="fixed inset-0 top-14 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
            <aside className="fixed top-14 bottom-0 left-0 z-30 w-72 border-r border-soft bg-[var(--surface)] lg:hidden">
              <Sidebar onNavigate={() => setOpen(false)} />
            </aside>
          </>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>

      <footer className="border-t border-soft px-4 py-6 text-center text-xs text-muted">
        Tutorial interativo de fundamentos de informática e programação · o teu progresso fica guardado neste browser
      </footer>
    </div>
  );
}
