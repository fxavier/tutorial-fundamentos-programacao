import { useState } from 'react';
import type { Exercise } from '../types';
import { progress, useProgress } from '../lib/progress';
import { RichText } from './RichText';
import { CodeBlock } from './CodeBlock';
import { normalizeAnswer } from '../lib/numbers';

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-0.5" title={`Dificuldade ${level} de 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`size-1.5 rounded-full ${i <= level ? 'bg-brand-500' : 'bg-current opacity-20'}`} />
      ))}
    </span>
  );
}

function ExerciseCard({ ex }: { ex: Exercise }) {
  const state = useProgress();
  const done = state.exercises[ex.id] ?? false;
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [value, setValue] = useState('');
  const [check, setCheck] = useState<'idle' | 'ok' | 'no'>('idle');

  const verify = () => {
    const accepted = (ex.accept ?? []).map(normalizeAnswer);
    const ok = accepted.includes(normalizeAnswer(value));
    setCheck(ok ? 'ok' : 'no');
    if (ok) progress.markExercise(ex.id, true);
  };

  return (
    <article className={`card overflow-hidden transition ${done ? 'border-emerald-400/70' : ''}`}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <button
          onClick={() => progress.markExercise(ex.id, !done)}
          className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-soft text-transparent hover:border-brand-400'}`}
          aria-label={done ? 'Marcar como não resolvido' : 'Marcar como resolvido'}
        >
          ✓
        </button>
        <h3 className={`flex-1 font-semibold text-strong ${done ? 'line-through opacity-60' : ''}`}>{ex.title}</h3>
        <DifficultyDots level={ex.difficulty} />
        <span className="chip surface-sunken text-muted">{ex.kind === 'code' ? 'código' : ex.kind === 'input' ? 'resposta curta' : 'reflexão'}</span>
      </div>

      <div className="border-t border-soft px-4 py-3.5">
        <p className="text-[0.92rem] leading-relaxed"><RichText text={ex.statement} /></p>

        {ex.kind === 'input' && (
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              className="field max-w-xs flex-1"
              value={value}
              onChange={(e) => { setValue(e.target.value); setCheck('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder="a tua resposta"
              aria-label={`Resposta para: ${ex.title}`}
            />
            <button className="btn btn-primary" onClick={verify} disabled={!value.trim()}>Verificar</button>
            {check === 'ok' && <span className="self-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Certo!</span>}
            {check === 'no' && <span className="self-center text-sm font-semibold text-rose-600 dark:text-rose-400">✗ Ainda não. Tenta outra vez.</span>}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {ex.hint && <button className="btn btn-ghost btn-sm" onClick={() => setHint(!hint)}>{hint ? 'Esconder pista' : '💡 Pista'}</button>}
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}>{open ? 'Esconder solução' : 'Ver solução'}</button>
        </div>

        {hint && ex.hint && (
          <p className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 px-3.5 py-2.5 text-[0.87rem] dark:border-amber-500/30 dark:bg-amber-500/10">
            <RichText text={ex.hint} />
          </p>
        )}

        {open && (
          <div className="mt-3 rounded-xl border border-soft surface-sunken p-3.5">
            {ex.solution.includes('\n') && (ex.kind === 'code' || ex.solution.trimStart().startsWith('algoritmo')) ? (
              <CodeBlock code={ex.solution} lang="portugol" caption="solução" />
            ) : (
              <p className="whitespace-pre-wrap text-[0.9rem] leading-relaxed"><RichText text={ex.solution} /></p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Exercises({ items }: { items: Exercise[] }) {
  const state = useProgress();
  const done = items.filter((e) => state.exercises[e.id]).length;
  return (
    <section className="mt-10">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Exercícios</h2>
          <p className="text-sm text-muted">Resolve à mão ou no editor de Portugol antes de veres a solução.</p>
        </div>
        <span className="chip surface-sunken text-muted">{done} de {items.length} resolvidos</span>
      </header>
      <div className="space-y-3">
        {items.map((ex) => <ExerciseCard key={ex.id} ex={ex} />)}
      </div>
    </section>
  );
}
