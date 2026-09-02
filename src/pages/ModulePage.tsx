import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getModule, moduleNeighbours } from '../content';
import { BlockView } from '../components/Blocks';
import { Quiz } from '../components/Quiz';
import { Exercises } from '../components/Exercises';
import { progress, useProgress } from '../lib/progress';

export function ModulePage() {
  const { id = '' } = useParams();
  const mod = getModule(id);
  const state = useProgress();

  useEffect(() => { if (mod) progress.visit(mod.id); }, [mod]);

  if (!mod) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="text-lg font-semibold">Módulo não encontrado.</p>
        <Link to="/" className="link mt-2 inline-block">Voltar ao início</Link>
      </div>
    );
  }

  const doneSections = state.sections[mod.id] ?? [];
  const { prev, next } = moduleNeighbours(mod.id);
  const pct = Math.round((doneSections.length / mod.sections.length) * 100);

  return (
    <article className="mx-auto max-w-3xl">
      <header className="animate-fade-up">
        <p className="text-[0.7rem] font-bold tracking-widest text-muted uppercase">Módulo {mod.number} · {mod.minutes} minutos</p>
        <h1 className="mt-1 flex items-start gap-3 text-3xl font-extrabold tracking-tight">
          <span aria-hidden>{mod.icon}</span>
          <span>{mod.title}</span>
        </h1>
        <p className="mt-2 text-[1.02rem] text-body">{mod.subtitle}</p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full surface-sunken">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="card min-w-0 p-4">
            <p className="mb-2 text-sm font-bold text-strong">No fim deste módulo vais conseguir</p>
            <ul className="space-y-1 text-[0.88rem]">
              {mod.goals.map((g, i) => (
                <li key={i} className="flex gap-2"><span className="text-brand-500" aria-hidden>→</span>{g}</li>
              ))}
            </ul>
          </div>
          <nav className="card min-w-0 p-4" aria-label="Índice do módulo">
            <p className="mb-2 text-sm font-bold text-strong">Nesta página</p>
            <ol className="space-y-1 text-[0.88rem]">
              {mod.sections.map((s, i) => (
                <li key={s.id} className="flex min-w-0 items-center gap-2">
                  <span className={`size-1.5 shrink-0 rounded-full ${doneSections.includes(s.id) ? 'bg-emerald-500' : 'bg-current opacity-25'}`} />
                  <a href={`#${s.id}`} className="truncate hover:text-brand-600 dark:hover:text-brand-400">
                    {mod.number}.{i + 1} {s.title}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2 pt-1 text-muted">
                <span className="size-1.5 shrink-0 rounded-full bg-current opacity-25" />
                Quiz ({mod.quiz.length}) e exercícios ({mod.exercises.length})
              </li>
            </ol>
          </nav>
        </div>
      </header>

      {mod.sections.map((section, si) => {
        const done = doneSections.includes(section.id);
        return (
          <section key={section.id} id={section.id} className="mt-12 scroll-mt-20">
            <div className="flex items-start justify-between gap-4 border-b border-soft pb-2">
              <h2 className="text-xl font-bold">
                <span className="mr-2 text-muted">{mod.number}.{si + 1}</span>
                {section.title}
              </h2>
            </div>
            <div className="prose-block">
              {section.blocks.map((b, bi) => <BlockView key={bi} block={b} />)}
            </div>
            <button
              onClick={() => progress.toggleSection(mod.id, section.id)}
              className={`btn mt-4 ${done ? 'btn-ghost' : 'btn-primary'}`}
            >
              {done ? '✓ Secção concluída' : 'Marcar secção como lida'}
            </button>
          </section>
        );
      })}

      <Quiz moduleId={mod.id} questions={mod.quiz} />
      <Exercises items={mod.exercises} />

      <nav className="mt-12 flex flex-wrap gap-3 border-t border-soft pt-6">
        {prev && (
          <Link to={`/modulo/${prev.id}`} className="card flex-1 p-3.5 transition hover:border-brand-400">
            <p className="text-xs text-muted">← Anterior</p>
            <p className="font-semibold text-strong">{prev.number}. {prev.title}</p>
          </Link>
        )}
        {next && (
          <Link to={`/modulo/${next.id}`} className="card flex-1 p-3.5 text-right transition hover:border-brand-400">
            <p className="text-xs text-muted">Seguinte →</p>
            <p className="font-semibold text-strong">{next.number}. {next.title}</p>
          </Link>
        )}
      </nav>
    </article>
  );
}
