/**
 * Interpretador de um subconjunto de Portugol (estilo VisuAlg) executado no browser.
 * Suporta: variáveis tipadas, vetores 1D/2D, condicionais, laços, funções,
 * procedimentos e recursão. Não é um compilador completo — é uma ferramenta didática.
 */

export type PValue = number | string | boolean | PArray;
export interface PArray {
  __array: true;
  dims: [number, number][]; // [inicio, fim] por dimensão
  data: Map<string, PValue>;
  base: PType;
}

export type PType = 'inteiro' | 'real' | 'caractere' | 'logico';

export interface RunResult {
  output: string[];
  error: string | null;
  steps: number;
  vars: { name: string; type: string; value: string }[];
}

/* ------------------------------------------------------------------ Léxico */

type TokKind = 'num' | 'str' | 'id' | 'kw' | 'op' | 'eof';
interface Tok { kind: TokKind; value: string; line: number }

const KEYWORDS = new Set([
  'algoritmo', 'var', 'inicio', 'fimalgoritmo', 'se', 'entao', 'senao', 'fimse',
  'enquanto', 'faca', 'fimenquanto', 'para', 'de', 'ate', 'passo', 'fimpara',
  'repita', 'escreva', 'escreval', 'leia', 'e', 'ou', 'nao', 'mod', 'div',
  'verdadeiro', 'falso', 'inteiro', 'real', 'caractere', 'literal', 'logico',
  'vetor', 'funcao', 'procedimento', 'fimfuncao', 'fimprocedimento', 'retorne',
  'escolha', 'caso', 'outrocaso', 'fimescolha', 'interrompa',
]);

const OPS = ['<-', '..', '<>', '<=', '>=', '==', ':=', '<', '>', '=', '+', '-', '*', '/', '%', '^', '(', ')', ',', ':', '[', ']'];

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  let line = 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '{') { while (i < src.length && src[i] !== '}') { if (src[i] === '\n') line++; i++; } i++; continue; }
    if (c === '"' || c === "'") {
      const quote = c;
      let s = '';
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\n') throw new PErr('String não terminada', line);
        s += src[i++];
      }
      if (i >= src.length) throw new PErr('String não terminada', line);
      i++;
      toks.push({ kind: 'str', value: s, line });
      continue;
    }
    if (/[0-9]/.test(c)) {
      let s = '';
      while (i < src.length && /[0-9]/.test(src[i])) s += src[i++];
      if (src[i] === '.' && /[0-9]/.test(src[i + 1] ?? '')) {
        s += src[i++];
        while (i < src.length && /[0-9]/.test(src[i])) s += src[i++];
      }
      toks.push({ kind: 'num', value: s, line });
      continue;
    }
    if (/[A-Za-z_\u00c0-\u024f]/.test(c)) {
      let s = '';
      while (i < src.length && /[A-Za-z0-9_\u00c0-\u024f]/.test(src[i])) s += src[i++];
      const low = stripAccents(s).toLowerCase();
      toks.push({ kind: KEYWORDS.has(low) ? 'kw' : 'id', value: low, line });
      continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (op) { toks.push({ kind: 'op', value: op, line }); i += op.length; continue; }
    throw new PErr(`Caractere inesperado "${c}"`, line);
  }
  toks.push({ kind: 'eof', value: '', line });
  return toks;
}

export class PErr extends Error {
  line: number;
  constructor(msg: string, line: number) {
    super(`Linha ${line}: ${msg}`);
    this.line = line;
  }
}

/* -------------------------------------------------------------------- AST */

type Expr =
  | { k: 'num'; v: number }
  | { k: 'str'; v: string }
  | { k: 'bool'; v: boolean }
  | { k: 'var'; name: string; line: number }
  | { k: 'index'; name: string; idx: Expr[]; line: number }
  | { k: 'un'; op: string; e: Expr; line: number }
  | { k: 'bin'; op: string; l: Expr; r: Expr; line: number }
  | { k: 'call'; name: string; args: Expr[]; line: number };

type Target = { name: string; idx?: Expr[]; line: number };

