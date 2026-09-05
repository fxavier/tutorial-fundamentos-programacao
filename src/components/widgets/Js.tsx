import { useMemo, useRef, useState } from 'react';
import { WidgetShell, ConsoleOutput, useCodeRunner } from './Shell';
import { jsRunner } from '../../lib/js';

type ExampleSet = 'basico' | 'async' | 'avancado' | 'node';

export const JS_EXAMPLES: { id: string; set: ExampleSet; name: string; argv: string; code: string }[] = [
  {
    id: 'js-ola', set: 'basico', name: '1. Variáveis, tipos e template strings', argv: '',
    code: `const nome = "Ana";          // const: não se reatribui
let idade = 30;               // let: reatribuível
const altura = 1.72;
const estuda = true;
const nada = null;
let indefinido;

idade += 1;

console.log(\`\${nome} tem \${idade} anos e \${altura} m.\`);
console.log(typeof nome, typeof idade, typeof estuda, typeof nada, typeof indefinido);
console.log(\`Área do quadrado de lado 3: \${3 ** 2}\`);`,
  },
  {
    id: 'js-igualdade', set: 'basico', name: '2. Igualdade, coerção e valores falsos', argv: '',
    code: `console.log(1 == "1");        // true  — == converte antes de comparar
console.log(1 === "1");       // false — === compara valor E tipo
console.log(null == undefined, null === undefined);

// valores "falsy": tudo o resto é verdadeiro
const casos = [["0", 0], ['""', ""], ["null", null], ["undefined", undefined],
               ["NaN", NaN], ["[]", []], ["{}", {}], ['"0"', "0"], ['" "', " "]];
for (const [etiqueta, v] of casos) {
  console.log(etiqueta.padEnd(11), "->", Boolean(v));
}

const config = { porta: 0 };
console.log(config.porta || 8080);   // 8080 — o 0 é falsy!
console.log(config.porta ?? 8080);   // 0    — ?? só reage a null/undefined`,
  },
  {
    id: 'js-funcoes', set: 'basico', name: '3. Funções e arrow functions', argv: '',
    code: `function area(largura, altura = largura) {   // valor por omissão
  return largura * altura;
}

const dobro = (n) => n * 2;                   // arrow com retorno implícito
const saudar = (nome, saudacao = "Olá") => \`\${saudacao}, \${nome}!\`;

const somar = (...numeros) => numeros.reduce((a, b) => a + b, 0);   // rest

console.log(area(3, 4), area(5));
console.log(dobro(21));
console.log(saudar("Ana"), saudar("Rui", "Bom dia"));
console.log(somar(1, 2, 3, 4, 5));`,
  },
  {
    id: 'js-arrays', set: 'basico', name: '4. Arrays e objetos', argv: '',
    code: `const notas = [14, 9, 18, 11, 20];

console.log(notas.length, notas[0], notas.at(-1));
console.log(notas.filter((n) => n >= 10));
console.log(notas.map((n) => n * 5));
console.log(notas.reduce((a, b) => a + b, 0) / notas.length);
console.log([...notas].sort((a, b) => b - a));   // cópia antes de ordenar!

const aluno = { nome: "Rui", curso: "Info", notas: [14, 16] };
const { nome, curso: c, email = "sem email" } = aluno;   // desestruturação
console.log(nome, c, email);

const atualizado = { ...aluno, ano: 2 };                  // spread
console.log(Object.keys(atualizado), atualizado.ano);
console.log(aluno.morada?.rua ?? "sem morada");           // encadeamento opcional`,
  },
  {
    id: 'js-ciclos', set: 'basico', name: '5. Ciclos e iteração', argv: '',
    code: `const cores = ["azul", "verde", "vermelho"];

for (let i = 0; i < cores.length; i++) console.log(i, cores[i]);

for (const cor of cores) console.log(cor);                 // valores
for (const [i, cor] of cores.entries()) console.log(i, cor);

const preços = { pão: 1.2, leite: 0.9 };
for (const [k, v] of Object.entries(preços)) console.log(k, v);

let n = 5, fatorial = 1;
while (n > 1) fatorial *= n--;
console.log("5! =", fatorial);`,
  },
  {
    id: 'js-callback', set: 'async', name: '1. Do callback à promessa', argv: '',
    code: `// 1. callback — o estilo antigo, que aninha
function comCallback(ms, valor, cb) {
  setTimeout(() => cb(null, valor), ms);
}

comCallback(30, "primeiro", (err, a) => {
  comCallback(30, "segundo", (err, b) => {
    comCallback(30, "terceiro", (err, c) => {
      console.log("callbacks:", a, b, c);   // o "pirâmide da perdição"
    });
  });
});

// 2. promessa — a mesma coisa, encadeada
const comPromessa = (ms, valor) => new Promise((resolve) => setTimeout(() => resolve(valor), ms));

comPromessa(60, "A")
  .then((a) => comPromessa(60, a + "B"))
  .then((ab) => console.log("promessas:", ab + "C"));`,
  },
  {
    id: 'js-async', set: 'async', name: '2. async / await', argv: '',
    code: `const esperar = (ms, valor) => new Promise((r) => setTimeout(() => r(valor), ms));
const falhar = (ms) => new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error("rede em baixo")), ms));

async function emSerie() {
  const t = Date.now();
  const a = await esperar(100, "A");
  const b = await esperar(100, "B");
  console.log("em série:", a, b, \`~\${Math.round((Date.now() - t) / 50) * 50} ms\`);
}

async function emParalelo() {
  const t = Date.now();
  const [a, b] = await Promise.all([esperar(100, "A"), esperar(100, "B")]);
  console.log("em paralelo:", a, b, \`~\${Math.round((Date.now() - t) / 50) * 50} ms\`);
}

async function comErro() {
  try {
    await falhar(20);
  } catch (e) {
    console.log("apanhado:", e.message);
  } finally {
    console.log("o finally corre sempre");
  }
}

await emSerie();
await emParalelo();
await comErro();`,
  },
  {
    id: 'js-eventloop', set: 'async', name: '3. O event loop: a ordem real', argv: '',
    code: `console.log("1 — síncrono");

setTimeout(() => console.log("4 — macrotarefa (setTimeout 0)"), 0);

Promise.resolve().then(() => console.log("3 — microtarefa (promessa)"));

queueMicrotask(() => console.log("3b — microtarefa (queueMicrotask)"));

console.log("2 — síncrono");

// Tudo o que é síncrono corre primeiro. Depois esvazia-se a fila de
// microtarefas. Só então se pega numa macrotarefa.`,
  },
  {
    id: 'js-promise-all', set: 'async', name: '4. Promise.all, race e allSettled', argv: '',
    code: `const ok = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const ko = (ms, m) => new Promise((_, x) => setTimeout(() => x(new Error(m)), ms));

console.log(await Promise.all([ok(30, 1), ok(10, 2), ok(20, 3)]));

console.log(await Promise.race([ok(30, "lento"), ok(10, "rápido")]));

console.log(await Promise.any([ko(10, "falhou"), ok(30, "sobreviveu")]));

const r = await Promise.allSettled([ok(10, "bom"), ko(10, "mau")]);
for (const x of r) console.log(x.status, x.value ?? x.reason.message);

try {
  await Promise.all([ok(10, "bom"), ko(5, "um chega para estragar")]);
} catch (e) {
  console.log("Promise.all rejeita à primeira falha:", e.message);
}`,
  },
  {
    id: 'js-closure', set: 'avancado', name: '1. Closures e escopo', argv: '',
    code: `function contador() {
  let n = 0;                       // fica preso na closure
  return {
    incrementar: () => ++n,
    valor: () => n,
  };
}

const c1 = contador(), c2 = contador();
c1.incrementar(); c1.incrementar(); c2.incrementar();
console.log(c1.valor(), c2.valor());     // 2 1 — estados independentes

// a armadilha clássica: var vs let num ciclo
const comVar = [], comLet = [];
for (var i = 0; i < 3; i++) comVar.push(() => i);
for (let j = 0; j < 3; j++) comLet.push(() => j);
console.log(comVar.map((f) => f()));     // [3, 3, 3] — um só i, partilhado
console.log(comLet.map((f) => f()));     // [0, 1, 2] — um j por iteração

// memoização: uma closure a guardar resultados
function memoizar(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
const lento = (n) => (n < 2 ? n : lento(n - 1) + lento(n - 2));
const rapido = memoizar((n) => (n < 2 ? n : rapido(n - 1) + rapido(n - 2)));
console.log(rapido(35));`,
  },
  {
    id: 'js-this', set: 'avancado', name: '2. O valor de `this`', argv: '',
    code: `const objeto = {
  nome: "config",
  normal() { return this?.nome; },
  seta: () => (typeof this === "undefined" ? "sem this" : "this do exterior"),
};

console.log(objeto.normal());            // "config" — this é quem chamou
const solta = objeto.normal;
console.log(solta());                    // undefined — perdeu o dono
console.log(objeto.normal.call({ nome: "outro" }));   // "outro"
console.log(objeto.seta());              // a arrow não tem this próprio

class Botao {
  constructor(etiqueta) {
    this.etiqueta = etiqueta;
    this.clicarPreso = this.clicar.bind(this);      // preso ao objeto
  }
  clicar() { return \`clique em \${this.etiqueta}\`; }
}

const b = new Botao("Gravar");
const desligado = b.clicar;
console.log(b.clicarPreso());
try { desligado(); } catch (e) { console.log("erro esperado:", e.constructor.name); }`,
  },
  {
    id: 'js-prototipos', set: 'avancado', name: '3. Protótipos, classes e herança', argv: '',
    code: `// classe: açúcar sintático por cima dos protótipos
class Figura {
  static contador = 0;
  #id;                                  // campo verdadeiramente privado
  constructor(nome) {
    this.nome = nome;
    this.#id = ++Figura.contador;
  }
  get id() { return this.#id; }
  area() { throw new Error("cada figura define a sua área"); }
  toString() { return \`\${this.nome} #\${this.#id}: área \${this.area().toFixed(2)}\`; }
}

class Retangulo extends Figura {
  constructor(l, a) { super("Retângulo"); this.l = l; this.a = a; }
  area() { return this.l * this.a; }
}

class Circulo extends Figura {
  constructor(r) { super("Círculo"); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}

for (const f of [new Retangulo(3, 4), new Circulo(2)]) console.log(String(f));

// por baixo é tudo cadeia de protótipos
const r = new Retangulo(1, 1);
console.log(Object.getPrototypeOf(r) === Retangulo.prototype);
console.log(r instanceof Retangulo, r instanceof Figura);
console.log(Object.getOwnPropertyNames(Retangulo.prototype));`,
  },
  {
    id: 'js-funcional', set: 'avancado', name: '4. Estilo funcional e imutabilidade', argv: '',
    code: `const vendas = [
  { loja: "Lisboa", mes: "jan", valor: 1200 },
  { loja: "Porto",  mes: "jan", valor: 800 },
  { loja: "Lisboa", mes: "fev", valor: 1500 },
  { loja: "Faro",   mes: "fev", valor: 400 },
];

const total = vendas.reduce((s, v) => s + v.valor, 0);
console.log("total:", total);

const porLoja = vendas.reduce((acc, v) => ({ ...acc, [v.loja]: (acc[v.loja] ?? 0) + v.valor }), {});
console.log(porLoja);

console.log(Object.entries(porLoja).sort((a, b) => b[1] - a[1]).map(([l, v]) => \`\${l}: \${v}\`));

// cópia superficial vs profunda
const original = { nome: "Ana", notas: [14, 16] };
const superficial = { ...original };
superficial.notas.push(99);
console.log("o spread NÃO protege o interior:", original.notas);

const profunda = structuredClone(original);
profunda.notas.push(0);
console.log("structuredClone protege:", original.notas, profunda.notas);

console.log(vendas.some((v) => v.valor > 1400), vendas.every((v) => v.valor > 300));
console.log(vendas.find((v) => v.loja === "Faro"));`,
  },
  {
    id: 'node-modulos', set: 'node', name: '1. Módulos: require e module.exports', argv: '',
    code: `const fs = require("node:fs");
const path = require("node:path");

// escrevemos um módulo e voltamos a lê-lo — tudo em memória
fs.writeFileSync("/matematica.js", \`
  const somar = (a, b) => a + b;
  const media = (v) => v.reduce(somar, 0) / v.length;
  module.exports = { somar, media };
\`);

console.log(fs.readdirSync());

// e agora carregamo-lo como qualquer módulo do Node
const { somar, media } = require("./matematica");
console.log(somar(2, 3), media([14, 9, 18, 11]));

console.log(path.join("/dados", "notas.csv"), path.extname("relatorio.pdf"), path.basename("/a/b/c.txt", ".txt"));
console.log(__filename, __dirname);
console.log(process.version, process.platform);`,
  },
  {
    id: 'node-ficheiros', set: 'node', name: '2. Ler e escrever ficheiros', argv: '',
    code: `const fs = require("node:fs");

const bruto = fs.readFileSync("/dados.txt", "utf8");
console.log("--- dados.txt ---");
console.log(bruto.trimEnd());

const alunos = bruto
  .trim()
  .split("\\n")
  .map((linha) => {
    const [nome, nota] = linha.split(",");
    return { nome, nota: Number(nota) };
  });

console.log(alunos);
console.log("aprovados:", alunos.filter((a) => a.nota >= 10).map((a) => a.nome));

const media = alunos.reduce((s, a) => s + a.nota, 0) / alunos.length;
fs.writeFileSync("/relatorio.json", JSON.stringify({ media, total: alunos.length }, null, 2));
console.log("--- relatorio.json ---");
console.log(fs.readFileSync("/relatorio.json", "utf8"));

const config = JSON.parse(fs.readFileSync("/notas.json", "utf8"));
console.log(config.turma, config.alunos.length);`,
  },
  {
    id: 'node-cli', set: 'node', name: '3. Um programa de linha de comandos', argv: '14\n9\n18\n11',
    code: `// A caixa "Argumentos" alimenta process.argv — uma linha por argumento.
const [, ficheiro, ...args] = process.argv;

console.log("programa:", ficheiro);
console.log("argumentos:", args);

if (args.length === 0) {
  console.error("Uso: node media.js <nota> [nota...]");
  console.log("(experimenta escrever números na caixa Argumentos)");
} else {
  const numeros = args.map(Number);
  if (numeros.some(Number.isNaN)) {
    console.error("Erro: todos os argumentos têm de ser números.");
  } else {
    const soma = numeros.reduce((a, b) => a + b, 0);
    console.log("n =", numeros.length);
    console.log("soma =", soma);
    console.log("média =", (soma / numeros.length).toFixed(2));
    console.log("máximo =", Math.max(...numeros));
  }
}`,
  },
  {
    id: 'node-eventos', set: 'node', name: '4. EventEmitter', argv: '',
    code: `const { EventEmitter } = require("node:events");

class Fila extends EventEmitter {
  #trabalhos = [];
  acrescentar(t) {
    this.#trabalhos.push(t);
    this.emit("acrescentado", t, this.#trabalhos.length);
    return this;
  }
  processar() {
    while (this.#trabalhos.length) {
      const t = this.#trabalhos.shift();
      try {
        if (t.falha) throw new Error(\`\${t.nome} rebentou\`);
        this.emit("feito", t);
      } catch (e) {
        this.emit("erro", e);
      }
    }
    this.emit("vazia");
  }
}

const fila = new Fila();
fila.on("acrescentado", (t, n) => console.log(\`+ \${t.nome} (\${n} na fila)\`));
fila.on("feito", (t) => console.log(\`✔ \${t.nome}\`));
fila.on("erro", (e) => console.log(\`✖ \${e.message}\`));
fila.once("vazia", () => console.log("fila vazia"));

fila.acrescentar({ nome: "redimensionar" }).acrescentar({ nome: "enviar", falha: true }).acrescentar({ nome: "arquivar" });
fila.processar();`,
  },
  {
    id: 'node-testes', set: 'node', name: '5. Testes com node:test', argv: '',
    code: `const test = require("node:test");
const assert = require("node:assert/strict");

function iva(valor, taxa = 0.23) {
  if (typeof valor !== "number" || Number.isNaN(valor)) throw new TypeError("valor tem de ser número");
  if (valor < 0) throw new RangeError("valor não pode ser negativo");
  return Number((valor * (1 + taxa)).toFixed(2));
}

test("aplica a taxa normal", () => {
  assert.strictEqual(iva(100), 123);
});

test("aceita outra taxa", () => {
  assert.strictEqual(iva(100, 0.06), 106);
});

test("arredonda a dois decimais", () => {
  assert.strictEqual(iva(19.99), 24.59);
});

test("rejeita valores negativos", () => {
  assert.throws(() => iva(-1));
});

test("rejeita texto", () => {
  assert.throws(() => iva("100"));
});`,
  },
];

