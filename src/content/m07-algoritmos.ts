import type { Module } from '../types';

export const m07: Module = {
  id: 'algoritmos',
  number: 7,
  title: 'Algoritmos e pseudocódigo',
  subtitle: 'Da ideia ao código: fluxogramas, Portugol, teste de mesa, funções e recursão',
  icon: '📝',
  minutes: 60,
  goals: [
    'Definir algoritmo e as suas propriedades obrigatórias',
    'Escrever pseudocódigo legível e sem ambiguidade',
    'Validar um algoritmo com teste de mesa antes de programar',
    'Decompor um problema em funções e procedimentos',
    'Compreender parâmetros, retorno, escopo e recursão',
  ],
  sections: [
    {
      id: 'o-que-e',
      title: 'O que é um algoritmo',
      blocks: [
        { type: 'p', text: 'Um **algoritmo** é uma sequência finita de passos não ambíguos que resolve um problema ou executa uma tarefa. Uma receita de cozinha é um algoritmo; as instruções de montagem de um móvel são um algoritmo; o processo de calcular o IVA é um algoritmo.' },
        { type: 'p', text: 'A palavra vem de *al-Khwarizmi*, matemático persa do século IX cujo tratado introduziu na Europa os métodos sistemáticos de cálculo com numeração indo-árabe.' },
        { type: 'h', text: 'As cinco propriedades obrigatórias' },
        {
          type: 'terms', items: [
            { term: 'Finitude', def: 'Tem de terminar após um número finito de passos. Um ciclo infinito não é algoritmo.' },
            { term: 'Precisão', def: 'Cada passo é definido sem ambiguidade. "Aquece um pouco" não serve; "aquece a 180 °C" serve.' },
            { term: 'Entrada', def: 'Zero ou mais valores fornecidos no início.' },
            { term: 'Saída', def: 'Pelo menos um resultado. Um algoritmo que não produz nada é inútil.' },
            { term: 'Efetividade', def: 'Cada passo tem de ser executável com os recursos disponíveis, em tempo finito.' },
          ],
        },
        { type: 'callout', tone: 'key', text: 'Para o mesmo problema há sempre vários algoritmos corretos, com custos muito diferentes. Escolher entre eles é boa parte do trabalho de engenharia — e é o assunto do módulo 9.' },
      ],
    },
    {
      id: 'formas',
      title: 'Três formas de escrever um algoritmo',
      blocks: [
        {
          type: 'table',
          head: ['Forma', 'O que é', 'Bom para', 'Limitação'],
          rows: [
            ['**Descrição narrativa**', 'Texto em língua natural', 'Explicar a ideia a outra pessoa', 'Ambígua; não escala para lógica complexa'],
            ['**Fluxograma**', 'Diagrama com símbolos normalizados', 'Ver o fluxo de decisões de relance', 'Torna-se ilegível a partir de meia página'],
            ['**Pseudocódigo**', 'Linguagem estruturada, próxima do código', 'Desenhar e discutir a solução antes de programar', 'Não executa (exceto em ferramentas como o Portugol)'],
          ],
        },
        { type: 'p', text: 'Na prática profissional usa-se pseudocódigo para desenhar, fluxogramas para comunicar decisões a não programadores, e narrativa nos comentários e na documentação.' },
        { type: 'h', text: 'Símbolos de fluxograma' },
        {
          type: 'list', items: [
            '**Elipse** — início e fim',
            '**Retângulo** — processamento (cálculo, atribuição)',
            '**Paralelogramo** — entrada ou saída de dados',
            '**Losango** — decisão, com duas saídas rotuladas',
            '**Seta** — sentido do fluxo',
          ],
        },
      ],
    },
    {
      id: 'portugol',
      title: 'Portugol: pseudocódigo executável',
      blocks: [
        { type: 'p', text: 'O Portugol é pseudocódigo com uma gramática suficientemente rígida para ser executado. Serve para aprender lógica sem lutar ao mesmo tempo com a sintaxe de uma linguagem real, com ponto e vírgula, importações e chavetas.' },
        { type: 'code', lang: 'portugol', caption: 'a estrutura de um programa em Portugol', code: `algoritmo "nome descritivo"

var                        // secção de declarações
   nome : caractere
   idade : inteiro
   media : real
   ativo : logico
   notas : vetor[1..10] de real

inicio                     // corpo do algoritmo
   escreval("Como te chamas?")
   leia(nome)
   escreval("Olá, ", nome)
fimalgoritmo` },
        {
          type: 'table',
          head: ['Portugol', 'Java / C', 'Python', 'Significado'],
          rows: [
            ['`<-`', '`=`', '`=`', 'atribuição'],
            ['`=`', '`==`', '`==`', 'comparação de igualdade'],
            ['`<>`', '`!=`', '`!=`', 'diferente'],
            ['`e` / `ou` / `nao`', '`&&` / `\\|\\|` / `!`', '`and` / `or` / `not`', 'operadores lógicos'],
            ['`escreval(x)`', '`System.out.println(x)`', '`print(x)`', 'escrever com quebra de linha'],
            ['`leia(x)`', '`scanner.nextInt()`', '`input()`', 'ler do utilizador'],
            ['`se … entao … fimse`', '`if (…) { }`', '`if …:`', 'decisão'],
            ['`para i de 1 ate n`', '`for (int i=1; i<=n; i++)`', '`for i in range(1, n+1)`', 'ciclo contado'],
          ],
        },
        { type: 'widget', id: 'portugol' },
      ],
    },
    {
      id: 'teste-mesa',
      title: 'Teste de mesa: depurar antes de existir código',
      blocks: [
        { type: 'p', text: 'O **teste de mesa** consiste em executar o algoritmo à mão, com papel, mantendo uma tabela com o valor de cada variável a cada passo. É a técnica mais antiga e continua a ser a mais eficaz para perceber porque um algoritmo não faz o que devia.' },
        { type: 'widget', id: 'desk-check' },
        { type: 'callout', tone: 'tip', title: 'Como fazer bem', text: 'Uma coluna por variável, mais uma para a saída. Uma linha por instrução executada, não por linha de código — num ciclo, a mesma linha aparece várias vezes. Escolhe valores de entrada que atinjam os casos de fronteira, não só o caso feliz.' },
      ],
    },
    {
      id: 'modularizacao',
      title: 'Funções e procedimentos',
      blocks: [
        { type: 'p', text: 'Programas crescem. A partir de umas dezenas de linhas, um bloco único torna-se impossível de ler e de testar. A solução é a **decomposição**: partir o problema em subproblemas com nome próprio.' },
        {
          type: 'compare',
          left: { title: 'Função', items: ['Devolve um valor', 'Usa-se dentro de uma expressão', 'Idealmente sem efeitos colaterais', 'Ex.: `maximo(a, b)`, `raiz(x)`'] },
          right: { title: 'Procedimento', items: ['Não devolve valor', 'Executa uma ação', 'O efeito é o objetivo', 'Ex.: `imprimirRelatorio()`, `guardarNoFicheiro(d)`'] },
        },
        { type: 'code', lang: 'portugol', code: `funcao area_retangulo(base, altura : real) : real
inicio
   retorne base * altura
fimfuncao

procedimento cabecalho(titulo : caractere)
inicio
   escreval("=====================")
   escreval(titulo)
   escreval("=====================")
fimprocedimento

inicio
   cabecalho("Cálculo de áreas")
   escreval("Área: ", area_retangulo(3, 4))
fimalgoritmo` },
        { type: 'h', text: 'Parâmetros, argumentos e escopo' },
        {
          type: 'terms', items: [
            { term: 'Parâmetro', def: 'O nome declarado na assinatura da função: `funcao dobro(x : inteiro)` — x é o parâmetro.' },
            { term: 'Argumento', def: 'O valor concreto passado na chamada: `dobro(7)` — 7 é o argumento.' },
            { term: 'Escopo local', def: 'Variáveis declaradas dentro da função só existem lá dentro; desaparecem quando a função termina.' },
            { term: 'Escopo global', def: 'Visível em todo o programa. Usa com muita moderação: torna difícil saber quem alterou o quê.' },
            { term: 'Passagem por valor', def: 'A função recebe uma cópia; alterá-la não afeta o original.' },
            { term: 'Passagem por referência', def: 'A função recebe o endereço; alterações são visíveis fora. É o que acontece com listas e objetos na maioria das linguagens.' },
          ],
        },
        { type: 'callout', tone: 'key', title: 'Uma função, uma responsabilidade', text: 'Se ao descrever o que a tua função faz precisas da palavra "e", provavelmente devem ser duas funções. `calcularEGuardarEEnviarEmail` é três funções disfarçadas — e impossível de testar isoladamente.' },
      ],
    },
    {
      id: 'recursao',
      title: 'Recursão',
      blocks: [
        { type: 'p', text: 'Uma função **recursiva** é uma função que se chama a si própria com um problema menor, até chegar a um caso tão simples que se resolve diretamente.' },
        {
          type: 'steps', items: [
            { title: 'Caso base', text: 'A condição de paragem, resolvida sem recursão. Sem ela, a pilha esgota-se e o programa falha com *stack overflow*.' },
            { title: 'Caso recursivo', text: 'A chamada a si próprio com uma entrada estritamente mais pequena, que garantidamente se aproxima do caso base.' },
          ],
        },
        { type: 'code', lang: 'portugol', code: `funcao fatorial(n : inteiro) : inteiro
inicio
   se n <= 1 entao
      retorne 1                       // caso base
   fimse
   retorne n * fatorial(n - 1)        // caso recursivo
fimfuncao

// fatorial(4)
//   = 4 * fatorial(3)
//   = 4 * (3 * fatorial(2))
//   = 4 * (3 * (2 * fatorial(1)))
//   = 4 * (3 * (2 * 1)) = 24` },
        { type: 'widget', id: 'stack-heap' },
        {
          type: 'compare',
          left: { title: 'A recursão brilha quando…', items: ['O problema é naturalmente recursivo: árvores, pastas, JSON', 'Dividir para conquistar: merge sort, quick sort, pesquisa binária', 'Percorrer grafos e labirintos', 'A versão iterativa exigiria gerir uma pilha à mão'] },
          right: { title: 'Evita a recursão quando…', items: ['A profundidade pode ser muito grande (risco de stack overflow)', 'Há recálculo massivo, como no Fibonacci ingénuo', 'A versão iterativa é igualmente clara e mais rápida', 'Estás numa linguagem sem otimização de chamada final'] },
        },
        { type: 'callout', tone: 'warn', title: 'O custo escondido do Fibonacci recursivo', text: '`fib(n) = fib(n-1) + fib(n-2)` sem memorização recalcula os mesmos valores milhões de vezes: `fib(40)` faz cerca de 300 milhões de chamadas e demora segundos; a versão iterativa faz 40 somas e é instantânea. Guardar os resultados já calculados (memorização) resolve o problema e é a porta de entrada para a **programação dinâmica**.' },
        { type: 'widget', id: 'portugol', props: { code: 'algoritmo "recursao_vs_iteracao"\nvar\n   i : inteiro\n\nfuncao fib_rec(n : inteiro) : inteiro\ninicio\n   se n < 2 entao\n      retorne n\n   fimse\n   retorne fib_rec(n - 1) + fib_rec(n - 2)\nfimfuncao\n\nfuncao fib_iter(n : inteiro) : inteiro\nvar\n   a, b, tmp, k : inteiro\ninicio\n   a <- 0\n   b <- 1\n   para k de 1 ate n faca\n      tmp <- a + b\n      a <- b\n      b <- tmp\n   fimpara\n   retorne a\nfimfuncao\n\ninicio\n   escreva("Recursivo: ")\n   para i de 0 ate 15 faca\n      escreva(fib_rec(i), " ")\n   fimpara\n   escreval("")\n\n   escreva("Iterativo: ")\n   para i de 0 ate 15 faca\n      escreva(fib_iter(i), " ")\n   fimpara\n   escreval("")\n   escreval("Repara no número de passos no fim: a versão recursiva gasta muito mais.")\nfimalgoritmo' } },
      ],
    },
  ],
  quiz: [
    { id: 'a1', prompt: 'Qual destas NÃO é uma propriedade obrigatória de um algoritmo?', options: ['Finitude', 'Precisão', 'Ser escrito numa linguagem de programação', 'Produzir pelo menos uma saída'], answer: 2, explain: 'Um algoritmo é independente de linguagem — pode ser descrito em português, num fluxograma ou em pseudocódigo.' },
    { id: 'a2', prompt: 'O que acontece a uma função recursiva sem caso base?', options: ['Devolve zero', 'Entra em recursão infinita e esgota a pilha (stack overflow)', 'O compilador corrige automaticamente', 'Executa apenas uma vez'], answer: 1, explain: 'Cada chamada empilha um novo bloco; sem condição de paragem a pilha esgota-se.' },
    { id: 'a3', prompt: 'A diferença entre função e procedimento é que…', options: ['a função é mais rápida', 'a função devolve um valor e o procedimento executa uma ação', 'o procedimento não aceita parâmetros', 'não há diferença nenhuma'], answer: 1, explain: 'A função pode ser usada numa expressão porque devolve valor; o procedimento existe pelo seu efeito.' },
    { id: 'a4', prompt: 'Para que serve o teste de mesa?', options: ['Medir a velocidade do programa', 'Simular a execução à mão, registando os valores das variáveis a cada passo', 'Compilar o pseudocódigo', 'Formatar o código'], answer: 1, explain: 'É depuração no papel: permite apanhar erros de lógica antes de escrever uma linha de código.' },
    { id: 'a5', prompt: 'Uma variável declarada dentro de uma função…', options: ['é visível em todo o programa', 'existe apenas durante a execução dessa função', 'é automaticamente uma constante', 'só pode ser inteira'], answer: 1, explain: 'É uma variável local, com escopo limitado à função e tempo de vida igual à chamada.' },
    { id: 'a6', prompt: 'Em `dobro(7)`, o 7 é…', options: ['um parâmetro', 'um argumento', 'uma variável global', 'um tipo de dados'], answer: 1, explain: 'Parâmetro é o nome na declaração; argumento é o valor concreto passado na chamada.' },
    { id: 'a7', prompt: 'Porque é que o Fibonacci recursivo ingénuo é tão lento?', options: ['Porque usa muitos ficheiros', 'Porque recalcula repetidamente os mesmos subproblemas, com crescimento exponencial', 'Porque a recursão é sempre lenta', 'Porque usa números grandes'], answer: 1, explain: 'A árvore de chamadas tem cerca de 2ⁿ nós e os mesmos valores são recalculados vezes sem conta. Memorizar resolve.' },
  ],
  exercises: [
    { id: 'e7-1', difficulty: 1, kind: 'open', title: 'Algoritmo do dia a dia', statement: 'Escreve, em pseudocódigo, o algoritmo para levantar dinheiro numa caixa multibanco. Inclui pelo menos duas decisões e uma repetição.', hint: 'Pensa nas validações: PIN errado (com número máximo de tentativas), saldo insuficiente, notas disponíveis.', solution: `algoritmo "levantamento"
var
   pin, tentativas, valor, saldo : inteiro
   autenticado : logico
inicio
   tentativas <- 0
   autenticado <- falso

   repita
      escreval("Introduz o PIN:")
      leia(pin)
      se pin = 1234 entao
         autenticado <- verdadeiro
      senao
         tentativas <- tentativas + 1
         escreval("PIN errado. Tentativa ", tentativas, " de 3")
      fimse
   ate autenticado ou (tentativas >= 3)

   se nao autenticado entao
      escreval("Cartão retido.")
   senao
      escreval("Valor a levantar:")
      leia(valor)
      se valor % 10 <> 0 entao
         escreval("Só é possível levantar múltiplos de 10.")
      senao
         se valor > saldo entao
            escreval("Saldo insuficiente.")
         senao
            saldo <- saldo - valor
            escreval("Retire as notas. Novo saldo: ", saldo)
         fimse
      fimse
   fimse
fimalgoritmo` },
    { id: 'e7-2', difficulty: 2, kind: 'code', title: 'Função de conversão', statement: 'Escreve uma função `celsius_para_fahrenheit(c : real) : real` e usa-a num ciclo que mostre a conversão de −10 °C a 40 °C, de 10 em 10.', hint: 'F = C × 9/5 + 32.', solution: `algoritmo "temperaturas"
var
   c : inteiro

funcao celsius_para_fahrenheit(c : real) : real
inicio
   retorne c * 9 / 5 + 32
fimfuncao

inicio
   para c de -10 ate 40 passo 10 faca
      escreval(c, " °C = ", celsius_para_fahrenheit(c), " °F")
   fimpara
fimalgoritmo` },
    { id: 'e7-3', difficulty: 2, kind: 'open', title: 'Teste de mesa', statement: 'Faz o teste de mesa de: `a <- 2`, `b <- 3`, `enquanto a < 20 faca: a <- a * b; b <- b + 1; fimenquanto`. Quantas iterações ocorrem e quais são os valores finais de a e b?', hint: 'Constrói uma tabela com colunas para a, b e a condição.', solution: 'Iteração 1: a = 2 × 3 = 6, b = 4 (6 < 20, continua). Iteração 2: a = 6 × 4 = 24, b = 5 (24 não é < 20, para). São **2 iterações**; no fim a = **24** e b = **5**. Nota que a condição é testada antes de cada volta, por isso a fica com um valor acima de 20 — o ciclo não "corrige" o excesso.' },
    { id: 'e7-4', difficulty: 3, kind: 'code', title: 'Recursão: soma dos dígitos', statement: 'Escreve uma função recursiva que calcule a soma dos dígitos de um número inteiro positivo. Por exemplo, 4728 → 4+7+2+8 = 21.', hint: 'O último dígito é `n % 10`; o resto do número é `n / 10` com divisão inteira.', solution: `algoritmo "soma_digitos"
funcao soma_digitos(n : inteiro) : inteiro
inicio
   se n < 10 entao
      retorne n                              // caso base: um só dígito
   fimse
   retorne (n % 10) + soma_digitos(n div 10) // último dígito + resto
fimfuncao

inicio
   escreval("4728 -> ", soma_digitos(4728))
   escreval("999  -> ", soma_digitos(999))
fimalgoritmo` },
    { id: 'e7-5', difficulty: 3, kind: 'open', title: 'Decomposição', statement: 'Um sistema tem de: ler um ficheiro de vendas, validar cada linha, converter moedas, calcular totais por vendedor e produzir um relatório em PDF. Propõe uma decomposição em funções, indicando o que cada uma recebe e devolve, e justifica as fronteiras que escolheste.', solution: 'Uma decomposição possível: `lerVendas(caminho) → lista de linhas em bruto`; `validarLinha(linha) → resultado com venda válida ou erro`; `converterMoeda(valor, moedaOrigem, taxa) → valor em moeda base`; `agruparPorVendedor(vendas) → mapa vendedor → total`; `gerarRelatorio(mapa) → estrutura do relatório`; `exportarPdf(relatorio, caminho) → ficheiro`. As fronteiras seguem dois critérios: (1) cada função tem uma única responsabilidade e um nome que a descreve sem "e"; (2) as funções de cálculo são puras — recebem dados e devolvem dados, sem tocar em ficheiros — o que as torna testáveis sem infraestrutura. A leitura e a escrita, que dependem do sistema de ficheiros, ficam isoladas nas pontas. Este padrão, de manter o núcleo puro e a E/S nas extremidades, é o que torna um sistema fácil de testar.' },
  ],
};
