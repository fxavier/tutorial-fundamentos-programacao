import type { Module } from '../types';

export const m18: Module = {
  id: 'javascript-async',
  number: 18,
  title: 'Assíncrono e o event loop',
  subtitle: 'Callbacks, promessas, async/await — e a ordem em que o JavaScript faz as coisas',
  icon: '⏳',
  minutes: 60,
  goals: [
    'Perceber porque é que o JavaScript é assíncrono e o que isso resolve',
    'Ler e escrever promessas, e converter callbacks em promessas',
    'Usar `async`/`await` com tratamento de erros correto',
    'Prever a ordem de execução entre código síncrono, microtarefas e macrotarefas',
    'Escolher entre `Promise.all`, `race`, `any` e `allSettled`',
  ],
  sections: [
    {
      id: 'porque-assincrono',
      title: 'Porquê assíncrono',
      blocks: [
        { type: 'p', text: 'O JavaScript corre numa **única linha de execução** (*single-threaded*): há uma pilha de chamadas e só uma coisa acontece de cada vez. Se uma operação demorada bloqueasse essa linha — ler um ficheiro, esperar por um servidor — a página congelaria: nada de cliques, nada de animações, nada de desenho.' },
        { type: 'p', text: 'A solução não foi criar threads, foi delegar. Quando pedes algo ao ambiente (um temporizador, um pedido de rede, uma leitura de disco), o trabalho sai da linha de execução e vai para o browser ou para o Node. Quando termina, a função que deixaste à espera é **posta numa fila** e corre quando a pilha estiver livre.' },
        {
          type: 'steps',
          items: [
            { title: 'A pilha de chamadas', text: 'Onde o código corre, uma função de cada vez. Enquanto houver aqui alguma coisa, mais nada acontece.' },
            { title: 'As APIs do ambiente', text: '`setTimeout`, `fetch`, `fs.readFile` — não fazem parte da linguagem. O browser ou o Node tratam delas em paralelo.' },
            { title: 'As filas de tarefas', text: 'Quando uma operação termina, o seu callback entra numa fila: microtarefas (promessas) ou macrotarefas (temporizadores, eventos).' },
            { title: 'O event loop', text: 'Um ciclo infinito: se a pilha estiver vazia, esvazia **toda** a fila de microtarefas e só depois tira **uma** macrotarefa.' },
          ],
        },
        { type: 'callout', tone: 'key', text: 'Assíncrono **não é** paralelo. Continua a haver uma só linha de execução a correr o teu código; o que corre em paralelo é a espera, tratada pelo ambiente. É por isso que um ciclo `while (true)` bloqueia tudo, mesmo num programa cheio de promessas.' },
        { type: 'widget', id: 'js-lab', props: { set: 'async' } },
      ],
    },
    {
      id: 'callbacks',
      title: 'Callbacks: o ponto de partida',
      blocks: [
        { type: 'p', text: 'A primeira forma de dizer "faz isto quando terminares" foi passar uma função como argumento. Funciona, mas encadear várias operações produz o chamado **inferno dos callbacks** — código que cresce para a direita e cujo tratamento de erros é repetido em cada nível.' },
        { type: 'code', lang: 'js', caption: 'a pirâmide da perdição', code: `function pedir(ms, valor, cb) {
  setTimeout(() => cb(null, valor), ms);   // convenção do Node: erro primeiro
}

pedir(20, "utilizador", (err, u) => {
  if (err) return console.error(err);
  pedir(20, "encomendas de " + u, (err, e) => {
    if (err) return console.error(err);
    pedir(20, "detalhes de " + e, (err, d) => {
      if (err) return console.error(err);
      console.log(d);           // três níveis para três passos
    });
  });
});` },
        { type: 'callout', tone: 'trap', title: 'Não podes devolver de dentro de um callback', text: 'A função exterior já terminou muito antes de o callback correr. `function ler() { fs.readFile(f, (e, d) => { return d; }); }` devolve sempre `undefined` — é o mal-entendido mais comum de quem começa em assíncrono.' },
      ],
    },
    {
      id: 'promessas',
      title: 'Promessas',
      blocks: [
        { type: 'p', text: 'Uma **promessa** é um objeto que representa um valor que ainda não existe. Tem três estados: pendente, cumprida (*fulfilled*) com um valor, ou rejeitada com um erro. Uma vez resolvida, nunca mais muda.' },
        { type: 'code', lang: 'js', caption: 'criar e consumir', code: `const esperar = (ms, valor) =>
  new Promise((resolve, rejeitar) => {
    if (ms < 0) rejeitar(new Error("tempo negativo"));
    setTimeout(() => resolve(valor), ms);
  });

esperar(20, "A")
  .then((a) => esperar(20, a + "B"))     // devolver uma promessa encadeia
  .then((ab) => { console.log(ab + "C"); return "fim"; })
  .then((f) => console.log(f))
  .catch((e) => console.error("falhou:", e.message))   // apanha TODO o encadeamento
  .finally(() => console.log("acabou, com ou sem erro"));

console.log("esta linha corre PRIMEIRO");` },
        {
          type: 'table',
          head: ['Método', 'Faz', 'Devolve'],
          rows: [
            ['`.then(fn)`', 'Corre `fn` com o valor quando cumprir', 'Uma promessa nova'],
            ['`.catch(fn)`', 'Corre `fn` se alguma etapa anterior rejeitar', 'Uma promessa nova'],
            ['`.finally(fn)`', 'Corre sempre, sem receber o valor', 'Uma promessa nova'],
            ['`Promise.resolve(v)`', 'Promessa já cumprida', 'Promessa'],
            ['`Promise.reject(e)`', 'Promessa já rejeitada', 'Promessa'],
          ],
        },
        { type: 'callout', tone: 'key', text: 'Cada `.then` devolve uma promessa nova — é isso que permite encadear em vez de aninhar. E um único `.catch` no fim apanha os erros de toda a cadeia, em vez de um `if (err)` por nível.' },
      ],
    },
    {
      id: 'async-await',
      title: 'async / await',
      blocks: [
        { type: 'p', text: '`async`/`await` é açúcar sintático por cima das promessas: o código passa a **ler-se como síncrono**, mantendo-se assíncrono por baixo. É a forma que se escreve hoje; `.then` fica para cadeias curtas e para casos em que não se quer criar uma função assíncrona.' },
        { type: 'code', lang: 'js', caption: 'a mesma coisa, três formas', code: `const pedir = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

// com .then
function comThen() {
  return pedir(20, "utilizador")
    .then((u) => pedir(20, u + " -> encomendas"))
    .then((e) => console.log("then:", e));
}

// com async/await
async function comAwait() {
  const u = await pedir(20, "utilizador");
  const e = await pedir(20, u + " -> encomendas");
  console.log("await:", e);
}

await comThen();
await comAwait();` },
        {
          type: 'terms',
          items: [
            { term: '`async`', def: 'Marca uma função. Passa a devolver **sempre** uma promessa, mesmo que o `return` seja um valor simples.' },
            { term: '`await`', def: 'Espera que a promessa resolva e devolve o valor. Só é válido dentro de `async` (ou no topo de um módulo).' },
            { term: 'Erro', def: 'Uma promessa rejeitada faz o `await` **lançar** — apanha-se com `try`/`catch` normal.' },
            { term: 'Bloqueia?', def: 'Só a função onde está. O resto do programa continua: `await` não trava a linha de execução.' },
          ],
        },
        { type: 'code', lang: 'js', caption: 'erros com try/catch', code: `const falhar = (ms) => new Promise((_, x) => setTimeout(() => x(new Error("rede em baixo")), ms));

async function comRede() {
  try {
    const dados = await falhar(10);
    return dados;
  } catch (e) {
    console.error("apanhado:", e.message);
    return null;                      // valor de recurso
  } finally {
    console.log("liberta recursos aqui");
  }
}

console.log(await comRede());` },
        { type: 'callout', tone: 'trap', title: 'O `await` esquecido', text: 'Chamar uma função `async` sem `await` devolve a promessa, não o valor: `const x = calcular();` deixa `x` como `Promise { <pending> }`, e um `try/catch` à volta não apanha a rejeição. Se um valor aparece como `Promise { <pending> }` no `console.log`, faltou um `await`.' },
      ],
    },
    {
      id: 'event-loop',
      title: 'O event loop: a ordem exata',
      blocks: [
        { type: 'p', text: 'Esta é a pergunta de entrevista mais frequente sobre JavaScript, e a fonte de bugs subtis. A regra é curta: **primeiro todo o código síncrono; depois toda a fila de microtarefas; só então uma macrotarefa** — e a seguir a cada macrotarefa a fila de microtarefas é esvaziada outra vez.' },
        {
          type: 'table',
          head: ['Categoria', 'Exemplos', 'Prioridade'],
          rows: [
            ['Síncrono', 'Tudo o que não espera por nada', '1.º — até a pilha esvaziar'],
            ['Microtarefas', '`.then`, `await`, `queueMicrotask`', '2.º — a fila **inteira**'],
            ['Macrotarefas', '`setTimeout`, `setInterval`, eventos de E/S', '3.º — **uma** de cada vez'],
          ],
        },
        { type: 'code', lang: 'js', caption: 'consegues prever a ordem antes de correr?', code: `console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

(async () => {
  console.log("D");
  await null;                 // tudo o que vem depois é microtarefa
  console.log("E");
})();

queueMicrotask(() => console.log("F"));

console.log("G");` },
        { type: 'callout', tone: 'key', title: 'A resposta', text: '**A, D, G, C, E, F, B.** O corpo da função assíncrona corre de imediato até ao primeiro `await` (por isso o D aparece cedo). Depois esvazia-se a fila de microtarefas pela ordem de entrada: C, E, F. O `setTimeout(…, 0)` é macrotarefa e fica sempre para o fim — o `0` significa "assim que possível", não "já".' },
        { type: 'callout', tone: 'warn', text: 'Corolário prático: uma cadeia infinita de microtarefas **nunca** deixa correr um `setTimeout`. E um ciclo síncrono pesado bloqueia tudo, promessas incluídas — assíncrono não torna o código mais rápido, só evita a espera parada.' },
      ],
    },
    {
      id: 'paralelo',
      title: 'Correr em paralelo',
      blocks: [
        { type: 'p', text: 'Dois `await` seguidos correm **em série**: o segundo pedido só começa quando o primeiro termina. Se forem independentes, isso é tempo desperdiçado.' },
        { type: 'code', lang: 'js', caption: 'em série contra em paralelo', code: `const pedir = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

// em série: 200 ms
let t = Date.now();
const a1 = await pedir(100, "A");
const b1 = await pedir(100, "B");
console.log("série:", a1, b1, Math.round((Date.now() - t) / 50) * 50, "ms");

// em paralelo: 100 ms — arrancam os dois e espera-se pelos dois
t = Date.now();
const [a2, b2] = await Promise.all([pedir(100, "A"), pedir(100, "B")]);
console.log("paralelo:", a2, b2, Math.round((Date.now() - t) / 50) * 50, "ms");` },
        {
          type: 'table',
          head: ['Combinador', 'Espera por', 'Se uma falhar', 'Usa quando'],
          rows: [
            ['`Promise.all`', 'Todas', 'Rejeita logo à primeira', 'Precisas de todos os resultados'],
            ['`Promise.allSettled`', 'Todas', 'Nunca rejeita: dá o estado de cada uma', 'Queres saber quais falharam'],
            ['`Promise.race`', 'A primeira a resolver', 'Rejeita se a primeira for falha', 'Tempo limite, o mais rápido de vários'],
            ['`Promise.any`', 'A primeira **cumprida**', 'Só rejeita se todas falharem', 'Vários espelhos, basta um funcionar'],
          ],
        },
        { type: 'code', lang: 'js', caption: 'um tempo limite em três linhas', code: `const pedir = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const limite = (ms) => new Promise((_, x) => setTimeout(() => x(new Error(\`passou de \${ms} ms\`)), ms));

try {
  console.log(await Promise.race([pedir(30, "chegou a tempo"), limite(100)]));
  console.log(await Promise.race([pedir(300, "demasiado lento"), limite(100)]));
} catch (e) {
  console.error(e.message);
}` },
        { type: 'callout', tone: 'tip', text: 'Num ciclo, `for (const x of lista) await f(x)` corre em série — às vezes é o que queres (para não sobrecarregar um servidor). Para paralelo: `await Promise.all(lista.map(f))`. Repara que `lista.forEach(async …)` **não** espera por nada: é um erro clássico.' },
      ],
    },
    {
      id: 'na-pratica',
      title: 'Na prática: buscar dados',
      blocks: [
        { type: 'p', text: 'No browser, os pedidos de rede fazem-se com `fetch`, que devolve uma promessa. O padrão completo, com erros e tempo limite, é este — e é praticamente o mesmo em Node.' },
        { type: 'code', lang: 'js', caption: 'o padrão completo (para correres fora do laboratório)', code: `async function buscar(url, { tempoLimite = 5000 } = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), tempoLimite);

  try {
    const resposta = await fetch(url, { signal: controlador.signal });

    // ATENÇÃO: o fetch NÃO rejeita em 404 ou 500 — só em falha de rede
    if (!resposta.ok) {
      throw new Error(\`HTTP \${resposta.status} \${resposta.statusText}\`);
    }
    return await resposta.json();
  } catch (e) {
    if (e.name === "AbortError") throw new Error("o pedido demorou demasiado");
    throw e;
  } finally {
    clearTimeout(temporizador);
  }
}

// const dados = await buscar("https://api.exemplo.pt/alunos");` },
        { type: 'callout', tone: 'trap', title: 'O `fetch` não rejeita em erros HTTP', text: 'Um 404 ou um 500 são respostas **entregues com sucesso** do ponto de vista da rede, por isso a promessa cumpre-se. Verificar `resposta.ok` não é opcional — sem isso, o teu código tenta ler JSON de uma página de erro.' },
        { type: 'callout', tone: 'warn', title: 'Rejeições sem tratamento', text: 'Uma promessa rejeitada sem `.catch` (ou sem `try`) provoca um `UnhandledPromiseRejection`. No Node moderno isso **termina o processo**. Toda a operação assíncrona precisa de um dono que trate os erros.' },
      ],
    },
  ],
  quiz: [
    { id: 'as1', prompt: 'O JavaScript é assíncrono porque…', options: ['Corre em várias threads', 'Tem uma só linha de execução e delega as esperas ao ambiente', 'É compilado', 'Usa vários processadores'], answer: 1, explain: 'Há uma única pilha de chamadas. As operações demoradas são entregues ao browser ou ao Node, e os seus callbacks voltam por uma fila quando a pilha está livre.' },
    { id: 'as2', prompt: 'Que imprime `console.log(typeof (async () => 1)())`?', options: ['`"number"`', '`"function"`', '`"object"`', '`"promise"`'], answer: 2, explain: 'Uma função `async` devolve sempre uma promessa, e `typeof promessa` é `"object"`. Para chegar ao 1 é preciso `await`.' },
    { id: 'as3', prompt: 'Numa promessa rejeitada, o `await` faz o quê?', options: ['Devolve `undefined`', 'Lança um erro, apanhável com try/catch', 'Devolve o erro como valor', 'Termina o programa em silêncio'], answer: 1, explain: 'É a grande vantagem de sintaxe: os erros assíncronos passam a tratar-se com o mesmo `try`/`catch` do código síncrono.' },
    { id: 'as4', prompt: 'Que corre primeiro: um `.then` já resolvido ou um `setTimeout(…, 0)`?', options: ['O setTimeout', 'O .then', 'Depende do browser', 'Ao mesmo tempo'], answer: 1, explain: 'O `.then` é microtarefa e a fila de microtarefas é esvaziada por inteiro antes de se tocar numa macrotarefa como o `setTimeout`.' },
    { id: 'as5', prompt: 'O que faz `Promise.all` se uma das promessas rejeitar?', options: ['Devolve os resultados das outras', 'Rejeita imediatamente com esse erro', 'Ignora a que falhou', 'Espera pelas restantes e depois rejeita'], answer: 1, explain: 'Falha à primeira. Para esperar por todas e saber quais falharam, usa-se `Promise.allSettled`.' },
    { id: 'as6', prompt: 'Dois `await` seguidos de operações independentes…', options: ['Correm em paralelo automaticamente', 'Correm em série, somando os tempos', 'Dão erro', 'São otimizados pelo motor'], answer: 1, explain: 'Cada `await` espera pelo anterior. Para as arrancar ao mesmo tempo: `await Promise.all([a(), b()])`.' },
    { id: 'as7', prompt: 'O `fetch` rejeita a promessa quando o servidor responde 404?', options: ['Sim', 'Não — só em falha de rede; é preciso verificar `resposta.ok`', 'Só em Node', 'Só se pedires JSON'], answer: 1, explain: 'Um 404 é uma resposta entregue com sucesso. Sem `if (!resposta.ok) throw …`, o código segue como se estivesse tudo bem.' },
    { id: 'as8', prompt: 'Porque é que `lista.forEach(async (x) => await f(x))` não espera por nada?', options: ['Porque `forEach` ignora o valor devolvido pelo callback', 'Porque `async` não funciona em arrow functions', 'Porque falta um `try`', 'Porque `forEach` é síncrono por natureza e não pode receber funções'], answer: 0, explain: '`forEach` deita fora as promessas devolvidas pelo callback, por isso não há nada por que esperar. A alternativa é `for (const x of lista) await f(x)` ou `await Promise.all(lista.map(f))`.' },
  ],
  exercises: [
    {
      id: 'e18-1', difficulty: 2, kind: 'predict', lang: 'js', title: 'Ordem de execução',
      statement: 'Por que ordem aparecem as letras?',
      code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
      accept: ['A D C B'],
      hint: 'Síncrono, depois microtarefas, depois macrotarefas.',
      solution: '`A D C B`. As duas linhas síncronas correm primeiro. O `.then` é microtarefa e corre assim que a pilha esvazia. O `setTimeout(…, 0)` é macrotarefa e fica para o fim — o zero significa "logo que possível", não "imediatamente".',
    },
    {
      id: 'e18-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'async devolve promessa',
      statement: 'Que é impresso?',
      code: `async function f() { return 1; }
const r = f();
console.log(r instanceof Promise);
console.log(await r);
console.log(typeof f);`,
      accept: ['true 1 function'],
      hint: 'Uma função `async` embrulha sempre o valor devolvido numa promessa.',
      solution: '`true`, `1`, `function`. Mesmo com um `return 1` simples, a função devolve uma promessa cumprida com 1. A própria `f` continua a ser uma função normal — o `async` só afeta o que ela devolve.',
    },
    {
      id: 'e18-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'await dentro de um ciclo',
      statement: 'Quantos milissegundos, aproximadamente, demora cada bloco? Responde com os dois números separados por espaço.',
      code: `const pedir = (ms) => new Promise((r) => setTimeout(r, ms));

let t = Date.now();
for (const ms of [100, 100, 100]) await pedir(ms);
const serie = Math.round((Date.now() - t) / 100) * 100;

t = Date.now();
await Promise.all([100, 100, 100].map(pedir));
const paralelo = Math.round((Date.now() - t) / 100) * 100;

console.log(serie, paralelo);`,
      accept: ['300 100'],
      hint: 'No ciclo, cada espera só começa quando a anterior acaba. No `Promise.all` arrancam as três ao mesmo tempo.',
      solution: '`300 100`. O ciclo com `await` corre em série e soma os tempos; o `Promise.all` arranca as três esperas de imediato e demora o que demorar a mais lenta. É a otimização mais rentável em código assíncrono.',
    },
    {
      id: 'e18-4', difficulty: 3, kind: 'predict', lang: 'js', title: 'allSettled',
      statement: 'Que estados são impressos, por ordem e separados por espaços?',
      code: `const ok = (v) => Promise.resolve(v);
const ko = (m) => Promise.reject(new Error(m));

const r = await Promise.allSettled([ok(1), ko("x"), ok(3)]);
console.log(r.map((x) => x.status).join(" "));`,
      accept: ['fulfilled rejected fulfilled'],
      hint: '`allSettled` nunca rejeita: espera por todas e devolve o estado de cada uma.',
      solution: '`fulfilled rejected fulfilled`. Ao contrário do `Promise.all`, que teria rejeitado logo no segundo elemento, o `allSettled` espera por todas e devolve um objeto por promessa, com `status` e depois `value` ou `reason`.',
    },
    {
      id: 'e18-5', difficulty: 2, kind: 'code', lang: 'js', title: 'Promisificar um callback',
      statement: 'Dada `lerAtrasado(ms, valor, cb)` no estilo callback do Node (erro primeiro), escreve `promisificar(fn)` que a converta numa função que devolve uma promessa. Usa-a com `await` e mostra que o erro é apanhado por `try/catch`.',
      hint: 'Devolve uma função que devolve `new Promise((resolve, reject) => fn(...args, (err, v) => err ? reject(err) : resolve(v)))`.',
      solution: `function lerAtrasado(ms, valor, cb) {
  setTimeout(() => (valor === null ? cb(new Error("valor em falta")) : cb(null, valor)), ms);
}

function promisificar(fn) {
  return (...args) =>
    new Promise((resolve, rejeitar) => {
      fn(...args, (err, valor) => (err ? rejeitar(err) : resolve(valor)));
    });
}

const ler = promisificar(lerAtrasado);

console.log(await ler(20, "chegou"));

try {
  await ler(20, null);
} catch (e) {
  console.error("apanhado:", e.message);
}`,
    },
    {
      id: 'e18-6', difficulty: 3, kind: 'code', lang: 'js', title: 'Repetir com recuo exponencial',
      statement: 'Escreve `tentar(fn, { tentativas = 3, esperaInicial = 20 })` que chame `fn()` e, se rejeitar, volte a tentar até ao limite, duplicando a espera entre tentativas. Deve registar cada tentativa e lançar o último erro se esgotar. Testa com uma função que falha as duas primeiras vezes.',
      hint: 'Um ciclo `for` com `try/catch` lá dentro; a espera é `new Promise((r) => setTimeout(r, ms))` e `ms *= 2` no fim de cada volta.',
      solution: `const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function tentar(fn, { tentativas = 3, esperaInicial = 20 } = {}) {
  let espera = esperaInicial;
  let ultimoErro;

  for (let i = 1; i <= tentativas; i++) {
    try {
      const r = await fn();
      console.log(\`tentativa \${i}: sucesso\`);
      return r;
    } catch (e) {
      ultimoErro = e;
      console.log(\`tentativa \${i}: \${e.message}\`);
      if (i < tentativas) {
        await dormir(espera);
        espera *= 2;
      }
    }
  }
  throw ultimoErro;
}

let n = 0;
const instavel = async () => {
  n += 1;
  if (n < 3) throw new Error("rede em baixo");
  return "dados";
};

console.log(await tentar(instavel));`,
    },
  ],
};
