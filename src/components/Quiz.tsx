import type { Question } from '../types';
import { progress, useProgress } from '../lib/progress';
import { RichText } from './RichText';

export function Quiz({ moduleId, questions }: { moduleId: string; questions: Question[] }) {
  const state = useProgress();
  const q = state.quiz[moduleId] ?? { answers: {}, submitted: false };
  const answered = questions.filter((x) => q.answers[x.id] !== undefined).length;
  const correct = questions.filter((x) => q.answers[x.id] === x.answer).length;
  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <section className="mt-10">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Quiz do módulo</h2>
          <p className="text-sm text-muted">{questions.length} perguntas · responde a todas e depois verifica.</p>
        </div>
        {q.submitted && (
          <div className={`chip px-3 py-1.5 text-sm ${pct >= 70 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
            {correct} / {questions.length} · {pct}%
          </div>
        )}
      </header>

      <div className="space-y-4">
        {questions.map((question, qi) => {
          const chosen = q.answers[question.id];
          return (
            <article key={question.id} className="card p-4">
              <p className="mb-3 font-semibold text-strong">
                <span className="mr-2 text-brand-600 dark:text-brand-400">{qi + 1}.</span>
                <RichText text={question.prompt} />
              </p>
              <div className="space-y-2">
                {question.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = question.answer === oi;
                  let cls = 'border-soft hover:border-brand-400';
                  if (q.submitted) {
                    if (isRight) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
                    else if (isChosen) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-500/10';
                    else cls = 'border-soft opacity-60';
                  } else if (isChosen) {
                    cls = 'border-brand-500 bg-brand-50 dark:bg-brand-500/10';
                  }
                  return (
                    <button
                      key={oi}
                      disabled={q.submitted}
                      onClick={() => progress.setQuizAnswer(moduleId, question.id, oi)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[0.9rem] transition ${cls}`}
                    >
                      <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold ${isChosen || (q.submitted && isRight) ? 'border-transparent bg-brand-600 text-white' : 'border-soft text-muted'}`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span><RichText text={opt} /></span>
                      {q.submitted && isRight && <span className="ml-auto text-emerald-600">✓</span>}
                      {q.submitted && isChosen && !isRight && <span className="ml-auto text-rose-600">✗</span>}
                    </button>
                  );
                })}
              </div>
              {q.submitted && (
                <p className={`mt-3 rounded-xl border px-3.5 py-2.5 text-[0.87rem] leading-relaxed ${chosen === question.answer ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-amber-300 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-500/10'}`}>
                  <b>{chosen === question.answer ? 'Certo. ' : 'Não é essa. '}</b>
                  <RichText text={question.explain} />
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!q.submitted ? (
          <>
            <button className="btn btn-primary" disabled={answered < questions.length} onClick={() => progress.submitQuiz(moduleId)}>
              Verificar respostas
            </button>
            <span className="text-sm text-muted">{answered} de {questions.length} respondidas</span>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => progress.resetQuiz(moduleId)}>Tentar de novo</button>
            <span className="text-sm text-muted">
              {pct === 100 ? 'Perfeito — podes avançar.' : pct >= 70 ? 'Bom resultado. Revê as que falhaste e avança.' : 'Vale a pena reler a secção antes de continuar.'}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