const SET_LABEL: Record<ExampleSet, string> = {
  basico: 'Fundamentos', async: 'Assíncrono', avancado: 'Avançado', node: 'Node.js',
};

export const useJs = () => useCodeRunner(jsRunner);

export function JsLab({ initial, initialArgv, set, compact }: {
  initial?: string; initialArgv?: string; set?: ExampleSet; compact?: boolean;
}) {
  const examples = useMemo(() => (set ? JS_EXAMPLES.filter((e) => e.set === set) : JS_EXAMPLES), [set]);
  const [code, setCode] = useState(initial ?? examples[0].code);
  const [argv, setArgv] = useState(initialArgv ?? examples[0].argv);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const { busy, status, result, execute, abort, clear } = useJs();

  const lines = useMemo(() => code.split('\n').length, [code]);
  const correr = () => execute({ code, argv: argv.split('\n').filter((a) => a.trim() !== '') });

  const loadExample = (id: string) => {
    const ex = JS_EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCode(ex.code);
    setArgv(ex.argv);
    clear();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = areaRef.current!;
      const s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '  ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); correr(); }
  };

  return (
    <WidgetShell
      title="Laboratório de JavaScript e Node"
      subtitle="Corre no motor do próprio browser — sem descarregar nada. Aceita await no topo, require() e um sistema de ficheiros em memória. Ctrl/Cmd + Enter para executar."
      actions={
        <div className="flex flex-wrap gap-2">
          {!compact && (
            <select className="field w-auto py-1.5 text-xs" onChange={(e) => loadExample(e.target.value)} defaultValue="" aria-label="Carregar exemplo">
              <option value="" disabled>Carregar exemplo…</option>
              {(['basico', 'async', 'avancado', 'node'] as ExampleSet[])
                .filter((s) => examples.some((e) => e.set === s))
                .map((s) => (
                  <optgroup key={s} label={SET_LABEL[s]}>
                    {examples.filter((e) => e.set === s).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </optgroup>
                ))}
            </select>
          )}
          <button className="btn btn-primary btn-sm" onClick={correr} disabled={busy}>{busy ? 'A correr…' : '▶ Executar'}</button>
          {busy && <button className="btn btn-ghost btn-sm" onClick={abort}>■ Parar</button>}
        </div>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">Código ({lines} linhas)</span>
            <button className="text-xs text-muted underline" onClick={() => { setCode(''); clear(); }}>limpar</button>
          </div>
          <textarea
            ref={areaRef}
            className="field scrollbar-thin h-80 resize-y leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            aria-label="Editor de código JavaScript"
          />
          <div className="mt-2">
            <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Argumentos (um por linha → process.argv)</span>
            <textarea className="field h-20 resize-y" value={argv} onChange={(e) => setArgv(e.target.value)} spellCheck={false} aria-label="Argumentos da linha de comandos" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Consola</span>
          <div className="h-80"><ConsoleOutput result={result} busy={busy} status={status} /></div>
        </div>
      </div>
    </WidgetShell>
  );
}
