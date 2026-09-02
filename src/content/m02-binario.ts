import type { Module } from '../types';

export const m02: Module = {
  id: 'binario',
  number: 2,
  title: 'Sistemas de numeração e binário',
  subtitle: 'Porque tudo são zeros e uns — e como converter entre bases',
  icon: '🔢',
  minutes: 50,
  goals: [
    'Compreender a notação posicional em qualquer base',
    'Converter entre binário, octal, decimal e hexadecimal com fluência',
    'Somar, subtrair e deslocar números em binário',
    'Representar números negativos com complemento de dois',
    'Reconhecer overflow e os seus efeitos',
  ],
  sections: [
    {
      id: 'porque-binario',
      title: 'Porquê base 2',
      blocks: [
        { type: 'p', text: 'Um computador é feito de milhares de milhões de interruptores minúsculos — transístores. Um interruptor tem dois estados fiáveis: **passa corrente** ou **não passa**. Distinguir dois níveis de tensão é fácil e resistente ao ruído; distinguir dez níveis seria caro e frágil.' },
        { type: 'p', text: 'Desses dois estados nasce o **bit** (*binary digit*): a menor unidade de informação, que vale 0 ou 1. Tudo o resto — números, texto, imagens, som, vídeo, o próprio programa — é uma combinação de bits interpretada segundo uma convenção.' },
        { type: 'callout', tone: 'key', text: 'Os mesmos bits podem significar coisas diferentes. `01000001` é o número 65, a letra "A" em ASCII, ou parte de uma instrução de máquina. **O significado vem do contexto**, não dos bits.' },
      ],
    },
    {
      id: 'posicional',
      title: 'Notação posicional: a ideia que serve para todas as bases',
      blocks: [
        { type: 'p', text: 'Já sabes ler base 10 sem pensar. Em 3 407, o 4 não vale 4 — vale 400, porque está na casa das centenas. Cada posição vale uma potência da base.' },
        { type: 'code', lang: 'text', caption: 'decimal: base 10', code: `3 4 0 7
│ │ │ └── 7 × 10⁰ =    7
│ │ └──── 0 × 10¹ =    0
│ └────── 4 × 10² =  400
└──────── 3 × 10³ = 3000
                    ────
                    3407` },
        { type: 'p', text: 'Em binário a regra é exatamente a mesma, só muda a base: cada posição vale uma potência de 2.' },
        { type: 'code', lang: 'text', caption: 'binário: base 2', code: `1 1 0 1 0 1 1 0
│ │ │ │ │ │ │ └── 0 × 2⁰ =   0
│ │ │ │ │ │ └──── 1 × 2¹ =   2
│ │ │ │ │ └────── 1 × 2² =   4
│ │ │ │ └──────── 0 × 2³ =   0
│ │ │ └────────── 1 × 2⁴ =  16
│ │ └──────────── 0 × 2⁵ =   0
│ └────────────── 1 × 2⁶ =  64
└──────────────── 1 × 2⁷ = 128
                          ────
                           214` },
        { type: 'callout', tone: 'tip', title: 'Decora esta linha', text: 'Os pesos dos 8 primeiros bits: **128 64 32 16 8 4 2 1**. Com isto converteste qualquer byte de cabeça: escolhe os pesos que somam o teu número.' },
        { type: 'widget', id: 'bit-toggler', props: { bits: 8 } },
      ],
    },
    {
      id: 'conversoes',
      title: 'Converter entre bases',
      blocks: [
        { type: 'h', text: 'Binário → decimal: soma dos pesos' },
        { type: 'p', text: 'Multiplica cada dígito pelo peso da sua posição e soma. Só os bits a 1 contribuem, por isso na prática somas apenas os pesos onde há um 1.' },
        { type: 'code', lang: 'text', code: `1 0 1 1 0 1₂  →  32 + 8 + 4 + 1 = 45₁₀
│ │ │ │ │ └ 1 × 1
│ │ │ │ └── 0
│ │ │ └──── 1 × 4
│ │ └────── 1 × 8
│ └──────── 0
└────────── 1 × 32` },
        { type: 'h', text: 'Decimal → binário: divisões sucessivas por 2' },
        { type: 'p', text: 'Divide o número por 2 repetidamente, guardando os restos. No fim, lê os restos **de baixo para cima**.' },
        { type: 'code', lang: 'text', code: `45 ÷ 2 = 22  resto 1   ↑
22 ÷ 2 = 11  resto 0   │
11 ÷ 2 =  5  resto 1   │  lê nesta direção
 5 ÷ 2 =  2  resto 1   │
 2 ÷ 2 =  1  resto 0   │
 1 ÷ 2 =  0  resto 1   │

45₁₀ = 101101₂` },
        { type: 'callout', tone: 'tip', title: 'Método alternativo, mais rápido de cabeça', text: 'Vai subtraindo o maior peso que cabe: 45 − 32 = 13 (bit 32 ✓), 13 − 8 = 5 (bit 8 ✓), 5 − 4 = 1 (bit 4 ✓), 1 − 1 = 0 (bit 1 ✓). Resultado: 101101.' },
        { type: 'widget', id: 'base-converter' },
      ],
    },
    {
      id: 'hex-octal',
      title: 'Hexadecimal e octal: binário abreviado',
      blocks: [
        { type: 'p', text: 'Escrever `11010110011101` é convite ao erro. Como 16 = 2⁴, **cada dígito hexadecimal representa exatamente 4 bits** — a conversão faz-se por blocos, sem contas. Por isso o hexadecimal aparece em endereços de memória, cores, códigos de erro e volumes de dados binários.' },
        {
          type: 'table',
          head: ['Decimal', 'Binário', 'Octal', 'Hex'],
          rows: [
            ['0', '0000', '0', '0'], ['1', '0001', '1', '1'], ['2', '0010', '2', '2'], ['3', '0011', '3', '3'],
            ['4', '0100', '4', '4'], ['5', '0101', '5', '5'], ['6', '0110', '6', '6'], ['7', '0111', '7', '7'],
            ['8', '1000', '10', '8'], ['9', '1001', '11', '9'], ['10', '1010', '12', '**A**'], ['11', '1011', '13', '**B**'],
            ['12', '1100', '14', '**C**'], ['13', '1101', '15', '**D**'], ['14', '1110', '16', '**E**'], ['15', '1111', '17', '**F**'],
          ],
          caption: 'Tabela para memorizar aos poucos — os quatro bits de cada dígito hexadecimal.',
        },
        { type: 'code', lang: 'text', caption: 'converter por blocos de 4 bits', code: `1101 0110₂
 │     │
 D     6      →  0xD6  =  214₁₀

0x2F  →  2 = 0010,  F = 1111  →  00101111₂  =  47₁₀` },
        { type: 'p', text: 'O **octal** (base 8) agrupa 3 bits. Hoje encontra-se sobretudo nas permissões de ficheiros em Unix: `chmod 755` significa `111 101 101` — leitura+escrita+execução para o dono, leitura+execução para os restantes.' },
        {
          type: 'terms', items: [
            { term: '0b1101', def: 'Prefixo comum para literais binários (Python, Java, JavaScript, C).' },
            { term: '0o755', def: 'Prefixo para octal em Python e JavaScript modernos.' },
            { term: '0xFF', def: 'Prefixo para hexadecimal, praticamente universal.' },
            { term: '#FF5733', def: 'Cor em HTML/CSS: três bytes hexadecimais — vermelho, verde e azul.' },
          ],
        },
      ],
    },
    {
      id: 'aritmetica',
      title: 'Aritmética binária',
      blocks: [
        { type: 'p', text: 'Somar em binário é como somar em decimal, mas o "vai um" acontece a partir de 2 em vez de 10. Só há quatro casos: 0+0=0, 0+1=1, 1+0=1 e **1+1=10** (escreve 0, transporta 1).' },
        { type: 'code', lang: 'text', caption: '13 + 11 = 24', code: `  ¹¹¹¹        ← transportes
   1101   (13)
 + 1011   (11)
 ───────
  11000   (24)` },
        { type: 'p', text: 'A multiplicação e a divisão por potências de 2 fazem-se com **deslocamentos** (*shifts*), a operação mais barata que a CPU tem.' },
        {
          type: 'table',
          head: ['Operação', 'Símbolo', 'Exemplo', 'Efeito'],
          rows: [
            ['Deslocar à esquerda', '`<<`', '`5 << 1` = 10', 'Multiplica por 2 (acrescenta um 0 à direita)'],
            ['Deslocar à direita', '`>>`', '`20 >> 2` = 5', 'Divide por 4, descartando o resto'],
            ['E lógico', '`&`', '`12 & 10` = 8', 'Bit a 1 só onde ambos são 1 — usa-se para máscaras'],
            ['OU lógico', '`|`', '`12 \\| 10` = 14', 'Bit a 1 onde pelo menos um é 1 — junta flags'],
            ['OU exclusivo', '`^`', '`12 ^ 10` = 6', 'Bit a 1 onde são diferentes — usa-se em criptografia e para trocar valores'],
            ['Negação', '`~`', '`~5` = −6', 'Inverte todos os bits'],
          ],
        },
        { type: 'callout', tone: 'info', title: 'Onde vais encontrar isto', text: 'Máscaras de sub-rede (`255.255.255.0`), permissões (`chmod`), *flags* de configuração combinadas com `|`, verificação de paridade e hashes. Não precisas de usar operações de bits todos os dias, mas tens de as reconhecer.' },
      ],
    },
    {
      id: 'negativos',
      title: 'Números negativos: complemento de dois',
      blocks: [
        { type: 'p', text: 'Os bits não têm sinal de menos. A convenção universal chama-se **complemento de dois**: o bit mais à esquerda passa a ter peso negativo. Em 8 bits, esse bit vale −128 em vez de +128.' },
        {
          type: 'steps', items: [
            { title: 'Escreve o valor absoluto', text: 'Para representar −42 em 8 bits, começa por 42 = `00101010`.' },
            { title: 'Inverte todos os bits', text: '`00101010` → `11010101` (isto é o complemento de um).' },
            { title: 'Soma 1', text: '`11010101` + 1 = `11010110`. É esta a representação de −42.' },
          ],
        },
        { type: 'p', text: 'A elegância do método: a soma funciona sem regras especiais. `42 + (−42)` = `00101010 + 11010110` = `1 00000000` — o transporte extra é descartado e sobra zero, tal como devia.' },
        { type: 'widget', id: 'twos-complement' },
        { type: 'callout', tone: 'warn', title: 'Overflow', text: 'Com 8 bits com sinal só cabem valores de **−128 a 127**. Somar 127 + 1 dá `10000000`, que se lê como −128. Não é um erro do computador: é a aritmética a "dar a volta". O bug do Ariane 5 (1996), que destruiu um foguetão de 370 milhões de dólares, foi exatamente isto — uma conversão de 64 para 16 bits sem verificação.' },
        {
          type: 'table',
          head: ['Tipo (Java/C)', 'Bits', 'Intervalo com sinal', 'Intervalo sem sinal'],
          rows: [
            ['`byte`', '8', '−128 … 127', '0 … 255'],
            ['`short`', '16', '−32 768 … 32 767', '0 … 65 535'],
            ['`int`', '32', '−2 147 483 648 … 2 147 483 647', '0 … 4 294 967 295'],
            ['`long`', '64', '≈ −9,2 × 10¹⁸ … 9,2 × 10¹⁸', '0 … ≈ 1,8 × 10¹⁹'],
          ],
        },
      ],
    },
  ],
  quiz: [
    { id: 'b1', prompt: 'Quanto vale `1010 1100` em decimal?', options: ['162', '172', '176', '188'], answer: 1, explain: '128 + 32 + 8 + 4 = 172. Os bits a 1 estão nas posições de peso 128, 32, 8 e 4.' },
    { id: 'b2', prompt: 'Qual é a representação binária de 100?', options: ['1100100', '1010100', '1100010', '1110100'], answer: 0, explain: '64 + 32 + 4 = 100, portanto 1100100.' },
    { id: 'b3', prompt: 'Porque é que o hexadecimal é tão usado em informática?', options: ['Porque é mais rápido de calcular', 'Porque cada dígito corresponde exatamente a 4 bits, o que torna a conversão imediata', 'Porque o processador trabalha em base 16', 'Por razões históricas, sem vantagem prática'], answer: 1, explain: 'Como 16 = 2⁴, converte-se por blocos de 4 bits sem fazer contas. O processador continua a trabalhar em binário.' },
    { id: 'b4', prompt: '`0x1F` corresponde a que valor decimal?', options: ['15', '31', '25', '116'], answer: 1, explain: '1 × 16 + 15 = 31. Em binário, 0001 1111.' },
    { id: 'b5', prompt: 'Numa variável de 8 bits com sinal, que valor tem o padrão `11111111`?', options: ['255', '−1', '−127', '128'], answer: 1, explain: 'Em complemento de dois, −128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = −1. Sem sinal, o mesmo padrão seria 255.' },
    { id: 'b6', prompt: 'O que faz a operação `x << 3`?', options: ['Divide x por 3', 'Multiplica x por 8', 'Multiplica x por 3', 'Inverte os bits de x'], answer: 1, explain: 'Cada deslocamento à esquerda multiplica por 2; três deslocamentos multiplicam por 2³ = 8.' },
    { id: 'b7', prompt: 'Um contador de 16 bits com sinal está em 32 767 e é incrementado. Que acontece?', options: ['Fica em 32 768', 'Passa a −32 768 por overflow', 'O programa lança sempre um erro', 'Fica em 0'], answer: 1, explain: 'Ultrapassa o máximo representável e "dá a volta" para o mínimo. Em muitas linguagens isto acontece em silêncio — daí o perigo.' },
    { id: 'b8', prompt: 'Quantos valores diferentes se podem representar com 10 bits?', options: ['100', '512', '1024', '2048'], answer: 2, explain: '2¹⁰ = 1024. Com n bits representam-se 2ⁿ valores distintos, de 0 a 2ⁿ − 1.' },
  ],
  exercises: [
    { id: 'e2-1', difficulty: 1, kind: 'input', title: 'Binário para decimal', statement: 'Converte `1001 0110` para decimal.', accept: ['150'], hint: 'Soma os pesos: 128 + 16 + 4 + 2.', solution: '128 + 16 + 4 + 2 = **150**.' },
    { id: 'e2-2', difficulty: 1, kind: 'input', title: 'Decimal para binário', statement: 'Converte 200 para binário (escreve apenas os dígitos, sem espaços).', accept: ['11001000'], hint: 'Começa pelo maior peso que cabe: 128.', solution: '200 = 128 + 64 + 8 → `11001000`.' },
    { id: 'e2-3', difficulty: 2, kind: 'input', title: 'Hexadecimal', statement: 'Converte `10110111` para hexadecimal (podes escrever com ou sem o prefixo 0x).', accept: ['b7', '0xb7'], hint: 'Divide em dois blocos de 4 bits e converte cada um.', solution: '`1011` = B, `0111` = 7 → **0xB7** (183 em decimal).' },
    { id: 'e2-4', difficulty: 2, kind: 'input', title: 'Quantos bits', statement: 'Quantos bits são necessários, no mínimo, para representar todos os números de 0 a 1000?', accept: ['10'], hint: '2⁹ = 512 e 2¹⁰ = 1024.', solution: 'São precisos **10 bits**: com 9 bits só se chega a 511; com 10 chega-se a 1023, que cobre 1000.' },
    { id: 'e2-5', difficulty: 2, kind: 'open', title: 'Soma binária', statement: 'Calcula à mão `1011 0110` + `0100 1101` em 8 bits. Há overflow se os valores forem sem sinal? E se forem com sinal?', hint: 'Soma bit a bit da direita para a esquerda, propagando o transporte.', solution: '182 + 77 = 259. Em binário, `10110110 + 01001101 = 1 00000011`. Sem sinal, há overflow: 259 não cabe em 8 bits (máximo 255) e o resultado guardado seria 3. Com sinal, os operandos são −74 e +77, cuja soma é 3 — que cabe e está correta. Ou seja, o mesmo padrão de bits é overflow numa interpretação e não é na outra; a CPU sinaliza as duas situações com flags diferentes (*carry* e *overflow*).' },
    { id: 'e2-6', difficulty: 3, kind: 'open', title: 'Complemento de dois', statement: 'Representa −100 em 8 bits com complemento de dois e mostra os três passos. Depois verifica que 100 + (−100) dá zero.', solution: 'Passo 1: 100 = `01100100`. Passo 2: inverter → `10011011`. Passo 3: somar 1 → `10011100`. Verificação: `01100100 + 10011100 = 1 00000000`; o nono bit é descartado e sobra `00000000` = 0. Confirma-se também pelos pesos: −128 + 16 + 8 + 4 = −100.' },
    { id: 'e2-7', difficulty: 3, kind: 'open', title: 'Máscara de sub-rede', statement: 'A máscara `255.255.255.192` escreve-se em binário como? Quantos endereços tem essa sub-rede e quantos são utilizáveis por máquinas?', hint: '192 = 128 + 64.', solution: '`11111111.11111111.11111111.11000000` — 26 bits a 1, ou seja, notação `/26`. Sobram 32 − 26 = 6 bits para máquinas, logo 2⁶ = 64 endereços. Retirando o endereço de rede e o de difusão (*broadcast*), ficam **62 endereços utilizáveis**.' },
  ],
};
