import { useMemo, useRef, useState } from 'react';
import { WidgetShell } from './Shell';
import { run, type RunResult } from '../../lib/portugol';

export const EXAMPLES: { id: string; name: string; input: string; code: string }[] = [
  {
    id: 'ola', name: '1. Olá, mundo', input: '',
    code: `algoritmo "primeiro"
inicio
   escreval("Olá, mundo!")
   escreval("Estou a aprender a programar.")
fimalgoritmo`,
  },
  {
    id: 'entrada', name: '2. Entrada, processamento e saída', input: 'Ana\n2000',
    code: `algoritmo "salario"
var
   nome : caractere
   bruto, liquido : real
inicio
   escreval("Qual é o teu nome?")
   leia(nome)
   escreval("Qual é o salário bruto?")
   leia(bruto)

   liquido <- bruto * 0.89   // desconta 11%

   escreval("Olá, ", nome)
   escreval("Salário líquido: ", liquido)
fimalgoritmo`,
  },
  {
    id: 'decisao', name: '3. Decisão (se / senão)', input: '15',
    code: `algoritmo "classificacao"
var
   nota : real
inicio
   escreval("Introduz a nota (0 a 20):")
   leia(nota)

   se (nota < 0) ou (nota > 20) entao
      escreval("Nota inválida.")
   senao
      se nota >= 18 entao
         escreval("Excelente")
      senao
         se nota >= 14 entao
            escreval("Bom")
         senao
            se nota >= 10 entao
               escreval("Suficiente")
            senao
               escreval("Insuficiente")
            fimse
         fimse
      fimse
   fimse
fimalgoritmo`,
  },
  {
    id: 'laco', name: '4. Laços: tabuada', input: '7',
    code: `algoritmo "tabuada"
var
   n, i : inteiro
inicio
   escreval("Tabuada de que número?")
   leia(n)

   para i de 1 ate 10 faca
      escreval(n, " x ", i, " = ", n * i)
   fimpara
fimalgoritmo`,
  },
  {
    id: 'acumulador', name: '5. Acumulador e contador', input: '4\n10\n15\n8\n20',
    code: `algoritmo "media"
var
   quantos, i : inteiro
   valor, soma, media : real
inicio
   escreval("Quantos valores?")
   leia(quantos)

   soma <- 0
   para i de 1 ate quantos faca
      escreval("Valor ", i, ":")
      leia(valor)
      soma <- soma + valor
   fimpara

   se quantos > 0 entao
      media <- soma / quantos
      escreval("Soma = ", soma)
      escreval("Média = ", media)
   senao
      escreval("Nada a calcular.")
   fimse
fimalgoritmo`,
  },
  {
    id: 'vetor', name: '6. Vetores: maior e menor', input: '',
    code: `algoritmo "vetores"
var
   v : vetor[1..8] de inteiro
   i, maior, menor : inteiro
inicio
   v[1] <- 34
   v[2] <- 7
   v[3] <- 91
   v[4] <- 12
   v[5] <- 55
   v[6] <- 3
   v[7] <- 68
   v[8] <- 27

   maior <- v[1]
   menor <- v[1]

   para i de 2 ate 8 faca
      se v[i] > maior entao
         maior <- v[i]
      fimse
      se v[i] < menor entao
         menor <- v[i]
      fimse
   fimpara

   escreval("Maior: ", maior)
   escreval("Menor: ", menor)
fimalgoritmo`,
  },
  {
    id: 'funcao', name: '7. Funções e procedimentos', input: '',
    code: `algoritmo "modularizado"
var
   a, b : inteiro

funcao maximo(x, y : inteiro) : inteiro
inicio
   se x > y entao
      retorne x
   fimse
   retorne y
fimfuncao

procedimento separador()
inicio
   escreval("------------------------")
fimprocedimento

inicio
   a <- 17
   b <- 42
   separador()
   escreval("O maior entre ", a, " e ", b, " é ", maximo(a, b))
   separador()
fimalgoritmo`,
  },
  {
    id: 'recursao', name: '8. Recursão: fatorial e Fibonacci', input: '',
    code: `algoritmo "recursao"
var
   i : inteiro

funcao fatorial(n : inteiro) : inteiro
inicio
   se n <= 1 entao
      retorne 1          // caso base: para a recursão
   fimse
   retorne n * fatorial(n - 1)   // caso recursivo
fimfuncao

funcao fib(n : inteiro) : inteiro
inicio
   se n < 2 entao
      retorne n
   fimse
   retorne fib(n - 1) + fib(n - 2)
fimfuncao

inicio
   escreval("fatorial(6) = ", fatorial(6))
   escreva("Fibonacci: ")
   para i de 0 ate 10 faca
      escreva(fib(i), " ")
   fimpara
   escreval("")
fimalgoritmo`,
  },
  {
    id: 'ordenacao', name: '9. Ordenação (bubble sort)', input: '',
    code: `algoritmo "bubble_sort"
var
   v : vetor[1..7] de inteiro
   i, j, tmp, n : inteiro
inicio
   n <- 7
   v[1] <- 5
   v[2] <- 2
   v[3] <- 9
   v[4] <- 1
   v[5] <- 7
   v[6] <- 3
   v[7] <- 8

   para i de 1 ate n - 1 faca
      para j de 1 ate n - i faca
         se v[j] > v[j + 1] entao
            tmp <- v[j]
            v[j] <- v[j + 1]
            v[j + 1] <- tmp
         fimse
      fimpara
   fimpara

   escreva("Ordenado: ")
   para i de 1 ate n faca
      escreva(v[i], " ")
   fimpara
   escreval("")
fimalgoritmo`,
  },
  {
    id: 'menu', name: '10. Menu com escolha/caso', input: '2\n8\n5',
    code: `algoritmo "calculadora"
var
   opcao : inteiro
   a, b : real
inicio
   escreval("1 - Somar")
   escreval("2 - Multiplicar")
   escreval("3 - Dividir")
   escreval("Opção:")
   leia(opcao)
   escreval("Primeiro número:")
   leia(a)
   escreval("Segundo número:")
   leia(b)

   escolha opcao
      caso 1
         escreval("Resultado: ", a + b)
      caso 2
         escreval("Resultado: ", a * b)
      caso 3
         se b = 0 entao
            escreval("Não se pode dividir por zero.")
         senao
            escreval("Resultado: ", a / b)
         fimse
      outrocaso
         escreval("Opção desconhecida.")
   fimescolha
fimalgoritmo`,
  },
];

