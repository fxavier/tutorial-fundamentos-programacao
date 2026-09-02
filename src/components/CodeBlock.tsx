import { useState } from 'react';

type Lang = 'portugol' | 'js' | 'python' | 'java' | 'bash' | 'text';

const KEYWORDS: Record<string, string[]> = {
  portugol: ['algoritmo', 'var', 'inicio', 'fimalgoritmo', 'se', 'entao', 'senao', 'fimse', 'enquanto', 'faca', 'fimenquanto', 'para', 'de', 'ate', 'passo', 'fimpara', 'repita', 'escreva', 'escreval', 'leia', 'e', 'ou', 'nao', 'mod', 'div', 'verdadeiro', 'falso', 'inteiro', 'real', 'caractere', 'literal', 'logico', 'vetor', 'funcao', 'procedimento', 'fimfuncao', 'fimprocedimento', 'retorne', 'escolha', 'caso', 'outrocaso', 'fimescolha', 'interrompa'],
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'class', 'new', 'true', 'false', 'null', 'undefined', 'import', 'export', 'from', 'of', 'in', 'typeof', 'console'],
  python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'import', 'from', 'class', 'print', 'range', 'len'],
  java: ['public', 'private', 'class', 'static', 'void', 'int', 'double', 'boolean', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'true', 'false', 'null', 'System'],
  bash: ['cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'echo', 'git', 'npm', 'node', 'pwd', 'grep', 'chmod', 'sudo'],
  text: [],
};

function highlight(code: string, lang: Lang) {
  const kws = new Set(KEYWORDS[lang] ?? []);
  const tokenRe = /(\/\/.*$|#.*$|"[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|<-|[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ0-9_]*)/gm;
  const out: { t: string; c: string }[] = [];
  let last = 0;
  for (const m of code.matchAll(tokenRe)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ t: code.slice(last, idx), c: '' });
    const tok = m[0];
    let cls = '';
    if (tok.startsWith('//') || (lang === 'python' && tok.startsWith('#')) || (lang === 'bash' && tok.startsWith('#'))) cls = 'text-emerald-600 dark:text-emerald-400 italic';
    else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'text-amber-600 dark:text-amber-300';
    else if (/^\d/.test(tok)) cls = 'text-sky-600 dark:text-sky-300';
    else if (tok === '<-') cls = 'text-pink-600 dark:text-pink-400 font-semibold';
    else if (kws.has(tok) || kws.has(tok.toLowerCase())) cls = 'text-violet-600 dark:text-violet-300 font-semibold';
    out.push({ t: tok, c: cls });
    last = idx + tok.length;
  }
  if (last < code.length) out.push({ t: code.slice(last), c: '' });
  return out;
}

export function CodeBlock({ code, lang = 'text', caption }: { code: string; lang?: string; caption?: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = highlight(code, (lang as Lang) ?? 'text');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard indisponível */ }
  };

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-soft surface-sunken">
      <div className="flex items-center justify-between border-b border-soft px-4 py-2">
        <span className="font-mono text-[0.7rem] font-semibold tracking-widest text-muted uppercase">{caption ?? lang}</span>
        <button onClick={copy} className="btn btn-ghost btn-sm" aria-label="Copiar código">
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 text-[0.83rem] leading-relaxed">
        <code className="font-mono">
          {tokens.map((t, i) => (t.c ? <span key={i} className={t.c}>{t.t}</span> : <span key={i}>{t.t}</span>))}
        </code>
      </pre>
    </figure>
  );
}
