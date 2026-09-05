import { useState } from 'react';
import type { Exercise } from '../types';
import { progress, useProgress } from '../lib/progress';
import { RichText } from './RichText';
import { CodeBlock } from './CodeBlock';
import { normalizeAnswer } from '../lib/numbers';
import { usePython } from './widgets/Python';
import { useJs } from './widgets/Js';
import { ConsoleOutput } from './widgets/Shell';

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-0.5" title={`Dificuldade ${level} de 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`size-1.5 rounded-full ${i <= level ? 'bg-brand-500' : 'bg-current opacity-20'}`} />
      ))}
    </span>
  );
}

const KIND_LABEL: Record<Exercise['kind'], string> = {
  code: 'código', input: 'resposta curta', open: 'reflexão', predict: 'prevê a saída',
};

function ExerciseCard({ ex }: { ex: Exercise }) {
  const state = useProgress();
  const done = state.exercises[ex.id] ?? false;
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [value, setValue] = useState('');
  const [check, setCheck] = useState<'idle' | 'ok' | 'no'>('idle');
  const py = usePython();
  const js = useJs();
  const lang = ex.lang ?? 'python';
  const run = lang === 'js' ? js : py;

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
        <span className="chip surface-sunken text-muted">{KIND_LABEL[ex.kind]}</span>
      </div>

      <div className="border-t border-soft px-4 py-3.5">
        <p className="text-[0.92rem] leading-relaxed"><RichText text={ex.statement} /></p>

        {ex.kind === 'predict' && ex.code && (
          <CodeBlock code={ex.code} lang={lang} caption="que saída produz este código?" />
        )}

        {(ex.kind === 'input' || ex.kind === 'predict') && (
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              className="field max-w-xs flex-1"
              value={value}
              onChange={(e) => { setValue(e.target.value); setCheck('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder={ex.kind === 'predict' ? 'a saída que esperas' : 'a tua resposta'}
              aria-label={`Resposta para: ${ex.title}`}
            />
            <button className="btn btn-primary" onClick={verify} disabled={!value.trim()}>Verificar</button>
            {ex.kind === 'predict' && ex.code && (
              <button
                className="btn btn-ghost"
                onClick={() => run.execute(lang === 'js' ? { code: ex.code! } : { code: ex.code!, packages: ex.packages })}
                disabled={run.busy || !value.trim()}
                title={value.trim() ? 'Corre o código a sério' : 'Escreve primeiro a tua previsão'}
              >
                {run.busy ? 'A correr…' : '▶ Confirmar a correr'}
              </button>
            )}
            {check === 'ok' && <span className="self-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Certo!</span>}
            {check === 'no' && <span className="self-center text-sm font-semibold text-rose-600 dark:text-rose-400">✗ Ainda não. Tenta outra vez.</span>}
          </div>
        )}

        {(run.busy || run.result) && (
          <div className="mt-3">
            <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Saída real</span>
            <ConsoleOutput result={run.result} busy={run.busy} status={run.status} />
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
              <CodeBlock code={ex.solution} lang={ex.solution.trimStart().startsWith('algoritmo') ? 'portugol' : lang} caption="solução" />
            ) : (
              <p className="text-[0.9rem] leading-relaxed"><RichText text={ex.solution} /></p>
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
          <p className="text-sm text-muted">Resolve à mão, ou no editor de Portugol e no laboratório de Python, antes de veres a solução.</p>
        </div>
        <span className="chip surface-sunken text-muted">{done} de {items.length} resolvidos</span>
      </header>
      <div className="space-y-3">
        {items.map((ex) => <ExerciseCard key={ex.id} ex={ex} />)}
      </div>
    </section>
  );
}
