import type { Module } from '../types';

export const m10: Module = {
  id: 'paradigmas',
  number: 10,
  title: 'Paradigmas, linguagens e boas práticas',
  subtitle: 'POO, programação funcional, código limpo, depuração e testes',
  icon: '🏛️',
  minutes: 55,
  goals: [
    'Distinguir os principais paradigmas de programação',
    'Compreender os quatro pilares da orientação a objetos',
    'Escolher uma primeira linguagem com critério',
    'Escrever código que outra pessoa consiga ler',
    'Depurar com método e escrever os primeiros testes',
  ],
  sections: [
    {
      id: 'paradigmas',
      title: 'Paradigmas de programação',
      blocks: [
        { type: 'p', text: 'Um **paradigma** é um estilo de organizar código — uma forma de pensar sobre o problema. As linguagens modernas são quase todas multiparadigma: podes escrever Python de forma imperativa, orientada a objetos ou funcional.' },
        {
          type: 'table',
          head: ['Paradigma', 'Ideia central', 'Linguagens', 'Bom para'],
          rows: [
            ['**Imperativo/procedimental**', 'Sequência de instruções que alteram o estado', 'C, Pascal, Go', 'Sistemas, desempenho, código próximo do hardware'],
            ['**Orientado a objetos**', 'Objetos que juntam dados e comportamento', 'Java, C#, Python, Kotlin', 'Sistemas grandes com muitos conceitos de domínio'],
            ['**Funcional**', 'Funções puras, dados imutáveis, composição', 'Haskell, Elixir, Scala, F#', 'Concorrência, transformação de dados, correção'],
            ['**Declarativo**', 'Descreve-se o resultado, não os passos', 'SQL, HTML, Prolog', 'Consultas, interfaces, regras'],
          ],
        },
        { type: 'code', lang: 'js', caption: 'o mesmo problema, três estilos', code: `const numeros = [1, 2, 3, 4, 5, 6];

// imperativo: descreve COMO
let soma = 0;
for (let i = 0; i < numeros.length; i++) {
  if (numeros[i] % 2 === 0) soma += numeros[i];
}

// funcional: descreve O QUÊ
const soma2 = numeros
  .filter(n => n % 2 === 0)
  .reduce((a, b) => a + b, 0);

// declarativo (SQL): descreve o resultado desejado
// SELECT SUM(valor) FROM numeros WHERE valor % 2 = 0;` },
      ],
    },
    {
      id: 'poo',
      title: 'Orientação a objetos',
      blocks: [
        { type: 'p', text: 'A ideia é modelar o problema com **objetos** — entidades que juntam dados (atributos) e comportamento (métodos). Uma **classe** é o molde; um **objeto** é uma instância concreta desse molde.' },
        { type: 'code', lang: 'java', code: `public class ContaBancaria {
    private String titular;      // atributos privados: encapsulamento
    private long saldoCentimos;

    public ContaBancaria(String titular) {
        this.titular = titular;
        this.saldoCentimos = 0;
    }

    public void depositar(long centimos) {          // comportamento
        if (centimos <= 0) {
            throw new IllegalArgumentException("valor tem de ser positivo");
        }
        this.saldoCentimos += centimos;
    }

    public long getSaldoCentimos() {                // acesso controlado
        return saldoCentimos;
    }
}

ContaBancaria conta = new ContaBancaria("Ana");   // objeto
conta.depositar(5000);                            // 50,00 €` },
        { type: 'h', text: 'Os quatro pilares' },
        {
          type: 'terms', items: [
            { term: 'Encapsulamento', def: 'Esconder o estado interno e expor apenas operações válidas. Ninguém consegue pôr o saldo negativo por acidente — tem de passar pelos métodos, que validam.' },
            { term: 'Abstração', def: 'Expor o que o objeto faz, não como o faz. Quem usa `conta.depositar()` não precisa de saber como o saldo é guardado.' },
            { term: 'Herança', def: 'Uma classe reutiliza e especializa outra: `ContaPoupanca extends ContaBancaria`. Usa com moderação — a composição costuma ser mais flexível.' },
            { term: 'Polimorfismo', def: 'O mesmo método comporta-se de forma diferente conforme o tipo concreto. `for (Forma f : formas) f.area();` funciona para círculos e retângulos sem `se` nenhum.' },
          ],
        },
        { type: 'callout', tone: 'tip', title: 'Composição em vez de herança', text: 'Hierarquias profundas de herança tornam-se rígidas e frágeis. A recomendação moderna é **compor**: em vez de `Carro extends Motor`, `Carro tem um Motor`. Mais fácil de testar, de trocar e de perceber.' },
      ],
    },
    {
      id: 'funcional',
      title: 'Noções de programação funcional',
      blocks: [
        { type: 'p', text: 'Mesmo que nunca escrevas Haskell, três ideias do paradigma funcional vão melhorar muito o teu código.' },
        {
          type: 'list', items: [
            '**Função pura**: para a mesma entrada devolve sempre a mesma saída e não altera nada fora dela. É trivial de testar e de paralelizar.',
            '**Imutabilidade**: em vez de alterar um objeto, cria-se um novo com a alteração. Elimina uma classe inteira de bugs de concorrência.',
            '**Funções de ordem superior**: `map`, `filter` e `reduce` — transformar, selecionar e agregar coleções sem escrever ciclos à mão.',
          ],
        },
        { type: 'code', lang: 'python', code: `# efeito colateral escondido: difícil de testar e perigoso
total = 0
def adicionar(valor):
    global total
    total += valor       # altera estado exterior

# função pura: entrada → saída, sem surpresas
def somar(total, valor):
    return total + valor

# map / filter / reduce
precos = [10, 25, 3, 48, 7]
com_iva = [p * 1.23 for p in precos]                # map
caros = [p for p in precos if p > 20]               # filter
total = sum(precos)                                 # reduce` },
        { type: 'callout', tone: 'key', text: 'Regra prática que serve em qualquer paradigma: mantém o **núcleo puro** (cálculo, regras de negócio, sem E/S) e empurra os efeitos — ficheiros, rede, base de dados, ecrã — para as **extremidades**. O núcleo passa a ser testável sem infraestrutura nenhuma.' },
      ],
    },
    {
      id: 'linguagens',
      title: 'Escolher a primeira linguagem',
      blocks: [
        {
          type: 'table',
          head: ['Linguagem', 'Ponto forte', 'Onde se usa', 'Como primeira linguagem'],
          rows: [
            ['**Python**', 'Sintaxe simples, ecossistema enorme', 'Dados, IA, automação, backend, ensino', 'Excelente — menos fricção, resultados rápidos'],
            ['**JavaScript**', 'Corre em qualquer browser', 'Web (frontend e backend com Node)', 'Boa — vês o resultado imediatamente'],
            ['**Java**', 'Rigor, tipagem forte, mercado grande', 'Empresas, Android, sistemas críticos', 'Boa — mais verbosa, ensina disciplina'],
            ['**C**', 'Controlo total sobre a memória', 'Sistemas operativos, embebidos', 'Difícil, mas ensina o que os outros escondem'],
            ['**Go**', 'Simples, rápida, concorrência fácil', 'Serviços em nuvem, infraestrutura', 'Boa segunda linguagem'],
            ['**SQL**', 'Consultar dados de forma declarativa', 'Toda e qualquer base de dados', 'Obrigatória, seja qual for a tua área'],
          ],
        },
        { type: 'callout', tone: 'info', title: 'A escolha importa menos do que parece', text: 'Os conceitos deste tutorial — variáveis, decisões, ciclos, funções, estruturas de dados — existem em todas elas. A primeira linguagem demora meses; a segunda demora semanas. Escolhe uma que te permita construir algo de que gostas e não mudes durante os primeiros seis meses.' },
      ],
    },
    {
      id: 'codigo-limpo',
      title: 'Código que outra pessoa consegue ler',
      blocks: [
        { type: 'p', text: 'Código é lido muito mais vezes do que escrito — e o leitor mais frequente serás tu, daqui a três meses, sem te lembrares de nada.' },
        {
          type: 'compare',
          left: { title: 'Práticas que valem a pena', items: ['Nomes que dizem a intenção: `calcularTotalComIva`', 'Funções curtas, com uma responsabilidade', 'Constantes com nome em vez de números soltos', 'Indentação consistente', 'Comentários que explicam o **porquê**', 'Tratar erros em vez de os ignorar'] },
          right: { title: 'Práticas que custam caro', items: ['`func1`, `dados`, `temp`, `x2`', 'Funções de 300 linhas que fazem tudo', '`if (estado == 3)` sem explicação', 'Copiar e colar blocos iguais em cinco sítios', 'Comentários que repetem o código', 'Apanhar exceções e não fazer nada'] },
        },
        { type: 'code', lang: 'js', caption: 'antes e depois', code: `// antes
function calc(a, b, c) {
  if (c == 1) { return a * b * 1.23; }
  else if (c == 2) { return a * b * 1.06; }
  else { return a * b; }
}

// depois
const IVA_NORMAL = 0.23;
const IVA_REDUZIDO = 0.06;

function calcularTotal(precoUnitario, quantidade, tipoDeIva) {
  const subtotal = precoUnitario * quantidade;
  switch (tipoDeIva) {
    case 'normal':   return subtotal * (1 + IVA_NORMAL);
    case 'reduzido': return subtotal * (1 + IVA_REDUZIDO);
    case 'isento':   return subtotal;
    default: throw new Error(\`tipo de IVA desconhecido: \${tipoDeIva}\`);
  }
}` },
        {
          type: 'terms', items: [
            { term: 'DRY', def: '*Don’t Repeat Yourself* — cada regra de negócio vive num único sítio. Se a mudares, mudas uma vez.' },
            { term: 'KISS', def: '*Keep It Simple* — a solução mais simples que resolve o problema é normalmente a certa.' },
            { term: 'YAGNI', def: '*You Aren’t Gonna Need It* — não construas para requisitos imaginários. Quase nunca chegam, e o código extra fica lá a pesar.' },
            { term: 'Princípio do menor espanto', def: 'Uma função chamada `obterUtilizador` não deve apagar nada. O nome é um contrato.' },
          ],
        },
      ],
    },
    {
      id: 'depuracao',
      title: 'Depuração e tratamento de erros',
      blocks: [
        { type: 'p', text: 'Vais passar mais tempo a perceber porque é que o código não funciona do que a escrevê-lo. Depurar é uma competência que se treina — e tem método.' },
        {
          type: 'steps', items: [
            { title: '1. Reproduz de forma fiável', text: 'Um bug que aparece "às vezes" é um bug que ainda não compreendeste. Encontra a entrada exata que o provoca.' },
            { title: '2. Lê a mensagem de erro', text: 'Toda ela, incluindo a linha e o *stack trace*. A resposta está lá em mais de metade dos casos.' },
            { title: '3. Isola', text: 'Reduz o programa ao mínimo que ainda mostra o problema. Comenta metade; se o erro desaparece, está na metade que comentaste.' },
            { title: '4. Formula uma hipótese e testa uma coisa de cada vez', text: 'Mudar três coisas ao mesmo tempo e ver que funcionou não ensina nada.' },
            { title: '5. Corrige a causa, não o sintoma', text: 'Se um valor vem nulo, percebe porquê. Acrescentar um `se` para o ignorar esconde o problema até ser mais caro.' },
          ],
        },
        {
          type: 'terms', items: [
            { term: 'print debugging', def: 'Imprimir valores em pontos-chave. Rudimentar, mas continua a ser a técnica mais usada do mundo — e nada tem de vergonhoso.' },
            { term: 'Depurador (debugger)', def: 'Permite parar a execução num ponto (*breakpoint*), avançar linha a linha e inspecionar variáveis. Aprender a usá-lo compensa em dias.' },
            { term: 'Rubber duck debugging', def: 'Explicar o problema em voz alta a um objeto. Funciona porque explicar obriga a articular suposições que não tinhas verificado.' },
            { term: 'Registo (logging)', def: 'Mensagens estruturadas com níveis (debug, info, warn, error). É o que te permite diagnosticar problemas em produção, onde não podes pôr breakpoints.' },
          ],
        },
        { type: 'code', lang: 'python', caption: 'tratar erros em vez de deixar rebentar', code: `def ler_configuracao(caminho):
    try:
        with open(caminho) as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("Ficheiro %s não existe; a usar valores por omissão", caminho)
        return CONFIGURACAO_POR_OMISSAO
    except json.JSONDecodeError as e:
        # aqui NÃO se usa valor por omissão: um ficheiro corrompido
        # deve falhar ruidosamente, não silenciosamente
        raise ConfiguracaoInvalida(f"{caminho} tem JSON inválido: {e}") from e` },
        { type: 'callout', tone: 'trap', title: 'O anti-padrão mais caro', text: 'Apanhar uma exceção e não fazer nada (`except: pass`). O erro continua a existir, mas agora é invisível — e vai reaparecer noutro sítio, dias depois, sem qualquer pista sobre a origem.' },
      ],
    },
    {
      id: 'testes',
      title: 'Testes',
      blocks: [
        { type: 'p', text: 'Um teste automático é código que verifica se o teu código faz o que devia. Escrevê-los parece trabalho a mais no início e poupa semanas depois — sobretudo quando alteras algo e queres saber se partiste alguma coisa.' },
        { type: 'code', lang: 'js', code: `// a função a testar
function calcularDesconto(total, ehPremium) {
  if (total < 0) throw new Error('total não pode ser negativo');
  if (ehPremium) return total * 0.85;
  if (total > 100) return total * 0.95;
  return total;
}

// os testes: nome descritivo, um comportamento por teste
test('cliente premium tem 15% de desconto', () => {
  expect(calcularDesconto(200, true)).toBe(170);
});

test('cliente normal acima de 100 tem 5%', () => {
  expect(calcularDesconto(200, false)).toBe(190);
});

test('cliente normal abaixo de 100 não tem desconto', () => {
  expect(calcularDesconto(50, false)).toBe(50);
});

test('total negativo é rejeitado', () => {
  expect(() => calcularDesconto(-1, false)).toThrow();
});` },
        {
          type: 'table',
          head: ['Tipo de teste', 'O que verifica', 'Velocidade', 'Quantidade'],
          rows: [
            ['**Unitário**', 'Uma função ou classe isolada', 'Milissegundos', 'Muitos'],
            ['**Integração**', 'Vários componentes juntos (código + base de dados)', 'Segundos', 'Alguns'],
            ['**Ponta a ponta**', 'O sistema completo pela interface do utilizador', 'Minutos', 'Poucos'],
          ],
          caption: 'A pirâmide de testes: muitos rápidos na base, poucos lentos no topo.',
        },
        { type: 'callout', tone: 'tip', title: 'Por onde começar', text: 'Não tentes testar tudo desde o primeiro dia. Escreve um teste sempre que corriges um bug — garante que ele nunca volta — e testa a lógica de negócio com casos de fronteira. Isso sozinho já apanha a maioria das regressões.' },
      ],
    },
  ],
  quiz: [
    { id: 'p1', prompt: 'O encapsulamento serve para…', options: ['tornar o programa mais rápido', 'esconder o estado interno e garantir que só é alterado por operações válidas', 'reduzir o tamanho do ficheiro', 'permitir herança múltipla'], answer: 1, explain: 'Protege os invariantes do objeto: o estado só muda através de métodos que validam.' },
    { id: 'p2', prompt: 'Uma função pura caracteriza-se por…', options: ['não ter parâmetros', 'devolver sempre o mesmo resultado para a mesma entrada e não alterar estado exterior', 'ser escrita em Haskell', 'ser mais curta que dez linhas'], answer: 1, explain: 'Determinismo e ausência de efeitos colaterais — o que a torna trivial de testar e de paralelizar.' },
    { id: 'p3', prompt: 'O princípio DRY diz que…', options: ['o código deve ser curto', 'cada regra deve existir num único sítio no sistema', 'não se devem usar bibliotecas', 'os testes são opcionais'], answer: 1, explain: 'Duplicar uma regra significa ter de a alterar em vários sítios — e esquecer-se de um deles.' },
    { id: 'p4', prompt: 'Qual é o problema de `except: pass`?', options: ['É lento', 'Esconde o erro sem o resolver, tornando o diagnóstico impossível mais tarde', 'Não compila', 'Consome muita memória'], answer: 1, explain: 'O erro deixa de ser visível mas continua a existir, e reaparece noutro sítio sem pista da origem.' },
    { id: 'p5', prompt: 'Numa pirâmide de testes saudável há…', options: ['muitos testes ponta a ponta e poucos unitários', 'muitos testes unitários e poucos ponta a ponta', 'apenas testes manuais', 'o mesmo número de cada tipo'], answer: 1, explain: 'Os unitários são rápidos e localizam o problema; os ponta a ponta são lentos e frágeis, mas dão confiança no todo.' },
    { id: 'p6', prompt: 'A recomendação moderna sobre herança é…', options: ['usar hierarquias o mais profundas possível', 'preferir composição, usando herança com moderação', 'nunca usar orientação a objetos', 'herdar sempre de pelo menos duas classes'], answer: 1, explain: 'Hierarquias profundas são rígidas e difíceis de alterar; a composição é mais flexível e testável.' },
    { id: 'p7', prompt: 'Ao depurar, a atitude mais produtiva é…', options: ['mudar várias coisas ao mesmo tempo até funcionar', 'reproduzir o erro de forma fiável, isolar e testar uma hipótese de cada vez', 'reescrever o módulo do zero', 'ignorar a mensagem de erro'], answer: 1, explain: 'Método vence sorte. Mudar várias coisas ao mesmo tempo não ensina qual delas era o problema.' },
  ],
  exercises: [
    { id: 'e10-1', difficulty: 1, kind: 'open', title: 'Melhora estes nomes', statement: 'Reescreve com nomes melhores: `int d;` (dias desde o registo), `função p(x)` (calcula preço com IVA), `bool f;` (indica se o pagamento foi confirmado), `lista l2` (produtos em promoção).', solution: '`int diasDesdeRegisto;` · `função calcularPrecoComIva(precoBase)` · `bool pagamentoConfirmado;` · `lista produtosEmPromocao`. Repara que os booleanos ganham em ter forma de afirmação verificável, e as listas em estar no plural.' },
    { id: 'e10-2', difficulty: 2, kind: 'open', title: 'Identifica os problemas', statement: 'Que problemas vês neste código?\n\n`function p(a,b,c){ if(c==1){return a*b*1.23} if(c==2){return a*b*1.06} return a*b }`', hint: 'Pensa em nomes, números mágicos e casos não previstos.', solution: 'Problemas: (1) nomes sem significado — `p`, `a`, `b`, `c` obrigam a ler todo o código para perceber; (2) números mágicos — 1.23 e 1.06 aparecem sem nome nem explicação, e mudar a taxa de IVA obriga a caçá-los; (3) o tipo é um inteiro sem significado — `1` e `2` deviam ser constantes ou uma enumeração; (4) o caso não previsto devolve silenciosamente o valor sem IVA em vez de assinalar erro; (5) não valida entradas negativas. A versão corrigida usa nomes descritivos, constantes nomeadas, uma enumeração para o tipo de IVA e lança erro no caso desconhecido.' },
    { id: 'e10-3', difficulty: 2, kind: 'open', title: 'Casos de teste', statement: 'Uma função `validarPassword(p)` exige: mínimo 8 caracteres, pelo menos um número e pelo menos uma maiúscula. Enumera pelo menos oito casos de teste, incluindo fronteiras.', solution: 'Casos válidos: "Password1" (típico); "Abcdefg1" (exatamente 8, a fronteira inferior válida). Casos inválidos: "" (vazio); "Abc1" (curta); "Abcdefg" (8 caracteres, sem número); "abcdefg1" (sem maiúscula); "ABCDEFG1" — válida, boa para confirmar que não se exige minúscula; "Abcdef1" (7 caracteres — fronteira imediatamente abaixo do mínimo). Vale ainda testar entradas fora do previsto: nulo, espaços apenas, caracteres acentuados e emojis (que contam como quantos caracteres?), e uma password muito longa. As fronteiras — 7 e 8 caracteres — são onde os bugs vivem.' },
    { id: 'e10-4', difficulty: 3, kind: 'open', title: 'Refatoração com responsabilidade única', statement: 'Uma função `processarEncomenda()` de 200 linhas: valida os dados, calcula preços, aplica descontos, grava na base de dados, envia email e escreve no log. Propõe uma decomposição e explica que benefícios concretos obténs.', solution: 'Decomposição: `validarEncomenda(dados) → resultado de validação`; `calcularPrecos(itens) → subtotal`; `aplicarDescontos(subtotal, cliente) → total`; `guardarEncomenda(encomenda) → id` (acesso a dados); `notificarCliente(encomenda)` (envio de email); o registo passa a ser transversal, feito por quem orquestra. Uma função `processarEncomenda` fica a coordenar estes passos em 15 linhas legíveis. Benefícios concretos: (1) as funções de cálculo passam a ser puras e testáveis sem base de dados nem servidor de email — os testes correm em milissegundos; (2) alterar a regra de descontos toca num único sítio; (3) uma falha no envio de email deixa de arriscar corromper a gravação, porque as fronteiras transacionais ficam explícitas; (4) o código passa a ler-se como a descrição do processo de negócio, o que reduz o tempo de integração de novos colegas.' },
  ],
};
