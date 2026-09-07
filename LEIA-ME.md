# Fundamentos de Informática e Programação

Tutorial interativo, em português, que vai do transístor ao React. Vinte e quatro módulos com
ferramentas interativas, quizzes com explicação e exercícios resolvidos — pensado para
quem está a começar em programação e quer perceber o que acontece por baixo do código.

## Como correr

Precisas de [Node.js](https://nodejs.org) 20 ou superior.

```bash
npm install      # instalar dependências (só na primeira vez)
npm run dev      # servidor de desenvolvimento em http://localhost:5173
```

Outros comandos:

```bash
npm run build      # verifica tipos e gera a versão de produção em dist/
npm run preview    # serve a versão de produção localmente
npm test           # interpretador, conversões, ordenação, integridade do conteúdo
                   # e a saída real dos exercícios de previsão (precisa de python3)
npm run typecheck  # apenas a verificação de tipos
```

Para publicar, basta servir a pasta `dist/` em qualquer alojamento estático
(GitHub Pages, Netlify, Vercel, um servidor Nginx). O `base` está definido como `./`,
por isso funciona também a partir de um subdiretório ou do sistema de ficheiros.

## Conteúdo

| # | Módulo | Assunto |
|---|--------|---------|
| 1 | Como funciona um computador | Hardware, software, ciclo de instrução, sistema operativo, compilação |
| 2 | Sistemas de numeração e binário | Notação posicional, conversões, hexadecimal, aritmética binária, complemento de dois |
| 3 | Bits, bytes e memória | Unidades, KB vs KiB, UTF-8, IEEE 754, hierarquia de memória, pilha e heap |
| 4 | Redes e o modelo OSI | Sete camadas, encapsulamento, TCP/IP, IP, portas, DNS, HTTP |
| 5 | Lógica de programação | Variáveis, tipos, operadores, precedência, álgebra booleana, De Morgan |
| 6 | Estruturas de controlo | Decisão, repetição, acumuladores, aninhamento, erros clássicos |
| 7 | Algoritmos e pseudocódigo | Fluxogramas, Portugol, teste de mesa, funções, escopo, recursão |
| 8 | Estruturas de dados | Vetores, matrizes, listas, pilhas, filas, mapas, árvores |
| 9 | Algoritmos clássicos e complexidade | Big-O, pesquisa linear e binária, cinco algoritmos de ordenação |
| 10 | Paradigmas e boas práticas | POO, funcional, código limpo, depuração, testes |
| 11 | Terminal, ficheiros e Git | Caminhos, linha de comandos, controlo de versões, ambiente de trabalho |
| 12 | Próximos passos | Plano de estudo, projetos, recursos, hábitos |
| 13 | Fundamentos de Python | Sintaxe, tipos, f-strings, decisão, ciclos, funções, erros |
| 14 | Estruturas de dados em Python | Listas, compreensões, dicionários, conjuntos, tuplos, pilhas e filas |
| 15 | Programação orientada a objetos | Classes, `self`, métodos especiais, herança, `@property`, dataclasses |
| 16 | Análise de dados com pandas | Series, DataFrames, filtros, colunas derivadas, `groupby`, limpeza, `merge` |
| 17 | JavaScript moderno | `const`/`let`, coerção, `===`, funções, arrays, objetos, desestruturação, erros |
| 18 | Assíncrono e o event loop | Callbacks, promessas, `async`/`await`, microtarefas, `Promise.all`, `fetch` |
| 19 | JavaScript avançado | Closures, `this`, protótipos, estilo funcional, ESM/CommonJS, npm, TypeScript |
| 20 | Node.js | Projeto e npm, módulos, ficheiros, CLI, EventEmitter, servidor HTTP, `node --test` |
| 21 | HTML | Documento, semântica, imagens, formulários, tabelas, DOM, acessibilidade |
| 22 | CSS | Seletores, cascata, box model, flexbox, grid, responsivo, variáveis e temas |
| 23 | React | JSX, componentes, props, `useState`, eventos, listas e keys, formulários |
| 24 | React na prática | `useEffect`, dados, `useRef`/`useMemo`, hooks próprios, Context, `useReducer`, Vite |

## Ferramentas interativas

Conversor de bases · bits ligados · complemento de dois · calculadora de armazenamento ·
texto para bits (ASCII/UTF-8) · IEEE 754 · mapa de memória · ciclo da CPU · pilha e heap ·
simulador OSI · inspetor de pacote · tabela verdade · fluxogramas · teste de mesa ·
**editor de Portugol executável** · **laboratório de Python com pandas** ·
**laboratório de JavaScript e Node** · **laboratório de HTML e CSS** ·
**laboratório de React** · ordenação animada · pesquisa binária · gráfico Big-O ·
tabela de tempos reais.

O editor de Portugol é um interpretador escrito de raiz que corre no browser. Suporta
variáveis tipadas, vetores de uma e duas dimensões, `se`/`senao`, `enquanto`, `para`,
`repita`, `escolha`/`caso`, funções, procedimentos e recursão, com deteção de laços
infinitos e mensagens de erro com número de linha.

O laboratório de Python corre **CPython 3.13 a sério**, compilado para WebAssembly
([Pyodide](https://pyodide.org)), dentro de um *web worker* — um ciclo infinito bloqueia
apenas o worker, que o botão **Parar** termina. O `input()` lê da caixa de entrada e o
pandas é descarregado só quando um exemplo precisa dele. É a única parte do tutorial que
exige ligação à internet, e só na primeira execução.

O laboratório de JavaScript corre no motor do próprio browser, também num worker, e não
descarrega nada — funciona sem internet. Por cima do JavaScript há um shim de Node: `console`
com o formato do Node, `process`, `require` de `fs`, `path`, `os`, `events`, `util`, `assert`,
`crypto` e `node:test`, um sistema de ficheiros em memória e `require("./modulo")` de ficheiros
locais. Chega para os exemplos de módulos, ficheiros, CLI, eventos e testes correrem de verdade;
o servidor HTTP fica como código para correr no teu computador.

Os laboratórios de HTML/CSS e de React desenham a página num `<iframe sandbox>` a partir do
que escreves, com a consola da página reencaminhada para a caixa de saída. O de HTML e CSS não
descarrega nada; o de React vai buscar o React 18 e o Babel a um CDN para compilar o JSX no
próprio browser.

Os exercícios de previsão mostram um bloco de código e pedem a saída ao aluno; depois de
responder, um botão executa o código a sério para comparar. As respostas aceites são
verificadas em `npm test` — as de Python contra o `python3` local, as de JavaScript contra o
próprio worker do laboratório — para não corrigir ninguém com uma resposta errada.

## Estrutura do projeto

```
src/
  content/      um ficheiro por módulo — texto, quiz e exercícios como dados
  components/
    widgets/    as ferramentas interativas
    Blocks.tsx  desenha cada tipo de bloco de conteúdo
    Quiz.tsx    motor de quiz com feedback e explicações
  lib/
    portugol.ts interpretador de Portugol (léxico, parser, interpretador)
    python.ts   cliente do worker de Python (+ python.worker.ts, que carrega o Pyodide)
    js.ts       cliente do worker de JavaScript (+ js.worker.ts, com o shim de Node)
    runner.ts   cliente genérico partilhado pelos laboratórios com worker
    numbers.ts  conversões entre bases, complemento de dois, UTF-8, IEEE 754
    sorting.ts  geradores de passos para as animações de ordenação
    progress.ts progresso guardado em localStorage
  pages/        início, módulo, ferramentas, glossário, progresso
tests/          testes em Node (node:test), sem dependências extra
```

O conteúdo está separado da apresentação: para acrescentar um módulo, cria um ficheiro em
`src/content/`, exporta um objeto `Module` e regista-o em `src/content/index.ts`. Os testes
de integridade verificam automaticamente ids únicos, índices de resposta válidos, tabelas
coerentes e widgets existentes.

## Tecnologias

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · React Router 7 · Pyodide (carregado de CDN,
em tempo de execução). Sem dependências de interface externas: todos os componentes e
visualizações são feitos de raiz.

## Notas

O progresso (secções lidas, respostas dos quizzes, exercícios resolvidos) fica guardado
no `localStorage` do browser — nada é enviado para nenhum servidor. A página `Progresso`
permite repor tudo.