type Stmt =
  | { k: 'assign'; target: Target; e: Expr }
  | { k: 'write'; args: Expr[]; nl: boolean; line: number }
  | { k: 'read'; targets: Target[]; line: number }
  | { k: 'if'; cond: Expr; then: Stmt[]; else: Stmt[]; line: number }
  | { k: 'while'; cond: Expr; body: Stmt[]; line: number }
  | { k: 'repeat'; body: Stmt[]; cond: Expr; line: number }
  | { k: 'for'; name: string; from: Expr; to: Expr; step: Expr | null; body: Stmt[]; line: number }
  | { k: 'choose'; subject: Expr; cases: { values: Expr[]; body: Stmt[] }[]; other: Stmt[]; line: number }
  | { k: 'return'; e: Expr | null; line: number }
  | { k: 'break'; line: number }
  | { k: 'callstmt'; name: string; args: Expr[]; line: number };

interface VarDecl { name: string; type: PType; dims?: [number, number][] }
interface SubProgram { name: string; params: VarDecl[]; locals: VarDecl[]; body: Stmt[]; isFunction: boolean; retType?: PType }
interface Program { globals: VarDecl[]; subs: SubProgram[]; body: Stmt[] }

/* ----------------------------------------------------------------- Parser */

class Parser {
  toks: Tok[];
  p = 0;
  constructor(toks: Tok[]) { this.toks = toks; }

  get cur(): Tok { return this.toks[this.p]; }
  get line(): number { return this.cur.line; }
  at(v: string): boolean { return this.cur.value === v && (this.cur.kind === 'kw' || this.cur.kind === 'op'); }
  eat(v: string): boolean { if (this.at(v)) { this.p++; return true; } return false; }
  expect(v: string, what = v): Tok {
    if (!this.at(v)) throw new PErr(`esperava "${what}" mas encontrei "${this.cur.value || 'fim do ficheiro'}"`, this.line);
    return this.toks[this.p++];
  }
  ident(): string {
    if (this.cur.kind !== 'id') throw new PErr(`esperava um nome de variável, encontrei "${this.cur.value}"`, this.line);
    return this.toks[this.p++].value;
  }

  parseProgram(): Program {
    if (this.at('algoritmo')) { this.p++; if (this.cur.kind === 'str') this.p++; }
    const globals: VarDecl[] = [];
    const subs: SubProgram[] = [];
    if (this.eat('var')) globals.push(...this.parseDecls());
    while (this.at('funcao') || this.at('procedimento')) subs.push(this.parseSub());
    this.expect('inicio');
    const body = this.parseBlock(['fimalgoritmo']);
    this.expect('fimalgoritmo');
    return { globals, subs, body };
  }

  parseDecls(): VarDecl[] {
    const out: VarDecl[] = [];
    while (this.cur.kind === 'id') {
      const names = [this.ident()];
      while (this.eat(',')) names.push(this.ident());
      this.expect(':');
      const { type, dims } = this.parseType();
      for (const n of names) out.push({ name: n, type, dims });
    }
    return out;
  }

  parseType(): { type: PType; dims?: [number, number][] } {
    if (this.eat('vetor')) {
      this.expect('[');
      const dims: [number, number][] = [];
      do {
        const a = Number(this.expectNum());
        if (!this.eat('..')) this.expect('ate', '.. ou ate');
        const b = Number(this.expectNum());
        dims.push([a, b]);
      } while (this.eat(','));
      this.expect(']');
      this.expect('de');
      const type = this.baseType();
      return { type, dims };
    }
    return { type: this.baseType() };
  }

  expectNum(): string {
    if (this.cur.kind !== 'num') throw new PErr('esperava um número', this.line);
    return this.toks[this.p++].value;
  }

  baseType(): PType {
    const v = this.cur.value;
    if (['inteiro', 'real', 'caractere', 'literal', 'logico'].includes(v)) {
      this.p++;
      return (v === 'literal' ? 'caractere' : v) as PType;
    }
    throw new PErr(`tipo desconhecido "${v}" (use inteiro, real, caractere ou logico)`, this.line);
  }

