import type { Module } from '../types';

export const m03: Module = {
  id: 'memoria',
  number: 3,
  title: 'Bits, bytes e memória',
  subtitle: 'Unidades, cálculo de armazenamento, codificação de dados e como a memória é organizada',
  icon: '🧠',
  minutes: 45,
  goals: [
    'Calcular tamanhos de ficheiros, largura de banda e capacidade',
    'Distinguir KB de KiB e saber porque o disco "encolhe"',
    'Explicar como texto, imagens e números reais são guardados',
    'Descrever a hierarquia de memória e o papel da cache',
    'Compreender endereços, pilha, heap e o que é uma fuga de memória',
  ],
  sections: [
    {
      id: 'unidades',
      title: 'Do bit ao terabyte',
      blocks: [
        { type: 'p', text: 'Um **bit** é um 0 ou um 1. Oito bits formam um **byte**, a unidade prática de endereçamento: praticamente todos os computadores dão um endereço a cada byte, não a cada bit.' },
        { type: 'p', text: 'Com 1 byte representam-se 2⁸ = **256** valores distintos: 0 a 255, ou −128 a 127 com sinal, ou um carácter ASCII.' },
        {
          type: 'table',
          head: ['Nome', 'Símbolo', 'Valor', 'Ordem de grandeza'],
          rows: [
            ['bit', 'b', '0 ou 1', 'um interruptor'],
            ['byte', 'B', '8 bits', 'uma letra ASCII'],
            ['kibibyte', 'KiB', '1024 B', 'um parágrafo'],
            ['mebibyte', 'MiB', '1024 KiB ≈ 1,05 MB', 'uma foto comprimida'],
            ['gibibyte', 'GiB', '1024 MiB', 'um filme curto, ou a RAM de um telemóvel'],
            ['tebibyte', 'TiB', '1024 GiB', 'um disco de portátil'],
            ['pebibyte', 'PiB', '1024 TiB', 'o armazenamento de uma empresa média'],
          ],
        },
        { type: 'h', text: 'A confusão do 1000 contra 1024' },
        { type: 'p', text: 'Existem duas famílias de prefixos e ambas são legítimas:' },
        {
          type: 'compare',
          left: { title: 'Base 1000 — prefixos SI (kB, MB, GB)', items: ['1 kB = 1 000 bytes', 'Usada por fabricantes de discos e por operadoras', 'Coerente com o resto do sistema métrico', 'Um disco "de 1 TB" tem 1 000 000 000 000 bytes'] },
            right: { title: 'Base 1024 — prefixos IEC (KiB, MiB, GiB)', items: ['1 KiB = 1 024 bytes', 'Usada pelos sistemas operativos e pela RAM', 'Alinhada com as potências de 2 do endereçamento', 'Esse mesmo disco aparece como 931 GiB'] },
        },
        { type: 'callout', tone: 'trap', title: 'Erro comum', text: 'Confundir **bits** com **bytes** na velocidade da internet. Uma ligação de 100 Mbps são 100 megabits por segundo = 12,5 MB/s. Ao descarregar um ficheiro de 1 GB, o melhor caso são cerca de 80 segundos, não 10.' },
        { type: 'widget', id: 'storage-calculator' },
      ],
    },
    {
      id: 'texto',
      title: 'Como se guarda texto',
      blocks: [
        { type: 'p', text: 'Um carácter é um número. A tabela que associa números a caracteres chama-se **codificação**.' },
        {
          type: 'list', items: [
            '**ASCII** (1963): 7 bits, 128 caracteres. Chega para o inglês; não tem "ç" nem "ã".',
            '**Latin-1 / ISO-8859-1**: 8 bits, 256 caracteres, acrescenta acentos da Europa ocidental. Ainda insuficiente para grego, cirílico ou chinês.',
            '**Unicode**: um catálogo com mais de 149 000 caracteres — todas as escritas do mundo, símbolos e emojis. Atribui a cada um um *code point* (por exemplo, U+00E7 para "ç").',
            '**UTF-8**: a forma dominante de escrever Unicode em bytes. Usa 1 byte para ASCII, 2 para a maioria dos acentos, 3 para chinês e 4 para emojis. É compatível com ASCII, o que explica o seu domínio.',
          ],
        },
        { type: 'widget', id: 'ascii-explorer' },
        { type: 'callout', tone: 'warn', title: 'Aquele "Ol√°" no ecrã', text: 'Texto ilegível quase sempre significa que os bytes foram escritos numa codificação e lidos noutra. Regra prática: **usa UTF-8 em todo o lado** — ficheiros, base de dados, cabeçalhos HTTP, terminal.' },
        { type: 'p', text: 'Consequência prática: em UTF-8, o número de caracteres e o número de bytes **não são a mesma coisa**. Truncar um texto a 100 bytes pode partir um carácter ao meio; validar um campo por bytes quando o utilizador conta letras gera bugs subtis.' },
      ],
    },
    {
      id: 'numeros-reais',
      title: 'Números com vírgula',
      blocks: [
        { type: 'p', text: 'Os inteiros são exatos. Os números reais, não: são guardados no formato **IEEE 754**, que é notação científica em binário — sinal, expoente e mantissa.' },
        { type: 'widget', id: 'float-bits' },
        { type: 'p', text: 'Tal como 1/3 não tem representação decimal finita (0,333…), **0,1 não tem representação binária finita**. O que fica guardado é o valor representável mais próximo, e os erros acumulam-se.' },
        { type: 'code', lang: 'js', caption: 'o clássico de todas as linguagens', code: `0.1 + 0.2            // 0.30000000000000004
0.1 + 0.2 === 0.3    // false

// certo: comparar com uma tolerância
Math.abs((0.1 + 0.2) - 0.3) < 1e-9   // true

// certo para dinheiro: trabalhar em cêntimos (inteiros)
const precoEmCentimos = 1999;   // 19,99 €` },
        { type: 'callout', tone: 'key', text: 'Regras: **nunca** uses vírgula flutuante para dinheiro (usa inteiros de cêntimos ou tipos decimais como `BigDecimal`/`decimal`), e **nunca** compares reais com `==` — compara com uma margem de erro.' },
      ],
    },
    {
      id: 'multimedia',
      title: 'Imagens, som e vídeo em bits',
      blocks: [
        { type: 'p', text: 'Todos os media seguem o mesmo princípio: amostrar a realidade e guardar números.' },
        {
          type: 'table',
          head: ['Media', 'Como se digitaliza', 'Cálculo do tamanho em bruto'],
          rows: [
            ['Imagem', 'Grelha de pixels; cada pixel guarda R, G e B (1 byte cada)', 'largura × altura × 3 bytes'],
            ['Som', 'Amostras da onda por segundo (44 100 Hz), cada uma com 16 bits', 'taxa × bits × canais × segundos ÷ 8'],
            ['Vídeo', 'Sequência de imagens (24–60 por segundo) + som', 'tamanho da imagem × fps × duração'],
          ],
        },
        { type: 'code', lang: 'text', caption: 'porque é que a compressão existe', code: `Foto 4000 × 3000 sem compressão:
  4000 × 3000 × 3 bytes = 36 000 000 B ≈ 34,3 MiB
  em JPEG (qualidade alta): ≈ 4 MiB   → cerca de 9× menor

Música: 44 100 × 16 × 2 × 240 s ÷ 8 = 42 336 000 B ≈ 40 MiB
  em MP3 a 192 kbps: ≈ 5,5 MiB

Vídeo 1080p, 90 min, sem compressão:
  1920 × 1080 × 3 × 25 × 5400 ≈ 840 GB
  em H.264: ≈ 3 GB   → cerca de 280× menor` },
        { type: 'p', text: 'A compressão divide-se em **sem perdas** (ZIP, PNG, FLAC — recupera-se o original bit a bit) e **com perdas** (JPEG, MP3, H.264 — deita fora informação que o olho e o ouvido não notam).' },
      ],
    },
    {
      id: 'hierarquia',
      title: 'A hierarquia de memória',
      blocks: [
        { type: 'p', text: 'Memória rápida é cara e pequena; memória barata é lenta e grande. Os computadores resolvem o dilema com camadas, mantendo perto da CPU aquilo que está a ser usado.' },
        {
          type: 'table',
          head: ['Nível', 'Tamanho típico', 'Tempo de acesso', 'Se um registo fosse 1 segundo…'],
          rows: [
            ['Registos', 'dezenas de bytes', '≈ 0,3 ns', '1 segundo'],
            ['Cache L1', '32–64 KiB', '≈ 1 ns', '3 segundos'],
            ['Cache L2/L3', '0,5–32 MiB', '≈ 10 ns', '30 segundos'],
            ['RAM', '8–64 GiB', '≈ 100 ns', '5 minutos'],
            ['SSD NVMe', '0,5–4 TiB', '≈ 100 µs', '3 dias'],
            ['Disco mecânico', '1–20 TiB', '≈ 10 ms', '1 ano'],
            ['Rede / nuvem', 'ilimitado', '10–200 ms', '1 a 20 anos'],
          ],
          caption: 'A última coluna torna visível o que os números não mostram: as diferenças são brutais.',
        },
        { type: 'callout', tone: 'tip', title: 'Localidade', text: 'A cache aposta em duas suposições que quase sempre acertam: se acedeste a um dado, vais precisar dele outra vez em breve (**localidade temporal**) e vais precisar do vizinho (**localidade espacial**). É por isso que percorrer um vetor é muito mais rápido do que saltar aleatoriamente pela memória, mesmo com o mesmo número de acessos.' },
      ],
    },
    {
      id: 'enderecos',
      title: 'Endereços, pilha e heap',
      blocks: [
        { type: 'p', text: 'A memória é uma sequência gigantesca de bytes numerados. Esse número é o **endereço**. Declarar uma variável é reservar um ou mais bytes contíguos e passar a referi-los por um nome.' },
        { type: 'widget', id: 'memory-visualizer' },
        { type: 'p', text: 'A memória de um processo divide-se em zonas com regras diferentes. As duas que mais te vão afetar são a **pilha** e o **heap**.' },
        { type: 'widget', id: 'stack-heap' },
        {
          type: 'terms', items: [
            { term: 'Ponteiro / referência', def: 'Uma variável que guarda um endereço em vez de um valor. Em Java, Python ou JavaScript trabalhas quase sempre com referências, mesmo sem lhes chamar isso.' },
            { term: 'Stack overflow', def: 'A pilha esgotou-se, normalmente por recursão sem caso base. O programa termina abruptamente.' },
            { term: 'Fuga de memória', def: 'Memória alocada no heap que nunca é libertada nem reutilizada. O processo cresce até esgotar a RAM.' },
            { term: 'Coletor de lixo', def: 'Componente que liberta automaticamente objetos inalcançáveis (Java, C#, Go, Python). Em C e C++ a libertação é responsabilidade de quem escreve.' },
            { term: 'Alinhamento', def: 'Os dados são colocados em endereços múltiplos do seu tamanho, o que às vezes deixa bytes de preenchimento vazios entre campos.' },
          ],
        },
        { type: 'callout', tone: 'info', title: 'Valor ou referência', text: 'Passar um número a uma função copia o valor; passar uma lista costuma passar a referência. É por isso que uma função que ordena a lista recebida altera a lista de quem a chamou. Saber isto evita uma classe inteira de bugs difíceis.' },
      ],
    },
  ],
  quiz: [
    { id: 'm1', prompt: 'Quantos bytes tem 1 MiB?', options: ['1 000 000', '1 024 000', '1 048 576', '8 388 608'], answer: 2, explain: '1 MiB = 1024 × 1024 = 1 048 576 bytes. Um MB (SI) seria 1 000 000.' },
    { id: 'm2', prompt: 'Uma ligação de 200 Mbps descarrega, no melhor caso, quanto por segundo?', options: ['200 MB', '25 MB', '20 MB', '1,6 MB'], answer: 1, explain: '200 megabits ÷ 8 = 25 megabytes por segundo. O "b" minúsculo é bit; o "B" maiúsculo é byte.' },
    { id: 'm3', prompt: 'Porque é que `0.1 + 0.2 !== 0.3` em quase todas as linguagens?', options: ['Por um erro dos compiladores', 'Porque 0,1 não tem representação binária finita e o valor guardado é aproximado', 'Porque a soma de reais não é comutativa', 'Porque falta memória'], answer: 1, explain: 'IEEE 754 guarda o valor representável mais próximo. Os pequenos erros somam-se e tornam-se visíveis.' },
    { id: 'm4', prompt: 'Quantos bytes ocupa a palavra "ação" em UTF-8?', options: ['4', '5', '6', '8'], answer: 1, explain: 'a(1) + ç(2) + ã(2) + o(1) = 5 bytes para 4 caracteres. Em UTF-8, caracteres acentuados ocupam 2 bytes.' },
    { id: 'm5', prompt: 'Qual destas memórias é a mais rápida?', options: ['RAM', 'SSD', 'Cache L1', 'Registos da CPU'], answer: 3, explain: 'Os registos estão dentro do núcleo do processador. Cache L1 vem logo a seguir.' },
    { id: 'm6', prompt: 'Uma recursão sem caso base provoca tipicamente…', options: ['uma fuga de memória no heap', 'um stack overflow', 'um erro de compilação', 'corrupção do disco'], answer: 1, explain: 'Cada chamada empilha um novo bloco na pilha; sem condição de paragem, a pilha esgota-se.' },
    { id: 'm7', prompt: 'Um fabricante vende um disco de 2 TB. Quanto mostra o sistema operativo, aproximadamente?', options: ['2 TiB', '1,82 TiB', '2,2 TiB', '1,5 TiB'], answer: 1, explain: '2 × 10¹² ÷ 1024³ ≈ 1862 GiB ≈ 1,82 TiB. Não desapareceu espaço: mudou a unidade.' },
  ],
  exercises: [
    { id: 'e3-1', difficulty: 1, kind: 'input', title: 'Bits num megabyte', statement: 'Quantos bits tem 1 MiB? Responde com o número exato.', accept: ['8388608'], hint: '1 MiB = 1 048 576 bytes; cada byte tem 8 bits.', solution: '1 048 576 × 8 = **8 388 608 bits**.' },
    { id: 'e3-2', difficulty: 2, kind: 'open', title: 'Tamanho de uma imagem', statement: 'Calcula o tamanho em bruto (sem compressão) de uma imagem de 1920 × 1080 pixels com 24 bits de cor. Apresenta o resultado em MiB.', hint: '24 bits = 3 bytes por pixel.', solution: '1920 × 1080 = 2 073 600 pixels. A 3 bytes cada: 6 220 800 bytes. Dividindo por 1024² ≈ **5,93 MiB**. Um PNG do mesmo conteúdo pode ocupar 1 MiB e um JPEG 300 KiB — a diferença é toda compressão.' },
    { id: 'e3-3', difficulty: 2, kind: 'input', title: 'Capacidade de um cartão', statement: 'Quantas fotos de 4 MiB cabem, aproximadamente, num cartão de 32 GiB? Responde com o número inteiro.', accept: ['8192'], hint: '32 GiB = 32 × 1024 MiB.', solution: '32 × 1024 = 32 768 MiB; 32 768 ÷ 4 = **8 192 fotos**. Na prática cabem menos, porque o sistema de ficheiros ocupa espaço e a capacidade anunciada costuma ser em GB (base 1000).' },
    { id: 'e3-4', difficulty: 2, kind: 'open', title: 'Tempo de descarga', statement: 'Uma atualização de 4,5 GiB é descarregada numa ligação de 60 Mbps que na prática atinge 80% do débito. Quanto tempo demora?', solution: 'Débito real: 60 × 0,8 = 48 Mbps = 6 MB/s = 6 × 10⁶ B/s. Tamanho: 4,5 × 1024³ ≈ 4,83 × 10⁹ bytes. Tempo ≈ 4,83 × 10⁹ ÷ 6 × 10⁶ ≈ **805 segundos ≈ 13,4 minutos**.' },
    { id: 'e3-5', difficulty: 3, kind: 'open', title: 'Dinheiro e vírgula flutuante', statement: 'Um sistema de faturação guarda preços em `double` e soma 10 000 artigos de 0,10 €. O total mostrado é 999,9999999999 €. Explica a causa e propõe duas soluções, com os respetivos compromissos.', hint: 'Pensa no que acontece à representação de 0,1.', solution: 'Causa: 0,10 não é representável exatamente em binário; cada soma acrescenta um erro minúsculo que se acumula ao longo de 10 000 operações. Solução 1 — guardar cêntimos em inteiros (`long`): exato, rápido e simples, mas obriga a converter na apresentação e a decidir o arredondamento em multiplicações (IVA, descontos). Solução 2 — usar um tipo decimal (`BigDecimal` em Java, `decimal` em C#/Python): aritmética decimal exata com escala e modo de arredondamento explícitos, ao custo de mais memória e desempenho inferior. Em sistemas financeiros a regra é: inteiros de cêntimos para contabilidade de alto volume, tipos decimais quando há muitas taxas e conversões. Em qualquer caso, arredondar apenas no momento de apresentar, nunca a meio dos cálculos.' },
    { id: 'e3-6', difficulty: 3, kind: 'open', title: 'Localidade e cache', statement: 'Percorrer uma matriz 10 000 × 10 000 por linhas é várias vezes mais rápido do que percorrê-la por colunas, apesar de o número de acessos ser idêntico. Porquê?', solution: 'Em memória, uma matriz é guardada linearmente — na maioria das linguagens, linha a linha (*row-major*). Ao percorrer por linhas, cada acesso cai na mesma linha de cache (tipicamente 64 bytes, ou seja 8 a 16 elementos) que já foi trazida: aproveita-se a localidade espacial. Ao percorrer por colunas, cada acesso salta uma linha inteira de memória, obriga a trazer uma nova linha de cache e desperdiça o resto. O resultado é uma falha de cache por elemento em vez de uma por cada 8 a 16 — daí a diferença, que pode chegar a 10×.' },
  ],
};
