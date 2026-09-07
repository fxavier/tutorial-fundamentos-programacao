import { useEffect, useMemo, useRef, useState } from 'react';
import { WidgetShell } from './Shell';

/**
 * Laboratório de HTML/CSS e de React.
 *
 * Ao contrário dos laboratórios de Portugol, Python e JavaScript — que correm num worker e
 * devolvem texto —, aqui o resultado é uma *página*. Por isso não há worker nenhum: o código
 * vai para um `<iframe sandbox>` por `srcdoc`, que é a forma que o próprio browser já oferece
 * para correr HTML isolado. O `console` da página é reencaminhado para a caixa de saída por
 * `postMessage`.
 *
 * ponytail: um ciclo infinito no código do aluno bloqueia a aba (o iframe partilha a thread),
 * ao contrário dos outros laboratórios. Se isso incomodar, mover a pré-visualização para um
 * iframe com `allow-scripts` num worker não resolve — a solução seria um Web Worker + OffscreenCanvas,
 * o que não vale a complexidade para um tutorial.
 */

type Mode = 'web' | 'react';
export type WebSet = 'html' | 'css' | 'layout';
export type ReactSet = 'react' | 'hooks';

const REACT_CDN = 'https://cdn.jsdelivr.net/npm';
const REACT_TAGS = [
  `<script src="${REACT_CDN}/react@18.3.1/umd/react.production.min.js"></script>`,
  `<script src="${REACT_CDN}/react-dom@18.3.1/umd/react-dom.production.min.js"></script>`,
  `<script src="${REACT_CDN}/@babel/standalone@7.26.4/babel.min.js"></script>`,
].join('\n');

const BASE_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; margin: 0; padding: 16px; color: #0f172a; background: #fff; line-height: 1.5; }`;

/** Reencaminha console e erros da página para o laboratório. */
const PONTE = `<script>
(function () {
  var texto = function (v) {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.name + ': ' + v.message;
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  };
  var envia = function (tipo, args) {
    parent.postMessage({ __lab: true, tipo: tipo, texto: Array.prototype.map.call(args, texto).join(' ') }, '*');
  };
  ['log', 'info', 'warn', 'error'].forEach(function (n) {
    var original = console[n];
    console[n] = function () { envia(n === 'log' || n === 'info' ? 'log' : 'erro', arguments); original.apply(console, arguments); };
  });
  window.onerror = function (msg, url, linha) { envia('erro', [msg + ' (linha ' + linha + ')']); };
  window.addEventListener('unhandledrejection', function (e) { envia('erro', ['Promessa rejeitada: ' + texto(e.reason)]); });
})();
</script>`;

function paginaWeb(html: string, css: string, js: string) {
  return `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BASE_CSS}</style>
<style>${css}</style>
</head><body>
${html}
${PONTE}
<script>${js}</script>
</body></html>`;
}

function paginaReact(jsx: string, css: string) {
  return `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BASE_CSS}</style>
<style>${css}</style>
${REACT_TAGS}
</head><body>
<div id="root"></div>
${PONTE}
<script type="text/babel" data-presets="react">
const { useState, useEffect, useMemo, useCallback, useRef, useReducer, createContext, useContext, Fragment } = React;
const { createRoot } = ReactDOM;
${jsx}
</script>
</body></html>`;
}

export interface WebExample { id: string; set: WebSet; name: string; html: string; css: string; js: string }
export interface ReactExample { id: string; set: ReactSet; name: string; jsx: string; css: string }

const CSS_CARTAO = `.cartao { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; max-width: 420px; }
.cartao h2 { margin: 0 0 4px; font-size: 18px; }
.cartao p { margin: 0; color: #475569; }`;