export function PortugolPlayground({ initial, initialInput, compact }: { initial?: string; initialInput?: string; compact?: boolean }) {
  const [code, setCode] = useState(initial ?? EXAMPLES[0].code);
  const [input, setInput] = useState(initialInput ?? '');
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const lines = useMemo(() => code.split('\n').length, [code]);

  const execute = () => {
    setBusy(true);
    // deixa o browser pintar o estado "a correr" antes de bloquear
    setTimeout(() => {
      try { setResult(run(code, input)); }
      catch (e) { setResult({ output: [], error: e instanceof Error ? e.message : String(e), steps: 0, vars: [] }); }
      setBusy(false);
    }, 10);
  };

  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCode(ex.code);
    setInput(ex.input);
    setResult(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = areaRef.current!;
      const s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '   ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 3; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); execute(); }
  };

  return (
    <WidgetShell
      title="Editor de Portugol"
      subtitle="Escreve pseudocódigo em português e executa-o aqui mesmo. Ctrl/Cmd + Enter para correr."
      actions={
        <div className="flex flex-wrap gap-2">
          {!compact && (
            <select className="field w-auto py-1.5 text-xs" onChange={(e) => loadExample(e.target.value)} defaultValue="" aria-label="Carregar exemplo">
              <option value="" disabled>Carregar exemplo…</option>
              {EXAMPLES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
          <button className="btn btn-primary btn-sm" onClick={execute} disabled={busy}>{busy ? 'A correr…' : '▶ Executar'}</button>
        </div>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">Código ({lines} linhas)</span>
            <button className="text-xs text-muted underline" onClick={() => { setCode(''); setResult(null); }}>limpar</button>
          </div>
          <textarea
            ref={areaRef}
            className="field scrollbar-thin h-80 resize-y leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            aria-label="Editor de código Portugol"
          />
          <div className="mt-2">
            <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Entrada (um valor por linha, para o comando leia)</span>
            <textarea className="field h-20 resize-y" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="Dados de entrada" />
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Saída</span>
          <div className="scrollbar-thin h-80 overflow-auto rounded-xl border border-soft bg-slate-950 p-3 font-mono text-[0.8rem] leading-relaxed text-slate-100">
            {result === null && <span className="text-slate-500">Clica em “Executar” para veres o resultado.</span>}
            {result?.output.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l || ' '}</div>)}
            {result?.error && (
              <div className="mt-2 rounded-lg border border-rose-500/50 bg-rose-500/10 px-2.5 py-2 text-rose-300">
                <b>Erro:</b> {result.error}
              </div>
            )}
            {result && !result.error && <div className="mt-2 text-emerald-400">✓ Terminou em {result.steps} passos.</div>}
          </div>

          {result && result.vars.length > 0 && (
            <div className="mt-2 max-h-32 overflow-auto rounded-xl border border-soft">
              <table className="w-full text-left text-xs">
                <thead className="surface-sunken"><tr><th className="px-3 py-1.5 font-semibold text-strong">Variável</th><th className="px-3 py-1.5 font-semibold text-strong">Tipo</th><th className="px-3 py-1.5 font-semibold text-strong">Valor final</th></tr></thead>
                <tbody className="font-mono">
                  {result.vars.map((v) => (
                    <tr key={v.name} className="border-t border-soft/60"><td className="px-3 py-1">{v.name}</td><td className="px-3 py-1 text-muted">{v.type}</td><td className="px-3 py-1 break-all">{v.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
