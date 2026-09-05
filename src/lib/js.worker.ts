/**
 * Worker que executa JavaScript e um subconjunto do Node.js.
 *
 * O JS corre nativamente — não é preciso carregar nada de fora. O que este worker
 * acrescenta é o ambiente do Node: `console` com o formato do Node, `process`,
 * `require` de alguns módulos internos e um sistema de ficheiros em memória, para
 * que os exemplos de ficheiros, módulos e CLI corram de verdade em vez de serem
 * blocos de código mortos. Fica num worker pela mesma razão do laboratório de
 * Python: um `while (true)` bloqueia só o worker, que o botão Parar termina.
 */

export interface RunRequest { code: string; argv?: string[] }
export type RunMessage =
  | { type: 'out'; text: string; err?: boolean }
  | { type: 'done'; error: string | null; ms: number };

const post = (m: RunMessage) => (self as any).postMessage(m);
const out = (text: string, err?: boolean) => post({ type: 'out', text, err });

const timer = self.setTimeout.bind(self);
const clear = self.clearTimeout.bind(self);

/* ------------------------------------------------- formatação à maneira do Node */

function inspect(v: unknown, profundidade = 0, vistos = new Set<unknown>()): string {
  if (typeof v === 'string') return profundidade === 0 ? v : `'${v}'`;
  if (typeof v === 'bigint') return `${v}n`;
  if (typeof v === 'function') return `[Function: ${(v as { name?: string }).name || 'anonymous'}]`;
  if (typeof v === 'symbol') return String(v);
  if (v === null || v === undefined || typeof v !== 'object') return String(v);
  if (vistos.has(v)) return '[Circular *1]';
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Date) return v.toISOString();
  if (v instanceof RegExp) return String(v);

  vistos.add(v);
  try {
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      return `[ ${v.map((x) => inspect(x, profundidade + 1, vistos)).join(', ')} ]`;
    }
    if (v instanceof Map) {
      const pares = [...v].map(([k, x]) => `${inspect(k, profundidade + 1, vistos)} => ${inspect(x, profundidade + 1, vistos)}`);
      return `Map(${v.size}) {${pares.length ? ` ${pares.join(', ')} ` : ''}}`;
    }
    if (v instanceof Set) {
      const itens = [...v].map((x) => inspect(x, profundidade + 1, vistos));
      return `Set(${v.size}) {${itens.length ? ` ${itens.join(', ')} ` : ''}}`;
    }
    if (v instanceof Promise) return 'Promise { <pending> }';

    const nome = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : '';
    const campos = Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${inspect(x, profundidade + 1, vistos)}`);
    if (campos.length === 0) return `${nome}{}`;
    return `${nome}{ ${campos.join(', ')} }`;
  } finally {
    vistos.delete(v);
  }
}

const juntar = (args: unknown[]) => args.map((a) => inspect(a)).join(' ');

/* --------------------------------------------- sistema de ficheiros em memória */

function criarFs() {
  const ficheiros = new Map<string, string>([
    ['/dados.txt', 'Ana,14\nRui,9\nSara,18\nTomás,11\n'],
    ['/notas.json', '{"turma":"12A","alunos":[{"nome":"Ana","nota":14},{"nome":"Rui","nota":9}]}'],
  ]);
  const norm = (p: string) => (p.startsWith('/') ? p : `/${p.replace(/^\.\//, '')}`);

  const fs = {
    readFileSync(p: string) {
      const k = norm(p);
      if (!ficheiros.has(k)) throw Object.assign(new Error(`ENOENT: no such file or directory, open '${p}'`), { code: 'ENOENT' });
      return ficheiros.get(k)!;
    },
    writeFileSync: (p: string, dados: unknown) => { ficheiros.set(norm(p), String(dados)); },
    appendFileSync: (p: string, dados: unknown) => { ficheiros.set(norm(p), (ficheiros.get(norm(p)) ?? '') + String(dados)); },
    existsSync: (p: string) => ficheiros.has(norm(p)),
    unlinkSync: (p: string) => { ficheiros.delete(norm(p)); },
    readdirSync: () => [...ficheiros.keys()].map((k) => k.slice(1)),
    mkdirSync: () => undefined,
    promises: {
      readFile: async (p: string) => fs.readFileSync(p),
      writeFile: async (p: string, d: unknown) => fs.writeFileSync(p, d),
      readdir: async () => fs.readdirSync(),
    },
  };
  return { fs, ficheiros };
}

const PATH = {
  sep: '/',
  join: (...p: string[]) => p.join('/').replace(/\/+/g, '/'),
  resolve: (...p: string[]) => `/${p.join('/').replace(/^\/+/, '').replace(/\/+/g, '/')}`,
  basename: (p: string, ext?: string) => {
    const b = p.split('/').pop() ?? '';
    return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b;
  },
  dirname: (p: string) => p.split('/').slice(0, -1).join('/') || '/',
  extname: (p: string) => {
    const b = p.split('/').pop() ?? '';
    const i = b.lastIndexOf('.');
    return i > 0 ? b.slice(i) : '';
  },
};

class EventEmitter {
  private ouvintes = new Map<string, ((...a: unknown[]) => void)[]>();
  on(evento: string, fn: (...a: unknown[]) => void) {
    this.ouvintes.set(evento, [...(this.ouvintes.get(evento) ?? []), fn]);
    return this;
  }
  once(evento: string, fn: (...a: unknown[]) => void) {
    const wrap = (...a: unknown[]) => { this.off(evento, wrap); fn(...a); };
    return this.on(evento, wrap);
  }
  off(evento: string, fn: (...a: unknown[]) => void) {
    this.ouvintes.set(evento, (this.ouvintes.get(evento) ?? []).filter((f) => f !== fn));
    return this;
  }
  emit(evento: string, ...a: unknown[]) {
    const fns = this.ouvintes.get(evento) ?? [];
    fns.forEach((f) => f(...a));
    return fns.length > 0;
  }
  listenerCount(evento: string) { return (this.ouvintes.get(evento) ?? []).length; }
}

class AssertionError extends Error { constructor(m: string) { super(m); this.name = 'AssertionError'; } }

function criarAssert() {
  const igual = (a: unknown, b: unknown) => inspect(a, 1) === inspect(b, 1);
  const assert = (valor: unknown, msg?: string) => { if (!valor) throw new AssertionError(msg ?? `${inspect(valor, 1)} não é verdadeiro`); };
  return Object.assign(assert, {
    ok: assert,
    equal: (a: unknown, b: unknown, m?: string) => { if (a != b) throw new AssertionError(m ?? `${inspect(a, 1)} != ${inspect(b, 1)}`); },
    strictEqual: (a: unknown, b: unknown, m?: string) => { if (a !== b) throw new AssertionError(m ?? `${inspect(a, 1)} !== ${inspect(b, 1)}`); },
    notStrictEqual: (a: unknown, b: unknown, m?: string) => { if (a === b) throw new AssertionError(m ?? `esperava algo diferente de ${inspect(a, 1)}`); },
    deepStrictEqual: (a: unknown, b: unknown, m?: string) => { if (!igual(a, b)) throw new AssertionError(m ?? `${inspect(a, 1)} não é igual a ${inspect(b, 1)}`); },
    throws: (fn: () => void, m?: string) => {
      try { fn(); } catch { return; }
      throw new AssertionError(m ?? 'esperava que lançasse um erro');
    },
    strict: undefined as unknown,
  });
}

/** `node:test` reduzido ao essencial: test(), aninhamento e um resumo no fim. */
function criarTest() {
  let passou = 0, falhou = 0, nivel = 0;
  const test = (nome: string, fn?: () => unknown): unknown => {
    const indent = '  '.repeat(nivel);
    try {
      nivel++;
      const r = fn?.();
      if (r instanceof Promise) {
        return r.then(
          () => { nivel--; passou++; out(`${indent}✔ ${nome}`); },
          (e: Error) => { nivel--; falhou++; out(`${indent}✖ ${nome}`, true); out(`${indent}  ${e.message}`, true); },
        );
      }
      nivel--; passou++; out(`${indent}✔ ${nome}`);
    } catch (e) {
      nivel--; falhou++;
      out(`${indent}✖ ${nome}`, true);
      out(`${indent}  ${(e as Error).message}`, true);
    }
    return undefined;
  };
  const resumo = () => { if (passou + falhou > 0) out(`\n${passou} a passar, ${falhou} a falhar`); };
  return { api: Object.assign(test, { test, describe: test, it: test, skip: (n: string) => out(`﹣ ${n} (saltado)`) }), resumo };
}

/* ------------------------------------------------------------------- execução */

self.onmessage = async (e: MessageEvent<RunRequest>) => {
  const { code, argv = [] } = e.data;
  const t0 = performance.now();

  const { fs } = criarFs();
  const { api: testApi, resumo } = criarTest();
  const modulos = new Map<string, unknown>();

  let pendentes = 0;
  const setTimeoutContado = (fn: (...a: unknown[]) => void, ms = 0, ...args: unknown[]) => {
    pendentes++;
    return timer(() => {
      pendentes--;
      try { fn(...args); } catch (err) { out(`Erro dentro de setTimeout: ${(err as Error).message}`, true); }
    }, ms);
  };

  const consola = {
    log: (...a: unknown[]) => out(juntar(a)),
    info: (...a: unknown[]) => out(juntar(a)),
    debug: (...a: unknown[]) => out(juntar(a)),
    warn: (...a: unknown[]) => out(juntar(a), true),
    error: (...a: unknown[]) => out(juntar(a), true),
    table: (v: unknown) => out(inspect(v)),
  };

  const process = {
    argv: ['node', '/programa.js', ...argv],
    env: { NODE_ENV: 'development', USER: 'aluno' } as Record<string, string>,
    platform: 'linux',
    version: 'v22.0.0 (simulado no browser)',
    exit: (c = 0) => { throw new Error(`process.exit(${c})`); },
    stdout: { write: (s: string) => out(String(s).replace(/\n$/, '')) },
    memoryUsage: () => ({ heapUsed: 4_194_304, heapTotal: 8_388_608 }),
    hrtime: { bigint: () => BigInt(Math.round(performance.now() * 1e6)) },
  };

  function require(nome: string): unknown {
    const chave = nome.replace(/^node:/, '');
    if (modulos.has(chave)) return modulos.get(chave);

    // módulos locais: ./algo — lidos do sistema de ficheiros em memória
    if (chave.startsWith('./') || chave.startsWith('../') || chave.startsWith('/')) {
      const caminho = chave.endsWith('.js') || chave.endsWith('.json') ? chave : `${chave}.js`;
      const fonte = fs.readFileSync(caminho);
      if (caminho.endsWith('.json')) {
        const dados = JSON.parse(fonte);
        modulos.set(chave, dados);
        return dados;
      }
      const local = { exports: {} as Record<string, unknown> };
      modulos.set(chave, local.exports);
      new Function('module', 'exports', 'require', 'console', 'process', '__filename', '__dirname', fonte)(
        local, local.exports, require, consola, process, caminho, PATH.dirname(caminho),
      );
      modulos.set(chave, local.exports);
      return local.exports;
    }
    let m: unknown;
    switch (chave) {
      case 'fs': m = fs; break;
      case 'fs/promises': m = fs.promises; break;
      case 'path': m = PATH; break;
      case 'os': m = { EOL: '\n', platform: () => 'linux', homedir: () => '/home/aluno', cpus: () => new Array(8).fill({ model: 'virtual' }) }; break;
      case 'events': m = Object.assign(EventEmitter, { EventEmitter }); break;
      case 'util': m = { inspect, format: (...a: unknown[]) => juntar(a) }; break;
      case 'assert': case 'assert/strict': m = criarAssert(); break;
      case 'test': m = testApi; break;
      case 'crypto': m = { randomUUID: () => crypto.randomUUID() }; break;
      default:
        throw new Error(`O módulo '${nome}' não está disponível no laboratório. Disponíveis: fs, path, os, events, util, assert, test, crypto.`);
    }
    modulos.set(chave, m);
    return m;
  }

  const modulo = { exports: {} as Record<string, unknown> };

  try {
    if (/^\s*(import|export)\s/m.test(code)) {
      throw new Error("O laboratório executa módulos CommonJS: usa require() e module.exports. A sintaxe import/export corre em ficheiros .mjs no teu computador.");
    }

    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    const fn = new AsyncFunction(
      'console', 'process', 'require', 'module', 'exports', 'setTimeout', 'clearTimeout', '__dirname', '__filename',
      `"use strict";\n${code}`,
    );
    await fn(consola, process, require, modulo, modulo.exports, setTimeoutContado, clear, '/', '/programa.js');

    // deixa os setTimeout pendentes correrem — é o que torna visíveis os exemplos do event loop
    const limite = performance.now() + 5000;
    while (pendentes > 0 && performance.now() < limite) {
      await new Promise((r) => timer(r, 10));
    }
    resumo();
    post({ type: 'done', error: null, ms: Math.round(performance.now() - t0) });
  } catch (err) {
    const e = err as Error;
    post({ type: 'done', error: `${e.name ?? 'Error'}: ${e.message}`, ms: Math.round(performance.now() - t0) });
  }
};
