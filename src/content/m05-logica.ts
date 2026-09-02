import type { Module } from '../types';

export const m05: Module = {
  id: 'logica',
  number: 5,
  title: 'Lógica de programação',
  subtitle: 'Variáveis, tipos, operadores e raciocínio booleano — a base de tudo o resto',
  icon: '🧩',
  minutes: 50,
  goals: [
    'Perceber o que é uma variável e como escolher bons nomes',
    'Distinguir os tipos de dados primitivos e quando usar cada um',
    'Aplicar operadores aritméticos, relacionais e lógicos com a precedência correta',
    'Construir e ler tabelas verdade',
    'Simplificar condições com as leis de De Morgan',
  ],
  sections: [
    {
      id: 'o-que-e-logica',
      title: 'O que é lógica de programação',
      blocks: [
        { type: 'p', text: 'Lógica de programação é a capacidade de decompor um problema numa sequência de passos precisos, sem ambiguidade, que uma máquina possa executar. Não depende de linguagem: quem a domina aprende Python, Java ou Go em semanas; quem não a domina decora sintaxe e fica preso ao primeiro problema novo.' },
        { type: 'p', text: 'A dificuldade não é técnica, é de precisão. Quando dizes a uma pessoa "faz um chá", ela preenche sozinha centenas de detalhes. Um computador não preenche nada. Programar é aprender a escrever aquilo que normalmente fica implícito.' },
        { type: 'callout', tone: 'key', text: 'A ordem de trabalho de qualquer programa: **compreender o problema → identificar entradas, saídas e regras → desenhar os passos → traduzir para código → testar**. Escrever código é a quarta etapa, não a primeira. Os iniciantes começam pela quarta; é a causa nº 1 de frustração.' },
      ],
    },
    {
      id: 'variaveis',
      title: 'Variáveis e constantes',
      blocks: [
        { type: 'p', text: 'Uma **variável** é um nome dado a um espaço de memória onde guardas um valor que pode mudar ao longo da execução. Pensa numa caixa etiquetada: a etiqueta é o nome, o conteúdo é o valor.' },
        { type: 'code', lang: 'portugol', caption: 'declaração e atribuição', code: `var
   idade : inteiro          // declaração: reserva espaço e dá-lhe um nome
   nome : caractere
   altura : real
   ativo : logico
inicio
   idade <- 30              // atribuição: coloca o valor 30 na variável
   idade <- idade + 1       // lê o valor atual, soma 1 e volta a guardar
   nome <- "Ana"
   altura <- 1.72
   ativo <- verdadeiro` },
        { type: 'callout', tone: 'trap', title: 'O sinal de igual não é igualdade', text: 'Em `idade <- idade + 1` (ou `idade = idade + 1` na maioria das linguagens) não estás a afirmar que um número é igual a si mais um. Estás a dar uma **ordem**: calcula a direita e guarda à esquerda. A comparação usa outro operador (`=` em Portugol, `==` em quase todas as linguagens).' },
        { type: 'h', text: 'Como dar nomes' },
        {
          type: 'compare',
          left: { title: 'Nomes que ajudam', items: ['`totalComIva`, `numeroDeAlunos`, `emailValido`', 'Dizem o que guardam, sem abreviaturas obscuras', '`i`, `j` são aceitáveis como índices de ciclo', 'Booleanos com forma de pergunta: `estaAtivo`, `temDesconto`', 'Constantes em maiúsculas: `TAXA_IVA`, `MAX_TENTATIVAS`'] },
          right: { title: 'Nomes que custam caro', items: ['`x`, `a1`, `dados`, `temp2`, `aux`', 'Obrigam a reler o código todo para perceber', '`lista1`, `lista2` — qual é qual daqui a três meses?', '`flag` — flag de quê?', 'Nomes em duas línguas misturadas no mesmo ficheiro'] },
        },
        { type: 'p', text: 'Uma **constante** é um valor que não muda: `PI`, `TAXA_IVA`, `VELOCIDADE_LUZ`. Declarar constantes em vez de escrever o número várias vezes evita erros e documenta a intenção — `preco * 1.23` diz pouco, `preco * (1 + TAXA_IVA)` diz tudo.' },
      ],
    },
    {
      id: 'tipos',
      title: 'Tipos de dados',
      blocks: [
        { type: 'p', text: 'O **tipo** determina que valores cabem na variável, quanta memória ocupa e que operações fazem sentido. Somar dois inteiros faz sentido; somar dois booleanos não.' },
        {
          type: 'table',
          head: ['Tipo', 'Portugol', 'Java', 'Python', 'Exemplo', 'Notas'],
          rows: [
            ['Inteiro', '`inteiro`', '`int`, `long`', '`int`', '−3, 0, 42', 'Exato. Atenção aos limites e ao overflow.'],
            ['Real', '`real`', '`double`', '`float`', '3.14, −0.5', 'Aproximado. Nunca para dinheiro.'],
            ['Texto', '`caractere`', '`String`', '`str`', '"Ana", "MZ"', 'Imutável na maioria das linguagens.'],
            ['Lógico', '`logico`', '`boolean`', '`bool`', 'verdadeiro, falso', 'Só dois valores. Base de todas as decisões.'],
            ['Vazio/nulo', '—', '`null`', '`None`', 'ausência de valor', 'Fonte nº 1 de erros em produção.'],
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Cuidado com conversões', text: 'Em muitas linguagens, `7 / 2` com dois inteiros dá **3**, não 3,5 — a divisão inteira descarta a parte decimal. E `"3" + 4` pode dar `"34"` (concatenação) ou 7, conforme a linguagem. Sempre que misturas tipos, sê explícito na conversão.' },
        { type: 'h', text: 'Tipagem estática e dinâmica' },
        {
          type: 'compare',
          left: { title: 'Estática (Java, Go, TypeScript, Rust)', items: ['O tipo é fixado na declaração e verificado antes de correr', 'Erros de tipo apanhados em compilação', 'Melhor autocompletar e refatoração segura', 'Mais verboso a escrever'] },
          right: { title: 'Dinâmica (Python, JavaScript, Ruby)', items: ['O tipo pertence ao valor e pode mudar', 'Código mais curto e flexível', 'Erros de tipo só aparecem em execução', 'Exige mais testes para a mesma confiança'] },
        },
      ],
    },
    {
      id: 'operadores',
      title: 'Operadores',
      blocks: [
        {
          type: 'table',
          head: ['Categoria', 'Operadores', 'Resultado', 'Exemplo'],
          rows: [
            ['Aritméticos', '`+  −  *  /  %  ^`', 'Número', '`17 % 5` = 2 (resto da divisão)'],
            ['Relacionais', '`=  <>  <  >  <=  >=`', 'Lógico', '`idade >= 18` → verdadeiro/falso'],
            ['Lógicos', '`e`  `ou`  `nao`', 'Lógico', '`idade >= 18 e temBilhete`'],
            ['Atribuição', '`<-`  (ou `=`)', '—', '`total <- total + preco`'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'O operador módulo (%) é mais útil do que parece', text: '`n % 2 = 0` testa se é par. `n % 3 = 0` testa divisibilidade por 3. `segundos % 60` dá os segundos que sobram depois dos minutos. `indice % tamanho` faz um índice dar a volta ao chegar ao fim de uma lista.' },
        { type: 'h', text: 'Precedência: quem se resolve primeiro' },
        {
          type: 'list', ordered: true, items: [
            'Parênteses `( )`',
            'Potência `^`',
            'Multiplicação, divisão e resto `*  /  %`',
            'Adição e subtração `+  −`',
            'Relacionais `<  >  <=  >=  =  <>`',
            'Negação `nao`',
            'Conjunção `e`',
            'Disjunção `ou`',
          ],
        },
        { type: 'code', lang: 'portugol', caption: 'a mesma expressão, com e sem parênteses', code: `2 + 3 * 4          // 14, porque a multiplicação vem primeiro
(2 + 3) * 4        // 20

idade >= 18 e tem_bilhete ou e_convidado
// lê-se: (idade >= 18 e tem_bilhete) ou e_convidado
// se querias outra coisa, escreve os parênteses:
idade >= 18 e (tem_bilhete ou e_convidado)` },
        { type: 'callout', tone: 'tip', text: 'Na dúvida, **põe parênteses**. Ninguém foi despedido por escrever parênteses a mais; muita gente perdeu uma noite por os ter escrito a menos.' },
      ],
    },
    {
      id: 'booleana',
      title: 'Lógica booleana',
      blocks: [
        { type: 'p', text: 'Toda a decisão que um programa toma reduz-se a verdadeiro ou falso. A álgebra de Boole (1854) formalizou estas operações muito antes de existirem computadores — e é literalmente o que os transístores implementam.' },
        {
          type: 'table',
          head: ['A', 'B', 'A e B', 'A ou B', 'nao A', 'A xor B'],
          rows: [
            ['F', 'F', 'F', 'F', 'V', 'F'],
            ['F', 'V', 'F', 'V', 'V', 'V'],
            ['V', 'F', 'F', 'V', 'F', 'V'],
            ['V', 'V', 'V', 'V', 'F', 'F'],
          ],
          caption: '`e` só é verdadeiro quando ambos são; `ou` é verdadeiro quando pelo menos um é; `xor` quando são diferentes.',
        },
        { type: 'widget', id: 'truth-table' },
        { type: 'h', text: 'Leis de De Morgan' },
        { type: 'p', text: 'Duas identidades que usarás constantemente para simplificar condições negadas:' },
        { type: 'code', lang: 'text', code: `nao (A e B)   ≡   nao A  ou  nao B
nao (A ou B)  ≡   nao A  e   nao B

Exemplo prático:
  "não é verdade que tem bilhete e é maior de idade"
   ≡ "não tem bilhete OU não é maior de idade"` },
        { type: 'callout', tone: 'info', title: 'Avaliação em curto-circuito', text: 'Quase todas as linguagens param de avaliar uma expressão lógica assim que o resultado é certo. Em `a <> nulo e a.nome = "Ana"`, se `a` for nulo a segunda parte nunca é avaliada — e é isso que evita o erro. A ordem das condições deixa de ser indiferente.' },
        { type: 'h', text: 'Condições legíveis' },
        { type: 'code', lang: 'portugol', code: `// difícil de ler
se nao (idade < 18) e nao (saldo <= 0) e nao (bloqueado) entao

// mais claro, com a mesma lógica
maiorDeIdade <- idade >= 18
temSaldo <- saldo > 0
se maiorDeIdade e temSaldo e nao bloqueado entao` },
      ],
    },
  ],
  quiz: [
    { id: 'l1', prompt: 'Qual é o resultado de `2 + 3 * 4 - 6 / 2`?', options: ['7', '11', '16', '4'], answer: 1, explain: 'Primeiro `3 * 4` = 12 e `6 / 2` = 3. Depois 2 + 12 − 3 = 11.' },
    { id: 'l2', prompt: 'Que valor tem `17 % 5`?', options: ['3', '3.4', '2', '85'], answer: 2, explain: 'O operador `%` devolve o resto da divisão inteira: 17 = 5 × 3 + 2, logo o resto é 2.' },
    { id: 'l3', prompt: 'Se A = verdadeiro e B = falso, quanto vale `nao (A e B) ou B`?', options: ['falso', 'verdadeiro', 'depende da linguagem', 'erro de tipos'], answer: 1, explain: '`A e B` = falso; `nao falso` = verdadeiro; `verdadeiro ou falso` = verdadeiro.' },
    { id: 'l4', prompt: 'Qual destes é o nome de variável mais adequado para guardar o número de tentativas falhadas de login?', options: ['`x`', '`num`', '`tentativasFalhadas`', '`dados2`'], answer: 2, explain: 'Um bom nome descreve o conteúdo sem obrigar a ler o resto do código.' },
    { id: 'l5', prompt: '`nao (A ou B)` é equivalente a…', options: ['`nao A ou nao B`', '`nao A e nao B`', '`A e B`', '`A ou nao B`'], answer: 1, explain: 'Segunda lei de De Morgan: negar uma disjunção transforma-a numa conjunção de negações.' },
    { id: 'l6', prompt: 'Numa linguagem com tipagem estática, um erro de tipo é detetado…', options: ['apenas quando o utilizador faz a ação', 'antes de o programa correr, na compilação', 'nunca', 'apenas em produção'], answer: 1, explain: 'É a principal vantagem: a classe inteira de erros de tipo desaparece antes da execução.' },
    { id: 'l7', prompt: 'Porque é que `preco * 1.23` é pior do que `preco * (1 + TAXA_IVA)`?', options: ['É matematicamente diferente', 'É mais lento', 'Esconde a intenção e obriga a caçar o número por todo o código quando a taxa mudar', 'Não há diferença'], answer: 2, explain: 'Chamam-se "números mágicos". Uma constante com nome documenta a intenção e centraliza a alteração.' },
    { id: 'l8', prompt: 'O que faz a avaliação em curto-circuito em `x <> nulo e x.tamanho > 0`?', options: ['Avalia sempre as duas partes', 'Se `x` for nulo, não avalia a segunda parte e evita o erro', 'Inverte a ordem das condições', 'Converte nulo em zero'], answer: 1, explain: 'Como `e` já não pode ser verdadeiro, a segunda condição não é avaliada. Inverter a ordem provocaria um erro.' },
  ],
  exercises: [
    { id: 'e5-1', difficulty: 1, kind: 'input', title: 'Precedência', statement: 'Calcula: `10 - 2 * 3 + 8 / 4`', accept: ['6'], hint: 'Multiplicação e divisão primeiro.', solution: '`2 * 3` = 6 e `8 / 4` = 2. Depois 10 − 6 + 2 = **6**.' },
    { id: 'e5-2', difficulty: 1, kind: 'input', title: 'Módulo', statement: 'Que expressão testa se um número `n` é múltiplo de 7? Escreve a condição usando o operador de resto (usa `n` e `%`).', accept: ['n%7=0', 'n%7==0'], hint: 'Múltiplo significa resto zero.', solution: '`n % 7 = 0` (ou `n % 7 == 0` na maioria das linguagens).' },
    { id: 'e5-3', difficulty: 2, kind: 'open', title: 'Traduz para lógica', statement: 'Escreve a condição para: "o cliente tem direito a portes grátis se a encomenda ultrapassar 50 € **ou** se for cliente premium, mas nunca se enviar para fora do país".', hint: 'A última parte é uma restrição que se aplica a ambos os casos.', solution: '`(total > 50 ou clientePremium) e nao envioInternacional`. Repara que os parênteses são obrigatórios: sem eles, `e` liga-se apenas a `clientePremium` e um cliente com encomenda de 60 € para o estrangeiro passaria a ter portes grátis.' },
    { id: 'e5-4', difficulty: 2, kind: 'open', title: 'Simplifica com De Morgan', statement: 'Simplifica `nao (idade < 18 ou nao temAutorizacao)` para uma forma sem a negação exterior.', solution: 'Aplicando De Morgan: `nao (idade < 18) e nao (nao temAutorizacao)` → `idade >= 18 e temAutorizacao`. Muito mais legível e é exatamente a mesma condição.' },
    { id: 'e5-5', difficulty: 2, kind: 'open', title: 'Troca de valores', statement: 'Tens `a = 5` e `b = 12`. Escreve os passos para trocar os valores usando uma variável auxiliar. Depois explica porque `a <- b` seguido de `b <- a` não funciona.', solution: 'Com auxiliar: `tmp <- a` (tmp = 5); `a <- b` (a = 12); `b <- tmp` (b = 5). Sem auxiliar não funciona porque `a <- b` destrói o valor original de `a`: quando se executa `b <- a`, `a` já vale 12, e ambas as variáveis ficam com 12. Alguns idiomas permitem `a, b <- b, a` (Python) ou a troca aritmética `a <- a + b; b <- a - b; a <- a - b`, que evita a auxiliar mas é menos legível e pode causar overflow.' },
    { id: 'e5-6', difficulty: 3, kind: 'open', title: 'Tabela verdade de um sistema real', statement: 'Um sistema de acesso a um edifício abre a porta se: o cartão for válido **e** (estiver dentro do horário **ou** a pessoa tiver autorização especial), **e** o alarme não estiver ativo. Constrói a tabela verdade com as 4 variáveis e conta em quantos casos a porta abre.', hint: 'São 2⁴ = 16 linhas. Usa o widget da tabela verdade para verificar.', solution: 'A condição é `cartaoValido e (dentroHorario ou autorizacaoEspecial) e nao alarmeAtivo`. Com 4 variáveis há 16 combinações. A porta abre quando: cartaoValido = V, alarmeAtivo = F, e pelo menos uma de (dentroHorario, autorizacaoEspecial) é V — ou seja, 3 combinações das duas variáveis do meio (VF, FV, VV). Total: **3 casos em 16**. Podes confirmar escrevendo `C e (H ou A) e nao AL` no widget da tabela verdade.' },
  ],
};
