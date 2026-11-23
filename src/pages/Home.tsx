import { Link } from 'react-router-dom';
import { MODULES, TRACKS, TOTAL_EXERCISES, TOTAL_MINUTES, TOTAL_QUESTIONS, TOTAL_SECTIONS } from '../content';
import { useProgress } from '../lib/progress';

function Ring({ pct, size = 46 }: { pct: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" className="stroke-current opacity-15" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" strokeLinecap="round"
        className="stroke-brand-500 transition-all duration-500"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
      />
    </svg>
  );
}

export function Home() {
  const state = useProgress();
  const doneSections = Object.values(state.sections).reduce((a, s) => a + s.length, 0);
  const pct = Math.round((doneSections / TOTAL_SECTIONS) * 100);
  const last = state.lastModule ? MODULES.find((m) => m.id === state.lastModule) : undefined;

  return (
    <div className="mx-auto max-w-4xl">
      <section className="animate-fade-up">
        <span className="chip bg-brand-100 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300">Do zero ao primeiro programa</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Fundamentos de informática<br />e programação
        </h1>
        <p className="mt-3 max-w-2xl text-[1.05rem] leading-relaxed text-body">
          Doze módulos que vão do transístor ao algoritmo: como um computador funciona por dentro, binário e memória,
          o modelo OSI, lógica de programação, pseudocódigo, estruturas de dados e complexidade — com
          ferramentas interativas, quizzes e exercícios resolvidos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={last ? `/modulo/${last.id}` : `/modulo/${MODULES[0].id}`} className="btn btn-primary">
            {last ? `Continuar: ${last.title}` : 'Começar pelo módulo 1'}
          </Link>
          <Link to="/ferramentas" className="btn btn-ghost">Explorar as ferramentas</Link>
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Módulos', value: String(MODULES.length) },
          { label: 'Secções', value: String(TOTAL_SECTIONS) },
          { label: 'Perguntas', value: String(TOTAL_QUESTIONS) },
          { label: 'Exercícios', value: String(TOTAL_EXERCISES) },
        ].map((s) => (
          <div key={s.label} className="card px-4 py-3">
            <p className="text-2xl font-extrabold text-strong">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      {doneSections > 0 && (
        <section className="card mt-4 flex items-center gap-4 p-4">
          <Ring pct={pct} size={54} />
          <div className="flex-1">
            <p className="font-semibold text-strong">{pct}% concluído</p>
            <p className="text-sm text-muted">{doneSections} de {TOTAL_SECTIONS} secções lidas · cerca de {TOTAL_MINUTES} minutos de leitura no total</p>
          </div>
          <Link to="/progresso" className="btn btn-ghost btn-sm">Ver detalhe</Link>
        </section>
      )}

      {TRACKS.map((track) => (
        <section key={track.id} className="mt-10">
          <h2 className={`mb-1 inline-block bg-gradient-to-r ${track.color} bg-clip-text text-lg font-bold text-transparent`}>
            {track.name}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {track.modules.map((mid) => {
              const m = MODULES.find((x) => x.id === mid)!;
              const done = (state.sections[m.id] ?? []).length;
              const mp = Math.round((done / m.sections.length) * 100);
              return (
                <Link
                  key={m.id}
                  to={`/modulo/${m.id}`}
                  className="card group flex gap-3.5 p-4 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg"
                >
                  <span className="text-2xl" aria-hidden>{m.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.7rem] font-bold tracking-wider text-muted uppercase">Módulo {m.number} · {m.minutes} min</p>
                    <p className="font-bold text-strong group-hover:text-brand-600 dark:group-hover:text-brand-400">{m.title}</p>
                    <p className="mt-0.5 text-[0.85rem] leading-snug text-muted">{m.subtitle}</p>
                    {mp > 0 && (
                      <div className="mt-2 h-1 overflow-hidden rounded-full surface-sunken">
                        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${mp}%` }} />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="card mt-10 p-5">
        <h2 className="text-lg font-bold">Como usar este tutorial</h2>
        <ol className="mt-3 space-y-2 text-[0.93rem]">
          <li><b className="text-strong">1. Lê e experimenta.</b> Cada módulo tem widgets interativos — mexe neles, não te limites a ler. Aprende-se mais a mudar valores do que a olhar para exemplos.</li>
          <li><b className="text-strong">2. Marca as secções.</b> Ao terminar cada secção, marca-a como lida; o progresso fica guardado neste browser.</li>
          <li><b className="text-strong">3. Faz o quiz.</b> Responde antes de veres as soluções. Errar e perceber porquê é a parte que ensina.</li>
          <li><b className="text-strong">4. Resolve os exercícios.</b> Tenta sozinho primeiro, usa a pista, e só depois vê a solução. Muitos podem ser testados no editor de Portugol.</li>
          <li><b className="text-strong">5. Não tenhas pressa.</b> Doze módulos são cerca de {Math.round(TOTAL_MINUTES / 60)} horas de leitura, mas o tempo real com exercícios é várias vezes isso — e é assim que deve ser.</li>
        </ol>
      </section>
    </div>
  );
}
