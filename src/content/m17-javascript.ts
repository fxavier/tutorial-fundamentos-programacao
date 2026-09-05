import type { Module } from '../types';

export const m17: Module = {
  id: 'javascript',
  number: 17,
  title: 'JavaScript moderno',
  subtitle: 'A linguagem da web, do browser ao servidor — sintaxe, tipos, funções e as suas armadilhas',
  icon: '🟨',
  minutes: 65,
  goals: [
    'Escrever e executar JavaScript moderno (ES2015+) no browser',
    'Escolher entre `const`, `let` e nunca `var`, e perceber porquê',
    'Dominar a coerção de tipos, `===` e os valores falsos',
    'Usar arrow functions, desestruturação, spread e encadeamento opcional',
    'Trabalhar com arrays e objetos pelos métodos que a linguagem já traz',
  ],
  sections: [
    {
      id: 'onde-corre',
      title: 'Onde é que o JavaScript corre',
      blocks: [
        { type: 'p', text: 'O JavaScript nasceu em 1995 para animar páginas web e é hoje a única linguagem que todos os browsers executam nativamente. Com o Node.js (módulo 20) saiu do browser e passou a correr também em servidores, ferramentas de linha de comandos e aplicações de secretária. É a linguagem mais usada do mundo, sobretudo por não haver alternativa no browser.' },
        {
          type: 'table',
          head: ['Ambiente', 'Motor', 'O que tem a mais', 'O que não tem'],
          rows: [
            ['Browser', 'V8 (Chrome), SpiderMonkey (Firefox), JSC (Safari)', '`document`, `window`, `fetch`, eventos do rato', 'Acesso a ficheiros do disco'],
            ['Node.js', 'V8', '`fs`, `http`, `process`, módulos do sistema', '`document`, `window`'],
            ['Deno / Bun', 'V8 / JavaScriptCore', 'TypeScript direto, segurança por omissão', 'Ecossistema mais pequeno'],
          ],
        },
        { type: 'callout', tone: 'key', text: 'A **linguagem** é a mesma em todo o lado: variáveis, funções, objetos, promessas. O que muda são as **APIs do ambiente**. Aprender JavaScript é aprender a linguagem uma vez e depois descobrir que APIs cada sítio oferece.' },
        { type: 'p', text: 'O laboratório abaixo corre o JavaScript no motor do próprio browser, dentro de um *web worker*. Não descarrega nada — ao contrário do laboratório de Python, funciona sem ligação à internet.' },
        { type: 'widget', id: 'js-lab', props: { set: 'basico' } },
        {
          type: 'table',
          head: ['Python', 'JavaScript', 'Nota'],
          rows: [
            ['`print(x)`', '`console.log(x)`', ''],
            ['`x = 5`', '`const x = 5;`', 'Declara-se sempre com `const` ou `let`'],
            ['Indentação delimita blocos', 'Chavetas `{ }` delimitam', 'A indentação é só estética'],
            ['`elif`', '`else if`', ''],
            ['`and`, `or`, `not`', '`&&`, `||`, `!`', ''],
            ['`True`, `False`, `None`', '`true`, `false`, `null`', 'Minúsculas'],
            ['`f"olá {nome}"`', '`` `olá ${nome}` ``', 'Template string, com crases'],
            ['`def f(x):`', '`function f(x) { }` ou `(x) => …`', ''],
            ['`len(v)`', '`v.length`', 'Propriedade, não função'],
            ['`for x in v:`', '`for (const x of v)`', '`in` em JS percorre **chaves**, não valores'],
          ],
        },
      ],
    },
    {
      id: 'variaveis',
      title: 'const, let e (nunca) var',
      blocks: [
        { type: 'code', lang: 'js', caption: 'as três formas, e a que não deves usar', code: `const taxa = 0.23;      // não se reatribui — a escolha por omissão
let contador = 0;       // reatribuível
contador += 1;

// taxa = 0.5;          // TypeError: Assignment to constant variable

var antigo = "evita";   // pré-2015: comporta-se de forma surpreendente

// const NÃO significa imutável — significa "este nome não muda de destino"
const config = { porta: 8080 };
config.porta = 3000;    // permitido: o objeto muda, o nome continua a apontar-lhe
console.log(config);
// config = {};         // isto é que dava erro` },
        {
          type: 'compare',
          left: { title: '`let` e `const` (usa estes)', items: ['Escopo de **bloco**: existem dentro das chavetas onde foram declarados', 'Redeclarar no mesmo escopo é erro', 'Usar antes da declaração dá `ReferenceError`', '`const` por omissão; `let` só quando reatribuis'] },
          right: { title: '`var` (não uses)', items: ['Escopo de **função**: escapa dos `if` e dos `for`', 'Redeclarar é aceite em silêncio', 'Usar antes da declaração dá `undefined` em vez de erro', 'Existe apenas por compatibilidade com código antigo'] },
        },
        { type: 'code', lang: 'js', caption: 'a diferença que morde', code: `function comVar() {
  if (true) { var x = "escapou"; }
  return x;              // funciona — var ignora o bloco
}

function comLet() {
  if (true) { let y = "preso"; }
  try { return y; } catch (e) { return e.constructor.name; }
}

console.log(comVar(), comLet());   // escapou ReferenceError` },
        { type: 'callout', tone: 'key', text: 'A regra prática, sem exceções úteis: **`const` sempre; `let` quando precisas mesmo de reatribuir; `var` nunca**. Isto elimina uma classe inteira de bugs e é o que qualquer revisor de código vai esperar.' },
      ],
    },
    {
      id: 'tipos',
      title: 'Tipos, coerção e igualdade',
      blocks: [
        { type: 'p', text: 'O JavaScript tem tipagem **dinâmica** (o tipo é do valor) e **fraca** (converte tipos sozinho quando lhe convém). A segunda parte é a origem da má fama da linguagem — e de quase todos os bugs de quem está a começar.' },
        {
          type: 'table',
          head: ['Tipo', 'Exemplo', '`typeof` devolve', 'Nota'],
          rows: [
            ['`number`', '`42`, `3.14`, `NaN`, `Infinity`', '`"number"`', 'Só existe um tipo numérico: tudo é float 64 bits'],
            ['`string`', '`"olá"`, `` `olá ${x}` ``', '`"string"`', 'Imutável, como em Python'],
            ['`boolean`', '`true`, `false`', '`"boolean"`', ''],
            ['`undefined`', 'variável declarada sem valor', '`"undefined"`', '"ainda não recebeu nada"'],
            ['`null`', '`null`', '`"object"` 🐛', '"não tem valor, de propósito". O `typeof` é um bug histórico'],
            ['`bigint`', '`9007199254740993n`', '`"bigint"`', 'Inteiros sem limite de precisão'],
            ['`symbol`', '`Symbol("id")`', '`"symbol"`', 'Chaves únicas, uso avançado'],
            ['`object`', '`{}`, `[]`, `function(){}`', '`"object"` / `"function"`', 'Arrays e funções também são objetos'],
          ],
        },
        { type: 'callout', tone: 'trap', title: 'Só existe um tipo de número', text: 'Não há inteiros separados: `1` e `1.0` são o mesmo valor, em vírgula flutuante de 64 bits (o IEEE 754 do módulo 3). Logo `0.1 + 0.2 === 0.3` é `false`, e inteiros acima de 2⁵³ perdem precisão. Para dinheiro, guarda **cêntimos como inteiro** — nunca euros como float.' },
        { type: 'h', text: '`==` contra `===`' },
        { type: 'code', lang: 'js', caption: 'porque é que se usa sempre ===', code: `console.log(1 == "1");        // true  — converte antes de comparar
console.log(1 === "1");       // false — compara valor E tipo
console.log(0 == false);      // true
console.log("" == 0);         // true
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(NaN === NaN);     // false! usa Number.isNaN(x)

// a única exceção defensável a "usa sempre ===":
const x = null;
if (x == null) console.log("apanha null E undefined de uma vez");` },
        { type: 'h', text: 'Valores falsos' },
        { type: 'p', text: 'Numa condição, apenas oito valores são falsos: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` e `NaN`. **Tudo o resto é verdadeiro** — incluindo `[]`, `{}` e `"0"`, o que surpreende quem vem de Python, onde a lista e o dicionário vazios são falsos.' },
        { type: 'code', lang: 'js', caption: '|| contra ??', code: `const config = { porta: 0, nome: "" };

console.log(config.porta || 8080);   // 8080 — o 0 é falso, e isto é um bug
console.log(config.porta ?? 8080);   // 0    — ?? só reage a null e undefined
console.log(config.nome || "sem nome");
console.log(config.nome ?? "sem nome");   // "" — mantém a string vazia` },
        { type: 'callout', tone: 'tip', text: 'Para valores por omissão usa `??` (*nullish coalescing*), não `||`. O `||` engole zeros e strings vazias, que muitas vezes são valores legítimos. É um dos bugs mais frequentes em código de configuração.' },
      ],
    },
    {
      id: 'funcoes',
      title: 'Funções',
      blocks: [
        { type: 'code', lang: 'js', caption: 'as formas de declarar uma função', code: `// declaração — sobe para o topo do escopo (hoisting)
function area(largura, altura = largura) {
  return largura * altura;
}

// expressão atribuída a uma const
const perimetro = function (l, a) { return 2 * (l + a); };

// arrow function — a forma moderna e curta
const dobro = (n) => n * 2;                       // retorno implícito
const saudar = (nome, s = "Olá") => \`\${s}, \${nome}!\`;
const ponto = (x, y) => ({ x, y });                // devolver objeto: entre ( )

// parâmetros rest e argumentos espalhados
const somar = (...numeros) => numeros.reduce((a, b) => a + b, 0);

console.log(area(3, 4), area(5));
console.log(dobro(21), saudar("Ana"), ponto(1, 2));
console.log(somar(1, 2, 3), Math.max(...[4, 8, 15]));` },
        {
          type: 'terms',
          items: [
            { term: 'Arrow function', def: 'Sintaxe curta `(a, b) => a + b`. Não tem `this` próprio nem `arguments` — herda-os do exterior (módulo 19).' },
            { term: 'Retorno implícito', def: 'Sem chavetas, o corpo da arrow é o valor devolvido. Com chavetas, é preciso `return`.' },
            { term: 'Parâmetro rest', def: '`...numeros` recolhe os argumentos restantes num array.' },
            { term: 'Spread', def: '`...array` espalha os elementos: `f(...v)`, `[...a, ...b]`, `{ ...obj }`.' },
            { term: 'Função de ordem superior', def: 'Função que recebe ou devolve outra função — a base de `map`, `filter` e `reduce`.' },
          ],
        },
        { type: 'callout', tone: 'trap', title: 'A arrow que devolve um objeto', text: '`() => { x: 1 }` devolve `undefined`: o `{` é lido como início de bloco e `x:` como uma etiqueta. Para devolver um objeto literal, envolve-o em parêntesis: `() => ({ x: 1 })`.' },
      ],
    },
    {
      id: 'arrays-objetos',
      title: 'Arrays e objetos',
      blocks: [
        { type: 'p', text: 'O array de JavaScript é a lista de Python: ordenado, mutável, de tamanho variável. O objeto é o dicionário — com a diferença de as chaves serem sempre strings (ou símbolos).' },
        {
          type: 'table',
          head: ['Método de array', 'Faz', 'Altera o original?'],
          rows: [
            ['`map(fn)`', 'Transforma cada elemento', 'não — devolve novo'],
            ['`filter(fn)`', 'Mantém os que passam no teste', 'não'],
            ['`reduce(fn, inicial)`', 'Reduz a um único valor', 'não'],
            ['`find(fn)` / `findIndex(fn)`', 'O primeiro que passa / o seu índice', 'não'],
            ['`some(fn)` / `every(fn)`', 'Algum? / todos?', 'não'],
            ['`includes(x)`', 'Contém o valor?', 'não'],
            ['`slice(a, b)`', 'Fatia (o `b` é excluído)', 'não'],
            ['`at(-1)`', 'Elemento pelo fim', 'não'],
            ['`push` / `pop` / `shift` / `unshift`', 'Acrescenta e remove nas pontas', '**sim**'],
            ['`sort(fn)` / `reverse()`', 'Ordena / inverte **no sítio**', '**sim**'],
            ['`splice(i, n, ...)`', 'Remove e insere no meio', '**sim**'],
          ],
        },
        { type: 'callout', tone: 'trap', title: '`sort()` ordena como texto', text: '`[10, 9, 100].sort()` devolve `[10, 100, 9]` — por omissão converte tudo para string e compara alfabeticamente. Para números é obrigatório passar o comparador: `sort((a, b) => a - b)`. E como ordena no sítio, copia antes: `[...v].sort(…)`.' },
        { type: 'code', lang: 'js', caption: 'desestruturação, spread e encadeamento opcional', code: `const aluno = { nome: "Rui", curso: "Info", notas: [14, 16] };

const { nome, curso: disciplina, email = "sem email" } = aluno;
const [primeira, ...restantes] = aluno.notas;
console.log(nome, disciplina, email, primeira, restantes);

const atualizado = { ...aluno, ano: 2 };          // cópia com um campo a mais
const semNotas = (({ notas, ...resto }) => resto)(aluno);
console.log(atualizado.ano, Object.keys(semNotas));

console.log(aluno.morada?.rua);                    // undefined, não rebenta
console.log(aluno.morada?.rua ?? "morada desconhecida");
console.log(aluno.calcularMedia?.());              // chama só se existir

// trocar valores sem auxiliar
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);` },
        { type: 'callout', tone: 'warn', title: 'Cópia superficial', text: '`{ ...obj }` e `[...arr]` copiam **um nível**. Os objetos e arrays lá dentro continuam a ser partilhados — alterar `copia.notas` altera `original.notas`. Para uma cópia profunda usa `structuredClone(obj)`.' },
      ],
    },
    {
      id: 'ciclos-erros',
      title: 'Ciclos e erros',
      blocks: [
        { type: 'code', lang: 'js', caption: 'as formas de percorrer', code: `const cores = ["azul", "verde", "vermelho"];

for (let i = 0; i < cores.length; i++) console.log(i, cores[i]);   // clássico
for (const cor of cores) console.log(cor);                          // valores
for (const [i, cor] of cores.entries()) console.log(i, cor);        // índice + valor
cores.forEach((cor, i) => console.log(i, cor));                     // método

const precos = { pao: 1.2, leite: 0.9 };
for (const chave in precos) console.log(chave);                     // CHAVES
for (const [k, v] of Object.entries(precos)) console.log(k, v);     // par` },
        { type: 'callout', tone: 'trap', text: '`for...in` percorre **chaves** (e também as herdadas do protótipo); `for...of` percorre **valores**. Num array, `for...in` dá-te os índices como strings — quase nunca é o que queres. Regra: `for...of` para arrays, `Object.entries` para objetos.' },
        { type: 'code', lang: 'js', caption: 'erros e try/catch', code: `function dividir(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("ambos os argumentos têm de ser números");
  }
  if (b === 0) throw new RangeError("divisão por zero");
  return a / b;
}

for (const args of [[10, 2], [10, 0], ["10", 2]]) {
  try {
    console.log(dividir(...args));
  } catch (e) {
    console.error(\`\${e.constructor.name}: \${e.message}\`);
  } finally {
    // corre sempre — com ou sem erro
  }
}` },
        {
          type: 'table',
          head: ['Erro', 'Significa', 'Causa típica'],
          rows: [
            ['`SyntaxError`', 'O código não é JavaScript válido', 'Chaveta ou parêntesis por fechar'],
            ['`ReferenceError`', 'Nome não definido', 'Erro de escrita, ou `let` usado antes da declaração'],
            ['`TypeError`', 'O valor não é do tipo esperado', '`undefined.length`, chamar algo que não é função'],
            ['`RangeError`', 'Valor fora do intervalo permitido', 'Recursão infinita, `new Array(-1)`'],
            ['`undefined is not a function`', 'Escreveste mal o nome do método', '`arr.lenght`, `str.tolowercase()`'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'O erro nº 1 em JavaScript', text: '`Cannot read properties of undefined (reading "x")` significa que a coisa à esquerda do ponto é `undefined`. Não caces o `x` — descobre porque é que o objeto não existe. `console.log` do objeto antes da linha do erro resolve quase sempre.' },
      ],
    },
  ],
  quiz: [
    { id: 'js1', prompt: 'Qual é a diferença entre `let` e `var`?', options: ['Nenhuma, `let` é só mais moderno', '`let` tem escopo de bloco, `var` tem escopo de função', '`var` é mais rápido', '`let` não pode ser reatribuído'], answer: 1, explain: 'Um `var` declarado dentro de um `if` continua a existir fora dele; um `let` não. `const` é que não pode ser reatribuído — `let` pode.' },
    { id: 'js2', prompt: 'Que valor tem `0 == false`?', options: ['`true`', '`false`', '`undefined`', 'Erro'], answer: 0, explain: 'O `==` converte antes de comparar, e `false` converte para `0`. Com `===` seria `false`. É a razão de se usar sempre `===`.' },
    { id: 'js3', prompt: 'Qual destes valores é **verdadeiro** numa condição?', options: ['`0`', '`""`', '`[]`', '`NaN`'], answer: 2, explain: 'Um array vazio é um objeto, e todos os objetos são verdadeiros. É uma diferença importante face a Python, onde `[]` é falso.' },
    { id: 'js4', prompt: 'O que devolve `[10, 9, 100].sort()`?', options: ['`[9, 10, 100]`', '`[10, 100, 9]`', '`[100, 10, 9]`', 'Erro'], answer: 1, explain: 'Sem comparador, o `sort` converte tudo para string: `"10" < "100" < "9"`. Para números é obrigatório `sort((a, b) => a - b)`.' },
    { id: 'js5', prompt: 'Porque é que se prefere `??` a `||` para valores por omissão?', options: ['`??` é mais rápido', '`||` substitui também `0` e `""`, que podem ser valores legítimos', '`||` não funciona com objetos', 'Não há diferença'], answer: 1, explain: '`||` reage a qualquer valor falso; `??` só a `null` e `undefined`. `config.porta || 8080` transforma a porta 0 em 8080 sem avisar.' },
    { id: 'js6', prompt: 'Que faz `const copia = { ...original }` quando `original` tem um array lá dentro?', options: ['Copia tudo em profundidade', 'Copia um nível: o array continua partilhado', 'Não copia nada', 'Dá erro'], answer: 1, explain: 'O spread faz cópia superficial. Alterar `copia.lista` altera `original.lista`. Para copiar em profundidade usa `structuredClone`.' },
    { id: 'js7', prompt: 'Num array, o que percorre `for (const x in arr)`?', options: ['Os valores', 'Os índices, como strings', 'Os pares índice/valor', 'Nada'], answer: 1, explain: '`for...in` percorre chaves — num array, os índices como strings. Para os valores usa `for...of`.' },
    { id: 'js8', prompt: 'Que tipo devolve `typeof null`?', options: ['`"null"`', '`"undefined"`', '`"object"`', '`"boolean"`'], answer: 2, explain: 'É um bug da primeira versão da linguagem, mantido por compatibilidade. Para testar use-se `x === null`, ou `x == null` para apanhar também `undefined`.' },
  ],
  exercises: [
    {
      id: 'e17-1', difficulty: 1, kind: 'predict', lang: 'js', title: 'Coerção',
      statement: 'Escreve a saída, uma linha por `console.log`.',
      code: `console.log(1 + "1");
console.log("3" * "4");
console.log(1 === "1");
console.log([] + {});`,
      accept: ['11 12 false [object Object]'],
      hint: 'O `+` com uma string concatena; `*` não tem versão para texto, por isso converte para número.',
      solution: '`11`, `12`, `false`, `[object Object]`. O `+` é ambíguo: com uma string concatena, e por isso `1 + "1"` dá `"11"`. Os outros operadores aritméticos só sabem trabalhar com números e convertem, logo `"3" * "4"` dá `12`.',
    },
    {
      id: 'e17-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'Escopo de bloco',
      statement: 'Que valores são impressos?',
      code: `let x = 1;
{
  let x = 2;
  console.log(x);
}
console.log(x);

var y = 1;
{
  var y = 2;
}
console.log(y);`,
      accept: ['2 1 2'],
      hint: '`let` cria uma variável nova dentro das chavetas; `var` não.',
      solution: '`2`, `1`, `2`. O `let` interior é uma variável diferente, que só existe dentro do bloco — por isso o `x` exterior fica intacto. Com `var` não há bloco nenhum: é sempre a mesma variável, e o valor 2 escapa.',
    },
    {
      id: 'e17-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'Ordenar números',
      statement: 'Cuidado com o `sort` sem comparador.',
      code: `const v = [10, 9, 100, 1];
console.log([...v].sort());
console.log([...v].sort((a, b) => a - b));`,
      accept: ['[ 1, 10, 100, 9 ] [ 1, 9, 10, 100 ]', '[1, 10, 100, 9] [1, 9, 10, 100]'],
      hint: 'Sem comparador, o `sort` compara as representações em texto.',
      solution: '`[ 1, 10, 100, 9 ]` e depois `[ 1, 9, 10, 100 ]`. Sem comparador o `sort` ordena alfabeticamente: `"1" < "10" < "100" < "9"`. É o erro mais comum com arrays de números.',
    },
    {
      id: 'e17-4', difficulty: 2, kind: 'predict', lang: 'js', title: '|| contra ??',
      statement: 'Que valores são impressos?',
      code: `const config = { porta: 0, nome: "", ativo: false };
console.log(config.porta || 8080, config.porta ?? 8080);
console.log(config.nome || "anónimo", config.nome ?? "anónimo");
console.log(config.ativo ?? true);`,
      accept: ['8080 0 anónimo  false', '8080 0 anónimo "" false'],
      hint: '`??` só substitui `null` e `undefined`; a string vazia sobrevive.',
      solution: 'Imprime `8080 0`, depois `anónimo` seguido de uma string vazia, e por fim `false`. O `||` substitui qualquer valor falso — incluindo o `0` e o `""`, que aqui são valores legítimos. O `??` só reage a `null` e `undefined`.',
    },
    {
      id: 'e17-5', difficulty: 2, kind: 'code', lang: 'js', title: 'Estatísticas de um array',
      statement: 'No laboratório, escreve uma função `estatisticas(numeros)` que devolva um objeto com `n`, `soma`, `media`, `minimo`, `maximo` e `ordenados` (uma cópia ordenada crescente). Trata o caso do array vazio devolvendo `null`. Testa com `[14, 9, 18, 11, 20]` e com `[]`.',
      hint: 'Usa `reduce` para a soma, `Math.min(...v)` para o mínimo e `[...v].sort((a, b) => a - b)` para não estragares o original.',
      solution: `function estatisticas(numeros) {
  if (numeros.length === 0) return null;
  const soma = numeros.reduce((a, b) => a + b, 0);
  return {
    n: numeros.length,
    soma,
    media: Number((soma / numeros.length).toFixed(2)),
    minimo: Math.min(...numeros),
    maximo: Math.max(...numeros),
    ordenados: [...numeros].sort((a, b) => a - b),
  };
}

const v = [14, 9, 18, 11, 20];
console.log(estatisticas(v));
console.log("original intacto:", v);
console.log(estatisticas([]));`,
    },
    {
      id: 'e17-6', difficulty: 3, kind: 'code', lang: 'js', title: 'Agrupar e resumir',
      statement: 'Dado um array de objetos `{ loja, mes, valor }`, escreve `resumo(vendas)` que devolva um objeto com o total por loja, e `melhorLoja(vendas)` que devolva o nome da loja com maior total. Não uses ciclos `for` — só métodos de array.',
      hint: '`reduce` com um objeto como acumulador para agrupar; `Object.entries(...).sort(...)` para encontrar o máximo.',
      solution: `const vendas = [
  { loja: "Lisboa", mes: "jan", valor: 1200 },
  { loja: "Porto", mes: "jan", valor: 800 },
  { loja: "Lisboa", mes: "fev", valor: 1500 },
  { loja: "Faro", mes: "fev", valor: 400 },
  { loja: "Porto", mes: "fev", valor: 950 },
];

const resumo = (v) => v.reduce((acc, x) => ({ ...acc, [x.loja]: (acc[x.loja] ?? 0) + x.valor }), {});

const melhorLoja = (v) => Object.entries(resumo(v)).sort((a, b) => b[1] - a[1])[0][0];

console.log(resumo(vendas));
console.log("melhor:", melhorLoja(vendas));
console.log("total:", vendas.reduce((s, x) => s + x.valor, 0));`,
    },
  ],
};