  parseSub(): SubProgram {
    const isFunction = this.cur.value === 'funcao';
    this.p++;
    const name = this.ident();
    const params: VarDecl[] = [];
    if (this.eat('(')) {
      if (!this.at(')')) {
        do {
          const names = [this.ident()];
          while (this.eat(',')) names.push(this.ident());
          this.expect(':');
          const { type, dims } = this.parseType();
          for (const n of names) params.push({ name: n, type, dims });
        } while (this.eat(','));
      }
      this.expect(')');
    }
    let retType: PType | undefined;
    if (isFunction) { this.expect(':'); retType = this.baseType(); }
    const locals: VarDecl[] = [];
    if (this.eat('var')) locals.push(...this.parseDecls());
    this.expect('inicio');
    const end = isFunction ? 'fimfuncao' : 'fimprocedimento';
    const body = this.parseBlock([end]);
    this.expect(end);
    return { name, params, locals, body, isFunction, retType };
  }

  parseBlock(stops: string[]): Stmt[] {
    const out: Stmt[] = [];
    while (!stops.some((s) => this.at(s)) && this.cur.kind !== 'eof') out.push(this.parseStmt());
    if (this.cur.kind === 'eof' && stops.length) throw new PErr(`faltou "${stops[0]}"`, this.line);
    return out;
  }

  parseStmt(): Stmt {
    const line = this.line;
    if (this.at('escreva') || this.at('escreval')) {
      const nl = this.cur.value === 'escreval';
      this.p++;
      const args: Expr[] = [];
      if (this.eat('(')) {
        if (!this.at(')')) { do { args.push(this.parseExpr()); } while (this.eat(',')); }
        this.expect(')');
      }
      return { k: 'write', args, nl, line };
    }
    if (this.eat('leia')) {
      this.expect('(');
      const targets: Target[] = [];
      do { targets.push(this.parseTarget()); } while (this.eat(','));
      this.expect(')');
      return { k: 'read', targets, line };
    }
    if (this.eat('se')) {
      const cond = this.parseExpr();
      this.expect('entao');
      const then = this.parseBlock(['senao', 'fimse']);
      let els: Stmt[] = [];
      if (this.eat('senao')) els = this.parseBlock(['fimse']);
      this.expect('fimse');
      return { k: 'if', cond, then, else: els, line };
    }
    if (this.eat('enquanto')) {
      const cond = this.parseExpr();
      this.expect('faca');
      const body = this.parseBlock(['fimenquanto']);
      this.expect('fimenquanto');
      return { k: 'while', cond, body, line };
    }
    if (this.eat('repita')) {
      const body = this.parseBlock(['ate']);
      this.expect('ate');
      const cond = this.parseExpr();
      return { k: 'repeat', body, cond, line };
    }
    if (this.eat('para')) {
      const name = this.ident();
      if (!this.eat('de')) { this.expect('<-', 'de'); }
      const from = this.parseExpr();
      this.expect('ate');
      const to = this.parseExpr();
      let step: Expr | null = null;
      if (this.eat('passo')) step = this.parseExpr();
      this.expect('faca');
      const body = this.parseBlock(['fimpara']);
      this.expect('fimpara');
      return { k: 'for', name, from, to, step, body, line };
    }
    if (this.eat('escolha')) {
      const subject = this.parseExpr();
      const cases: { values: Expr[]; body: Stmt[] }[] = [];
      let other: Stmt[] = [];
      while (this.eat('caso')) {
        const values: Expr[] = [];
        do { values.push(this.parseExpr()); } while (this.eat(','));
        const body = this.parseBlock(['caso', 'outrocaso', 'fimescolha']);
        cases.push({ values, body });
      }
      if (this.eat('outrocaso')) other = this.parseBlock(['fimescolha']);
      this.expect('fimescolha');
      return { k: 'choose', subject, cases, other, line };
    }
    if (this.eat('retorne')) {
      const e = this.at('fimfuncao') || this.at('fimprocedimento') ? null : this.parseExpr();
      return { k: 'return', e, line };
    }
    if (this.eat('interrompa')) return { k: 'break', line };

    // atribuição ou chamada de procedimento
    const target = this.parseTarget();
    if (this.eat('<-') || this.eat(':=')) {
      const e = this.parseExpr();
      return { k: 'assign', target, e };
    }
    if (this.at('(')) {
      this.p++;
      const args: Expr[] = [];
      if (!this.at(')')) { do { args.push(this.parseExpr()); } while (this.eat(',')); }
      this.expect(')');
      return { k: 'callstmt', name: target.name, args, line };
    }
    return { k: 'callstmt', name: target.name, args: [], line };
  }

