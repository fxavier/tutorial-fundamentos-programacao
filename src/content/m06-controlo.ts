import type { Module } from '../types';

export const m06: Module = {
  id: 'controlo',
  number: 6,
  title: 'Estruturas de controlo',
  subtitle: 'Sequência, decisão e repetição — com estas três escreve-se qualquer programa',
  icon: '🔀',
  minutes: 55,
  goals: [
    'Escrever condições simples, encadeadas e com múltiplos casos',
    'Escolher entre enquanto, para e repita',
    'Usar contadores, acumuladores e sentinelas',
    'Aninhar estruturas sem se perder',
    'Reconhecer e evitar os erros clássicos de ciclos',
  ],
  sections: [
    {
      id: 'tres-estruturas',
      title: 'As três estruturas fundamentais',
      blocks: [
        { type: 'p', text: 'O **teorema de Böhm-Jacopini** (1966) provou uma coisa notável: qualquer algoritmo computável pode ser escrito usando apenas três estruturas. Não precisas de mais nada.' },
        {
          type: 'list', ordered: true, items: [
            '**Sequência** — instruções executadas uma após a outra, por ordem.',
            '**Seleção (decisão)** — escolher entre caminhos consoante uma condição.',
            '**Repetição (iteração)** — repetir um bloco enquanto uma condição se mantiver.',
          ],
        },
        { type: 'widget', id: 'flowchart' },
        { type: 'callout', tone: 'key', text: 'Foi este resultado que deu origem à **programação estruturada** e ao abandono do `goto`. Um programa feito só destas três estruturas lê-se de cima para baixo e é possível raciocinar sobre ele. Um programa cheio de saltos, não.' },
      ],
    },
    {
      id: 'decisao',
      title: 'Decisão: se, senão, senão se',
      blocks: [
        { type: 'code', lang: 'portugol', caption: 'as três formas', code: `// simples
se idade >= 18 entao
   escreval("Pode entrar")
fimse

// composta
se nota >= 10 entao
   escreval("Aprovado")
senao
   escreval("Reprovado")
fimse

// encadeada: a ordem importa!
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
fimse` },
        { type: 'callout', tone: 'trap', title: 'Erro clássico nas condições encadeadas', text: 'Se escreveres primeiro `se nota >= 10` e só depois `se nota >= 18`, um 19 entra logo no primeiro ramo e é classificado como "Suficiente". Em condições encadeadas com limiares, começa sempre pelo **caso mais restritivo**.' },
        { type: 'h', text: 'Escolha múltipla' },
        { type: 'p', text: 'Quando comparas a **mesma variável** com vários valores fixos, uma estrutura de escolha é mais legível do que dez `senao se`.' },
        { type: 'code', lang: 'portugol', code: `escolha diaDaSemana
   caso 1, 7
      escreval("Fim de semana")
   caso 2, 3, 4, 5, 6
      escreval("Dia útil")
   outrocaso
      escreval("Dia inválido")
fimescolha` },
        { type: 'callout', tone: 'warn', title: 'Em C, Java e JavaScript: não te esqueças do break', text: 'Nessas linguagens, sem `break` a execução "cai" para o caso seguinte. É uma fonte histórica de bugs — e ocasionalmente uma técnica deliberada. Linguagens mais recentes (Go, Rust, Kotlin, C# moderno) já não têm esse comportamento por omissão.' },
      ],
    },
    {
      id: 'repeticao',
      title: 'Repetição: enquanto, para e repita',
      blocks: [
        {
          type: 'table',
          head: ['Estrutura', 'Quando usar', 'Testa a condição', 'Executa no mínimo'],
          rows: [
            ['`enquanto … faca`', 'Não sabes quantas vezes; depende de uma condição', 'Antes de cada volta', '0 vezes'],
            ['`para … de … ate`', 'Sabes exatamente quantas repetições queres', 'Gerido automaticamente', '0 vezes'],
            ['`repita … ate`', 'Tem de correr pelo menos uma vez (menus, validação de entrada)', 'Depois de cada volta', '1 vez'],
          ],
        },
        { type: 'code', lang: 'portugol', caption: 'a mesma contagem, nas três formas', code: `// enquanto: controlo manual do contador
i <- 1
enquanto i <= 5 faca
   escreval(i)
   i <- i + 1          // se esqueceres esta linha, o ciclo é infinito
fimenquanto

// para: o contador é gerido pela estrutura
para i de 1 ate 5 faca
   escreval(i)
fimpara

// repita: executa e só depois testa
i <- 1
repita
   escreval(i)
   i <- i + 1
ate i > 5` },
        { type: 'callout', tone: 'tip', title: 'Como escolher em três segundos', text: 'Sabes o número de repetições? **para**. Não sabes e pode ser zero? **enquanto**. Não sabes mas tem de correr pelo menos uma vez? **repita**.' },
        { type: 'p', text: 'O `para` também aceita passo diferente de 1, incluindo negativo:' },
        { type: 'code', lang: 'portugol', code: `para i de 10 ate 1 passo -1 faca     // contagem decrescente
   escreva(i, " ")
fimpara

para i de 0 ate 100 passo 5 faca     // de 5 em 5
   escreva(i, " ")
fimpara` },
      ],
    },
    {
      id: 'padroes',
      title: 'Padrões que vais repetir a vida toda',
      blocks: [
        { type: 'p', text: 'Três padrões cobrem a maioria dos ciclos que alguma vez vais escrever.' },
        { type: 'h', text: 'Acumulador' },
        { type: 'code', lang: 'portugol', code: `soma <- 0                    // começa no elemento neutro da operação
para i de 1 ate n faca
   soma <- soma + valores[i]  // acumula
fimpara

// para produto, o neutro é 1:
produto <- 1
para i de 1 ate n faca
   produto <- produto * valores[i]
fimpara` },
        { type: 'h', text: 'Contador condicional' },
        { type: 'code', lang: 'portugol', code: `aprovados <- 0
para i de 1 ate n faca
   se notas[i] >= 10 entao
      aprovados <- aprovados + 1
   fimse
fimpara` },
        { type: 'h', text: 'Maior, menor e sentinela' },
        { type: 'code', lang: 'portugol', code: `// começa com o PRIMEIRO elemento, nunca com zero
maior <- valores[1]
para i de 2 ate n faca
   se valores[i] > maior entao
      maior <- valores[i]
   fimse
fimpara

// sentinela: repete até um valor de paragem
repita
   escreval("Valor (0 para terminar):")
   leia(x)
   se x <> 0 entao
      soma <- soma + x
   fimse
ate x = 0` },
        { type: 'callout', tone: 'trap', title: 'Porque não iniciar `maior` a zero', text: 'Se todos os valores forem negativos (temperaturas, saldos, variações), o resultado seria 0 — um valor que nem sequer está na lista. Inicia sempre com o primeiro elemento real, ou com o menor valor possível do tipo.' },
        { type: 'widget', id: 'portugol', props: { code: 'algoritmo "padroes"\nvar\n   notas : vetor[1..6] de real\n   i, aprovados : inteiro\n   soma, media, maior : real\ninicio\n   notas[1] <- 12\n   notas[2] <- 8\n   notas[3] <- 17\n   notas[4] <- 15\n   notas[5] <- 4\n   notas[6] <- 11\n\n   soma <- 0\n   aprovados <- 0\n   maior <- notas[1]\n\n   para i de 1 ate 6 faca\n      soma <- soma + notas[i]\n      se notas[i] >= 10 entao\n         aprovados <- aprovados + 1\n      fimse\n      se notas[i] > maior entao\n         maior <- notas[i]\n      fimse\n   fimpara\n\n   media <- soma / 6\n   escreval("Média: ", media)\n   escreval("Aprovados: ", aprovados, " em 6")\n   escreval("Melhor nota: ", maior)\nfimalgoritmo' } },
      ],
    },
    {
      id: 'aninhamento',
      title: 'Estruturas aninhadas',
      blocks: [
        { type: 'p', text: 'Um ciclo dentro de outro percorre duas dimensões: linhas e colunas, tabuadas, matrizes, comparações de todos com todos.' },
        { type: 'code', lang: 'portugol', caption: 'todas as tabuadas de 1 a 9', code: `para tabuada de 1 ate 9 faca
   escreval("--- Tabuada do ", tabuada, " ---")
   para i de 1 ate 10 faca
      escreval(tabuada, " x ", i, " = ", tabuada * i)
   fimpara
fimpara

// o ciclo interior corre 10 vezes por cada volta do exterior
// total: 9 x 10 = 90 linhas` },
        { type: 'callout', tone: 'warn', title: 'O custo multiplica-se', text: 'Dois ciclos aninhados sobre n elementos fazem n² operações. Com n = 1000 são um milhão — instantâneo. Com n = 100 000 são dez mil milhões — horas. É este raciocínio que o módulo de complexidade formaliza.' },
        { type: 'h', text: 'Interromper e saltar' },
        {
          type: 'terms', items: [
            { term: 'interrompa / break', def: 'Sai imediatamente do ciclo. Útil quando já encontraste o que procuravas.' },
            { term: 'continue', def: 'Salta o resto desta volta e passa à seguinte. Existe na maioria das linguagens, embora não em Portugol clássico.' },
            { term: 'variável de controlo (flag)', def: 'Alternativa mais explícita: `encontrado <- verdadeiro` e usar isso na condição do ciclo.' },
          ],
        },
      ],
    },
    {
      id: 'erros',
      title: 'Os erros clássicos',
      blocks: [
        {
          type: 'table',
          head: ['Erro', 'Sintoma', 'Como evitar'],
          rows: [
            ['**Ciclo infinito**', 'O programa nunca termina ou congela', 'Garante que alguma coisa dentro do ciclo aproxima a condição do fim'],
            ['**Erro de um (off-by-one)**', 'Falta o primeiro ou o último elemento', 'Testa sempre com o menor caso possível: 0, 1 e 2 elementos'],
            ['**Índice fora dos limites**', 'O programa falha com erro de acesso', 'Confirma se a linguagem começa em 0 ou em 1 e qual é o último índice válido'],
            ['**Divisão por zero**', 'Erro em execução ou resultado infinito', 'Testa o divisor antes de dividir'],
            ['**Acumulador mal iniciado**', 'Resultados sempre errados por um valor fixo', 'Soma começa em 0, produto em 1, máximo no primeiro elemento'],
            ['**Condição invertida**', 'O ramo errado executa sempre', 'Faz um teste de mesa com dois casos de fronteira'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'Regra dos três testes', text: 'Antes de dares um algoritmo por terminado, corre-o mentalmente com: um caso típico, um caso de fronteira (zero elementos, um elemento, o limiar exato) e um caso inválido (número negativo, texto onde se esperava número). A maioria dos bugs mora nos dois últimos.' },
      ],
    },
  ],
  quiz: [
    { id: 't1', prompt: 'Que estrutura garante pelo menos uma execução do bloco?', options: ['`enquanto`', '`para`', '`repita … ate`', 'Todas garantem'], answer: 2, explain: 'O `repita` testa a condição no fim, portanto o corpo corre sempre pelo menos uma vez.' },
    { id: 't2', prompt: 'Quantas vezes executa `para i de 3 ate 12 passo 3 faca`?', options: ['3', '4', '5', '9'], answer: 1, explain: 'i toma os valores 3, 6, 9 e 12 — quatro iterações.' },
    { id: 't3', prompt: 'Nesta cadeia: `se n >= 10 … senao se n >= 18 …`, o que acontece com n = 19?', options: ['Entra no ramo de 18', 'Entra no ramo de 10, porque é testado primeiro', 'Entra nos dois', 'Dá erro'], answer: 1, explain: 'A primeira condição verdadeira ganha e as restantes nem são testadas. Em cadeias com limiares, começa pelo mais restritivo.' },
    { id: 't4', prompt: 'Para somar os elementos de uma lista, o acumulador deve começar em…', options: ['1', '0', 'no primeiro elemento', 'no maior valor possível'], answer: 1, explain: '0 é o elemento neutro da adição. Para produto seria 1; para máximo, o primeiro elemento.' },
    { id: 't5', prompt: 'Dois ciclos aninhados, cada um de 1 a n, executam o corpo interior quantas vezes?', options: ['2n', 'n²', 'n log n', 'n + 1'], answer: 1, explain: 'Por cada volta do exterior, o interior faz n voltas: n × n = n².' },
    { id: 't6', prompt: 'Qual é a causa mais comum de um ciclo infinito com `enquanto`?', options: ['A condição inicial ser falsa', 'Esquecer de atualizar a variável que a condição testa', 'Usar `e` em vez de `ou`', 'Declarar a variável dentro do ciclo'], answer: 1, explain: 'Se nada dentro do corpo altera a condição, ela nunca se torna falsa.' },
    { id: 't7', prompt: 'Numa linguagem cujos índices começam em 0, o último índice válido de uma lista com n elementos é…', options: ['n', 'n − 1', 'n + 1', '1'], answer: 1, explain: 'Os índices vão de 0 a n − 1. Aceder a n é a causa clássica do erro "índice fora dos limites".' },
  ],
  exercises: [
    { id: 'e6-1', difficulty: 1, kind: 'input', title: 'Contagem de iterações', statement: 'Quantas vezes executa o corpo de `para i de 0 ate 20 passo 4 faca`?', accept: ['6'], hint: 'Escreve os valores que i toma.', solution: 'i = 0, 4, 8, 12, 16, 20 → **6 iterações**.' },
    { id: 'e6-2', difficulty: 1, kind: 'code', title: 'Números pares', statement: 'Escreve um algoritmo que mostre todos os números pares entre 1 e 50. Testa-o no editor de Portugol.', hint: 'Ou testas `i % 2 = 0`, ou usas o passo do `para`.', solution: `algoritmo "pares"
var
   i : inteiro
inicio
   para i de 2 ate 50 passo 2 faca
      escreva(i, " ")
   fimpara
   escreval("")
fimalgoritmo

// alternativa com teste explícito:
// para i de 1 ate 50 faca
//    se i % 2 = 0 entao escreva(i, " ") fimse
// fimpara` },
    { id: 'e6-3', difficulty: 2, kind: 'code', title: 'Validação com repita', statement: 'Escreve um algoritmo que peça uma nota entre 0 e 20 e continue a pedir enquanto o valor for inválido. No editor, coloca vários valores na caixa de Entrada (um por linha), incluindo alguns inválidos.', hint: 'A estrutura `repita … ate` foi feita exatamente para isto.', solution: `algoritmo "validacao"
var
   nota : real
inicio
   repita
      escreval("Introduz uma nota entre 0 e 20:")
      leia(nota)
      se (nota < 0) ou (nota > 20) entao
         escreval("Valor inválido. Tenta outra vez.")
      fimse
   ate (nota >= 0) e (nota <= 20)

   escreval("Nota registada: ", nota)
fimalgoritmo` },
    { id: 'e6-4', difficulty: 2, kind: 'code', title: 'Tabuada com aninhamento', statement: 'Mostra as tabuadas de 1 a 5, cada uma de 1 a 10, com um separador entre elas.', solution: `algoritmo "tabuadas"
var
   t, i : inteiro
inicio
   para t de 1 ate 5 faca
      escreval("=== Tabuada do ", t, " ===")
      para i de 1 ate 10 faca
         escreval(t, " x ", i, " = ", t * i)
      fimpara
   fimpara
fimalgoritmo` },
    { id: 'e6-5', difficulty: 3, kind: 'code', title: 'FizzBuzz', statement: 'O exercício mais famoso das entrevistas de emprego: mostra os números de 1 a 30, mas escreve "Fizz" nos múltiplos de 3, "Buzz" nos múltiplos de 5 e "FizzBuzz" nos múltiplos de ambos.', hint: 'Testa primeiro a condição mais restritiva: múltiplo de 15.', solution: `algoritmo "fizzbuzz"
var
   i : inteiro
inicio
   para i de 1 ate 30 faca
      se (i % 3 = 0) e (i % 5 = 0) entao
         escreval("FizzBuzz")
      senao
         se i % 3 = 0 entao
            escreval("Fizz")
         senao
            se i % 5 = 0 entao
               escreval("Buzz")
            senao
               escreval(i)
            fimse
         fimse
      fimse
   fimpara
fimalgoritmo

// A armadilha: se testares "% 3" primeiro, o 15 nunca chega
// ao caso "FizzBuzz". A ordem das condições é tudo.` },
    { id: 'e6-6', difficulty: 3, kind: 'code', title: 'Números primos', statement: 'Escreve um algoritmo que indique se um número lido é primo. Otimiza-o: não precisas de testar divisores acima da raiz quadrada do número.', hint: 'Se n = a × b, então um dos fatores é menor ou igual a √n.', solution: `algoritmo "primo"
var
   n, i : inteiro
   ehPrimo : logico
inicio
   escreval("Número:")
   leia(n)

   se n < 2 entao
      ehPrimo <- falso
   senao
      ehPrimo <- verdadeiro
      i <- 2
      enquanto (i * i <= n) e ehPrimo faca
         se n % i = 0 entao
            ehPrimo <- falso
         fimse
         i <- i + 1
      fimenquanto
   fimse

   se ehPrimo entao
      escreval(n, " é primo")
   senao
      escreval(n, " não é primo")
   fimse
fimalgoritmo

// Porquê i * i <= n em vez de i <= raiz(n)?
// Evita calcular raízes quadradas e problemas de arredondamento.
// Passa de n divisões para cerca de √n — com n = 1 000 000,
// de um milhão de testes para mil.` },
  ],
};
