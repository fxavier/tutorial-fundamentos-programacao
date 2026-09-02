import { Link } from 'react-router-dom';
import { MODULES, TOTAL_EXERCISES, TOTAL_QUESTIONS, TOTAL_SECTIONS } from '../content';
import { progress, useProgress } from '../lib/progress';

export function ProgressPage() {
  const state = useProgress();

  const sectionsDone = Object.values(state.sections).reduce((a, s) => a + s.length, 0);
  const exercisesDone = Object.values(state.exercises).filter(Boolean).length;
  const quizzesDone = MODULES.filter((m) => state.quiz[m.id]?.submitted).length;
  const quizCorrect = MODULES.reduce((acc, m) => {
    const q = state.quiz[m.id];
    if (!q?.submitted) return acc;
    return acc + m.quiz.filter((x) => q.answers[x.id] === x.answer).length;
  }, 0);
  const quizAnswered = MODULES.reduce((acc, m) => (state.quiz[m.id]?.submitted ? acc + m.quiz.length : acc), 0);

  const reset = () => {
    if (confirm('Isto apaga todo o progresso guardado neste browser. Continuar?')) progress.resetAll();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="animate-fade-up flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">O teu progresso</h1>
          <p className="mt-2 text-body">Guardado apenas neste browser — nada é enviado para lado nenhum.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset}>Repor tudo</button>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Secções lidas', value: `${sectionsDone} / ${TOTAL_SECTIONS}`, pct: sectionsDone / TOTAL_SECTIONS },
          { label: 'Exercícios resolvidos', value: `${exercisesDone} / ${TOTAL_EXERCISES}`, pct: exercisesDone / TOTAL_EXERCISES },
          { label: 'Quizzes concluídos', value: `${quizzesDone} / ${MODULES.length}`, pct: quizzesDone / MODULES.length },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-2xl font-extrabold text-strong">{s.value}</p>
            <p className="mb-2 text-xs text-muted">{s.label}</p>
            <div className="h-1.5 overflow-hidden rounded-full surface-sunken">
              <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${Math.round(s.pct * 100)}%` }} />
            </div>
          </div>
        ))}
      </section>

      {quizAnswered > 0 && (
        <p className="mt-4 rounded-xl border border-soft px-4 py-3 text-sm">
          Nos quizzes já verificados acertaste <b className="text-strong">{quizCorrect}</b> de <b className="text-strong">{quizAnswered}</b> perguntas
          ({Math.round((quizCorrect / quizAnswered) * 100)}%) — de um total de {TOTAL_QUESTIONS} perguntas no tutorial.
        </p>
      )}

      <section className="mt-8 space-y-2">
        {MODULES.map((m) => {
          const done = (state.sections[m.id] ?? []).length;
          const pct = Math.round((done / m.sections.length) * 100);
          const q = state.quiz[m.id];
          const correct = q?.submitted ? m.quiz.filter((x) => q.answers[x.id] === x.answer).length : null;
          const ex = m.exercises.filter((e) => state.exercises[e.id]).length;
          return (
            <Link key={m.id} to={`/modulo/${m.id}`} className="card flex flex-wrap items-center gap-3 p-3.5 transition hover:border-brand-400">
              <span className="text-xl" aria-hidden>{m.icon}</span>
              <span className="min-w-40 flex-1">
                <span className="block text-sm font-semibold text-strong">{m.number}. {m.title}</span>
                <span className="block text-xs text-muted">
                  {done}/{m.sections.length} secções · {ex}/{m.exercises.length} exercícios
                  {correct !== null && ` · quiz ${correct}/${m.quiz.length}`}
                </span>
              </span>
              <span className="w-24">
                <span className="block h-1.5 overflow-hidden rounded-full surface-sunken">
                  <span className={`block h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                </span>
              </span>
              <span className={`w-10 text-right text-xs font-bold ${pct === 100 ? 'text-emerald-500' : 'text-muted'}`}>{pct}%</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
