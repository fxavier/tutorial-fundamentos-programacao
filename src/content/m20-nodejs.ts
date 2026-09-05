import type { Module } from '../types';

export const m20: Module = {
  id: 'nodejs',
  number: 20,
  title: 'Node.js',
  subtitle: 'JavaScript fora do browser — módulos, ficheiros, linha de comandos, servidores e testes',
  icon: '🟩',
  minutes: 70,
  goals: [
    'Perceber o que o Node acrescenta ao JavaScript e onde é boa escolha',
    'Organizar um projeto com `package.json`, scripts e dependências',
    'Ler e escrever ficheiros, e tratar caminhos de forma portável',
    'Escrever um programa de linha de comandos que lê argumentos e devolve códigos de saída',
    'Levantar um servidor HTTP e perceber o modelo de eventos e streams',
    'Escrever testes com o executor incluído no próprio Node',
  ],
  sections: [
    {
      id: 'o-que-e',
      title: 'O que é o Node.js',
      blocks: [
        { type: 'p', text: 'O Node.js é o motor V8 do Chrome retirado do browser e colado a um conjunto de bibliotecas de sistema. Dá ao JavaScript aquilo que o browser lhe nega de propósito: acesso ao sistema de ficheiros, sockets de rede, processos, variáveis de ambiente. Foi isso que transformou uma linguagem de páginas web numa linguagem de servidores.' },
        {
          type: 'compare',
          left: { title: 'O Node é boa escolha para', items: ['APIs e serviços com muita E/S e pouco cálculo', 'Ferramentas de linha de comandos', 'Ferramentas de construção do próprio frontend', 'Equipas que já escrevem JavaScript no cliente', 'Prototipagem rápida e serviços em tempo real'] },
          right: { title: 'O Node é má escolha para', items: ['Cálculo intensivo em CPU (bloqueia a linha de execução)', 'Programas onde a precisão numérica é crítica', 'Sistemas com restrições de memória apertadas', 'Tarefas em que já existe uma ferramenta melhor e madura'] },
        },
        { type: 'callout', tone: 'key', title: 'O modelo do Node numa frase', text: 'Uma só linha de execução, E/S não bloqueante, um event loop (módulo 18). Um servidor Node aguenta milhares de ligações em simultâneo porque quase nunca está a **fazer** alguma coisa — está à espera de disco ou de rede, e essa espera não custa uma thread. Em troca, um cálculo pesado bloqueia todos os pedidos ao mesmo tempo.' },
        { type: 'p', text: 'O laboratório abaixo simula o essencial do Node dentro do browser: `console` com o formato do Node, `process`, `require` de vários módulos internos e um sistema de ficheiros em memória com dois ficheiros já criados (`/dados.txt` e `/notas.json`). É suficiente para tudo o que se segue, exceto o servidor HTTP — esse tem de correr no teu computador.' },
        { type: 'widget', id: 'js-lab', props: { set: 'node' } },
      ],
    },
    {
      id: 'projeto',
      title: 'Um projeto de Node do zero',
      blocks: [
        { type: 'code', lang: 'bash', caption: 'no teu terminal', code: `node --version                 # confirma que tens o Node (v20 ou superior)

mkdir o-meu-projeto && cd o-meu-projeto
npm init -y                    # cria o package.json

npm install dayjs              # dependência de execução
npm install -D vitest          # dependência só de desenvolvimento

node index.js                  # correr um ficheiro
npm run dev                    # correr um script do package.json
npx cowsay olá                 # correr uma ferramenta sem a instalar` },
        {
          type: 'table',
          head: ['Ficheiro / pasta', 'O que é', 'Vai para o Git?'],
          rows: [
            ['`package.json`', 'Nome, scripts, dependências declaradas', '**sim**'],
            ['`package-lock.json`', 'As versões exatas efetivamente instaladas', '**sim**'],
            ['`node_modules/`', 'O código descarregado das dependências', 'não — `.gitignore`'],
            ['`.env`', 'Segredos e configuração local', '**nunca**'],
            ['`index.js`', 'Ponto de entrada, por convenção', 'sim'],
          ],
        },
        { type: 'callout', tone: 'trap', title: '`npm install` contra `npm ci`', text: '`npm install` pode atualizar o lock e mudar versões; `npm ci` apaga o `node_modules` e instala exatamente o que está no lock. Em desenvolvimento usa-se o primeiro; em integração contínua e produção usa-se **sempre** o segundo — é o que garante que a máquina de construção instala o mesmo que a tua.' },
        { type: 'callout', tone: 'warn', title: 'Segredos nunca vão para o código', text: 'Chaves de API, palavras-passe e ligações a bases de dados leem-se de `process.env`, e o ficheiro `.env` fica fora do controlo de versões. Um segredo commitado tem de ser considerado comprometido e rodado — apagá-lo depois não serve de nada, porque continua no histórico.' },
      ],
    },
    {
      id: 'modulos',
      title: 'Módulos: organizar o código',
      blocks: [
        { type: 'p', text: 'Um ficheiro é um módulo. O que não for exportado é privado — não há forma de lhe chegar de fora. É o mecanismo de encapsulamento mais usado em JavaScript, muito antes das classes.' },
        { type: 'code', lang: 'js', caption: 'CommonJS: o que o laboratório executa', code: `const fs = require("node:fs");

fs.writeFileSync("/notas.js", \`
  const somar = (a, b) => a + b;
  const media = (v) => v.reduce(somar, 0) / v.length;
  const aprovado = (n) => n >= 10;
  module.exports = { somar, media, aprovado };   // o que sai
\`);

const { media, aprovado } = require("./notas");

console.log(media([14, 9, 18, 11]));
console.log([14, 9, 18].filter(aprovado));` },
        { type: 'code', lang: 'js', caption: 'ESM: o padrão moderno (corre no teu computador)', code: `// notas.mjs
// export const somar = (a, b) => a + b;
// export const media = (v) => v.reduce(somar, 0) / v.length;
// export default media;

// index.mjs
// import media, { somar } from "./notas.mjs";   // a extensão é obrigatória
// import { readFile } from "node:fs/promises";  // prefixo node: nos internos
//
// const dados = await readFile("./dados.txt", "utf8");   // await no topo: só em ESM
// console.log(media([14, 9]), somar(1, 2), dados.length);` },
        { type: 'callout', tone: 'key', text: 'Para usar ESM, põe `"type": "module"` no `package.json` (ou usa a extensão `.mjs`). Em ESM as extensões nos caminhos relativos são **obrigatórias** (`./notas.js`, não `./notas`), e o prefixo `node:` nos módulos internos deixa claro que não vêm do npm.' },
      ],
    },
    {
      id: 'ficheiros',
      title: 'Ficheiros e caminhos',
      blocks: [
        { type: 'code', lang: 'js', caption: 'ler, transformar, escrever', code: `const fs = require("node:fs");
const path = require("node:path");

const bruto = fs.readFileSync("/dados.txt", "utf8");

const alunos = bruto.trim().split("\\n").map((linha) => {
  const [nome, nota] = linha.split(",");
  return { nome, nota: Number(nota) };
});

const relatorio = {
  total: alunos.length,
  media: Number((alunos.reduce((s, a) => s + a.nota, 0) / alunos.length).toFixed(2)),
  aprovados: alunos.filter((a) => a.nota >= 10).map((a) => a.nome),
};

fs.writeFileSync("/relatorio.json", JSON.stringify(relatorio, null, 2));
console.log(fs.readFileSync("/relatorio.json", "utf8"));

console.log(path.join("dados", "2026", "notas.csv"));
console.log(path.extname("relatorio.final.pdf"), path.basename("/a/b/c.txt", ".txt"));` },
        { type: 'callout', tone: 'trap', title: 'Nunca juntes caminhos com `+`', text: '`"pasta" + "/" + ficheiro` parte no Windows e duplica barras. Usa sempre `path.join`. E lê ficheiros relativos a `import.meta.dirname` (ESM) ou `__dirname` (CommonJS), não ao diretório onde o utilizador estava quando correu o programa.' },
        {
          type: 'table',
          head: ['Operação', 'Síncrona', 'Com promessa', 'Quando usar a síncrona'],
          rows: [
            ['Ler', '`fs.readFileSync`', '`await fs.promises.readFile`', 'Arranque do programa e scripts'],
            ['Escrever', '`fs.writeFileSync`', '`await fs.promises.writeFile`', 'O mesmo'],
            ['Listar', '`fs.readdirSync`', '`await fs.promises.readdir`', 'O mesmo'],
            ['Existe?', '`fs.existsSync`', '(tenta e apanha o erro)', 'O mesmo'],
          ],
        },
        { type: 'callout', tone: 'warn', text: 'As versões `…Sync` **bloqueiam a linha de execução inteira**. Num script ou no arranque de um programa são perfeitamente aceitáveis e mais legíveis. Dentro de um servidor a atender pedidos são um erro grave: param todos os utilizadores enquanto o disco responde.' },
        { type: 'code', lang: 'js', caption: 'ficheiros grandes: streams', code: `// Um ficheiro de 4 GB não cabe em memória. Streams processam aos pedaços.
//
// import { createReadStream } from "node:fs";
// import { createInterface } from "node:readline";
//
// const rl = createInterface({ input: createReadStream("enorme.csv") });
// let linhas = 0;
// for await (const linha of rl) {        // uma linha de cada vez
//   if (linha.includes("ERRO")) linhas++;
// }
// console.log(linhas);

console.log("Memória usada:", Math.round(process.memoryUsage().heapUsed / 1024 / 1024), "MB");` },
      ],
    },
    {
      id: 'cli',
      title: 'Programas de linha de comandos',
      blocks: [
        { type: 'p', text: 'Um programa de linha de comandos tem um contrato simples com o sistema: recebe **argumentos**, escreve resultados em `stdout`, escreve erros em `stderr` e devolve um **código de saída** — zero se correu bem, diferente de zero se falhou. Respeitar esse contrato é o que permite encadeá-lo com outros programas (módulo 11).' },
        { type: 'code', lang: 'js', caption: 'a estrutura de um CLI decente', code: `// A caixa "Argumentos" do laboratório alimenta process.argv, uma linha por argumento.
const [, ficheiro, ...args] = process.argv;   // [0] é o node, [1] é o script

function ajuda() {
  console.log("Uso: media <numero> [numero...]");
  console.log("  --json    devolve o resultado em JSON");
}

if (args.length === 0 || args.includes("--help")) {
  ajuda();
} else {
  const json = args.includes("--json");
  const numeros = args.filter((a) => !a.startsWith("--")).map(Number);

  if (numeros.some(Number.isNaN)) {
    console.error("Erro: todos os argumentos têm de ser números.");   // stderr
  } else {
    const media = numeros.reduce((a, b) => a + b, 0) / numeros.length;
    const r = { n: numeros.length, media: Number(media.toFixed(2)), maximo: Math.max(...numeros) };
    console.log(json ? JSON.stringify(r) : \`média de \${r.n} valores: \${r.media}\`);
  }
}` },
        {
          type: 'steps',
          items: [
            { title: 'Resultados em `stdout`, mensagens em `stderr`', text: '`console.log` vai para stdout, `console.error` para stderr. Assim `programa > ficheiro.txt` guarda só os dados e os avisos continuam a aparecer no ecrã.' },
            { title: 'Código de saída honesto', text: '`process.exit(1)` em caso de erro. Um script de shell ou uma máquina de CI decidem com base nesse número.' },
            { title: 'Uma ajuda com `--help`', text: 'Um programa que não explica como se usa é um programa que ninguém usa duas vezes.' },
            { title: 'Sem argumentos, mostra a ajuda', text: 'Nunca fiques a bloquear em silêncio à espera de entrada que o utilizador não sabe que devia dar.' },
          ],
        },
        { type: 'callout', tone: 'tip', text: 'Para argumentos mais complexos, o Node já traz `parseArgs` em `node:util` — não é preciso instalar nada. Só quando o programa cresce muito é que vale a pena uma biblioteca dedicada.' },
      ],
    },
    {
      id: 'eventos-http',
      title: 'Eventos e servidores HTTP',
      blocks: [
        { type: 'p', text: 'Boa parte da API do Node é construída sobre o padrão **emissor/ouvinte**: um objeto anuncia acontecimentos, e quem estiver interessado regista uma função. Servidores, streams e sockets são todos `EventEmitter`.' },
        { type: 'code', lang: 'js', caption: 'EventEmitter', code: `const { EventEmitter } = require("node:events");

class Fila extends EventEmitter {
  #trabalhos = [];
  acrescentar(t) { this.#trabalhos.push(t); this.emit("novo", t); return this; }
  processar() {
    while (this.#trabalhos.length) {
      const t = this.#trabalhos.shift();
      try {
        if (t.falha) throw new Error(\`\${t.nome} rebentou\`);
        this.emit("feito", t);
      } catch (e) { this.emit("erro", e); }
    }
    this.emit("vazia");
  }
}

const fila = new Fila();
fila.on("novo", (t) => console.log("+", t.nome));
fila.on("feito", (t) => console.log("✔", t.nome));
fila.on("erro", (e) => console.log("✖", e.message));
fila.once("vazia", () => console.log("nada por fazer"));

fila.acrescentar({ nome: "redimensionar" }).acrescentar({ nome: "enviar", falha: true });
fila.processar();` },
        { type: 'callout', tone: 'trap', text: 'Um `EventEmitter` que emite `"error"` sem ninguém a ouvir **termina o processo**. É o único nome de evento com tratamento especial: regista sempre um ouvinte de erro.' },
        { type: 'h', text: 'Um servidor HTTP em vinte linhas' },
        { type: 'code', lang: 'js', caption: 'guarda como servidor.mjs e corre com: node servidor.mjs', code: `import { createServer } from "node:http";

const alunos = [
  { id: 1, nome: "Ana", nota: 14 },
  { id: 2, nome: "Rui", nota: 9 },
];

const servidor = createServer((pedido, resposta) => {
  const url = new URL(pedido.url, \`http://\${pedido.headers.host}\`);

  if (pedido.method === "GET" && url.pathname === "/alunos") {
    const minimo = Number(url.searchParams.get("minimo") ?? 0);
    const dados = alunos.filter((a) => a.nota >= minimo);

    resposta.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return resposta.end(JSON.stringify(dados));
  }

  resposta.writeHead(404, { "Content-Type": "application/json" });
  resposta.end(JSON.stringify({ erro: "não encontrado" }));
});

servidor.listen(3000, () => console.log("http://localhost:3000/alunos?minimo=10"));` },
        { type: 'p', text: 'Repara em quantas peças do módulo 4 aparecem aqui: uma porta (3000), o método HTTP, o caminho, os parâmetros da query, o código de estado e o cabeçalho `Content-Type`. O Node não esconde o protocolo — é uma boa forma de o ver de perto.' },
        { type: 'callout', tone: 'tip', text: 'Na prática usa-se um framework (Express, Fastify, Hono) que trata de rotas, corpos de pedido e erros. Mas escrever um servidor cru pelo menos uma vez mostra que um framework é só uma camada fina por cima disto.' },
      ],
    },
    {
      id: 'testes',
      title: 'Testes sem instalar nada',
      blocks: [
        { type: 'p', text: 'Desde a versão 18 o Node traz um executor de testes e uma biblioteca de asserções incluídos. Para a maioria dos projetos chegam perfeitamente — não é preciso instalar nada, e é exatamente o que este tutorial usa nos seus próprios testes.' },
        { type: 'code', lang: 'js', caption: 'testes que correm no laboratório', code: `const test = require("node:test");
const assert = require("node:assert/strict");

function iva(valor, taxa = 0.23) {
  if (typeof valor !== "number" || Number.isNaN(valor)) throw new TypeError("valor tem de ser número");
  if (valor < 0) throw new RangeError("valor não pode ser negativo");
  return Number((valor * (1 + taxa)).toFixed(2));
}

test("aplica a taxa normal", () => {
  assert.strictEqual(iva(100), 123);
});

test("aceita uma taxa diferente", () => {
  assert.strictEqual(iva(100, 0.06), 106);
});

test("arredonda a dois decimais", () => {
  assert.strictEqual(iva(19.99), 24.59);
});

test("rejeita negativos e texto", () => {
  assert.throws(() => iva(-1));
  assert.throws(() => iva("100"));
});` },
        { type: 'code', lang: 'bash', caption: 'no terminal', code: `node --test                  # corre tudo o que parecer um teste
node --test tests/iva.test.js
node --test --watch          # volta a correr quando um ficheiro muda
node --test --experimental-test-coverage` },
        {
          type: 'steps',
          items: [
            { title: 'Testa o comportamento, não a implementação', text: 'Um teste que conhece as variáveis internas parte-se em cada refatoração e não protege nada.' },
            { title: 'Um teste, uma afirmação clara', text: 'Quando falha, o nome do teste devia bastar para saber o que se partiu.' },
            { title: 'Os casos-limite é que apanham bugs', text: 'Vazio, zero, negativo, um único elemento, o maior valor possível, entrada com o tipo errado.' },
            { title: 'Um bug encontrado vira teste', text: 'Escreve primeiro o teste que falha, depois corrige. Assim aquele bug em concreto nunca volta.' },
          ],
        },
        { type: 'callout', tone: 'key', text: 'A pergunta que decide se vale a pena testar algo: **se isto se partir em silêncio, quanto tempo demoro a descobrir?** Se a resposta for "semanas" ou "quando um utilizador se queixar", escreve o teste.' },
      ],
    },
  ],
  quiz: [
    { id: 'nd1', prompt: 'O que é o Node.js?', options: ['Uma linguagem de programação', 'Uma framework de frontend', 'Um ambiente que corre JavaScript fora do browser, com acesso ao sistema', 'Um browser sem interface'], answer: 2, explain: 'É o motor V8 mais bibliotecas de sistema. A linguagem é a mesma do browser; o que muda são as APIs disponíveis.' },
    { id: 'nd2', prompt: 'Porque é que o Node aguenta muitas ligações em simultâneo com uma só linha de execução?', options: ['Porque usa threads escondidas para o teu código', 'Porque a E/S não bloqueia: a espera é delegada e o event loop trata dos resultados', 'Porque é compilado', 'Porque limita o número de utilizadores'], answer: 1, explain: 'Enquanto espera por disco ou rede, o Node atende outros pedidos. Em troca, um cálculo pesado bloqueia todos ao mesmo tempo.' },
    { id: 'nd3', prompt: 'O que deve ir para o controlo de versões?', options: ['`node_modules/`', '`package-lock.json`', '`.env`', 'Todos os anteriores'], answer: 1, explain: 'O lock garante instalações reproduzíveis. O `node_modules` reconstrói-se a partir dele, e o `.env` tem segredos que nunca devem ser commitados.' },
    { id: 'nd4', prompt: 'Qual é a diferença entre `npm install` e `npm ci`?', options: ['Nenhuma', '`npm ci` instala exatamente o que está no lock, apagando o node_modules antes', '`npm ci` é mais lento', '`npm ci` só instala devDependencies'], answer: 1, explain: 'É por isso que `npm ci` é o comando certo em integração contínua e produção: garante a mesma árvore de dependências em qualquer máquina.' },
    { id: 'nd5', prompt: 'Quando é aceitável usar `fs.readFileSync`?', options: ['Sempre, é mais simples', 'Nunca', 'Em scripts e no arranque de um programa, mas não a atender pedidos', 'Só em ficheiros grandes'], answer: 2, explain: 'A versão síncrona bloqueia a linha de execução inteira. No arranque isso é irrelevante e o código fica mais legível; dentro de um servidor, para todos os utilizadores ao mesmo tempo.' },
    { id: 'nd6', prompt: 'Onde deve um CLI escrever as mensagens de erro?', options: ['`stdout`, com console.log', '`stderr`, com console.error', 'Num ficheiro de registo', 'Não deve escrever erros'], answer: 1, explain: 'Separar os fluxos permite `programa > resultado.txt` guardar só os dados úteis, continuando a ver os erros no terminal.' },
    { id: 'nd7', prompt: 'O que acontece se um EventEmitter emitir `"error"` sem ouvintes?', options: ['Nada', 'O processo termina', 'O erro fica em fila', 'É convertido em aviso'], answer: 1, explain: '`"error"` é o único nome de evento com tratamento especial: sem ouvinte, o Node lança e o processo morre. Regista sempre um.' },
    { id: 'nd8', prompt: 'Para correr os testes do Node é preciso instalar o quê?', options: ['Jest', 'Mocha e Chai', 'Nada — `node --test` e `node:assert` vêm incluídos', 'Vitest'], answer: 2, explain: 'Desde a versão 18 o executor de testes e as asserções fazem parte do Node. Para a maioria dos projetos chegam, e é o que este tutorial usa.' },
  ],
  exercises: [
    {
      id: 'e20-1', difficulty: 1, kind: 'predict', lang: 'js', title: 'Caminhos',
      statement: 'Que valores imprime o `path`?',
      code: `const path = require("node:path");
console.log(path.join("a", "b", "c.txt"));
console.log(path.extname("relatorio.final.pdf"));
console.log(path.basename("/x/y/notas.csv", ".csv"));`,
      accept: ['a/b/c.txt .pdf notas'],
      hint: '`extname` devolve a última extensão, com o ponto.',
      solution: '`a/b/c.txt`, `.pdf` e `notas`. O `join` usa o separador do sistema, o `extname` conta a partir do último ponto, e o `basename` com um segundo argumento remove essa extensão do resultado.',
    },
    {
      id: 'e20-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'process.argv',
      statement: 'Se o programa for chamado com `node media.js 10 20`, quantos elementos tem `process.argv` e qual é o índice do primeiro argumento do utilizador? Responde com os dois números.',
      code: `// simulação do que o Node preenche em: node media.js 10 20
const argv = ["/usr/bin/node", "/projeto/media.js", "10", "20"];
console.log(argv.length, argv.indexOf("10"));`,
      accept: ['4 2'],
      hint: 'O Node põe o executável e o caminho do script à frente.',
      solution: '`4 2`. O `process.argv[0]` é o executável do Node e o `[1]` é o caminho do script; os argumentos do utilizador começam no índice 2. Daí o idioma `const args = process.argv.slice(2)`.',
    },
    {
      id: 'e20-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'Módulo em memória',
      statement: 'Que valores são impressos?',
      code: `const fs = require("node:fs");
fs.writeFileSync("/m.js", "const oculto = 1; module.exports = { visivel: 2 };");
const m = require("./m");
console.log(m.visivel, m.oculto, typeof oculto);`,
      accept: ['2 undefined undefined'],
      hint: 'Só o que está em `module.exports` sai do módulo.',
      solution: '`2 undefined undefined`. O `oculto` existe dentro do módulo mas não foi exportado, por isso não é acessível nem como propriedade nem como variável global. É assim que os módulos dão encapsulamento em JavaScript.',
    },
    {
      id: 'e20-4', difficulty: 2, kind: 'predict', lang: 'js', title: 'Ler e resumir um ficheiro',
      statement: 'O ficheiro `/dados.txt` do laboratório contém quatro linhas `nome,nota`: Ana 14, Rui 9, Sara 18 e Tomás 11. Que valores são impressos?',
      code: `const fs = require("node:fs");
const linhas = fs.readFileSync("/dados.txt", "utf8").trim().split("\\n");
const notas = linhas.map((l) => Number(l.split(",")[1]));
console.log(linhas.length, notas.reduce((a, b) => a + b, 0), notas.filter((n) => n >= 10).length);`,
      accept: ['4 52 3'],
      hint: '14 + 9 + 18 + 11, e quantos são maiores ou iguais a 10.',
      solution: '`4 52 3`. Quatro linhas, soma 52 e três notas positivas (o 9 do Rui fica de fora). É o padrão de sempre: ler o texto, `split` para linhas, `map` para estruturar, `reduce` e `filter` para resumir.',
    },
    {
      id: 'e20-5', difficulty: 2, kind: 'code', lang: 'js', title: 'CLI de estatísticas',
      statement: 'Escreve um programa que leia números de `process.argv`, valide que são todos números, e imprima n, soma, média, mínimo e máximo. Se não houver argumentos, mostra a ajuda; se algum não for número, escreve o erro em `stderr`. Testa a escrever números na caixa Argumentos.',
      hint: '`process.argv.slice(2)` para os argumentos; `Number.isNaN` para validar; `console.error` para o erro.',
      solution: `const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Uso: estatisticas <numero> [numero...]");
} else {
  const numeros = args.map(Number);
  const invalidos = args.filter((a, i) => Number.isNaN(numeros[i]));

  if (invalidos.length > 0) {
    console.error(\`Erro: não são números: \${invalidos.join(", ")}\`);
  } else {
    const soma = numeros.reduce((a, b) => a + b, 0);
    console.log("n      =", numeros.length);
    console.log("soma   =", soma);
    console.log("média  =", (soma / numeros.length).toFixed(2));
    console.log("mínimo =", Math.min(...numeros));
    console.log("máximo =", Math.max(...numeros));
  }
}`,
    },
    {
      id: 'e20-6', difficulty: 3, kind: 'code', lang: 'js', title: 'Processar um CSV e testar',
      statement: 'Escreve uma função `resumir(csv)` que receba o conteúdo de um ficheiro `nome,nota` e devolva `{ total, media, aprovados, melhor }`. Lê o `/dados.txt`, escreve o resultado em `/resumo.json`, e acrescenta testes com `node:test` que cubram pelo menos o caso normal e o CSV vazio.',
      hint: 'Trata o vazio devolvendo `{ total: 0, media: 0, aprovados: [], melhor: null }` — assim os testes não rebentam com divisão por zero.',
      solution: `const fs = require("node:fs");
const test = require("node:test");
const assert = require("node:assert/strict");

function resumir(csv) {
  const linhas = csv.trim().split("\\n").filter(Boolean);
  if (linhas.length === 0) return { total: 0, media: 0, aprovados: [], melhor: null };

  const alunos = linhas.map((l) => {
    const [nome, nota] = l.split(",");
    return { nome: nome.trim(), nota: Number(nota) };
  });

  return {
    total: alunos.length,
    media: Number((alunos.reduce((s, a) => s + a.nota, 0) / alunos.length).toFixed(2)),
    aprovados: alunos.filter((a) => a.nota >= 10).map((a) => a.nome),
    melhor: alunos.reduce((m, a) => (a.nota > m.nota ? a : m)).nome,
  };
}

const resumo = resumir(fs.readFileSync("/dados.txt", "utf8"));
fs.writeFileSync("/resumo.json", JSON.stringify(resumo, null, 2));
console.log(fs.readFileSync("/resumo.json", "utf8"));

test("resume um CSV normal", () => {
  const r = resumir("Ana,14\\nRui,9\\nSara,18");
  assert.strictEqual(r.total, 3);
  assert.strictEqual(r.media, 13.67);
  assert.deepStrictEqual(r.aprovados, ["Ana", "Sara"]);
  assert.strictEqual(r.melhor, "Sara");
});

test("aguenta um CSV vazio", () => {
  assert.deepStrictEqual(resumir("   "), { total: 0, media: 0, aprovados: [], melhor: null });
});`,
    },
  ],
};
