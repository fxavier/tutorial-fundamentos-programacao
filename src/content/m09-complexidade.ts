import type { Module } from '../types';

export const m09: Module = {
  id: 'complexidade',
  number: 9,
  title: 'Algoritmos clássicos e complexidade',
  subtitle: 'Notação Big-O, pesquisa e ordenação — como saber se o teu código aguenta crescer',
  icon: '📈',
  minutes: 55,
  goals: [
    'Contar operações e exprimir o custo em notação Big-O',
    'Reconhecer as complexidades mais comuns no código que lês',
    'Comparar pesquisa linear e binária',
    'Conhecer cinco algoritmos de ordenação e os seus compromissos',
    'Decidir quando otimizar e quando não vale a pena',
  ],
  sections: [
    {
      id: 'porque-medir',
      title: 'Medir sem cronómetro',
      blocks: [
        { type: 'p', text: 'Um programa que demora 2 segundos no teu portátil pode demorar 2 horas no servidor com dados reais. Medir com cronómetro depende da máquina, da linguagem, da carga. Precisamos de uma medida independente disso: **quantas operações o algoritmo faz em função do tamanho da entrada**.' },
        { type: 'p', text: 'A notação **Big-O** descreve como o custo cresce quando *n* cresce, ignorando constantes e termos menores. Não diz que um algoritmo O(n) demora n segundos; diz que **duplicar a entrada duplica o tempo**.' },
        { type: 'code', lang: 'text', caption: 'porque se ignoram constantes', code: `3n² + 15n + 500     →     O(n²)

Com n = 10:      300 +  150 + 500 = 950      (as constantes dominam)
Com n = 1 000:   3 000 000 + 15 000 + 500    (o n² domina tudo)
Com n = 100 000: 3 × 10¹⁰ + …                (o resto é ruído)

O que interessa é a forma da curva quando n cresce.` },
        { type: 'widget', id: 'bigo-chart' },
      ],
    },
    {
      id: 'reconhecer',
      title: 'Reconhecer a complexidade no código',
      blocks: [
        {
          type: 'table',
          head: ['Complexidade', 'Nome', 'Como reconhecer', 'Exemplo'],
          rows: [
            ['**O(1)**', 'Constante', 'Sem ciclos que dependam de n', 'Aceder a `v[5]`, ler de um mapa'],
            ['**O(log n)**', 'Logarítmica', 'O problema é dividido ao meio a cada passo', 'Pesquisa binária, árvore equilibrada'],
            ['**O(n)**', 'Linear', 'Um ciclo que percorre a entrada uma vez', 'Somar todos os elementos'],
            ['**O(n log n)**', 'Linearítmica', 'Divide e conquista, com trabalho linear em cada nível', 'Merge sort, quick sort, ordenar'],
            ['**O(n²)**', 'Quadrática', 'Dois ciclos aninhados sobre a mesma entrada', 'Bubble sort, comparar todos com todos'],
            ['**O(2ⁿ)**', 'Exponencial', 'Cada passo duplica as possibilidades', 'Fibonacci ingénuo, força bruta em subconjuntos'],
            ['**O(n!)**', 'Fatorial', 'Todas as permutações', 'Caixeiro-viajante por força bruta'],
          ],
        },
        { type: 'code', lang: 'js', caption: 'contar operações à vista', code: `// O(1) — sempre o mesmo trabalho
function primeiro(v) { return v[0]; }

// O(n) — um ciclo sobre n
function soma(v) {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i];   // n iterações
  return s;
}

// O(n²) — ciclo dentro de ciclo
function temDuplicados(v) {
  for (let i = 0; i < v.length; i++)              // n
    for (let j = i + 1; j < v.length; j++)        // até n
      if (v[i] === v[j]) return true;
  return false;
}

// O(n) — mesma tarefa, com a estrutura certa
function temDuplicadosRapido(v) {
  const vistos = new Set();
  for (const x of v) {                            // n
    if (vistos.has(x)) return true;               // O(1)
    vistos.add(x);
  }
  return false;
}` },
        { type: 'widget', id: 'complexity-race' },
        { type: 'callout', tone: 'info', title: 'Complexidade de espaço', text: 'Além do tempo, conta-se a memória extra que o algoritmo precisa. O merge sort é O(n log n) no tempo mas O(n) no espaço, porque precisa de um vetor auxiliar; o quick sort usa apenas O(log n) da pilha de recursão. Em sistemas com memória limitada, este critério pode decidir a escolha.' },
      ],
    },
    {
      id: 'pesquisa',
      title: 'Pesquisa: linear e binária',
      blocks: [
        { type: 'p', text: 'Procurar um valor numa coleção é a operação mais frequente que existe. Há duas estratégias fundamentais, e a diferença entre elas é enorme.' },
        { type: 'code', lang: 'portugol', caption: 'pesquisa linear — O(n)', code: `funcao procurar(v : vetor[1..100] de inteiro; n, alvo : inteiro) : inteiro
var
   i : inteiro
inicio
   para i de 1 ate n faca
      se v[i] = alvo entao
         retorne i              // encontrado
      fimse
   fimpara
   retorne -1                   // não existe
fimfuncao` },
        { type: 'code', lang: 'portugol', caption: 'pesquisa binária — O(log n), exige vetor ordenado', code: `funcao pesquisa_binaria(v : vetor[1..100] de inteiro; n, alvo : inteiro) : inteiro
var
   inicio_i, fim, meio : inteiro
inicio
   inicio_i <- 1
   fim <- n
   enquanto inicio_i <= fim faca
      meio <- (inicio_i + fim) div 2
      se v[meio] = alvo entao
         retorne meio
      senao
         se v[meio] < alvo entao
            inicio_i <- meio + 1      // descarta a metade esquerda
         senao
            fim <- meio - 1           // descarta a metade direita
         fimse
      fimse
   fimenquanto
   retorne -1
fimfuncao` },
        { type: 'widget', id: 'binary-search' },
        { type: 'callout', tone: 'warn', title: 'O preço da pesquisa binária', text: 'Exige o vetor **ordenado**. Se procurares uma vez, ordenar (O(n log n)) custa mais do que a pesquisa linear (O(n)) — não compensa. Se procurares milhares de vezes na mesma coleção, ordenar uma vez e pesquisar em O(log n) compensa muitíssimo. É este raciocínio, e não a tabela de complexidades, que decide.' },
      ],
    },
    {
      id: 'ordenacao',
      title: 'Ordenação',
      blocks: [
        { type: 'p', text: 'Ordenar é o problema mais estudado da informática. Vale a pena conhecer cinco algoritmos, não para os implementares em produção — usa o da biblioteca — mas porque cada um ensina uma técnica reutilizável.' },
        { type: 'widget', id: 'sorting-visualizer' },
        {
          type: 'table',
          head: ['Algoritmo', 'Melhor', 'Médio', 'Pior', 'Espaço', 'Estável', 'Ideia'],
          rows: [
            ['Bolha', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', 'Sim', 'Troca vizinhos até não haver trocas'],
            ['Seleção', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', 'Não', 'Procura o menor e coloca-o à frente'],
            ['Inserção', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', 'Sim', 'Insere cada elemento no sítio certo, como cartas na mão'],
            ['Intercalação', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Sim', 'Divide ao meio, ordena e intercala'],
            ['Rápida', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', 'Não', 'Escolhe pivô, separa menores e maiores, repete'],
          ],
        },
        {
          type: 'terms', items: [
            { term: 'Estabilidade', def: 'Um algoritmo estável mantém a ordem relativa de elementos com a mesma chave. Se ordenares por nome e depois por departamento, com um algoritmo estável os nomes continuam ordenados dentro de cada departamento.' },
            { term: 'In-place', def: 'Ordena usando apenas memória constante extra, sem copiar o vetor. Importa quando os dados são grandes.' },
            { term: 'Pior caso do quick sort', def: 'Acontece quando o pivô é sempre o menor ou o maior elemento — por exemplo, num vetor já ordenado com pivô fixo. As implementações reais escolhem o pivô ao acaso ou pela mediana de três para evitar isto.' },
            { term: 'Timsort', def: 'O algoritmo usado por Python e Java para objetos: combina inserção e intercalação e aproveita partes já ordenadas. É estável e O(n) em dados quase ordenados.' },
          ],
        },
        { type: 'callout', tone: 'key', title: 'Na prática', text: 'Nunca escrevas o teu próprio algoritmo de ordenação em código de produção. As bibliotecas padrão têm implementações híbridas afinadas ao longo de décadas. Conhece-los serve para **compreender o custo** do que estás a chamar e para reconhecer os padrões — dividir para conquistar, invariantes de ciclo, escolha de pivô — em problemas novos.' },
      ],
    },
    {
      id: 'quando-otimizar',
      title: 'Quando otimizar (e quando não)',
      blocks: [
        { type: 'p', text: 'Donald Knuth escreveu que *"a otimização prematura é a raiz de todo o mal"*. A frase é frequentemente mal citada: ele não defendia código lento, defendia que se otimizasse **com medições**, não com palpites.' },
        {
          type: 'steps', items: [
            { title: 'Primeiro: torna-o correto', text: 'Um programa rápido e errado não vale nada. Correção antes de velocidade, sempre.' },
            { title: 'Segundo: escolhe a estrutura e o algoritmo certos', text: 'É aqui que estão os ganhos de ordens de grandeza. Trocar O(n²) por O(n) vale mais do que qualquer micro-otimização.' },
            { title: 'Terceiro: mede', text: 'Usa um *profiler*. A intuição sobre onde está o tempo gasto está errada na maioria das vezes.' },
            { title: 'Quarto: otimiza o que domina', text: 'Se 90% do tempo está numa função, é essa que interessa. Otimizar as outras não muda nada — é a lei de Amdahl.' },
          ],
        },
        { type: 'callout', tone: 'tip', title: 'A regra dos números pequenos', text: 'Para n < 100, praticamente tudo é instantâneo e a legibilidade ganha sempre. A complexidade só importa quando n cresce, ou quando a operação está dentro de um ciclo que corre milhões de vezes. Saber distinguir os dois casos é o que separa engenharia de superstição.' },
      ],
    },
  ],
  quiz: [
    { id: 'x1', prompt: 'Qual é a complexidade de dois ciclos aninhados, cada um de 1 a n?', options: ['O(n)', 'O(2n)', 'O(n²)', 'O(n log n)'], answer: 2, explain: 'O corpo interior executa n × n vezes.' },
    { id: 'x2', prompt: 'Duplicar a entrada de um algoritmo O(n log n) faz o tempo…', options: ['duplicar exatamente', 'quadruplicar', 'pouco mais do que duplicar', 'manter-se igual'], answer: 2, explain: 'O fator n duplica e o log cresce em 1 unidade, portanto o tempo cresce pouco mais do que o dobro.' },
    { id: 'x3', prompt: 'A pesquisa binária exige que…', options: ['o vetor tenha tamanho par', 'o vetor esteja ordenado', 'os valores sejam únicos', 'o vetor esteja em memória contígua'], answer: 1, explain: 'Sem ordem não é possível descartar metade dos elementos com uma comparação.' },
    { id: 'x4', prompt: 'Qual destes algoritmos tem pior caso O(n²)?', options: ['Merge sort', 'Quick sort', 'Heap sort', 'Pesquisa binária'], answer: 1, explain: 'Com escolhas de pivô infelizes, o quick sort degrada para O(n²). Na prática evita-se com pivô aleatório ou mediana de três.' },
    { id: 'x5', prompt: 'O que significa um algoritmo de ordenação ser "estável"?', options: ['Nunca falha', 'Mantém a ordem relativa dos elementos com chaves iguais', 'Usa memória constante', 'Funciona em qualquer linguagem'], answer: 1, explain: 'É essencial quando se ordena por vários critérios em sequência.' },
    { id: 'x6', prompt: 'Num vetor ordenado de 1 milhão de elementos, a pesquisa binária faz no máximo quantas comparações?', options: ['1 000 000', '1 000', 'cerca de 20', 'cerca de 500 000'], answer: 2, explain: 'log₂(10⁶) ≈ 20. Cada comparação elimina metade do que resta.' },
    { id: 'x7', prompt: 'A melhor primeira ação para acelerar um programa lento é…', options: ['reescrevê-lo noutra linguagem', 'medir com um profiler para descobrir onde está o tempo gasto', 'comprar um servidor maior', 'remover comentários'], answer: 1, explain: 'Otimizar sem medir é adivinhar. O profiler diz onde estão os 90% do tempo.' },
    { id: 'x8', prompt: 'Trocar uma pesquisa linear dentro de um ciclo por um conjunto (hash set) transforma O(n²) em…', options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(1)'], answer: 1, explain: 'Continua a haver um ciclo sobre n, mas cada verificação passa de O(n) para O(1) médio.' },
  ],
  exercises: [
    { id: 'e9-1', difficulty: 1, kind: 'input', title: 'Identifica a complexidade', statement: 'Um algoritmo percorre um vetor de n elementos uma vez e, para cada um, faz uma operação de custo constante. Qual é a complexidade? Escreve na forma O(...) — por exemplo, O(n log n).', accept: ['o(n)', 'on', 'n'], hint: 'Um único ciclo sobre a entrada.', solution: '**O(n)** — linear: o tempo cresce na mesma proporção que o número de elementos. Duplicar a entrada duplica o tempo.' },
    { id: 'e9-2', difficulty: 2, kind: 'open', title: 'Contar comparações', statement: 'Quantas comparações faz o bubble sort, no pior caso, num vetor de 10 elementos? E o selection sort?', hint: 'É a soma 9 + 8 + 7 + … + 1.', solution: 'Ambos fazem o mesmo número de comparações no pior caso: (n−1) + (n−2) + … + 1 = n(n−1)/2 = 10 × 9 / 2 = **45 comparações**. A diferença está nas trocas: o selection sort faz no máximo n−1 = 9 trocas, enquanto o bubble sort pode fazer 45. Se mover elementos for caro (registos grandes), o selection sort ganha, apesar de ambos serem O(n²).' },
    { id: 'e9-3', difficulty: 2, kind: 'open', title: 'Escolher a estratégia', statement: 'Tens 10 milhões de registos e vais fazer 5 milhões de pesquisas por identificador. Compara três estratégias: pesquisa linear; ordenar e usar pesquisa binária; construir um mapa hash. Indica os custos e recomenda uma.', solution: 'Pesquisa linear: 5 × 10⁶ × 10⁷ = 5 × 10¹³ operações — inviável. Ordenar + binária: 10⁷ log 10⁷ ≈ 2,3 × 10⁸ para ordenar, mais 5 × 10⁶ × 24 ≈ 1,2 × 10⁸ para as pesquisas; total cerca de 3,5 × 10⁸ — segundos. Mapa hash: 10⁷ inserções + 5 × 10⁶ consultas, ambas O(1) médio; total 1,5 × 10⁷ — décimas de segundo, mas ocupa memória adicional significativa (tipicamente 2 a 3 vezes o tamanho dos dados). **Recomendação: mapa hash**, se a memória disponível o permitir; caso contrário, ordenar e usar pesquisa binária, que tem consumo de memória mínimo e continua perfeitamente aceitável. Se os dados estiverem em disco, a resposta muda outra vez: um índice B-tree, que é o que uma base de dados faria.' },
    { id: 'e9-4', difficulty: 3, kind: 'code', title: 'Implementa a pesquisa binária', statement: 'Implementa a pesquisa binária em Portugol sobre um vetor ordenado de 12 elementos e conta quantas comparações fez. Testa com um valor que existe e com outro que não existe.', hint: 'Mantém um contador incrementado em cada volta do enquanto.', solution: `algoritmo "binaria"
var
   v : vetor[1..12] de inteiro
   i, alvo, ini, fim, meio, passos, resultado : inteiro
inicio
   para i de 1 ate 12 faca
      v[i] <- i * 5          // 5, 10, 15, ... 60
   fimpara

   alvo <- 45
   ini <- 1
   fim <- 12
   passos <- 0
   resultado <- -1

   enquanto (ini <= fim) e (resultado = -1) faca
      passos <- passos + 1
      meio <- (ini + fim) div 2
      se v[meio] = alvo entao
         resultado <- meio
      senao
         se v[meio] < alvo entao
            ini <- meio + 1
         senao
            fim <- meio - 1
         fimse
      fimse
   fimenquanto

   se resultado > 0 entao
      escreval("Encontrado na posição ", resultado, " em ", passos, " comparações")
   senao
      escreval("Não existe. ", passos, " comparações")
   fimse
fimalgoritmo` },
    { id: 'e9-5', difficulty: 3, kind: 'open', title: 'Diagnóstico de desempenho', statement: 'Um relatório demorava 3 segundos com 1 000 clientes e demora 5 minutos com 10 000. Que complexidade sugere este comportamento? Que hipóteses investigarias primeiro?', hint: 'Compara o crescimento do tempo com o crescimento de n.', solution: 'n cresceu 10×; o tempo cresceu 100× (3 s → 300 s). Isso é a assinatura de **O(n²)**. Hipóteses a investigar, por ordem: (1) dois ciclos aninhados sobre a lista de clientes, tipicamente uma pesquisa linear dentro de um ciclo — substituir por mapa; (2) o problema N+1 de acesso a dados: uma consulta à base de dados por cada cliente dentro do ciclo, que dá n consultas em vez de uma com junção; (3) concatenação de strings dentro do ciclo, que em algumas linguagens copia a string inteira a cada volta. Um profiler distingue as três em minutos. Vale a pena confirmar a hipótese medindo com 2 000 e 4 000 clientes: se o tempo quadruplicar de cada vez, é mesmo quadrático.' },
  ],
};
