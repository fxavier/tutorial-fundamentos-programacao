import type { Module } from '../types';

export const m01: Module = {
  id: 'computador',
  number: 1,
  title: 'Como funciona um computador',
  subtitle: 'Hardware, software e o ciclo que transforma eletricidade em programas',
  icon: '🖥️',
  minutes: 35,
  goals: [
    'Distinguir hardware, software e firmware',
    'Nomear os componentes essenciais e o papel de cada um',
    'Explicar o ciclo busca–descodificação–execução',
    'Perceber o que o sistema operativo faz por ti',
    'Saber a diferença entre código-fonte, compilação e execução',
  ],
  sections: [
    {
      id: 'o-que-e',
      title: 'O que é, afinal, um computador',
      blocks: [
        { type: 'p', text: 'Um computador é uma máquina que faz três coisas: **recebe dados**, **processa-os segundo instruções** e **devolve resultados**. Nada mais. Toda a complexidade que vês — um jogo, um browser, um sistema bancário — é construída em cima deste ciclo simples, repetido milhares de milhões de vezes por segundo.' },
        { type: 'p', text: 'Esse ciclo tem um nome que vais reencontrar em todos os programas que escreveres: **entrada → processamento → saída** (em inglês, *input–processing–output*, ou IPO). Um programa que calcula a média de notas recebe as notas (entrada), soma e divide (processamento) e mostra o resultado (saída). Um sistema de faturação faz exatamente o mesmo, com mais passos.' },
        {
          type: 'terms', items: [
            { term: 'Hardware', def: 'A parte física: processador, memória, disco, teclado, ecrã. Aquilo em que podes bater com o dedo.' },
            { term: 'Software', def: 'As instruções que dizem ao hardware o que fazer. Não tem massa nem peso — é informação.' },
            { term: 'Firmware', def: 'Software gravado dentro de um componente de hardware (a BIOS/UEFI da placa-mãe, o controlador de um SSD). Fica entre os dois.' },
            { term: 'Dados', def: 'Os valores em bruto que o programa manipula: números, texto, imagens, tudo reduzido a bits.' },
          ],
        },
        { type: 'callout', tone: 'key', text: 'Programar é escrever as instruções do software. O hardware não sabe nada sobre o teu problema — só sabe executar operações elementares, muito depressa e sem se enganar.' },
      ],
    },
    {
      id: 'componentes',
      title: 'Os componentes e o que cada um faz',
      blocks: [
        { type: 'p', text: 'Uma analogia útil: pensa numa cozinha profissional. O **cozinheiro** é o processador, a **bancada** é a memória RAM, a **despensa** é o disco, e a **receita** é o programa.' },
        {
          type: 'table',
          head: ['Componente', 'Função', 'Analogia da cozinha', 'Ordem de grandeza'],
          rows: [
            ['**CPU** (processador)', 'Executa as instruções: aritmética, comparações, movimento de dados', 'O cozinheiro que trabalha', '3–5 GHz, 4 a 16 núcleos'],
            ['**RAM** (memória principal)', 'Guarda os dados e o código **em uso**. Volátil: apaga-se ao desligar', 'A bancada onde estão os ingredientes do prato atual', '8–64 GB'],
            ['**Disco** (SSD/HDD)', 'Guarda ficheiros de forma permanente. Muito mais lento que a RAM', 'A despensa, onde tudo fica arrumado', '256 GB – 4 TB'],
            ['**GPU**', 'Milhares de núcleos simples para cálculos paralelos: gráficos, IA', 'Uma brigada que descasca 1000 batatas ao mesmo tempo', '—'],
            ['**Placa-mãe e barramentos**', 'Ligam tudo e transportam os dados entre componentes', 'Os corredores da cozinha', '—'],
            ['**Periféricos**', 'Entrada (teclado, rato, sensores) e saída (ecrã, impressora, som)', 'A porta por onde entram encomendas e saem pratos', '—'],
          ],
        },
        { type: 'h', text: 'Dentro do processador' },
        {
          type: 'list', items: [
            '**ULA** (Unidade Lógica e Aritmética): faz somas, subtrações e comparações. É onde `2 + 3` acontece de verdade.',
            '**Unidade de Controlo**: lê cada instrução e coordena os restantes blocos.',
            '**Registos**: memórias minúsculas (dezenas de bytes) dentro da CPU, as mais rápidas que existem.',
            '**Cache L1/L2/L3**: memória intermédia entre os registos e a RAM, para não esperar tanto pelos dados.',
          ],
        },
        { type: 'callout', tone: 'info', title: 'Porque é que isto interessa a quem programa', text: 'Aceder à RAM é cerca de 100 vezes mais lento do que aceder a um registo; aceder ao disco é cerca de 100 000 vezes mais lento do que a RAM. Muita da otimização de software resume-se a uma frase: **evita ir buscar dados longe**.' },
      ],
    },
    {
      id: 'ciclo',
      title: 'O ciclo de instrução',
      blocks: [
        { type: 'p', text: 'O processador não faz nada de mágico: repete um ciclo curtíssimo, muitos milhões de vezes por segundo.' },
        {
          type: 'steps', items: [
            { title: 'Busca (fetch)', text: 'O **contador de programa (PC)** guarda o endereço da próxima instrução. A CPU vai buscá-la à memória.' },
            { title: 'Descodificação (decode)', text: 'A instrução, que é apenas um número binário, é traduzida em sinais de controlo: que operação e sobre que operandos.' },
            { title: 'Execução (execute)', text: 'A ULA faz a operação; o resultado fica num registo ou volta à memória.' },
            { title: 'Atualização do PC', text: 'O contador avança para a instrução seguinte — ou salta, se a instrução for um desvio (é assim que existem `se` e ciclos).' },
          ],
        },
        { type: 'widget', id: 'cpu-cycle' },
        { type: 'callout', tone: 'tip', text: 'Um processador a 3 GHz executa 3 mil milhões de ciclos por segundo. Isto explica porque um `para` que corre um milhão de vezes é instantâneo, mas um algoritmo mau com mil milhões de milhões de operações não acaba nunca. Vais ver isto em detalhe no módulo de complexidade.' },
      ],
    },
    {
      id: 'sistema-operativo',
      title: 'O sistema operativo',
      blocks: [
        { type: 'p', text: 'Entre o teu programa e o hardware existe um intermediário: o **sistema operativo** (Windows, Linux, macOS, Android). Sem ele, cada programa teria de saber falar com cada modelo de disco e de placa de rede que existe.' },
        {
          type: 'list', items: [
            '**Gestão de processos**: decide qual programa usa a CPU em cada instante (escalonamento). É por isso que parece que tudo corre ao mesmo tempo.',
            '**Gestão de memória**: dá a cada processo o seu espaço e impede que um programa leia a memória de outro.',
            '**Sistema de ficheiros**: transforma blocos do disco em pastas e ficheiros com nomes.',
            '**Controladores (drivers)**: falam com o hardware concreto.',
            '**Segurança e permissões**: quem pode ler o quê.',
          ],
        },
        { type: 'p', text: 'Quando o teu programa quer escrever num ficheiro, não fala com o disco: faz uma **chamada de sistema** (*system call*) e pede ao sistema operativo que o faça. Esta separação é o que torna o software portátil.' },
      ],
    },
    {
      id: 'do-codigo-ao-cpu',
      title: 'Do teu código até à CPU',
      blocks: [
        { type: 'p', text: 'Tu escreves texto. A CPU só entende números binários (**código-máquina**). Alguma coisa tem de traduzir — e há três estratégias principais.' },
        {
          type: 'table',
          head: ['Estratégia', 'Como funciona', 'Linguagens típicas', 'Compromissos'],
          rows: [
            ['**Compilada**', 'Um compilador traduz tudo para código-máquina antes de executar; gera um executável', 'C, C++, Go, Rust', 'Muito rápida a executar; erros apanhados cedo; é preciso recompilar por plataforma'],
            ['**Interpretada**', 'Um interpretador lê e executa linha a linha, em cada execução', 'Python, JavaScript, PHP, Ruby', 'Arranca depressa e é flexível; mais lenta; muitos erros só aparecem em execução'],
            ['**Híbrida (bytecode + VM)**', 'Compila para um código intermédio que uma máquina virtual executa, otimizando em tempo real (JIT)', 'Java, C#, Kotlin', 'Bom equilíbrio; portável ("compila uma vez, corre em qualquer lado"); arranque mais lento'],
          ],
        },
        { type: 'code', lang: 'text', caption: 'o caminho de um programa', code: `código-fonte  →  (compilador / interpretador)  →  instruções  →  CPU
  soma.c              gcc soma.c                 código-máquina    executa
  soma.py             python soma.py             bytecode+VM       executa
  Soma.java           javac + JVM                bytecode+JIT      executa` },
        { type: 'callout', tone: 'info', text: 'Nenhuma destas famílias é "melhor". Escolhe-se pelo problema: um sistema operativo escreve-se em C ou Rust; um script de análise de dados escreve-se em Python; um serviço empresarial de longa duração costuma escrever-se em Java, C# ou Go.' },
      ],
    },
  ],
  quiz: [
    { id: 'c1', prompt: 'Qual é a diferença essencial entre RAM e disco?', options: ['A RAM é maior', 'A RAM é volátil e muito mais rápida; o disco é permanente e mais lento', 'O disco é usado apenas por programas antigos', 'Não há diferença — são o mesmo tipo de memória'], answer: 1, explain: 'A RAM perde o conteúdo quando falta energia, mas é ordens de grandeza mais rápida. O disco mantém os dados, ao custo de acessos muito mais lentos.' },
    { id: 'c2', prompt: 'O que guarda o contador de programa (PC)?', options: ['O resultado da última operação', 'O endereço da próxima instrução a executar', 'Quantos programas estão abertos', 'A temperatura do processador'], answer: 1, explain: 'O PC aponta para a próxima instrução. Alterá-lo é exatamente o que acontece num `se` ou num ciclo: um salto para outro endereço.' },
    { id: 'c3', prompt: 'Qual das ordens está correta, da mais rápida para a mais lenta?', options: ['Disco → RAM → cache → registos', 'RAM → registos → cache → disco', 'Registos → cache → RAM → disco', 'Cache → registos → disco → RAM'], answer: 2, explain: 'Quanto mais perto do núcleo da CPU, mais rápido e mais caro por byte — e por isso menor.' },
    { id: 'c4', prompt: 'Uma linguagem interpretada distingue-se de uma compilada porque…', options: ['não pode ter erros', 'traduz e executa o código a cada execução, em vez de gerar antecipadamente um executável', 'não usa memória RAM', 'só funciona em Linux'], answer: 1, explain: 'O interpretador faz a tradução em tempo de execução. Daí a flexibilidade e a penalização de desempenho.' },
    { id: 'c5', prompt: 'Porque é que um programa não escreve diretamente no disco?', options: ['Porque o disco está sempre cheio', 'Porque pede ao sistema operativo através de uma chamada de sistema, o que garante portabilidade e segurança', 'Porque o disco só aceita dados da GPU', 'Porque o hardware não permite escritas'], answer: 1, explain: 'O sistema operativo é o intermediário: isola os processos, aplica permissões e esconde as diferenças entre hardwares.' },
    { id: 'c6', prompt: 'O modelo entrada → processamento → saída aplica-se a…', options: ['apenas a programas de cálculo', 'praticamente qualquer programa, de uma calculadora a um sistema bancário', 'apenas a sistemas operativos', 'apenas a linguagens compiladas'], answer: 1, explain: 'É o esqueleto de qualquer software. Identificar as três partes é o primeiro passo para desenhar uma solução.' },
  ],
  exercises: [
    { id: 'e1-1', difficulty: 1, kind: 'open', title: 'Identifica o IPO', statement: 'Para cada situação, escreve qual é a entrada, o processamento e a saída: (a) uma máquina multibanco a levantar dinheiro; (b) um site de comércio eletrónico a calcular o custo de portes; (c) um leitor de código de barras num supermercado.', solution: '(a) Entrada: cartão, PIN, valor pedido. Processamento: validar PIN, verificar saldo, debitar conta, registar movimento. Saída: notas, talão, novo saldo. (b) Entrada: morada, peso e dimensões da encomenda. Processamento: escolher a tabela da transportadora e aplicar escalões. Saída: valor dos portes. (c) Entrada: sequência de barras lida pelo sensor. Processamento: descodificar para um número, procurar o artigo na base de dados. Saída: nome e preço no ecrã, linha no talão.' },
    { id: 'e1-2', difficulty: 1, kind: 'input', title: 'Ciclo de instrução', statement: 'Quantas fases essenciais tem o ciclo de instrução clássico (busca, descodificação, execução)? Responde com um número.', accept: ['3', 'tres', 'três'], hint: 'Conta apenas as fases essenciais, sem a atualização do contador.', solution: 'Três: busca, descodificação e execução. A atualização do contador de programa é normalmente contada como parte da execução.' },
    { id: 'e1-3', difficulty: 2, kind: 'open', title: 'Onde vive cada coisa', statement: 'Abres um editor de texto, escreves duas páginas e ainda não gravaste. O computador falha a energia. O que perdeste e porquê? E se tivesses gravado?', hint: 'Pensa em qual das memórias é volátil.', solution: 'Perdeste tudo o que estava apenas em RAM — o texto escrito e não gravado. A RAM é volátil: sem energia, o conteúdo desaparece. Gravar significa copiar esses bytes para o disco, que é não volátil; nesse caso perderias apenas as alterações posteriores à última gravação. É por isso que os editores modernos gravam automaticamente de tempos a tempos.' },
    { id: 'e1-4', difficulty: 2, kind: 'open', title: 'Compilar ou interpretar', statement: 'Tens de escolher a tecnologia para: (a) o firmware de um sensor com 64 KB de memória; (b) um script que limpa um ficheiro CSV uma vez por mês; (c) o backend de um banco com milhares de pedidos por segundo. Que família de linguagens escolhias em cada caso e porquê?', solution: '(a) Compilada e sem runtime pesado — C ou Rust: memória mínima, controlo total, sem coletor de lixo a acordar em momentos críticos. (b) Interpretada — Python: o tempo de execução é irrelevante, e escrever depressa é o que importa. (c) Híbrida ou compilada — Java, C# ou Go: desempenho previsível, boas ferramentas de observabilidade, ecossistema maduro para concorrência e transações. Em qualquer caso, a decisão pesa também as competências da equipa e a manutenção a longo prazo.' },
    { id: 'e1-5', difficulty: 3, kind: 'open', title: 'Porque é que o computador "abranda"', statement: 'Um utilizador diz que o computador fica lento quando tem muitos separadores do browser abertos. Explica tecnicamente o que está a acontecer, usando os conceitos de RAM, disco e sistema operativo.', hint: 'Procura o termo *swap* ou memória virtual.', solution: 'Cada separador ocupa memória. Quando a RAM se esgota, o sistema operativo recorre a memória virtual: move páginas de memória menos usadas para o disco (*swap*). Como o disco é milhares de vezes mais lento do que a RAM, cada acesso a essas páginas obriga a ir buscá-las de volta — o chamado *thrashing*. A CPU passa a esperar por E/S em vez de calcular, e tudo parece lento, mesmo com o processador quase parado.' },
  ],
};