export const WEB_EXAMPLES: WebExample[] = [
  {
    id: 'html-estrutura', set: 'html', name: '1. Estrutura e texto',
    html: `<h1>Receita de panquecas</h1>
<p>Uma receita <strong>simples</strong> para <em>quatro</em> pessoas.</p>

<h2>Ingredientes</h2>
<ul>
  <li>2 ovos</li>
  <li>200 g de farinha</li>
  <li>300 ml de leite</li>
</ul>

<h2>Passos</h2>
<ol>
  <li>Bate os ovos com o leite.</li>
  <li>Junta a farinha aos poucos.</li>
  <li>Frita em lume médio.</li>
</ol>

<p>Baseado em <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTML">MDN — HTML</a>.</p>`,
    css: '', js: '',
  },
  {
    id: 'html-semantica', set: 'html', name: '2. Elementos semânticos',
    html: `<header>
  <h1>Blogue do Rui</h1>
  <nav>
    <a href="#inicio">Início</a> ·
    <a href="#artigos">Artigos</a> ·
    <a href="#sobre">Sobre</a>
  </nav>
</header>

<main>
  <article>
    <h2>Porque é que a semântica importa</h2>
    <p>Um leitor de ecrã anuncia <code>&lt;nav&gt;</code> como "navegação" e deixa saltar
       directamente para o <code>&lt;main&gt;</code>. Com <code>&lt;div&gt;</code> não anuncia nada.</p>
    <figure>
      <img src="https://placehold.co/320x120/38bdf8/ffffff?text=figura" alt="Retângulo azul de exemplo">
      <figcaption>Uma figura com legenda.</figcaption>
    </figure>
  </article>

  <aside>
    <h3>Nota lateral</h3>
    <p>Conteúdo relacionado, mas não essencial.</p>
  </aside>
</main>

<footer><small>© 2026 Rui</small></footer>`,
    css: `header, main, aside, footer { border: 1px dashed #94a3b8; padding: 8px; margin-bottom: 8px; }
article { border: 1px solid #38bdf8; padding: 8px; }
img { border-radius: 8px; }`,
    js: '',
  },
  {
    id: 'html-formulario', set: 'html', name: '3. Formulário e validação nativa',
    html: `<form id="inscricao">
  <fieldset>
    <legend>Inscrição</legend>

    <p>
      <label for="nome">Nome</label><br>
      <input id="nome" name="nome" required minlength="3" placeholder="Ana Silva">
    </p>
    <p>
      <label for="email">Email</label><br>
      <input id="email" name="email" type="email" required placeholder="ana@exemplo.pt">
    </p>
    <p>
      <label for="idade">Idade</label><br>
      <input id="idade" name="idade" type="number" min="16" max="120" value="18">
    </p>
    <p>
      <label for="curso">Curso</label><br>
      <select id="curso" name="curso">
        <option value="info">Informática</option>
        <option value="gestao">Gestão</option>
      </select>
    </p>
    <p>
      <label><input type="checkbox" name="termos" required> Aceito os termos</label>
    </p>

    <button type="submit">Inscrever</button>
  </fieldset>
</form>`,
    css: `input:invalid { border: 2px solid #ef4444; }
input:valid { border: 2px solid #22c55e; }
fieldset { max-width: 360px; border-radius: 12px; }`,
    js: `// O browser já valida required, type e min/max antes de disparar o submit.
document.getElementById("inscricao").addEventListener("submit", (e) => {
  e.preventDefault();                       // sem servidor para onde enviar
  const dados = Object.fromEntries(new FormData(e.target));
  console.log("dados válidos:", dados);
});`,
  },
  {
    id: 'html-dom', set: 'html', name: '4. HTML + JavaScript: o DOM',
    html: `<h2>Lista de tarefas</h2>
<form id="form">
  <input id="texto" placeholder="Nova tarefa" required>
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>
<p id="contador"></p>`,
    css: `li { cursor: pointer; }
li.feita { text-decoration: line-through; color: #94a3b8; }
#contador { color: #475569; font-size: 14px; }`,
    js: `const form = document.getElementById("form");
const texto = document.getElementById("texto");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");

function atualizar() {
  const total = lista.children.length;
  const feitas = lista.querySelectorAll(".feita").length;
  contador.textContent = \`\${feitas} de \${total} feitas\`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const li = document.createElement("li");
  li.textContent = texto.value;
  li.addEventListener("click", () => { li.classList.toggle("feita"); atualizar(); });
  lista.appendChild(li);
  texto.value = "";
  atualizar();
  console.log("tarefa adicionada:", li.textContent);
});

for (const t of ["Ler o módulo 21", "Fazer os exercícios"]) {
  texto.value = t;
  form.requestSubmit();
}`,
  },
  {
    id: 'css-seletores', set: 'css', name: '5. Seletores e cascata',
    html: `<p>Parágrafo normal.</p>
<p class="destaque">Tem a classe <code>.destaque</code>.</p>
<p class="destaque" id="unico">Tem classe <em>e</em> id.</p>
<p class="destaque" style="color: teal">Tem um estilo em linha.</p>
<ul>
  <li>primeiro</li><li>meio</li><li>último</li>
</ul>`,
    css: `/* especificidade: em linha (1000) > id (100) > classe (10) > elemento (1) */
p          { color: #334155; }   /* 0,0,1 */
.destaque  { color: #d97706; }   /* 0,1,0 — ganha ao anterior */
#unico     { color: #7c3aed; }   /* 1,0,0 — ganha à classe */

li:first-child { font-weight: bold; }
li:last-child  { font-style: italic; }
li:nth-child(2)::after { content: " ← selecionado por posição"; color: #94a3b8; }`,
    js: '',
  },
  {
    id: 'css-box', set: 'css', name: '6. Box model e box-sizing',
    html: `<div class="caixa conteudo">width: 200px<br>content-box</div>
<div class="caixa borda">width: 200px<br>border-box</div>`,
    css: `.caixa {
  width: 200px;
  padding: 20px;
  border: 5px solid #0ea5e9;
  margin: 12px 0;
  background: #e0f2fe;
}

/* content-box (omissão do CSS): 200 + 2×20 + 2×5 = 250 px no ecrã */
.conteudo { box-sizing: content-box; }

/* border-box: os 200 px incluem padding e borda — o conteúdo fica com 150 px */
.borda { box-sizing: border-box; }`,
    js: `for (const el of document.querySelectorAll(".caixa")) {
  console.log(el.className, "→ largura real:", el.getBoundingClientRect().width + "px");
}`,
  },
  {
    id: 'css-flex', set: 'layout', name: '7. Flexbox',
    html: `<nav class="barra">
  <span class="logo">Logo</span>
  <a href="#">Início</a>
  <a href="#">Artigos</a>
  <a href="#">Sobre</a>
</nav>

<div class="cartoes">
  <div class="cartao">Um</div>
  <div class="cartao">Dois</div>
  <div class="cartao">Três, com bastante mais texto do que os outros</div>
</div>`,
    css: `.barra {
  display: flex;
  align-items: center;      /* eixo transversal: alinha verticalmente */
  gap: 16px;
  padding: 12px;
  background: #0f172a;
  border-radius: 12px;
}
.barra a { color: #e2e8f0; text-decoration: none; }
.logo { font-weight: bold; color: #38bdf8; margin-right: auto; }  /* empurra o resto */

.cartoes { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.cartao {
  flex: 1 1 140px;          /* crescer, encolher, base de 140px */
  border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px;
}`,
    js: '',
  },
  {
    id: 'css-grid', set: 'layout', name: '8. Grid e responsivo',
    html: `<div class="pagina">
  <header>cabeçalho</header>
  <nav>menu</nav>
  <main>conteúdo</main>
  <footer>rodapé</footer>
</div>

<div class="galeria">
  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
</div>`,
    css: `.pagina {
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-template-areas:
    "cabecalho cabecalho"
    "menu      conteudo"
    "rodape    rodape";
  gap: 8px;
}
.pagina > * { background: #e0f2fe; padding: 12px; border-radius: 8px; }
header { grid-area: cabecalho; }
nav    { grid-area: menu; }
main   { grid-area: conteudo; }
footer { grid-area: rodape; }

/* galeria que se adapta sozinha, sem media query */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px; margin-top: 16px;
}
.galeria div { background: #fde68a; padding: 20px; text-align: center; border-radius: 8px; }

/* abaixo de 500px a página passa a uma coluna */
@media (max-width: 500px) {
  .pagina {
    grid-template-columns: 1fr;
    grid-template-areas: "cabecalho" "menu" "conteudo" "rodape";
  }
}`,
    js: `console.log("Arrasta a barra entre o editor e a pré-visualização para ver a media query a disparar.");`,
  },
];

