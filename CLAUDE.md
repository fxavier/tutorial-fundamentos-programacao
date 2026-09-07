# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev        # Vite dev server em http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run typecheck  # só verificação de tipos
npm test           # node:test sobre tests/*.test.mjs
```

`npm test` corre um `pretest` que compila `src/lib/{portugol,numbers,sorting,widget-ids}.ts` e
faz bundle de `src/content/index.ts` para `.tmp/*.mjs` com esbuild — os testes importam de
`.tmp/`, não de `src/`. Um ficheiro novo em `src/lib` que os testes precisem tem de ser
acrescentado à lista do `pretest`.

Correr um ficheiro só: `npm run pretest && node --test tests/portugol.test.mjs`
Correr um teste só: `node --test --test-name-pattern "ids são únicos" tests/content.test.mjs`

[tests/predict.test.mjs](tests/predict.test.mjs) corre o código dos exercícios de previsão — os de
Python no `python3` do sistema, os de JavaScript no worker do laboratório compilado para
`.tmp/js-worker.mjs` — e compara com o `accept` declarado. Sem `python3` esses casos são saltados;
os de pandas também, se o pacote não estiver instalado (`python3 -m venv v && v/bin/pip install
pandas` e correr com esse `python3` no PATH para os verificar).

## Idioma

Todo o conteúdo, UI, comentários e nomes de teste estão em **português (pt-PT)**. Manter.

## Arquitetura

**Conteúdo como dados, não como JSX.** Cada módulo é um ficheiro em [src/content/](src/content/)
que exporta um objeto `Module` (ver [src/types.ts](src/types.ts)) — secções, quiz e exercícios são
estruturas de dados puras. [Blocks.tsx](src/components/Blocks.tsx) faz o `switch` sobre o union
`Block` e desenha cada tipo. Consequências:

- Para acrescentar um módulo: novo ficheiro em `src/content/`, exportar o `Module`, registar em
  [src/content/index.ts](src/content/index.ts) (array `MODULES` **e** o `TRACKS` certo).
- Acrescentar um tipo de bloco = editar o union em `types.ts` **e** o `switch` em `Blocks.tsx`.
- Os textos passam por [RichText.tsx](src/components/RichText.tsx), que suporta `**negrito**`,
  `*itálico*`, `` `código` `` e `[texto](url)` — nada mais (não é markdown).

**Widgets.** Um `WidgetId` tem de existir em três sítios em sincronia: o union em
[src/types.ts](src/types.ts), o `switch` e o `WIDGET_CATALOG` em
[src/components/widgets/index.tsx](src/components/widgets/index.tsx), e o array em
[src/lib/widget-ids.ts](src/lib/widget-ids.ts) (esta duplicação existe porque os testes em
`.mjs` não conseguem ler um tipo TypeScript). [tests/content.test.mjs](tests/content.test.mjs)
falha se divergirem.

**Testes de integridade do conteúdo.** `tests/content.test.mjs` valida todos os módulos: ids
únicos, contagens mínimas (≥4 secções, ≥4 perguntas, ≥2 exercícios), `answer` dentro do
intervalo de `options`, tabelas com linhas do tamanho do cabeçalho, widgets existentes. Editar
conteúdo sem correr `npm test` é a forma mais fácil de partir o build.

**Estado.** [src/lib/progress.ts](src/lib/progress.ts) é um store manual sobre
`useSyncExternalStore` + `localStorage` (chave `fip:progress:v1`), sem biblioteca de estado. O
mesmo ficheiro tem o `themeStore` (classe `.dark` no `<html>`). Nada vai para servidor nenhum.

**Laboratórios de código.** Os de Python e de JavaScript correm num *web worker*
(deliberadamente: um ciclo infinito de um aluno bloqueia só o worker, que o botão Parar mata) e
partilham o cliente [src/lib/runner.ts](src/lib/runner.ts) e o `useCodeRunner`/`ConsoleOutput` de
[Shell.tsx](src/components/widgets/Shell.tsx). Ao mexer aqui, confirma no browser — o `tsc` não
apanha nada disto.

**HTML/CSS e React.** [Web.tsx](src/components/widgets/Web.tsx) é o quarto e o quinto
laboratório (`web-lab` e `react-lab` são o mesmo componente com `mode` diferente). Aqui o
resultado é uma *página*, não texto, por isso não há worker nenhum: o código vai para um
`<iframe sandbox>` por `srcdoc`, com uma ponte de `postMessage` que reencaminha o `console` e os
erros para a caixa de saída. O modo React injeta React 18 UMD + Babel standalone de CDN (o React
19 já não publica build UMD) e expõe `React`, os hooks e `createRoot` como globais — os exemplos
não escrevem `import`. Consequência: um ciclo infinito **bloqueia a aba**, ao contrário dos
outros laboratórios.

**JavaScript e Node.** [src/lib/js.worker.ts](src/lib/js.worker.ts) executa o código num
`AsyncFunction` (top-level await funciona) e constrói à volta um ambiente de Node: `console` com
o formato do Node, `process`, `require` de módulos internos, um sistema de ficheiros em memória e
`require("./x")` a partir dele. Só CommonJS — `import`/`export` dão um erro explicativo. Depois
de o código resolver, espera-se pelos `setTimeout` pendentes (até 5 s) para os exemplos do event
loop mostrarem a ordem certa.

**Python no browser.** O laboratório corre CPython real via Pyodide, carregado de CDN em tempo
de execução — é a única parte do projeto que precisa de internet, e a única dependência externa.
[src/lib/python.worker.ts](src/lib/python.worker.ts) importa o Pyodide dentro de um *web worker*
(deliberadamente: um ciclo infinito de um aluno bloqueia só o worker, que o botão Parar mata) e
substitui o `input()` por um shim que lê da caixa de entrada;
[src/lib/python.ts](src/lib/python.ts) é o cliente, com um worker único partilhado por toda a
aplicação. Ao mexer aqui, confirma no browser — o `tsc` não apanha nada disto.

**Exercícios de previsão.** Só existem para Python e JavaScript — HTML, CSS e JSX não têm saída
de texto para comparar (nesses módulos o mesmo papel é feito por `kind: 'input'`, e o `lang`
serve só para o realce do bloco de código). `kind: 'predict'` mostra `code` (na linguagem de `lang`, 'python' por
omissão), pede a saída ao aluno, valida contra `accept` (normalizado por `normalizeAnswer`, que
ignora espaços, acentos e pontuação) e permite executar o código a sério no laboratório certo.
Nunca inventes o valor de `accept`: corre o código e copia a saída — o `npm test` verifica-o, os
de Python no `python3` e os de JavaScript no próprio worker do laboratório.

**Lógica pura em `src/lib/`.** `portugol.ts` (interpretador completo: léxico → parser →
interpretador, com deteção de laços infinitos), `numbers.ts` (conversões, complemento de dois,
UTF-8, IEEE 754), `sorting.ts` (geradores de passos para as animações). Estes módulos não
importam React — é o que permite testá-los com `node:test`. Manter assim.

**Estilo.** Tailwind 4 via `@tailwindcss/vite`, configurado em CSS puro em
[src/index.css](src/index.css) (`@theme` + variáveis CSS por tema). Existem classes de
componente próprias — `card`, `btn`/`btn-primary`/`btn-ghost`/`btn-sm`, `field`, `chip`, `link`,
`surface`, `text-strong`/`text-body`/`text-muted`, `border-soft`. Usar estas em vez de repetir
cadeias de utilitários. Zero dependências de UI: tudo é feito de raiz.

**Build.** `base: './'` em [vite.config.ts](vite.config.ts) para funcionar em subdiretório ou
`file://`; `manualChunks` separa `vendor`, `conteudo` e `widgets`.
