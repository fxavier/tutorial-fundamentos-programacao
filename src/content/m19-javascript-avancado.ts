import type { Module } from '../types';

export const m19: Module = {
  id: 'javascript-avancado',
  number: 19,
  title: 'JavaScript avançado',
  subtitle: 'Closures, `this`, protótipos, estilo funcional, módulos — e uma introdução ao TypeScript',
  icon: '🧠',
  minutes: 70,
  goals: [
    'Explicar o que é uma closure e usá-la para guardar estado privado',
    'Prever o valor de `this` em cada forma de chamada',
    'Perceber a cadeia de protótipos por baixo das classes',
    'Escrever transformações de dados com `map`, `filter` e `reduce`, sem mutação',
    'Distinguir ESM de CommonJS e ler um `package.json`',
    'Perceber o que o TypeScript acrescenta e porque é que este projeto o usa',
  ],
  sections: [
    {
      id: 'closures',
      title: 'Closures e escopo',
      blocks: [
        { type: 'p', text: 'Uma **closure** é uma função que se lembra do ambiente onde foi criada, mesmo depois de esse ambiente ter terminado. É o mecanismo que dá estado privado ao JavaScript e está por baixo de quase todos os padrões da linguagem — módulos, memoização, *event handlers*, funções parcialmente aplicadas.' },
        { type: 'code', lang: 'js', caption: 'estado privado sem classes', code: `function contador(inicio = 0) {
  let n = inicio;                    // ninguém lá chega de fora
  return {
    incrementar: () => ++n,
    decrementar: () => --n,
    valor: () => n,
  };
}

const a = contador(), b = contador(10);
a.incrementar(); a.incrementar(); b.decrementar();
console.log(a.valor(), b.valor());   // 2 9 — estados independentes
console.log(a.n);                    // undefined: n não é acessível` },
        { type: 'widget', id: 'js-lab', props: { set: 'avancado' } },
        { type: 'h', text: 'A armadilha do `var` num ciclo' },
        { type: 'code', lang: 'js', caption: 'a pergunta de entrevista clássica', code: `const comVar = [], comLet = [];

for (var i = 0; i < 3; i++) comVar.push(() => i);
for (let j = 0; j < 3; j++) comLet.push(() => j);

console.log(comVar.map((f) => f()));   // [3, 3, 3]
console.log(comLet.map((f) => f()));   // [0, 1, 2]` },
        { type: 'callout', tone: 'key', text: 'Com `var` existe **uma só** variável `i`, partilhada pelas três funções; quando elas correm, o ciclo já terminou e `i` vale 3. Com `let`, cada iteração cria uma ligação nova, e cada função fecha sobre a sua. É a explicação mais curta de porque é que `let` substituiu `var`.' },
        { type: 'code', lang: 'js', caption: 'memoização: uma closure a guardar resultados', code: `function memoizar(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}

const fib = memoizar((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
console.log(fib(40));      // instantâneo; sem cache seriam mil milhões de chamadas` },
        { type: 'callout', tone: 'warn', title: 'Closures também seguram memória', text: 'Enquanto a função devolvida existir, tudo aquilo a que ela fecha fica vivo. Uma closure sobre um array enorme guardado num *event listener* que nunca se remove é uma fuga de memória — o motivo mais comum de páginas que vão ficando lentas.' },
      ],
    },
    {
      id: 'this',
      title: 'O valor de `this`',
      blocks: [
        { type: 'p', text: 'Ao contrário de quase todas as linguagens, em JavaScript o `this` **não** depende de onde a função foi escrita — depende de **como foi chamada**. Saber as quatro regras evita a maior parte dos bugs com objetos e callbacks.' },
        {
          type: 'table',
          head: ['Forma de chamada', 'Exemplo', '`this` é'],
          rows: [
            ['Como método', '`obj.f()`', '`obj` — quem está antes do ponto'],
            ['Solta', '`const g = obj.f; g()`', '`undefined` (em modo estrito)'],
            ['Com `new`', '`new F()`', 'O objeto acabado de criar'],
            ['Explícita', '`f.call(x)`, `f.apply(x)`, `f.bind(x)`', '`x`'],
            ['Arrow function', '`() => this`', 'O `this` de fora — a arrow não tem `this` próprio'],
          ],
        },
        { type: 'code', lang: 'js', caption: 'o método que perde o dono', code: `const contador = {
  n: 0,
  incrementar() { this.n += 1; return this.n; },
};

console.log(contador.incrementar());      // 1 — this é contador

const solto = contador.incrementar;
try { solto(); } catch (e) { console.log("erro:", e.constructor.name); }

const preso = contador.incrementar.bind(contador);
console.log(preso());                      // 2 — this fixado para sempre` },
        { type: 'callout', tone: 'trap', title: 'O `this` perdido no callback', text: '`setTimeout(obj.metodo, 100)` passa a função sem o dono: quando correr, `this` já não é `obj`. As soluções são `setTimeout(() => obj.metodo(), 100)` — a arrow preserva o `this` do sítio onde foi escrita — ou `obj.metodo.bind(obj)`.' },
        { type: 'code', lang: 'js', caption: 'arrow como campo de classe: o padrão moderno', code: `class Temporizador {
  segundos = 0;

  // método normal: perde o this quando passado como callback
  tique() { this.segundos += 1; }

  // campo com arrow: o this fica preso à instância
  tiqueSeguro = () => { this.segundos += 1; };
}

const t = new Temporizador();
const f1 = t.tique, f2 = t.tiqueSeguro;
try { f1(); } catch (e) { console.log("tique solto:", e.constructor.name); }
f2();
console.log(t.segundos);` },
      ],
    },
    {
      id: 'prototipos',
      title: 'Protótipos, classes e herança',
      blocks: [
        { type: 'p', text: 'O JavaScript não tem herança por classes — tem herança por **protótipos**. Cada objeto tem uma ligação interna a outro objeto (o seu protótipo); quando uma propriedade não é encontrada, a procura sobe por essa cadeia até `null`. As `class` de 2015 são açúcar sintático por cima deste mecanismo.' },
        { type: 'code', lang: 'js', caption: 'a cadeia por baixo', code: `class Animal {
  constructor(nome) { this.nome = nome; }
  som() { return "..."; }
  falar() { return \`\${this.nome} faz \${this.som()}\`; }
}

class Cao extends Animal {
  som() { return "ão ão"; }
}

const rex = new Cao("Rex");
console.log(rex.falar());

console.log(Object.getPrototypeOf(rex) === Cao.prototype);
console.log(Object.getPrototypeOf(Cao.prototype) === Animal.prototype);
console.log(rex.hasOwnProperty("nome"), rex.hasOwnProperty("som"));
console.log(rex instanceof Cao, rex instanceof Animal, rex instanceof Object);` },
        { type: 'callout', tone: 'key', text: '`nome` está no **objeto** (foi posto pelo construtor); `som` e `falar` estão no **protótipo**, partilhados por todas as instâncias. É por isso que criar mil objetos não duplica os métodos mil vezes.' },
        { type: 'code', lang: 'js', caption: 'o que as classes modernas trazem', code: `class Conta {
  static taxa = 0.01;              // propriedade de classe
  #saldo = 0;                      // campo privado a sério (o # faz parte do nome)

  constructor(titular) { this.titular = titular; }

  get saldo() { return this.#saldo; }                 // getter
  set saldo(v) {                                      // setter com validação
    if (v < 0) throw new RangeError("saldo negativo");
    this.#saldo = v;
  }

  depositar(v) { this.saldo = this.#saldo + v; return this; }

  static comBonus(titular) { return new Conta(titular).depositar(100); }
  toString() { return \`\${this.titular}: \${this.#saldo} €\`; }
}

const c = Conta.comBonus("Ana").depositar(50);
console.log(String(c), Conta.taxa);
try { c.saldo = -1; } catch (e) { console.log(e.message); }
console.log(Object.keys(c));      // o #saldo não aparece` },
        {
          type: 'compare',
          left: { title: 'Herança (`extends`)', items: ['Só quando "X **é um** Y" é verdade', 'Partilha implementação pela cadeia', 'Duas ou três camadas, no máximo', '`super()` obrigatório antes de usar `this`'] },
          right: { title: 'Composição (a escolha por omissão)', items: ['"X **tem um** Y": guarda-o como campo', 'Fácil de trocar e de testar isoladamente', 'Sem cadeias frágeis a partir de mudanças no pai', 'Em JS, muitas vezes basta uma função e um objeto'] },
        },
      ],
    },
    {
      id: 'funcional',
      title: 'Estilo funcional e imutabilidade',
      blocks: [
        { type: 'p', text: 'As funções em JavaScript são valores: podem ser guardadas, passadas e devolvidas. Isso torna natural um estilo em que os dados **não se alteram** — cada transformação devolve uma estrutura nova. Menos estado partilhado significa menos bugs difíceis de reproduzir.' },
        { type: 'code', lang: 'js', caption: 'map, filter, reduce', code: `const alunos = [
  { nome: "Ana", curso: "Info", nota: 14 },
  { nome: "Rui", curso: "Gestão", nota: 9 },
  { nome: "Sara", curso: "Info", nota: 18 },
  { nome: "Inês", curso: "Info", nota: 20 },
];

console.log(alunos.filter((a) => a.nota >= 10).map((a) => a.nome));
console.log(alunos.reduce((s, a) => s + a.nota, 0) / alunos.length);

// agrupar: o reduce com um objeto como acumulador
const porCurso = alunos.reduce((acc, a) => {
  (acc[a.curso] ??= []).push(a.nome);
  return acc;
}, {});
console.log(porCurso);

// encadear leituras é o que torna isto legível
const topInfo = alunos
  .filter((a) => a.curso === "Info")
  .sort((x, y) => y.nota - x.nota)
  .slice(0, 2)
  .map((a) => \`\${a.nome} (\${a.nota})\`);
console.log(topInfo);` },
        { type: 'code', lang: 'js', caption: 'atualizar sem mutar', code: `const estado = { utilizador: { nome: "Ana", ativo: true }, itens: [1, 2] };

// errado: muda o objeto original, que pode estar a ser usado noutro sítio
// estado.itens.push(3);

const novo = {
  ...estado,
  utilizador: { ...estado.utilizador, ativo: false },   // um nível de cada vez
  itens: [...estado.itens, 3],
};

console.log(estado.itens, novo.itens);
console.log(estado.utilizador.ativo, novo.utilizador.ativo);

// cuidado: o spread é superficial
const raso = { ...estado };
raso.itens.push(99);
console.log("o original mudou:", estado.itens);

const profundo = structuredClone(estado);
profundo.itens.push(-1);
console.log("agora não:", estado.itens, profundo.itens);` },
        { type: 'callout', tone: 'tip', title: 'Funções puras', text: 'Uma função pura devolve sempre o mesmo resultado para os mesmos argumentos e não mexe em nada de fora. São as mais fáceis de testar (sem preparação nem limpeza), de memoizar e de raciocinar. Não é preciso que o programa inteiro seja puro — basta empurrar os efeitos (escrita em disco, rede, `console`) para as bordas.' },
      ],
    },
    {
      id: 'modulos',
      title: 'Módulos, npm e ferramentas',
      blocks: [
        { type: 'p', text: 'Durante quinze anos o JavaScript não teve módulos. O Node inventou o **CommonJS** (`require`/`module.exports`) e a linguagem acabou por adotar o **ESM** (`import`/`export`), hoje o padrão em todo o lado.' },
        {
          type: 'compare',
          left: { title: 'ESM — o padrão', items: ['`import { x } from "./a.js"`', '`export function f() {}` / `export default`', 'Estático: as ferramentas sabem o que é usado (*tree shaking*)', 'Assíncrono, e permite `await` no topo', 'Ficheiros `.mjs`, ou `"type": "module"` no package.json'] },
          right: { title: 'CommonJS — o legado do Node', items: ['`const { x } = require("./a")`', '`module.exports = { f }`', 'Dinâmico: o `require` pode estar dentro de um `if`', 'Síncrono', 'Ficheiros `.cjs`, ou omissão do `type`'] },
        },
        { type: 'code', lang: 'js', caption: 'as duas sintaxes lado a lado', code: `// ---- ESM (matematica.js)
// export const somar = (a, b) => a + b;
// export default function media(v) { return v.reduce(somar, 0) / v.length; }
//
// ---- e a usar:
// import media, { somar } from "./matematica.js";
// import * as mat from "./matematica.js";
// const { somar } = await import("./matematica.js");   // dinâmico

// ---- CommonJS (o que o laboratório executa)
const somar = (a, b) => a + b;
module.exports = { somar };
console.log(typeof module.exports.somar);` },
        { type: 'h', text: 'O `package.json`' },
        { type: 'code', lang: 'js', caption: 'o ficheiro que descreve um projeto', code: `{
  "name": "o-meu-projeto",
  "version": "1.0.0",
  "type": "module",              // trata os .js como ESM
  "scripts": {
    "dev": "vite",               // corre com: npm run dev
    "test": "node --test"
  },
  "dependencies": {              // precisas delas para correr
    "react": "^19.1.1"
  },
  "devDependencies": {           // só para desenvolver e construir
    "vite": "^7.1.5"
  }
}` },
        {
          type: 'table',
          head: ['Intervalo', 'Aceita', 'Exemplo com 1.4.2'],
          rows: [
            ['`1.4.2`', 'Exatamente essa versão', '1.4.2'],
            ['`~1.4.2`', 'Correções (o último número)', '1.4.2 a 1.4.x'],
            ['`^1.4.2`', 'Compatíveis (não muda o primeiro)', '1.4.2 a 1.x.x'],
            ['`*`', 'Qualquer uma — nunca faças isto', 'tudo'],
          ],
        },
        { type: 'callout', tone: 'key', title: 'Versionamento semântico', text: '`MAIOR.MENOR.CORREÇÃO`: a **correção** repara sem mudar nada, a **menor** acrescenta sem partir, a **maior** parte compatibilidade. O `package-lock.json` guarda as versões exatas que foram efetivamente instaladas — é ele que faz `npm ci` reproduzir a mesma árvore em qualquer máquina, e por isso vai para o controlo de versões.' },
        { type: 'callout', tone: 'warn', title: 'Cada dependência é código de outra pessoa no teu programa', text: 'Um projeto médio tem centenas de dependências indiretas. Antes de instalar uma biblioteca para algo que se resolve em dez linhas, escreve as dez linhas. `npm audit` mostra vulnerabilidades conhecidas; `npm ls <pacote>` mostra quem a puxou.' },
      ],
    },
    {
      id: 'typescript',
      title: 'TypeScript: JavaScript com tipos',
      blocks: [
        { type: 'p', text: 'O TypeScript é JavaScript com um sistema de tipos por cima. Não corre em lado nenhum: um compilador verifica os tipos e **apaga-os**, produzindo JavaScript normal. Todo o JavaScript válido é TypeScript válido — a adoção pode ser gradual, ficheiro a ficheiro.' },
        { type: 'code', lang: 'js', caption: 'o mesmo código, com e sem tipos', code: `// JavaScript: o erro só aparece em execução, talvez em produção
function area(largura, altura) {
  return largura * altura;
}
area("3", 4);          // "3" * 4 dá 12 por coerção... e area(3) dá NaN

// TypeScript: o erro aparece enquanto escreves
// function area(largura: number, altura: number): number {
//   return largura * altura;
// }
// area("3", 4);       // Erro: 'string' não é atribuível a 'number'
// area(3);            // Erro: esperava 2 argumentos, recebeu 1` },
        { type: 'code', lang: 'js', caption: 'as construções que se usam todos os dias', code: `// type e interface descrevem a forma dos dados
// interface Aluno {
//   nome: string;
//   nota: number;
//   email?: string;          // opcional
//   readonly id: number;     // não se altera depois de criado
// }
//
// type Estado = "pendente" | "ativo" | "cancelado";   // união literal
// type Resposta<T> = { ok: true; dados: T } | { ok: false; erro: string };
//
// function media(alunos: Aluno[]): number {
//   return alunos.reduce((s, a) => s + a.nota, 0) / alunos.length;
// }
//
// // o compilador obriga a tratar os dois casos:
// function mostrar(r: Resposta<Aluno[]>) {
//   if (r.ok) console.log(media(r.dados));
//   else console.error(r.erro);
// }

console.log("Os tipos desaparecem na compilação — em execução isto é JavaScript normal.");` },
        {
          type: 'compare',
          left: { title: 'O que ganhas', items: ['Erros de tipo apanhados antes de correr', 'Autocompletar que sabe mesmo o que existe', 'Refatorações seguras: mudar um nome atualiza tudo', 'Os tipos documentam a intenção e não desatualizam'] },
          right: { title: 'O que pagas', items: ['Um passo de compilação e configuração', 'Sintaxe a mais para aprender', 'Tipos de bibliotecas antigas por vezes maus ou inexistentes', 'Em execução não há verificação nenhuma: dados externos continuam a precisar de validação'] },
        },
        { type: 'callout', tone: 'key', title: 'Este próprio tutorial é TypeScript', text: 'Os módulos que estás a ler são objetos verificados contra a interface `Module` em `src/types.ts`. Um erro de escrita num tipo de bloco, uma secção sem `id` ou um widget inexistente falham a compilação — o conteúdo nunca chega ao browser partido. É o argumento prático a favor dos tipos: transformam uma classe inteira de erros em erros de compilação.' },
        { type: 'callout', tone: 'trap', text: 'O `any` desliga o verificador para aquele valor e contamina tudo o que toca. Quando não souberes o tipo, usa `unknown`: obriga-te a verificar antes de usar, que é exatamente o que devias estar a fazer com dados vindos da rede.' },
      ],
    },
  ],
  quiz: [
    { id: 'av1', prompt: 'O que é uma closure?', options: ['Uma função sem nome', 'Uma função que se lembra do escopo onde foi criada', 'Um objeto com métodos privados', 'Uma função assíncrona'], answer: 1, explain: 'A função continua a ter acesso às variáveis do ambiente onde foi definida, mesmo depois de essa função exterior ter terminado. É o que permite estado privado sem classes.' },
    { id: 'av2', prompt: 'Porque é que `for (var i…)` com três funções guardadas imprime `3 3 3`?', options: ['Porque as funções correm ao mesmo tempo', 'Porque existe uma só variável `i`, partilhada, e o ciclo já terminou', 'Porque `var` copia o valor', 'Porque falta um `await`'], answer: 1, explain: 'O `var` tem escopo de função: as três closures fecham sobre a mesma variável, que no fim do ciclo vale 3. Com `let` cada iteração cria uma ligação nova.' },
    { id: 'av3', prompt: 'Em `const g = obj.metodo; g();` (modo estrito), quanto vale `this`?', options: ['`obj`', '`undefined`', '`globalThis`', 'A função `g`'], answer: 1, explain: 'O `this` depende de como a função é chamada. Chamada solta, perde o dono. Resolve-se com `bind(obj)` ou com uma arrow que envolva a chamada.' },
    { id: 'av4', prompt: 'Onde vive o método `som()` de `class Cao`?', options: ['Em cada instância de Cao', 'Em `Cao.prototype`, partilhado por todas as instâncias', 'Numa cópia por chamada', 'No objeto global'], answer: 1, explain: 'Os métodos ficam no protótipo; só os campos definidos no construtor ficam em cada objeto. É por isso que criar muitas instâncias não duplica os métodos.' },
    { id: 'av5', prompt: 'O que faz `{ ...obj }` a um array que esteja dentro de `obj`?', options: ['Copia-o também', 'Partilha a mesma referência', 'Converte-o em objeto', 'Remove-o'], answer: 1, explain: 'O spread é uma cópia superficial: só o primeiro nível é novo. Para copiar em profundidade usa-se `structuredClone`.' },
    { id: 'av6', prompt: 'Qual é a diferença entre ESM e CommonJS?', options: ['Nenhuma, são sinónimos', 'ESM usa `import`/`export` e é estático; CommonJS usa `require` e é dinâmico e síncrono', 'CommonJS só funciona no browser', 'ESM não permite exportações nomeadas'], answer: 1, explain: 'Por ser estático, o ESM permite às ferramentas saber o que é realmente usado e remover o resto. O CommonJS é o formato original do Node, ainda muito presente.' },
    { id: 'av7', prompt: 'Que significa `^1.4.2` num package.json?', options: ['Exatamente 1.4.2', 'Qualquer versão 1.x.x a partir de 1.4.2', 'Apenas correções: 1.4.x', 'A versão mais recente, seja qual for'], answer: 1, explain: 'O acento circunflexo aceita atualizações menores e de correção, mas não muda o número maior — que é o que, por convenção, quebra compatibilidade.' },
    { id: 'av8', prompt: 'O que resta dos tipos do TypeScript em execução?', options: ['Tudo: as verificações continuam', 'Nada — são apagados na compilação', 'Só os das funções', 'Ficam como comentários'], answer: 1, explain: 'O TypeScript verifica e depois apaga. Em execução é JavaScript normal, por isso dados externos (JSON de uma API, entrada do utilizador) continuam a precisar de validação real.' },
  ],
  exercises: [
    {
      id: 'e19-1', difficulty: 2, kind: 'predict', lang: 'js', title: 'Closures independentes',
      statement: 'Que valores são impressos?',
      code: `function contador() {
  let n = 0;
  return () => ++n;
}
const a = contador();
const b = contador();
console.log(a(), a(), a(), b());`,
      accept: ['1 2 3 1'],
      hint: 'Cada chamada a `contador()` cria um ambiente novo.',
      solution: '`1 2 3 1`. Cada invocação de `contador()` cria um `n` próprio, e a função devolvida fecha sobre esse `n`. Os dois contadores são completamente independentes — é assim que se obtém estado privado sem classes.',
    },
    {
      id: 'e19-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'var contra let no ciclo',
      statement: 'Que dois arrays são impressos?',
      code: `const f = [], g = [];
for (var i = 0; i < 3; i++) f.push(() => i);
for (let j = 0; j < 3; j++) g.push(() => j);
console.log(f.map((x) => x()), g.map((x) => x()));`,
      accept: ['[ 3, 3, 3 ] [ 0, 1, 2 ]', '[3, 3, 3] [0, 1, 2]'],
      hint: 'Quantas variáveis existem em cada caso?',
      solution: '`[ 3, 3, 3 ]` e `[ 0, 1, 2 ]`. Com `var` há uma só variável, partilhada pelas três funções, que no fim do ciclo vale 3. Com `let` cada iteração cria uma ligação nova, e cada closure guarda a sua.',
    },
    {
      id: 'e19-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'Onde está o método',
      statement: 'Que valores booleanos são impressos?',
      code: `class A { constructor() { this.x = 1; } m() { return 2; } }
const a = new A();
console.log(a.hasOwnProperty("x"), a.hasOwnProperty("m"), "m" in a);`,
      accept: ['true false true'],
      hint: '`hasOwnProperty` só olha para o próprio objeto; `in` sobe a cadeia de protótipos.',
      solution: '`true false true`. O campo `x` foi posto no objeto pelo construtor; o método `m` vive em `A.prototype`. O operador `in` encontra-o porque sobe a cadeia de protótipos, mas `hasOwnProperty` não.',
    },
    {
      id: 'e19-4', difficulty: 3, kind: 'predict', lang: 'js', title: 'Cópia superficial',
      statement: 'Que arrays são impressos, por esta ordem?',
      code: `const original = { nome: "Ana", notas: [14, 16] };
const copia = { ...original };
copia.nome = "Rui";
copia.notas.push(20);
console.log(original.nome, original.notas);
console.log(copia.nome, copia.notas);`,
      accept: ['Ana [ 14, 16, 20 ] Rui [ 14, 16, 20 ]', 'Ana [14, 16, 20] Rui [14, 16, 20]'],
      hint: 'O spread copia um nível. O que é que `notas` guarda, exatamente?',
      solution: 'Imprime `Ana [ 14, 16, 20 ]` e depois `Rui [ 14, 16, 20 ]`. O nome foi copiado por valor, por isso mudou só na cópia; mas `notas` é uma referência partilhada, e o `push` alterou o array que os dois objetos veem. É a razão de `structuredClone` existir.',
    },
    {
      id: 'e19-5', difficulty: 2, kind: 'code', lang: 'js', title: 'Um cache com closure',
      statement: 'Escreve `criarCache(limite)` que devolva um objeto com `guardar(chave, valor)`, `obter(chave)` e `tamanho()`, guardando no máximo `limite` entradas (ao exceder, remove a mais antiga). O `Map` interno não pode ser acessível de fora.',
      hint: 'Um `Map` preserva a ordem de inserção: a chave mais antiga é `mapa.keys().next().value`.',
      solution: `function criarCache(limite = 3) {
  const mapa = new Map();

  return {
    guardar(chave, valor) {
      if (mapa.has(chave)) mapa.delete(chave);
      mapa.set(chave, valor);
      if (mapa.size > limite) mapa.delete(mapa.keys().next().value);
      return this;
    },
    obter(chave) { return mapa.get(chave); },
    tamanho() { return mapa.size; },
    chaves() { return [...mapa.keys()]; },
  };
}

const c = criarCache(3);
c.guardar("a", 1).guardar("b", 2).guardar("c", 3).guardar("d", 4);
console.log(c.chaves(), c.tamanho());
console.log(c.obter("a"), c.obter("d"));
console.log(c.mapa);   // undefined: o Map não é acessível de fora`,
    },
    {
      id: 'e19-6', difficulty: 3, kind: 'code', lang: 'js', title: 'Pipeline de transformações',
      statement: 'Escreve `pipe(...funcoes)` que devolva uma função que aplica todas por ordem, e usa-a para transformar um array de vendas: filtrar as acima de 500, converter para euros com IVA, e somar. Nenhuma função pode alterar o array original.',
      hint: '`pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)`.',
      solution: `const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const acimaDe = (n) => (v) => v.filter((x) => x.valor > n);
const comIva = (taxa) => (v) => v.map((x) => ({ ...x, valor: Number((x.valor * (1 + taxa)).toFixed(2)) }));
const somar = (v) => v.reduce((s, x) => s + x.valor, 0);

const vendas = [
  { loja: "Lisboa", valor: 1200 },
  { loja: "Porto", valor: 400 },
  { loja: "Faro", valor: 800 },
];

const totalLiquido = pipe(acimaDe(500), comIva(0.23), somar);
console.log(totalLiquido(vendas).toFixed(2));
console.log("original intacto:", vendas);`,
    },
  ],
};