  parseTarget(): Target {
    const line = this.line;
    const name = this.ident();
    if (this.at('[')) {
      this.p++;
      const idx: Expr[] = [];
      do { idx.push(this.parseExpr()); } while (this.eat(','));
      this.expect(']');
      return { name, idx, line };
    }
    return { name, line };
  }

  parseExpr(): Expr { return this.parseOr(); }

  parseOr(): Expr {
    let l = this.parseAnd();
    while (this.at('ou')) { const line = this.line; this.p++; l = { k: 'bin', op: 'ou', l, r: this.parseAnd(), line }; }
    return l;
  }
  parseAnd(): Expr {
    let l = this.parseNot();
    while (this.at('e')) { const line = this.line; this.p++; l = { k: 'bin', op: 'e', l, r: this.parseNot(), line }; }
    return l;
  }
  parseNot(): Expr {
    if (this.at('nao')) { const line = this.line; this.p++; return { k: 'un', op: 'nao', e: this.parseNot(), line }; }
    return this.parseCmp();
  }
  parseCmp(): Expr {
    let l = this.parseAdd();
    while (['=', '==', '<>', '<', '>', '<=', '>='].some((o) => this.at(o))) {
      const line = this.line;
      const op = this.toks[this.p++].value;
      l = { k: 'bin', op: op === '==' ? '=' : op, l, r: this.parseAdd(), line };
    }
    return l;
  }
  parseAdd(): Expr {
    let l = this.parseMul();
    while (this.at('+') || this.at('-')) {
      const line = this.line;
      const op = this.toks[this.p++].value;
      l = { k: 'bin', op, l, r: this.parseMul(), line };
    }
    return l;
  }
  parseMul(): Expr {
    let l = this.parsePow();
    while (this.at('*') || this.at('/') || this.at('%') || this.at('mod') || this.at('div')) {
      const line = this.line;
      const op = this.toks[this.p++].value;
      l = { k: 'bin', op: op === 'mod' ? '%' : op, l, r: this.parsePow(), line };
    }
    return l;
  }
  parsePow(): Expr {
    const l = this.parseUnary();
    if (this.at('^')) { const line = this.line; this.p++; return { k: 'bin', op: '^', l, r: this.parsePow(), line }; }
    return l;
  }
  parseUnary(): Expr {
    if (this.at('-')) { const line = this.line; this.p++; return { k: 'un', op: '-', e: this.parseUnary(), line }; }
    if (this.at('+')) { this.p++; return this.parseUnary(); }
    return this.parsePrimary();
  }
  parsePrimary(): Expr {
    const t = this.cur;
    if (t.kind === 'num') { this.p++; return { k: 'num', v: Number(t.value) }; }
    if (t.kind === 'str') { this.p++; return { k: 'str', v: t.value }; }
    if (this.at('verdadeiro')) { this.p++; return { k: 'bool', v: true }; }
    if (this.at('falso')) { this.p++; return { k: 'bool', v: false }; }
    if (this.eat('(')) { const e = this.parseExpr(); this.expect(')'); return e; }
    if (t.kind === 'id') {
      this.p++;
      if (this.at('(')) {
        this.p++;
        const args: Expr[] = [];
        if (!this.at(')')) { do { args.push(this.parseExpr()); } while (this.eat(',')); }
        this.expect(')');
        return { k: 'call', name: t.value, args, line: t.line };
      }
      if (this.at('[')) {
        this.p++;
        const idx: Expr[] = [];
        do { idx.push(this.parseExpr()); } while (this.eat(','));
        this.expect(']');
        return { k: 'index', name: t.value, idx, line: t.line };
      }
      return { k: 'var', name: t.value, line: t.line };
    }
    throw new PErr(`expressão inesperada perto de "${t.value || 'fim'}"`, t.line);
  }
}

/* ----------------------------------------------------------- Interpretador */

class BreakSignal { }
class ReturnSignal {
  value: PValue | null;
  constructor(value: PValue | null) { this.value = value; }
}

const MAX_STEPS = 400_000;
const MAX_OUTPUT = 4000;
const MAX_DEPTH = 400;

function defaultFor(t: PType): PValue {
  return t === 'caractere' ? '' : t === 'logico' ? false : 0;
}

