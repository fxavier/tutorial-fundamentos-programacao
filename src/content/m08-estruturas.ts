import type { Module } from '../types';

export const m08: Module = {
  id: 'estruturas',
  number: 8,
  title: 'Estruturas de dados',
  subtitle: 'Vetores, matrizes, listas, pilhas, filas, mapas e árvores — e quando usar cada uma',
  icon: '🗂️',
  minutes: 55,
  goals: [
    'Usar vetores e matrizes com confiança nos índices',
    'Distinguir vetor de lista ligada e conhecer os custos de cada operação',
    'Reconhecer os padrões pilha (LIFO) e fila (FIFO) em problemas reais',
    'Escolher a estrutura certa para um problema concreto',
    'Ter uma noção de conjuntos, mapas, árvores e grafos',
  ],
  sections: [
    {
      id: 'porque',
      title: 'Porque é que a estrutura importa',
      blocks: [
        { type: 'p', text: 'Uma variável guarda um valor. Mas raramente trabalhamos com um valor: trabalhamos com as notas de uma turma, os produtos de uma encomenda, as mensagens de uma conversa. **Estruturas de dados** são as formas de organizar coleções de valores em memória.' },
        { type: 'p', text: 'A escolha não é estética. A mesma tarefa — "verificar se este utilizador já está registado" — pode custar 1 operação ou 1 000 000, dependendo apenas da estrutura escolhida.' },
        { type: 'callout', tone: 'key', text: 'Frase de Linus Torvalds que vale a pena guardar: *"Más programadores preocupam-se com o código. Bons programadores preocupam-se com as estruturas de dados e as relações entre elas."* Escolher bem a estrutura resolve metade dos problemas de desempenho antes de existirem.' },
      ],
    },
    {
      id: 'vetores',
      title: 'Vetores (arrays)',
      blocks: [
        { type: 'p', text: 'Um **vetor** é uma sequência de elementos do mesmo tipo, guardados em posições **contíguas** de memória e acedidos por um índice numérico.' },
        { type: 'code', lang: 'portugol', code: `var
   notas : vetor[1..5] de real
inicio
   notas[1] <- 14.5
   notas[2] <- 9.0
   notas[3] <- 17.5

   escreval("Primeira nota: ", notas[1])` },
        { type: 'p', text: 'A contiguidade é o que torna o acesso instantâneo: o endereço do elemento *i* calcula-se com uma multiplicação — `base + i × tamanho_do_elemento`. Não é preciso procurar.' },
        { type: 'callout', tone: 'trap', title: 'Índices: 0 ou 1?', text: 'Portugol e Lua começam em 1. C, Java, Python, JavaScript, Go e praticamente todas as linguagens usadas em produção começam em **0**. Num vetor de n elementos com base 0, os índices válidos vão de 0 a **n − 1**; aceder a n é o erro mais comum da profissão.' },
        {
          type: 'table',
          head: ['Operação num vetor', 'Custo', 'Porquê'],
          rows: [
            ['Aceder por índice', 'O(1)', 'Cálculo direto do endereço'],
            ['Procurar um valor (não ordenado)', 'O(n)', 'Pode ser preciso ver todos'],
            ['Procurar um valor (ordenado, pesquisa binária)', 'O(log n)', 'Cada comparação elimina metade'],
            ['Inserir ou remover no fim', 'O(1) amortizado', 'Não obriga a mexer nos outros'],
            ['Inserir ou remover no início/meio', 'O(n)', 'Obriga a deslocar todos os seguintes'],
          ],
        },
        { type: 'h', text: 'Matrizes: vetores de vetores' },
        { type: 'code', lang: 'portugol', code: `var
   tabuleiro : vetor[1..3, 1..3] de caractere
   i, j : inteiro
inicio
   tabuleiro[2, 2] <- "X"

   para i de 1 ate 3 faca            // linhas
      para j de 1 ate 3 faca         // colunas
         escreva(tabuleiro[i, j], " ")
      fimpara
      escreval("")
   fimpara` },
        { type: 'widget', id: 'portugol', props: { code: 'algoritmo "matriz"\nvar\n   m : vetor[1..3, 1..3] de inteiro\n   i, j, soma : inteiro\ninicio\n   // preenche com a tabuada\n   para i de 1 ate 3 faca\n      para j de 1 ate 3 faca\n         m[i, j] <- i * j\n      fimpara\n   fimpara\n\n   // imprime\n   para i de 1 ate 3 faca\n      para j de 1 ate 3 faca\n         escreva(m[i, j], "\\t")\n      fimpara\n      escreval("")\n   fimpara\n\n   // soma da diagonal principal\n   soma <- 0\n   para i de 1 ate 3 faca\n      soma <- soma + m[i, i]\n   fimpara\n   escreval("Soma da diagonal: ", soma)\nfimalgoritmo' } },
      ],
    },
    {
      id: 'listas',
      title: 'Listas ligadas',
      blocks: [
        { type: 'p', text: 'Numa **lista ligada**, os elementos não estão contíguos: cada nó guarda o seu valor e o **endereço do nó seguinte**. Isto inverte completamente o perfil de custos em relação ao vetor.' },
        { type: 'code', lang: 'text', caption: 'a estrutura na memória', code: `Vetor (contíguo):
  [ 10 ][ 20 ][ 30 ][ 40 ]
   0x100 0x104 0x108 0x10C     ← endereços seguidos

Lista ligada (dispersa):
  [10|•]───→[20|•]───→[30|•]───→[40|∅]
   0x200     0x8A0     0x140     0x9C0` },
        {
          type: 'table',
          head: ['Operação', 'Vetor', 'Lista ligada'],
          rows: [
            ['Aceder ao elemento i', '**O(1)**', 'O(n) — é preciso seguir os ponteiros'],
            ['Inserir no início', 'O(n)', '**O(1)**'],
            ['Inserir no fim', 'O(1) amortizado', 'O(1) com ponteiro para a cauda'],
            ['Remover do meio (com referência ao nó)', 'O(n)', '**O(1)**'],
            ['Memória por elemento', 'Só o valor', 'Valor + ponteiro(s)'],
            ['Desempenho de cache', '**Excelente**', 'Mau — os nós estão espalhados'],
          ],
        },
        { type: 'callout', tone: 'info', title: 'Na prática', text: 'A vantagem teórica da lista ligada é frequentemente anulada pela cache: percorrer um vetor de um milhão de inteiros costuma ser várias vezes mais rápido do que percorrer uma lista ligada com os mesmos valores. Por omissão, usa vetores dinâmicos (`ArrayList` em Java, `list` em Python, *slice* em Go); escolhe listas ligadas quando as inserções e remoções no meio dominam mesmo o perfil de uso.' },
      ],
    },
    {
      id: 'pilhas-filas',
      title: 'Pilhas e filas',
      blocks: [
        {
          type: 'compare',
          left: { title: 'Pilha (stack) — LIFO', items: ['Último a entrar, primeiro a sair', 'Operações: `empilhar` (push) e `desempilhar` (pop)', 'Como uma pilha de pratos', 'Usos: chamadas de função, desfazer (Ctrl+Z), histórico do browser, avaliação de expressões, verificação de parênteses'] },
          right: { title: 'Fila (queue) — FIFO', items: ['Primeiro a entrar, primeiro a sair', 'Operações: `enfileirar` (enqueue) e `desenfileirar` (dequeue)', 'Como a bicha do supermercado', 'Usos: fila de impressão, escalonamento de tarefas, pedidos a um servidor, mensagens entre serviços, pesquisa em largura em grafos'] },
        },
        { type: 'code', lang: 'portugol', caption: 'pilha implementada sobre um vetor', code: `var
   pilha : vetor[1..100] de inteiro
   topo : inteiro
inicio
   topo <- 0                       // pilha vazia

   // empilhar
   topo <- topo + 1
   pilha[topo] <- 42

   // desempilhar
   se topo > 0 entao
      valor <- pilha[topo]
      topo <- topo - 1
   senao
      escreval("Pilha vazia")
   fimse` },
        { type: 'callout', tone: 'tip', title: 'Reconhecer o padrão', text: 'Sempre que o problema envolve "voltar atrás", "desfazer" ou "verificar aninhamento" (parênteses, tags HTML, chamadas), a resposta é uma **pilha**. Sempre que envolve "por ordem de chegada" ou "processar por turnos", a resposta é uma **fila**. Reconhecer o padrão poupa horas.' },
        { type: 'h', text: 'Variantes úteis' },
        {
          type: 'list', items: [
            '**Deque** (fila de duas pontas): permite inserir e remover em ambas as extremidades.',
            '**Fila de prioridade**: sai sempre o elemento mais importante, não o mais antigo. Base do algoritmo de Dijkstra e dos escalonadores.',
            '**Buffer circular**: fila de tamanho fixo que reaproveita o espaço; usa-se em streaming e em registos de eventos.',
          ],
        },
      ],
    },
    {
      id: 'mapas-conjuntos',
      title: 'Mapas e conjuntos',
      blocks: [
        { type: 'p', text: 'Um **mapa** (dicionário, tabela de dispersão, *hash map*) associa **chaves** a **valores**. Em vez de procurar por posição, procuras por nome.' },
        { type: 'code', lang: 'python', caption: 'em Python, mas o conceito é universal', code: `precos = {
    "cafe": 0.80,
    "pao": 0.15,
    "leite": 1.20,
}

precos["cafe"]           # 0.80 — praticamente instantâneo, O(1)
precos["cha"] = 1.00     # inserir
"leite" in precos        # True — teste de existência em O(1)` },
        { type: 'p', text: 'A magia está na **função de dispersão** (*hash*): transforma a chave num número que indica diretamente onde procurar. Por isso o custo médio é O(1), independentemente de o mapa ter dez ou dez milhões de entradas.' },
        { type: 'p', text: 'Um **conjunto** (*set*) é um mapa só com chaves: guarda elementos únicos e responde depressa a "isto já cá está?". É a estrutura certa para eliminar duplicados e para testar pertença.' },
        {
          type: 'table',
          head: ['Preciso de…', 'Estrutura', 'Custo típico'],
          rows: [
            ['Aceder por posição numérica', 'Vetor', 'O(1)'],
            ['Procurar por identificador (email, código)', 'Mapa', 'O(1) médio'],
            ['Saber se um elemento já existe', 'Conjunto', 'O(1) médio'],
            ['Manter ordem de chegada', 'Fila', 'O(1)'],
            ['Voltar ao estado anterior', 'Pilha', 'O(1)'],
            ['Manter sempre ordenado', 'Árvore de pesquisa equilibrada', 'O(log n)'],
            ['Sair sempre o mais urgente', 'Fila de prioridade (heap)', 'O(log n)'],
          ],
        },
        { type: 'callout', tone: 'trap', title: 'O erro mais caro de quem começa', text: 'Usar um vetor e um ciclo para verificar se um elemento existe, dentro de outro ciclo. São dois ciclos aninhados: O(n²). Com 100 000 elementos são dez mil milhões de comparações. Trocar o vetor interior por um conjunto reduz para O(n) — de horas para milissegundos, sem mudar mais nada.' },
      ],
    },
    {
      id: 'arvores-grafos',
      title: 'Árvores e grafos',
      blocks: [
        { type: 'p', text: 'Nem tudo é linear. Muitas relações do mundo real são hierárquicas ou em rede.' },
        { type: 'p', text: 'Uma **árvore** tem uma raiz e nós filhos, sem ciclos. Encontra-la em todo o lado: o sistema de ficheiros, o DOM de uma página web, um documento JSON, o índice de uma base de dados, a estrutura de uma organização.' },
        { type: 'code', lang: 'text', caption: 'árvore binária de pesquisa', code: `            50
          /    \\
        30      70
       /  \\    /  \\
     20   40  60   80

Regra: à esquerda ficam os menores, à direita os maiores.
Procurar o 60: 60 > 50 → direita; 60 < 70 → esquerda; encontrado.
Três comparações em vez de sete. É pesquisa binária, mas em ponteiros.` },
        { type: 'p', text: 'Um **grafo** são nós ligados por arestas, com ciclos permitidos: uma rede social, um mapa de estradas, dependências entre tarefas, a topologia da Internet. Os algoritmos clássicos sobre grafos — pesquisa em largura, pesquisa em profundidade, Dijkstra — são o passo seguinte natural depois deste tutorial.' },
        {
          type: 'terms', items: [
            { term: 'Árvore binária de pesquisa', def: 'Mantém a ordem e permite procurar em O(log n) — desde que esteja equilibrada.' },
            { term: 'Árvore equilibrada (AVL, rubro-negra)', def: 'Reorganiza-se automaticamente para garantir que a altura se mantém logarítmica.' },
            { term: 'Heap', def: 'Árvore em que o pai é sempre menor (ou maior) do que os filhos. Implementa filas de prioridade.' },
            { term: 'B-tree', def: 'Árvore com muitos filhos por nó, otimizada para disco. É a estrutura dos índices de praticamente todas as bases de dados relacionais.' },
            { term: 'Trie', def: 'Árvore de prefixos, usada em autocompletar e dicionários.' },
          ],
        },
      ],
    },
  ],
  quiz: [
    { id: 'd1', prompt: 'Num vetor com base 0 e 10 elementos, qual é o último índice válido?', options: ['10', '9', '11', 'depende da linguagem'], answer: 1, explain: 'Os índices vão de 0 a n − 1, ou seja, de 0 a 9. Aceder ao índice 10 é o erro clássico de fora dos limites.' },
    { id: 'd2', prompt: 'Qual é a vantagem principal do vetor sobre a lista ligada?', options: ['Ocupa menos memória por elemento e permite acesso direto por índice em O(1)', 'Permite inserir no meio mais depressa', 'Não tem limite de tamanho', 'É mais fácil de ordenar'], answer: 0, explain: 'A contiguidade permite calcular o endereço diretamente e aproveita muito melhor a cache do processador.' },
    { id: 'd3', prompt: 'A estrutura adequada para implementar a função "desfazer" (Ctrl+Z) é…', options: ['uma fila', 'uma pilha', 'um mapa', 'uma árvore'], answer: 1, explain: 'A última ação feita é a primeira a desfazer — é exatamente o comportamento LIFO de uma pilha.' },
    { id: 'd4', prompt: 'Qual é a estrutura mais eficiente para verificar repetidamente se um email já está registado entre um milhão?', options: ['Vetor com pesquisa linear', 'Conjunto ou mapa (hash)', 'Lista ligada', 'Pilha'], answer: 1, explain: 'O teste de pertença num conjunto é O(1) em média; no vetor seria O(n) por cada verificação.' },
    { id: 'd5', prompt: 'FIFO é o comportamento de…', options: ['uma pilha', 'uma fila', 'uma árvore', 'um conjunto'], answer: 1, explain: 'First In, First Out: o primeiro a chegar é o primeiro a ser servido.' },
    { id: 'd6', prompt: 'Numa árvore binária de pesquisa equilibrada com 1 000 000 de nós, quantas comparações são precisas, no pior caso, para encontrar um valor?', options: ['1 000 000', '1 000', 'cerca de 20', 'cerca de 100'], answer: 2, explain: 'log₂(1 000 000) ≈ 20. Cada comparação elimina metade da árvore restante.' },
    { id: 'd7', prompt: 'Porque é que percorrer um vetor costuma ser mais rápido do que percorrer uma lista ligada com os mesmos elementos?', options: ['Porque tem menos elementos', 'Porque os elementos contíguos aproveitam a cache do processador', 'Porque a lista ligada é sempre desordenada', 'Porque o vetor usa a GPU'], answer: 1, explain: 'Cada linha de cache trazida contém vários elementos seguidos; na lista ligada, cada nó pode estar numa zona diferente da memória.' },
  ],
  exercises: [
    { id: 'e8-1', difficulty: 1, kind: 'code', title: 'Inverter um vetor', statement: 'Escreve um algoritmo que inverta a ordem dos elementos de um vetor de 8 inteiros, sem usar um segundo vetor.', hint: 'Troca o primeiro com o último, o segundo com o penúltimo… e para a meio.', solution: `algoritmo "inverter"
var
   v : vetor[1..8] de inteiro
   i, tmp, n : inteiro
inicio
   n <- 8
   para i de 1 ate n faca
      v[i] <- i * 10
   fimpara

   para i de 1 ate n div 2 faca        // só até meio!
      tmp <- v[i]
      v[i] <- v[n - i + 1]
      v[n - i + 1] <- tmp
   fimpara

   para i de 1 ate n faca
      escreva(v[i], " ")
   fimpara
   escreval("")
fimalgoritmo

// Se o ciclo fosse até n, cada troca seria desfeita
// na segunda metade e o vetor voltaria ao original.` },
    { id: 'e8-2', difficulty: 2, kind: 'code', title: 'Contar ocorrências', statement: 'Dado um vetor de 10 números entre 1 e 5, conta quantas vezes cada valor aparece, usando um vetor de contagens.', hint: 'Um vetor `contagem[1..5]` em que o índice é o próprio valor.', solution: `algoritmo "contagem"
var
   v : vetor[1..10] de inteiro
   contagem : vetor[1..5] de inteiro
   i : inteiro
inicio
   v[1] <- 3  v[2] <- 1  v[3] <- 4  v[4] <- 4  v[5] <- 2
   v[6] <- 3  v[7] <- 3  v[8] <- 5  v[9] <- 1  v[10] <- 4

   para i de 1 ate 5 faca
      contagem[i] <- 0
   fimpara

   para i de 1 ate 10 faca
      contagem[v[i]] <- contagem[v[i]] + 1    // o valor é o índice
   fimpara

   para i de 1 ate 5 faca
      escreval("Valor ", i, ": ", contagem[i], " vezes")
   fimpara
fimalgoritmo

// Esta técnica chama-se counting sort quando usada para ordenar.
// Custa O(n), mas só serve para gamas de valores pequenas e conhecidas.` },
    { id: 'e8-3', difficulty: 2, kind: 'open', title: 'Escolher a estrutura', statement: 'Para cada caso, escolhe a estrutura e justifica: (a) histórico de navegação com botão "recuar"; (b) lista de espera de um centro de saúde; (c) cache de traduções palavra → tradução; (d) tabuleiro de xadrez; (e) pedidos de impressão por ordem de chegada, mas com trabalhos urgentes à frente.', solution: '(a) **Pilha** — o recuar volta sempre à página mais recente (LIFO). (b) **Fila** — por ordem de chegada (FIFO). (c) **Mapa/dicionário** — acesso por chave em O(1); um vetor obrigaria a percorrer tudo. (d) **Matriz 8×8** — a posição tem duas coordenadas naturais e o tamanho é fixo. (e) **Fila de prioridade** — combina ordem de chegada com um critério de urgência; sai sempre o mais prioritário, e entre iguais o mais antigo.' },
    { id: 'e8-4', difficulty: 3, kind: 'code', title: 'Verificar parênteses equilibrados', statement: 'Usando uma pilha, escreve um algoritmo que verifique se uma expressão tem os parênteses corretamente equilibrados. Exemplo: `((2+3)*(4-1))` é válida; `((2+3)` não é.', hint: 'Empilha cada "(" e desempilha em cada ")". No fim a pilha tem de estar vazia.', solution: `algoritmo "parenteses"
var
   expressao : caractere
   i, topo, n : inteiro
   c : caractere
   valido : logico
inicio
   expressao <- "((2+3)*(4-1))"
   n <- tamanho(expressao)
   topo <- 0
   valido <- verdadeiro
   i <- 1

   enquanto (i <= n) e valido faca
      c <- copia(expressao, i, 1)
      se c = "(" entao
         topo <- topo + 1              // empilha
      senao
         se c = ")" entao
            se topo = 0 entao
               valido <- falso         // fecha sem abrir
            senao
               topo <- topo - 1        // desempilha
            fimse
         fimse
      fimse
      i <- i + 1
   fimenquanto

   se valido e (topo = 0) entao
      escreval("Equilibrada")
   senao
      escreval("Não equilibrada")
   fimse
fimalgoritmo

// Com apenas um tipo de parêntese basta um contador. Com (), [] e {}
// é preciso mesmo uma pilha, para verificar se o que fecha corresponde
// ao último que abriu.` },
    { id: 'e8-5', difficulty: 3, kind: 'open', title: 'De O(n²) para O(n)', statement: 'Este código procura duplicados numa lista de 200 000 emails usando dois ciclos aninhados e demora vários minutos. Explica o custo atual e como reduzi-lo, indicando a nova complexidade e o compromisso.', hint: 'Que estrutura responde a "já vi este?" em tempo constante?', solution: 'Custo atual: para cada elemento compara-se com todos os seguintes — cerca de n²/2 = 2 × 10¹⁰ comparações, o que explica os minutos. Solução: percorrer a lista uma única vez mantendo um **conjunto** (*hash set*) dos emails já vistos; para cada email, se já estiver no conjunto é duplicado, senão acrescenta-se. Passa a n operações de custo médio O(1), ou seja **O(n)** — 200 000 operações em vez de 20 mil milhões, de minutos para milissegundos. O compromisso é memória: o conjunto ocupa espaço proporcional ao número de elementos distintos, tipicamente algumas dezenas de MB neste caso. É a troca clássica **tempo contra espaço**, e quase sempre vale a pena.' },
  ],
};