export const REACT_EXAMPLES: ReactExample[] = [
  {
    id: 'react-primeiro', set: 'react', name: '1. Primeiro componente e props',
    jsx: `function Cartao({ nome, curso, media }) {
  const aprovado = media >= 9.5;
  return (
    <div className="cartao">
      <h2>{nome}</h2>
      <p>{curso} · média {media.toFixed(1)} — {aprovado ? "aprovado" : "reprovado"}</p>
    </div>
  );
}

function App() {
  const alunos = [
    { id: 1, nome: "Ana", curso: "Informática", media: 15.5 },
    { id: 2, nome: "Rui", curso: "Gestão", media: 8 },
  ];
  return (
    <>
      <h1>Alunos ({alunos.length})</h1>
      {alunos.map((a) => <Cartao key={a.id} {...a} />)}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    css: CSS_CARTAO,
  },
  {
    id: 'react-estado', set: 'react', name: '2. Estado com useState',
    jsx: `function Contador({ passo = 1 }) {
  const [valor, setValor] = useState(0);

  console.log("render com valor =", valor);

  return (
    <div className="cartao">
      <h2>{valor}</h2>
      <button onClick={() => setValor(valor + passo)}>+{passo}</button>
      <button onClick={() => setValor((v) => v - passo)}>-{passo}</button>
      <button onClick={() => setValor(0)}>zero</button>
      <p>{valor % 2 === 0 ? "par" : "ímpar"}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <>
    <Contador />
    <Contador passo={10} />
  </>
);`,
    css: CSS_CARTAO + `\nbutton { margin-right: 8px; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; cursor: pointer; }`,
  },
  {
    id: 'react-lista', set: 'react', name: '3. Listas, keys e estado imutável',
    jsx: `function Tarefas() {
  const [tarefas, setTarefas] = useState([
    { id: 1, texto: "Ler o módulo 23", feita: true },
    { id: 2, texto: "Fazer os exercícios", feita: false },
  ]);
  const [texto, setTexto] = useState("");

  function adicionar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    // nunca tarefas.push(...): cria-se um array NOVO
    setTarefas([...tarefas, { id: Date.now(), texto, feita: false }]);
    setTexto("");
  }

  const alternar = (id) =>
    setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));

  const apagar = (id) => setTarefas(tarefas.filter((t) => t.id !== id));

  const porFazer = tarefas.filter((t) => !t.feita).length;

  return (
    <div className="cartao">
      <h2>Tarefas ({porFazer} por fazer)</h2>
      <form onSubmit={adicionar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Nova tarefa" />
        <button>Adicionar</button>
      </form>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>
            <input type="checkbox" checked={t.feita} onChange={() => alternar(t.id)} />
            {t.texto}
            <button onClick={() => apagar(t.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Tarefas />);`,
    css: CSS_CARTAO + `\nli { list-style: none; margin: 4px 0; }
li.feita { text-decoration: line-through; color: #94a3b8; }
button { margin-left: 8px; }`,
  },
  {
    id: 'react-formulario', set: 'react', name: '4. Formulário controlado',
    jsx: `function Inscricao() {
  const [dados, setDados] = useState({ nome: "", email: "", idade: 18 });
  const [enviado, setEnviado] = useState(null);

  // um handler para todos os campos: usa o name do input
  const mudar = (e) =>
    setDados({ ...dados, [e.target.name]: e.target.value });

  const erros = {
    nome: dados.nome.trim().length < 3 ? "mínimo 3 letras" : null,
    email: dados.email.includes("@") ? null : "email inválido",
    idade: Number(dados.idade) >= 16 ? null : "mínimo 16 anos",
  };
  const valido = Object.values(erros).every((e) => e === null);

  return (
    <form className="cartao" onSubmit={(e) => { e.preventDefault(); setEnviado(dados); }}>
      <h2>Inscrição</h2>
      {["nome", "email", "idade"].map((campo) => (
        <p key={campo}>
          <input name={campo} value={dados[campo]} onChange={mudar} placeholder={campo} />
          {erros[campo] && <span className="erro"> {erros[campo]}</span>}
        </p>
      ))}
      <button disabled={!valido}>Enviar</button>
      {enviado && <pre>{JSON.stringify(enviado, null, 2)}</pre>}
    </form>
  );
}

createRoot(document.getElementById("root")).render(<Inscricao />);`,
    css: CSS_CARTAO + `\n.erro { color: #dc2626; font-size: 13px; }
pre { background: #f1f5f9; padding: 8px; border-radius: 8px; }`,
  },
  {
    id: 'react-efeito', set: 'hooks', name: '5. useEffect, limpeza e dependências',
    jsx: `function Relogio({ ativo }) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!ativo) return;
    console.log("efeito: a ligar o intervalo");
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => {                       // limpeza: corre antes do próximo efeito e ao desmontar
      console.log("limpeza: a desligar o intervalo");
      clearInterval(id);
    };
  }, [ativo]);                           // só volta a correr quando 'ativo' muda

  return <p>{segundos} s</p>;
}

function App() {
  const [ativo, setAtivo] = useState(true);
  const [montado, setMontado] = useState(true);
  return (
    <div className="cartao">
      <h2>Relógio</h2>
      {montado && <Relogio ativo={ativo} />}
      <button onClick={() => setAtivo(!ativo)}>{ativo ? "pausar" : "retomar"}</button>
      <button onClick={() => setMontado(!montado)}>{montado ? "desmontar" : "montar"}</button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    css: CSS_CARTAO + `\nbutton { margin-right: 8px; }`,
  },
  {
    id: 'react-hook-proprio', set: 'hooks', name: '6. Hook próprio e dados assíncronos',
    jsx: `// um hook é uma função que começa por "use" e usa outros hooks
function usePedido(url) {
  const [estado, setEstado] = useState({ dados: null, erro: null, aCarregar: true });

  useEffect(() => {
    let cancelado = false;
    setEstado({ dados: null, erro: null, aCarregar: true });

    // simulação de um pedido de rede (500 ms)
    const id = setTimeout(() => {
      if (cancelado) return;
      if (url.includes("falha")) setEstado({ dados: null, erro: "404 não encontrado", aCarregar: false });
      else setEstado({ dados: { url, alunos: ["Ana", "Rui", "Sara"] }, erro: null, aCarregar: false });
    }, 500);

    return () => { cancelado = true; clearTimeout(id); };   // evita atualizar depois de desmontar
  }, [url]);

  return estado;
}

function App() {
  const [url, setUrl] = useState("/api/alunos");
  const { dados, erro, aCarregar } = usePedido(url);

  return (
    <div className="cartao">
      <h2>Alunos</h2>
      <button onClick={() => setUrl("/api/alunos")}>carregar</button>
      <button onClick={() => setUrl("/api/falha")}>provocar erro</button>

      {aCarregar && <p>a carregar…</p>}
      {erro && <p className="erro">{erro}</p>}
      {dados && <ul>{dados.alunos.map((a) => <li key={a}>{a}</li>)}</ul>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    css: CSS_CARTAO + `\n.erro { color: #dc2626; }
button { margin-right: 8px; }`,
  },
  {
    id: 'react-contexto', set: 'hooks', name: '7. Estado partilhado: elevar e Context',
    jsx: `const TemaContexto = createContext("claro");

function Botao({ children, onClick }) {
  const tema = useContext(TemaContexto);          // lê sem receber por props
  return <button className={tema} onClick={onClick}>{children}</button>;
}

function Painel({ total }) {
  const tema = useContext(TemaContexto);
  return <p className={"painel " + tema}>Total no carrinho: {total} €</p>;
}

function App() {
  const [tema, setTema] = useState("claro");
  const [total, setTotal] = useState(0);          // estado ELEVADO: vive no pai comum

  return (
    <TemaContexto.Provider value={tema}>
      <div className="cartao">
        <h2>Loja</h2>
        <Painel total={total} />
        <Botao onClick={() => setTotal(total + 5)}>+5 €</Botao>
        <Botao onClick={() => setTotal(0)}>limpar</Botao>
        <Botao onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>tema</Botao>
      </div>
    </TemaContexto.Provider>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    css: CSS_CARTAO + `\nbutton { margin-right: 8px; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
button.claro { background: #e2e8f0; color: #0f172a; border: 1px solid #cbd5e1; }
button.escuro { background: #0f172a; color: #f8fafc; border: 1px solid #0f172a; }
.painel.escuro { background: #0f172a; color: #f8fafc; padding: 8px; border-radius: 8px; }`,
  },
  {
    id: 'react-reducer', set: 'hooks', name: '8. useReducer e useMemo',
    jsx: `function reducer(estado, acao) {
  switch (acao.tipo) {
    case "juntar": return { ...estado, itens: [...estado.itens, acao.item] };
    case "remover": return { ...estado, itens: estado.itens.filter((i) => i.id !== acao.id) };
    case "filtro": return { ...estado, filtro: acao.valor };
    default: throw new Error("ação desconhecida: " + acao.tipo);
  }
}

const CATALOGO = [
  { id: 1, nome: "Caderno", preco: 3.5 },
  { id: 2, nome: "Caneta", preco: 1.2 },
  { id: 3, nome: "Mochila", preco: 24 },
];

function App() {
  const [estado, despachar] = useReducer(reducer, { itens: [], filtro: "" });

  // só recalcula quando os itens mudam
  const total = useMemo(() => {
    console.log("a recalcular o total");
    return estado.itens.reduce((s, i) => s + i.preco, 0);
  }, [estado.itens]);

  const visiveis = CATALOGO.filter((p) => p.nome.toLowerCase().includes(estado.filtro.toLowerCase()));

  return (
    <div className="cartao">
      <h2>Carrinho: {total.toFixed(2)} €</h2>
      <input
        placeholder="filtrar catálogo"
        value={estado.filtro}
        onChange={(e) => despachar({ tipo: "filtro", valor: e.target.value })}
      />
      <ul>
        {visiveis.map((p) => (
          <li key={p.id}>
            {p.nome} — {p.preco.toFixed(2)} €
            <button onClick={() => despachar({ tipo: "juntar", item: { ...p, id: Date.now() } })}>juntar</button>
          </li>
        ))}
      </ul>
      <ul>
        {estado.itens.map((i) => (
          <li key={i.id}>{i.nome} <button onClick={() => despachar({ tipo: "remover", id: i.id })}>×</button></li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    css: CSS_CARTAO + `\nli { list-style: none; margin: 4px 0; }
button { margin-left: 8px; }`,
  },
];

const SET_LABEL: Record<string, string> = {
  html: 'HTML', css: 'CSS', layout: 'Layout', react: 'React básico', hooks: 'Hooks',
};

type Aba = 'html' | 'css' | 'js';

export function WebLab({ mode = 'web', initialHtml, initialCss, initialJs, set, compact }: {
  mode?: Mode;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  set?: WebSet | ReactSet;
  compact?: boolean;
}) {
  const react = mode === 'react';
  const exemplos = useMemo(() => {
    const todos = react ? REACT_EXAMPLES : WEB_EXAMPLES;
    const filtrados = set ? todos.filter((e) => e.set === set) : todos;
    return (filtrados.length ? filtrados : todos) as (WebExample | ReactExample)[];
  }, [react, set]);

  const primeiro = exemplos[0];
  const codigoDe = (e: WebExample | ReactExample) => ('jsx' in e ? e.jsx : e.js);
  const htmlDe = (e: WebExample | ReactExample) => ('html' in e ? e.html : '');

  const [html, setHtml] = useState(initialHtml ?? htmlDe(primeiro));
  const [css, setCss] = useState(initialCss ?? primeiro.css);
  const [js, setJs] = useState(initialJs ?? codigoDe(primeiro));
  const [aba, setAba] = useState<Aba>(react ? 'js' : 'html');
  const [linhas, setLinhas] = useState<{ tipo: string; texto: string }[]>([]);
  const [doc, setDoc] = useState('');
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const construir = react ? () => paginaReact(js, css) : () => paginaWeb(html, css, js);

  // Atualiza a pré-visualização pouco depois de o aluno parar de escrever.
  useEffect(() => {
    const id = setTimeout(() => { setLinhas([]); setDoc(construir()); }, 700);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js, react]);

  useEffect(() => {
    const aoReceber = (e: MessageEvent) => {
      const d = e.data as { __lab?: boolean; tipo: string; texto: string };
      if (d && d.__lab) setLinhas((l) => [...l, { tipo: d.tipo, texto: d.texto }].slice(-60));
    };
    window.addEventListener('message', aoReceber);
    return () => window.removeEventListener('message', aoReceber);
  }, []);

  const carregarExemplo = (id: string) => {
    const e = [...WEB_EXAMPLES, ...REACT_EXAMPLES].find((x) => x.id === id);
    if (!e) return;
    setHtml(htmlDe(e));
    setCss(e.css);
    setJs(codigoDe(e));
    setAba(react ? 'js' : htmlDe(e) ? 'html' : 'css');
  };

  const valor = aba === 'html' ? html : aba === 'css' ? css : js;
  const escrever = (v: string) => (aba === 'html' ? setHtml(v) : aba === 'css' ? setCss(v) : setJs(v));

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = areaRef.current!;
      const s = el.selectionStart, en = el.selectionEnd;
      escrever(valor.slice(0, s) + '  ' + valor.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); setLinhas([]); setDoc(construir()); }
  };

  const abas: Aba[] = react ? ['js', 'css'] : ['html', 'css', 'js'];
  const nomeAba: Record<Aba, string> = { html: 'HTML', css: 'CSS', js: react ? 'JSX' : 'JS' };

  return (
    <WidgetShell
      title={react ? 'Laboratório de React' : 'Laboratório de HTML e CSS'}
      subtitle={
        react
          ? 'React a sério, compilado no browser. React, os hooks e createRoot já estão disponíveis — não escrevas imports. A página atualiza-se sozinha; Ctrl/Cmd + Enter força.'
          : 'Escreve HTML, CSS e JavaScript e vê a página a mudar. Corre no próprio browser, sem descarregar nada. Ctrl/Cmd + Enter força a atualização.'
      }
      actions={
        !compact && (
          <select className="field w-auto py-1.5 text-xs" onChange={(e) => carregarExemplo(e.target.value)} defaultValue="" aria-label="Carregar exemplo">
            <option value="" disabled>Carregar exemplo…</option>
            {[...new Set(exemplos.map((e) => e.set))].map((s) => (
              <optgroup key={s} label={SET_LABEL[s]}>
                {exemplos.filter((e) => e.set === s).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </optgroup>
            ))}
          </select>
        )
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            {abas.map((a) => (
              <button
                key={a}
                onClick={() => setAba(a)}
                className={`chip ${aba === a ? 'bg-brand-600 text-white' : 'surface-sunken text-muted'}`}
              >
                {nomeAba[a]}
              </button>
            ))}
            <button className="ml-auto text-xs text-muted underline" onClick={() => escrever('')}>limpar</button>
          </div>
          <textarea
            ref={areaRef}
            className="field scrollbar-thin h-80 resize-y leading-relaxed"
            value={valor}
            onChange={(e) => escrever(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            aria-label={`Editor de ${nomeAba[aba]}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide text-muted uppercase">Pré-visualização</span>
          <iframe
            title="Pré-visualização"
            srcDoc={doc}
            sandbox="allow-scripts allow-modals allow-forms"
            className="h-72 w-full resize-y rounded-xl border border-soft bg-white"
          />
          <div className="scrollbar-thin h-24 overflow-auto rounded-xl border border-soft bg-slate-950 p-2.5 font-mono text-[0.75rem] leading-relaxed text-slate-100">
            {linhas.length === 0
              ? <span className="text-slate-500">A consola da página aparece aqui.</span>
              : linhas.map((l, i) => <div key={i} className={`whitespace-pre-wrap ${l.tipo === 'erro' ? 'text-rose-300' : ''}`}>{l.texto}</div>)}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