function makeArray(d: VarDecl): PArray {
  return { __array: true, dims: d.dims!, data: new Map(), base: d.type };
}

export function fmt(v: PValue): string {
  if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return String(v);
    return String(Number(v.toFixed(6)));
  }
  if (typeof v === 'string') return v;
  return '<vetor>';
}

interface Scope { vars: Map<string, PValue>; types: Map<string, PType> }

export function run(src: string, inputText = ''): RunResult {
  const output: string[] = [];
  let pending = '';
  let steps = 0;
  const inputs = inputText.split(/\r?\n/).filter((_, i, a) => !(i === a.length - 1 && a[i] === ''));
  let inputPos = 0;

  const push = (s: string) => {
    pending += s;
  };
  const flush = () => {
    output.push(pending);
    pending = '';
    if (output.length > MAX_OUTPUT) throw new Error('Saída demasiado longa — verifica se há um laço infinito.');
  };

  let program: Program;
  try {
    program = new Parser(tokenize(src)).parseProgram();
  } catch (e) {
    return { output: [], error: e instanceof Error ? e.message : String(e), steps: 0, vars: [] };
  }

  const subs = new Map(program.subs.map((s) => [s.name, s]));
  const globalScope: Scope = { vars: new Map(), types: new Map() };
  for (const d of program.globals) {
    globalScope.vars.set(d.name, d.dims ? makeArray(d) : defaultFor(d.type));
    globalScope.types.set(d.name, d.type);
  }

  const tick = (line: number) => {
    if (++steps > MAX_STEPS) throw new PErr('limite de passos atingido — provavelmente há um laço infinito', line);
  };

  function coerce(type: PType | undefined, v: PValue, line: number): PValue {
    if (!type) return v;
    if (type === 'inteiro') {
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (typeof v === 'string') { const n = Number(v); if (Number.isNaN(n)) throw new PErr(`"${v}" não é um número inteiro`, line); return Math.trunc(n); }
      if (typeof v === 'number') return Math.trunc(v);
    }
    if (type === 'real') {
      if (typeof v === 'string') { const n = Number(v); if (Number.isNaN(n)) throw new PErr(`"${v}" não é um número`, line); return n; }
      if (typeof v === 'boolean') return v ? 1 : 0;
      return v;
    }
    if (type === 'caractere') return typeof v === 'string' ? v : fmt(v);
    if (type === 'logico') {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string') return v.toLowerCase() === 'verdadeiro' || v.toLowerCase() === 'v';
      return v !== 0;
    }
    return v;
  }

  function lookup(scope: Scope, name: string, line: number): { scope: Scope } {
    if (scope.vars.has(name)) return { scope };
    if (globalScope.vars.has(name)) return { scope: globalScope };
    throw new PErr(`variável "${name}" não foi declarada na secção var`, line);
  }

  function arrayKey(arr: PArray, idx: number[], line: number): string {
    if (idx.length !== arr.dims.length) throw new PErr(`o vetor espera ${arr.dims.length} índice(s)`, line);
    idx.forEach((v, i) => {
      const [a, b] = arr.dims[i];
      if (v < a || v > b) throw new PErr(`índice ${v} fora dos limites [${a}..${b}]`, line);
    });
    return idx.join(',');
  }

  function evalExpr(e: Expr, scope: Scope): PValue {
    switch (e.k) {
      case 'num': return e.v;
      case 'str': return e.v;
      case 'bool': return e.v;
      case 'var': {
        const { scope: s } = lookup(scope, e.name, e.line);
        return s.vars.get(e.name)!;
      }
      case 'index': {
        const { scope: s } = lookup(scope, e.name, e.line);
        const arr = s.vars.get(e.name);
        if (!arr || typeof arr !== 'object') throw new PErr(`"${e.name}" não é um vetor`, e.line);
        const idx = e.idx.map((x) => Math.trunc(Number(evalExpr(x, scope))));
        const key = arrayKey(arr, idx, e.line);
        return arr.data.get(key) ?? defaultFor(arr.base);
      }
      case 'un': {
        const v = evalExpr(e.e, scope);
        if (e.op === '-') return -Number(v);
        return !truthy(v);
      }
      case 'call': return callBuiltinOrSub(e.name, e.args.map((a) => evalExpr(a, scope)), e.line);
      case 'bin': {
        const op = e.op;
        if (op === 'e') return truthy(evalExpr(e.l, scope)) && truthy(evalExpr(e.r, scope));
        if (op === 'ou') return truthy(evalExpr(e.l, scope)) || truthy(evalExpr(e.r, scope));
        const l = evalExpr(e.l, scope);
        const r = evalExpr(e.r, scope);
        switch (op) {
          case '+':
            if (typeof l === 'string' || typeof r === 'string') return fmt(l) + fmt(r);
            return Number(l) + Number(r);
          case '-': return Number(l) - Number(r);
          case '*': return Number(l) * Number(r);
          case '/':
            if (Number(r) === 0) throw new PErr('divisão por zero', e.line);
            return Number(l) / Number(r);
          case 'div':
            if (Number(r) === 0) throw new PErr('divisão por zero', e.line);
            return Math.trunc(Number(l) / Number(r));
          case '%':
            if (Number(r) === 0) throw new PErr('resto de divisão por zero', e.line);
            return Number(l) % Number(r);
          case '^': return Number(l) ** Number(r);
          case '=': return eq(l, r);
          case '<>': return !eq(l, r);
          case '<': return cmp(l, r) < 0;
          case '>': return cmp(l, r) > 0;
          case '<=': return cmp(l, r) <= 0;
          case '>=': return cmp(l, r) >= 0;
          default: throw new PErr(`operador desconhecido "${op}"`, e.line);
        }
      }
    }
  }

  function eq(a: PValue, b: PValue): boolean {
    if (typeof a === 'string' || typeof b === 'string') return fmt(a) === fmt(b);
    return Number(a) === Number(b);
  }
  function cmp(a: PValue, b: PValue): number {
    if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0;
    return Number(a) - Number(b);
  }
  function truthy(v: PValue): boolean {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v.toLowerCase() === 'verdadeiro';
    return false;
  }

  let depth = 0;

  function callBuiltinOrSub(name: string, args: PValue[], line: number): PValue {
    const n = args.map((a) => Number(a));
    switch (name) {
      case 'abs': return Math.abs(n[0]);
      case 'raiz':
      case 'raizq': return Math.sqrt(n[0]);
      case 'int':
      case 'trunc': return Math.trunc(n[0]);
      case 'arredondar': return Math.round(n[0] * 10 ** (n[1] ?? 0)) / 10 ** (n[1] ?? 0);
      case 'exp':
      case 'potencia': return n[0] ** n[1];
      case 'log': return Math.log10(n[0]);
      case 'aleatorio': return Math.floor(Math.random() * ((n[1] ?? 100) - (n[0] ?? 0) + 1)) + (n[0] ?? 0);
      case 'compr':
      case 'tamanho': return String(args[0]).length;
      case 'maiusc': return String(args[0]).toUpperCase();
      case 'minusc': return String(args[0]).toLowerCase();
      case 'copia':
      case 'subtexto': return String(args[0]).substring(n[1] - 1, n[1] - 1 + n[2]);
      case 'asc': return String(args[0]).charCodeAt(0);
      case 'carac': return String.fromCharCode(n[0]);
      case 'numpcarac': return fmt(args[0]);
      case 'caracpnum': return Number(String(args[0]));
      default: break;
    }
    const sub = subs.get(name);
    if (!sub) throw new PErr(`"${name}" não é uma função conhecida nem foi declarada`, line);
    if (++depth > MAX_DEPTH) { depth--; throw new PErr('recursão demasiado profunda (mais de 400 chamadas encadeadas)', line); }
    const local: Scope = { vars: new Map(), types: new Map() };
    sub.params.forEach((p, i) => {
      local.vars.set(p.name, p.dims ? makeArray(p) : coerce(p.type, args[i] ?? defaultFor(p.type), line));
      local.types.set(p.name, p.type);
    });
    for (const d of sub.locals) {
      local.vars.set(d.name, d.dims ? makeArray(d) : defaultFor(d.type));
      local.types.set(d.name, d.type);
    }
    local.vars.set(sub.name, defaultFor(sub.retType ?? 'inteiro'));
    local.types.set(sub.name, sub.retType ?? 'inteiro');
    let ret: PValue | null = null;
    try {
      execBlock(sub.body, local);
    } catch (sig) {
      if (sig instanceof ReturnSignal) ret = sig.value;
      else { depth--; throw sig; }
    }
    depth--;
    if (!sub.isFunction) return 0;
    const v = ret ?? local.vars.get(sub.name)!;
    return coerce(sub.retType, v, line);
  }

  function assign(target: Target, value: PValue, scope: Scope) {
    const { scope: s } = lookup(scope, target.name, target.line);
    if (target.idx) {
      const arr = s.vars.get(target.name);
      if (!arr || typeof arr !== 'object') throw new PErr(`"${target.name}" não é um vetor`, target.line);
      const idx = target.idx.map((x) => Math.trunc(Number(evalExpr(x, scope))));
      arr.data.set(arrayKey(arr, idx, target.line), coerce(arr.base, value, target.line));
      return;
    }
    s.vars.set(target.name, coerce(s.types.get(target.name), value, target.line));
  }

  function execBlock(stmts: Stmt[], scope: Scope) {
    for (const st of stmts) exec(st, scope);
  }

  function exec(st: Stmt, scope: Scope) {
    tick('line' in st ? st.line : st.target.line);
    switch (st.k) {
      case 'assign':
        assign(st.target, evalExpr(st.e, scope), scope);
        return;
      case 'write': {
        for (const a of st.args) push(fmt(evalExpr(a, scope)));
        if (st.nl) flush();
        return;
      }
      case 'read': {
        for (const t of st.targets) {
          if (inputPos >= inputs.length) throw new PErr('faltam dados de entrada — escreve os valores no painel "Entrada", um por linha', st.line);
          assign(t, inputs[inputPos++], scope);
        }
        return;
      }
      case 'if':
        if (truthy(evalExpr(st.cond, scope))) execBlock(st.then, scope);
        else execBlock(st.else, scope);
        return;
      case 'while':
        while (truthy(evalExpr(st.cond, scope))) {
          tick(st.line);
          try { execBlock(st.body, scope); } catch (s) { if (s instanceof BreakSignal) break; throw s; }
        }
        return;
      case 'repeat':
        for (;;) {
          tick(st.line);
          try { execBlock(st.body, scope); } catch (s) { if (s instanceof BreakSignal) break; throw s; }
          if (truthy(evalExpr(st.cond, scope))) break;
        }
        return;
      case 'for': {
        const from = Number(evalExpr(st.from, scope));
        const to = Number(evalExpr(st.to, scope));
        const step = st.step ? Number(evalExpr(st.step, scope)) : 1;
        if (step === 0) throw new PErr('o passo do "para" não pode ser zero', st.line);
        lookup(scope, st.name, st.line);
        for (let i = from; step > 0 ? i <= to : i >= to; i += step) {
          tick(st.line);
          assign({ name: st.name, line: st.line }, i, scope);
          try { execBlock(st.body, scope); } catch (s) { if (s instanceof BreakSignal) break; throw s; }
        }
        return;
      }
      case 'choose': {
        const v = evalExpr(st.subject, scope);
        for (const c of st.cases) {
          if (c.values.some((x) => eq(evalExpr(x, scope), v))) {
            try { execBlock(c.body, scope); } catch (s) { if (!(s instanceof BreakSignal)) throw s; }
            return;
          }
        }
        execBlock(st.other, scope);
        return;
      }
      case 'return':
        throw new ReturnSignal(st.e ? evalExpr(st.e, scope) : null);
      case 'break':
        throw new BreakSignal();
      case 'callstmt':
        callBuiltinOrSub(st.name, st.args.map((a) => evalExpr(a, scope)), st.line);
        return;
    }
  }

  let error: string | null = null;
  try {
    execBlock(program.body, globalScope);
  } catch (e) {
    if (e instanceof ReturnSignal || e instanceof BreakSignal) error = null;
    else error = e instanceof Error ? e.message : String(e);
  }
  if (pending !== '') flush();

  const vars = [...globalScope.vars.entries()].map(([name, value]) => ({
    name,
    type: globalScope.types.get(name) ?? '?',
    value: typeof value === 'object'
      ? `[${[...value.data.entries()].sort().map(([k, v]) => `${k}:${fmt(v)}`).join(', ')}]`
      : fmt(value),
  }));

  return { output, error, steps, vars };
}
