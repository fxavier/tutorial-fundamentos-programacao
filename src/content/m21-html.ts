import type { Module } from '../types';

export const m21: Module = {
  id: 'html',
  number: 21,
  title: 'HTML: a estrutura da página',
  subtitle: 'A linguagem de marcação da web — elementos, semântica, formulários e acessibilidade',
  icon: '🧱',
  minutes: 55,
  goals: [
    'Escrever um documento HTML válido e perceber o que o browser faz com ele',
    'Escolher o elemento certo pelo significado, e não pelo aspeto',
    'Construir formulários com validação nativa e etiquetas ligadas aos campos',
    'Perceber o DOM: a árvore que o JavaScript manipula',
    'Escrever páginas que funcionam para quem usa leitor de ecrã ou só o teclado',
  ],
  sections: [
    {
      id: 'o-que-e',
      title: 'O que é (e o que não é) o HTML',
      blocks: [
        { type: 'p', text: 'O HTML — *HyperText Markup Language* — é uma linguagem de **marcação**, não de programação: não tem variáveis, condições nem ciclos. Serve para dizer ao browser *o que cada pedaço de conteúdo é*: isto é um título, isto é um parágrafo, isto é uma ligação. O aspeto vem do CSS (módulo 22) e o comportamento do JavaScript (módulo 17).' },
        {
          type: 'compare',
          left: { title: 'O HTML trata de', items: ['Significado do conteúdo: título, lista, tabela, formulário', 'Estrutura e ordem do documento', 'Ligações entre páginas', 'Informação para o browser e para tecnologias de apoio'] },
          right: { title: 'O HTML **não** trata de', items: ['Cores, tamanhos, espaçamentos → CSS', 'Reagir a cliques e calcular coisas → JavaScript', 'Guardar dados → servidor ou browser', 'Aspeto exato em cada ecrã → CSS responsivo'] },
        },
        { type: 'code', lang: 'html', caption: 'o documento mínimo — e cada linha importa', code: `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>A minha página</title>
    <link rel="stylesheet" href="estilo.css">
  </head>
  <body>
    <h1>Olá, mundo</h1>
    <p>O primeiro parágrafo.</p>
    <script src="programa.js"></script>
  </body>
</html>` },
        {
          type: 'terms',
          items: [
            { term: '`<!doctype html>`', def: 'Diz ao browser para usar o modo padrão. Sem ele, o browser entra em *quirks mode* e imita bugs dos anos 90.' },
            { term: '`lang="pt"`', def: 'A língua do documento. Os leitores de ecrã escolhem a pronúncia por aqui, e os motores de busca usam-no.' },
            { term: '`<meta charset="utf-8">`', def: 'A codificação do módulo 3. Sem isto, os acentos aparecem como `Ã§`.' },
            { term: '`<meta name="viewport">`', def: 'Diz ao telemóvel para não fingir que tem um ecrã de 980 px. Obrigatório para o responsivo funcionar.' },
            { term: '`<head>` e `<body>`', def: 'A cabeça tem informação *sobre* a página; o corpo tem o que se vê.' },
          ],
        },
        { type: 'h', text: 'A anatomia de um elemento' },
        { type: 'code', lang: 'html', caption: 'etiqueta de abertura, atributos, conteúdo, etiqueta de fecho', code: `<a href="https://exemplo.pt" target="_blank" rel="noopener">visitar o site</a>
 │  └── atributo ──┘                                          └ conteúdo ┘
 └ nome do elemento

<!-- alguns elementos são vazios: não têm conteúdo nem fecho -->
<img src="gato.jpg" alt="Um gato cinzento a dormir">
<br>
<hr>

<!-- isto é um comentário: não aparece na página, mas é visível no código-fonte -->` },
        { type: 'callout', tone: 'key', text: 'O browser é **muito** tolerante: um HTML mal formado quase nunca dá erro, é simplesmente interpretado à maneira dele. Isso é bom para o utilizador e mau para quem aprende — o teu erro não rebenta, apenas produz uma página estranha. Usa o validador em [validator.w3.org](https://validator.w3.org) quando algo não bate certo.' },
        { type: 'p', text: 'Escreve à esquerda, vê à direita. O laboratório corre no próprio browser — não descarrega nada e funciona sem internet.' },
        { type: 'widget', id: 'web-lab', props: { set: 'html' } },
      ],
    },
    {
      id: 'texto',
      title: 'Texto, listas e ligações',
      blocks: [
        {
          type: 'table',
          head: ['Elemento', 'Para que serve', 'Nota'],
          rows: [
            ['`<h1>` … `<h6>`', 'Títulos, do mais ao menos importante', 'Um `<h1>` por página; não saltes níveis'],
            ['`<p>`', 'Parágrafo de texto', 'Não uses `<br>` para separar parágrafos'],
            ['`<strong>` / `<em>`', 'Importante / com ênfase', 'Têm **significado**; o browser mostra a negrito e itálico'],
            ['`<b>` / `<i>`', 'Negrito / itálico sem significado', 'Só quando não há mesmo significado a transmitir'],
            ['`<ul>` / `<ol>` / `<li>`', 'Lista sem ordem / com ordem / item', 'Só `<li>` pode ser filho direto de `<ul>`'],
            ['`<a href="…">`', 'Ligação', 'O texto da ligação deve dizer para onde vai'],
            ['`<code>` / `<pre>`', 'Código em linha / bloco com espaços preservados', 'Combinam-se: `<pre><code>…`'],
            ['`<blockquote>` / `<q>`', 'Citação em bloco / em linha', ''],
            ['`<span>` / `<div>`', 'Agrupar sem significado, em linha / em bloco', 'Último recurso, quando nenhum elemento semântico serve'],
          ],
        },
        { type: 'code', lang: 'html', caption: 'ligações: os quatro tipos de caminho', code: `<a href="https://developer.mozilla.org">absoluto — outro site</a>
<a href="/sobre.html">a partir da raiz do site</a>
<a href="capitulos/dois.html">relativo à página atual</a>
<a href="#formulario">âncora — salta para id="formulario" nesta página</a>

<a href="mailto:ana@exemplo.pt">enviar email</a>
<a href="documento.pdf" download>descarregar</a>

<!-- abrir noutro separador: o rel evita que a página nova aceda à tua -->
<a href="https://exemplo.pt" target="_blank" rel="noopener noreferrer">exemplo</a>` },
        { type: 'callout', tone: 'trap', title: '"Clique aqui" não é texto de ligação', text: 'Quem usa leitor de ecrã pede muitas vezes a *lista das ligações da página*. Uma lista de dez "clique aqui" é inútil. Escreve `<a href="/precos">tabela de preços</a>`, não `veja a tabela de preços <a href="/precos">aqui</a>`.' },
      ],
    },
    {
      id: 'semantica',
      title: 'Semântica: o elemento certo para cada coisa',
      blocks: [
        { type: 'p', text: 'Tecnicamente, podias fazer uma página inteira com `<div>` e CSS. Visualmente ficaria igual. Mas o HTML não é só para os olhos: é também para leitores de ecrã, motores de busca, o modo de leitura do browser e o teu colega que abre o ficheiro daqui a um ano. Um `<div>` não diz nada; um `<nav>` diz "isto é navegação".' },
        {
          type: 'table',
          head: ['Elemento', 'É para', 'Quantos por página'],
          rows: [
            ['`<header>`', 'Cabeçalho da página ou de um artigo', 'Vários (um por secção)'],
            ['`<nav>`', 'Bloco de navegação principal', '1 a 2'],
            ['`<main>`', 'O conteúdo principal e único da página', 'Exatamente 1'],
            ['`<article>`', 'Peça independente que faria sentido sozinha', 'Vários'],
            ['`<section>`', 'Secção temática, normalmente com título', 'Vários'],
            ['`<aside>`', 'Conteúdo relacionado mas secundário', 'Vários'],
            ['`<footer>`', 'Rodapé da página ou de um artigo', 'Vários'],
            ['`<figure>` / `<figcaption>`', 'Ilustração com legenda', 'Vários'],
          ],
        },
        { type: 'code', lang: 'html', caption: 'a mesma página, duas vezes', code: `<!-- ✗ funciona, mas não significa nada -->
<div class="topo">
  <div class="menu"><div class="link">Início</div></div>
</div>
<div class="conteudo">
  <div class="titulo">Artigo</div>
  <div class="texto">…</div>
</div>

<!-- ✓ o mesmo aspeto, com significado -->
<header>
  <nav><a href="/">Início</a></nav>
</header>
<main>
  <article>
    <h1>Artigo</h1>
    <p>…</p>
  </article>
</main>` },
        { type: 'callout', tone: 'tip', title: 'A regra prática', text: 'Escolhe o elemento pelo **significado**, nunca pelo aspeto. Um `<button>` que parece uma ligação continua a ser um botão; um `<h2>` que precisa de ser pequeno resolve-se com CSS. Se nenhum elemento serve, aí sim: `<div>` (bloco) ou `<span>` (em linha).' },
        { type: 'p', text: 'Carrega o exemplo *Elementos semânticos* no laboratório acima para veres a estrutura desenhada com contornos.' },
      ],
    },
    {
      id: 'imagens',
      title: 'Imagens, media e o atributo alt',
      blocks: [
        { type: 'code', lang: 'html', caption: 'imagens', code: `<img src="/fotos/gato.jpg" alt="Gato cinzento a dormir numa almofada" width="320" height="200">

<!-- imagem decorativa: alt VAZIO, para o leitor de ecrã a saltar -->
<img src="separador.svg" alt="">

<!-- com legenda visível -->
<figure>
  <img src="grafico.png" alt="Vendas mensais: sobem de janeiro a junho">
  <figcaption>Vendas do primeiro semestre.</figcaption>
</figure>

<!-- a imagem certa para cada ecrã -->
<img src="foto-800.jpg"
     srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Vista da ponte">` },
        {
          type: 'terms',
          items: [
            { term: '`alt`', def: 'Descrição da imagem para quem não a vê — leitores de ecrã, e também o browser quando a imagem falha. **Obrigatório**: ou descreve, ou fica vazio se a imagem for decorativa.' },
            { term: '`width` e `height`', def: 'Dá as dimensões reais. O browser reserva o espaço antes de descarregar e a página deixa de "saltar" enquanto carrega.' },
            { term: '`srcset` / `sizes`', def: 'Várias versões da mesma imagem; o browser escolhe pela largura do ecrã e poupa dados.' },
            { term: '`loading="lazy"`', def: 'Só descarrega a imagem quando está quase visível. Bom para páginas com muitas imagens abaixo da dobra.' },
            { term: 'SVG', def: 'Imagem vetorial em XML. Não perde qualidade em nenhum tamanho e pode ser estilizada por CSS. Ideal para ícones e logótipos.' },
          ],
        },
        { type: 'code', lang: 'html', caption: 'vídeo e áudio', code: `<video src="aula.mp4" controls width="480" poster="capa.jpg">
  <track kind="captions" src="legendas.vtt" srclang="pt" label="Português">
  O teu browser não suporta vídeo.
</video>

<audio src="podcast.mp3" controls></audio>` },
        { type: 'callout', tone: 'warn', title: 'Nunca uses `autoplay` com som', text: 'Os browsers bloqueiam-no na maioria dos casos, e quando não bloqueiam o utilizador fecha o separador. `autoplay` só é aceitável com `muted`.' },
      ],
    },
    {
      id: 'formularios',
      title: 'Formulários e tabelas',
      blocks: [
        { type: 'p', text: 'O formulário é a parte do HTML onde mais se ganha em conhecer bem a linguagem: o browser já traz teclados adequados no telemóvel, validação, mensagens de erro traduzidas e integração com o gestor de senhas. Tudo isso se perde quando se reimplementa um campo com `<div>` e JavaScript.' },
        { type: 'code', lang: 'html', caption: 'os elementos de um formulário', code: `<form action="/inscrever" method="post">
  <label for="nome">Nome</label>
  <input id="nome" name="nome" required minlength="3">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="nascimento">Data de nascimento</label>
  <input id="nascimento" name="nascimento" type="date">

  <label for="curso">Curso</label>
  <select id="curso" name="curso">
    <option value="info">Informática</option>
    <option value="gestao">Gestão</option>
  </select>

  <label for="notas">Observações</label>
  <textarea id="notas" name="notas" rows="4"></textarea>

  <label><input type="checkbox" name="termos" required> Aceito os termos</label>

  <button type="submit">Inscrever</button>
</form>` },
        {
          type: 'table',
          head: ['`type` do input', 'Dá', 'Validação nativa'],
          rows: [
            ['`text`', 'Campo de texto', '`required`, `minlength`, `pattern`'],
            ['`email`', 'Teclado com @ no telemóvel', 'Formato de email'],
            ['`number`', 'Setas e teclado numérico', '`min`, `max`, `step`'],
            ['`date` / `time`', 'Calendário e relógio do sistema', 'Intervalo com `min`/`max`'],
            ['`password`', 'Texto escondido', 'Integra o gestor de senhas'],
            ['`checkbox` / `radio`', 'Caixa / escolha exclusiva por `name`', '`required`'],
            ['`file`', 'Seletor de ficheiros', '`accept`, `multiple`'],
            ['`range` / `color`', 'Cursor / seletor de cor', ''],
            ['`search` / `tel` / `url`', 'Teclados e semântica próprios', 'Formato, no caso do `url`'],
          ],
        },
        { type: 'callout', tone: 'key', title: '`label`, `id` e `name`', text: 'O `for` da etiqueta tem de ser igual ao `id` do campo — é isso que faz o clique na palavra "Nome" focar a caixa, e é isso que o leitor de ecrã anuncia. O `name` é diferente: é o nome com que o valor viaja para o servidor. **Sem `label` não há acessibilidade; sem `name` não há dados.**' },
        { type: 'callout', tone: 'trap', title: 'A validação do browser não é segurança', text: '`required` e `type="email"` só ajudam o utilizador — qualquer pessoa envia o formulário sem eles com duas linhas de código. **Validar outra vez no servidor não é opcional.** A validação do lado do cliente é conforto; a do servidor é a que conta.' },
        { type: 'h', text: 'Tabelas' },
        { type: 'code', lang: 'html', caption: 'tabelas são para dados, não para layout', code: `<table>
  <caption>Notas do 1.º período</caption>
  <thead>
    <tr><th scope="col">Aluno</th><th scope="col">Matemática</th><th scope="col">Português</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ana</th><td>16</td><td>15</td></tr>
    <tr><th scope="row">Rui</th><td>12</td><td>14</td></tr>
  </tbody>
</table>` },
        { type: 'p', text: 'O `scope` diz ao leitor de ecrã se o cabeçalho manda na coluna ou na linha — é o que permite anunciar "Rui, Matemática, 12" em vez de um 12 solto. Para *dispor* elementos na página usa-se CSS Grid (módulo 22), nunca tabelas.' },
      ],
    },
    {
      id: 'dom',
      title: 'O DOM: o HTML como árvore',
      blocks: [
        { type: 'p', text: 'Quando o browser lê o HTML, constrói uma árvore de objetos na memória — o **DOM** (*Document Object Model*). O que vês na página é o desenho dessa árvore, e não do texto original. É por isso que o JavaScript consegue mudar a página depois de carregada: mexe na árvore, e o browser volta a desenhar.' },
        {
          type: 'steps',
          items: [
            { title: '1. Descarregar', text: 'O browser pede o HTML ao servidor (o pedido HTTP do módulo 4).' },
            { title: '2. Analisar', text: 'Lê o texto de cima para baixo e constrói a árvore de nós: `html` → `body` → `h1` → texto.' },
            { title: '3. Estilos e layout', text: 'Aplica o CSS a cada nó e calcula a posição e o tamanho de cada caixa.' },
            { title: '4. Desenhar', text: 'Pinta os pixels no ecrã.' },
            { title: '5. Reagir', text: 'O JavaScript altera a árvore; o browser refaz o layout e volta a pintar só o que mudou.' },
          ],
        },
        { type: 'code', lang: 'js', caption: 'as operações que se usam todos os dias', code: `// encontrar
const titulo = document.querySelector("h1");           // o primeiro que corresponde
const itens = document.querySelectorAll("li.feito");   // todos (uma NodeList)
const campo = document.getElementById("nome");

// ler e escrever
titulo.textContent = "Novo título";      // texto — seguro
campo.value = "Ana";                     // o valor de um input não é textContent!
titulo.classList.add("destaque");
titulo.classList.toggle("escondido");
campo.setAttribute("disabled", "");

// criar e inserir
const li = document.createElement("li");
li.textContent = "Nova tarefa";
document.querySelector("ul").appendChild(li);
li.remove();

// reagir
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();                     // não recarregar a página
  console.log(Object.fromEntries(new FormData(e.target)));
});` },
        { type: 'callout', tone: 'trap', title: '`innerHTML` com dados de terceiros', text: '`elemento.innerHTML = texto` interpreta o texto como HTML. Se esse texto vier de um utilizador, acabaste de deixar alguém injetar `<script>` na tua página — é o ataque **XSS**. Usa `textContent`, que escreve texto e nada mais.' },
        { type: 'p', text: 'O exemplo *HTML + JavaScript: o DOM* no laboratório monta uma lista de tarefas com estas operações. Repara em quanto código é preciso para manter o ecrã sincronizado com os dados — é exatamente esse trabalho que o React (módulo 23) vem eliminar.' },
        { type: 'widget', id: 'web-lab', props: { set: 'html' } },
      ],
    },
    {
      id: 'acessibilidade',
      title: 'Acessibilidade e o resto que importa',
      blocks: [
        { type: 'p', text: 'Acessibilidade não é uma funcionalidade extra que se acrescenta no fim: 95% dela resulta de escrever HTML correto. Um site acessível é também mais fácil de indexar, de automatizar e de usar num telemóvel a uma mão.' },
        {
          type: 'list',
          items: [
            'Usa **elementos nativos**: `<button>` já é focável, ativa-se com Enter e Espaço, e é anunciado como botão. Um `<div onclick>` não é nada disso.',
            'Toda a **imagem** leva `alt` — descritivo, ou vazio se for decorativa.',
            'Todo o **campo** de formulário leva `<label>` ligada pelo `for`.',
            'A **ordem do HTML** é a ordem de tabulação. Navega a página só com o Tab: se te perderes, o utilizador também se perde.',
            'Os **títulos** formam um índice: `h1` → `h2` → `h3`, sem saltos.',
            'O **contraste** entre texto e fundo deve ser pelo menos 4,5:1 (o DevTools mede).',
            'Nunca uses só a **cor** para transmitir informação — junta um ícone ou texto.',
            'Os atributos `aria-*` são o **último recurso**, para quando não existe elemento nativo. Um `aria` mal usado é pior do que nenhum.',
          ],
        },
        { type: 'code', lang: 'html', caption: 'o mesmo botão, três vezes', code: `<!-- ✗ não é focável, não responde ao teclado, não é anunciado -->
<div class="botao" onclick="guardar()">Guardar</div>

<!-- ~ remendado: muito trabalho para chegar onde o <button> já estava -->
<div class="botao" role="button" tabindex="0"
     onclick="guardar()" onkeydown="if(event.key==='Enter')guardar()">Guardar</div>

<!-- ✓ -->
<button type="button" onclick="guardar()">Guardar</button>` },
        { type: 'h', text: 'As ferramentas do browser' },
        {
          type: 'table',
          head: ['Separador do DevTools (F12)', 'Serve para'],
          rows: [
            ['Elements / Inspetor', 'Ver a árvore do DOM a sério e experimentar CSS ao vivo'],
            ['Console', 'Erros de JavaScript e experiências rápidas'],
            ['Network', 'Que ficheiros foram pedidos, quanto pesam e quanto demoraram'],
            ['Lighthouse', 'Auditoria automática de desempenho, acessibilidade e SEO'],
            ['Application', 'Cookies, localStorage — onde o teu progresso neste tutorial está guardado'],
          ],
        },
        { type: 'callout', tone: 'tip', text: 'O código-fonte (Ctrl+U) mostra o HTML **como veio do servidor**; o inspetor mostra o DOM **como está agora**, já com as alterações do JavaScript. Quando os dois não batem certo, é porque há código a mexer na página — e essa diferença é a primeira pista em muitos bugs.' },
      ],
    },
  ],
  quiz: [
    { id: 'h1', prompt: 'Para que serve o atributo `alt` de uma imagem?', options: ['Mostrar um título ao passar o rato', 'Descrever a imagem para quem não a vê ou quando ela falha', 'Definir o tamanho', 'Indicar o formato do ficheiro'], answer: 1, explain: 'É lido pelos leitores de ecrã e mostrado quando a imagem não carrega. Numa imagem meramente decorativa escreve-se `alt=""` para o leitor de ecrã a ignorar.' },
    { id: 'h2', prompt: 'Quantos elementos `<main>` deve ter uma página?', options: ['Nenhum, é opcional e inútil', 'Exatamente um', 'Um por secção', 'Tantos quantos quiser'], answer: 1, explain: 'O `<main>` marca o conteúdo principal e único da página. É o destino do atalho "saltar para o conteúdo" que os leitores de ecrã oferecem.' },
    { id: 'h3', prompt: 'O que liga uma `<label>` ao seu campo?', options: ['A proximidade no código', 'O atributo `for` da label igual ao `id` do campo', 'O atributo `name`', 'A ordem de aparecimento'], answer: 1, explain: '`for` aponta para o `id`. É isso que faz o clique na etiqueta focar o campo e que permite ao leitor de ecrã anunciar o nome do campo. O `name` serve para enviar o valor.' },
    { id: 'h4', prompt: 'A validação `required` do HTML dispensa validar no servidor?', options: ['Sim, o browser garante os dados', 'Não: qualquer pessoa envia o pedido sem passar pelo formulário', 'Só em formulários `method="post"`', 'Sim, se houver também JavaScript'], answer: 1, explain: 'A validação do cliente é conforto para o utilizador. Um pedido HTTP feito à mão ignora-a por completo, por isso o servidor tem sempre de validar outra vez.' },
    { id: 'h5', prompt: 'Qual é a diferença entre `textContent` e `innerHTML`?', options: ['Nenhuma', '`textContent` escreve texto; `innerHTML` interpreta o valor como HTML', '`innerHTML` é mais rápido e igualmente seguro', '`textContent` só lê'], answer: 1, explain: 'Escrever dados de utilizadores em `innerHTML` permite injetar `<script>` — é o ataque XSS. Com `textContent` o valor é sempre tratado como texto.' },
    { id: 'h6', prompt: 'Porque é que `<div onclick>` é pior do que `<button>`?', options: ['É mais lento', 'Não é focável, não responde ao teclado e não é anunciado como botão', 'Não pode ter CSS', 'Não funciona em telemóveis'], answer: 1, explain: 'O `<button>` traz de graça foco, ativação por Enter e Espaço, e o papel semântico. Reproduzir isso num `<div>` exige `role`, `tabindex` e tratadores de teclado.' },
    { id: 'h7', prompt: 'O que faz `<meta name="viewport" content="width=device-width, initial-scale=1">`?', options: ['Define a largura máxima da página', 'Impede o telemóvel de fingir um ecrã largo e reduzir a página', 'Ativa o CSS', 'Traduz a página'], answer: 1, explain: 'Sem esta linha, o telemóvel assume um ecrã virtual de cerca de 980 px e encolhe tudo — e as media queries nunca disparam como esperado.' },
    { id: 'h8', prompt: 'O que é o DOM?', options: ['O ficheiro HTML no disco', 'A árvore de objetos que o browser constrói a partir do HTML e que o JavaScript manipula', 'Um formato de imagem', 'O protocolo entre browser e servidor'], answer: 1, explain: 'O HTML é texto; o DOM é a estrutura viva em memória. Alterar o DOM muda a página sem recarregar — e é por isso que o inspetor pode mostrar algo diferente do código-fonte.' },
  ],
  exercises: [
    {
      id: 'e21-1', difficulty: 1, kind: 'input', title: 'O elemento certo',
      statement: 'Que elemento deve envolver o conteúdo principal e único de uma página, aquele para onde aponta o atalho "saltar para o conteúdo"? Escreve só o nome do elemento.',
      accept: ['main', '<main>', '<main></main>'],
      hint: 'Não é `<div class="conteudo">` nem `<section>`.',
      solution: '`<main>`. Só pode haver um por página e não deve estar dentro de `<article>`, `<aside>`, `<header>` ou `<footer>`.',
    },
    {
      id: 'e21-2', difficulty: 2, kind: 'input', title: 'Ligar etiqueta e campo',
      statement: 'Dado `<input id="email" name="correio" type="email">`, que valor tem de ter o atributo `for` da `<label>` para ficarem ligados? Escreve só o valor.',
      accept: ['email'],
      hint: 'O `for` aponta para um dos dois atributos do input — e não é aquele que viaja para o servidor.',
      solution: '`email`. O `for` corresponde ao **`id`**, não ao `name`: `<label for="email">Email</label>`. O `name="correio"` é a chave com que o valor é enviado ao servidor.',
    },
    {
      id: 'e21-3', difficulty: 2, kind: 'code', lang: 'html', title: 'Currículo semântico',
      statement: 'No laboratório, escreve a página de um currículo usando apenas elementos semânticos — sem uma única `<div>`. Precisa de: cabeçalho com nome e navegação, uma secção de experiência com pelo menos dois `<article>`, uma lista de competências, uma imagem com `alt` e um rodapé com contacto.',
      hint: '`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<ul>`, `<figure>`, `<footer>`. Um `<h1>` só, e depois `<h2>` e `<h3>`.',
      solution: `<header>
  <h1>Ana Silva</h1>
  <p>Programadora júnior</p>
  <nav>
    <a href="#experiencia">Experiência</a>
    <a href="#competencias">Competências</a>
  </nav>
</header>

<main>
  <section id="experiencia">
    <h2>Experiência</h2>
    <article>
      <h3>Estagiária de front-end — Acme</h3>
      <p><time datetime="2025-09">setembro de 2025</time> até hoje.</p>
      <p>Manutenção de páginas em HTML, CSS e JavaScript.</p>
    </article>
    <article>
      <h3>Voluntária — Associação de Estudantes</h3>
      <p>Site do evento anual, feito de raiz.</p>
    </article>
  </section>

  <section id="competencias">
    <h2>Competências</h2>
    <ul>
      <li>HTML semântico e acessibilidade</li>
      <li>CSS: flexbox, grid, responsivo</li>
      <li>JavaScript moderno</li>
    </ul>
    <figure>
      <img src="https://placehold.co/240x120" alt="Gráfico das linguagens mais usadas">
      <figcaption>Linguagens usadas nos últimos projetos.</figcaption>
    </figure>
  </section>
</main>

<footer>
  <p>Contacto: <a href="mailto:ana@exemplo.pt">ana@exemplo.pt</a></p>
</footer>`,
    },
    {
      id: 'e21-4', difficulty: 2, kind: 'code', lang: 'html', title: 'Formulário que se valida sozinho',
      statement: 'Constrói um formulário de marcação de consulta com: nome (mínimo 3 letras, obrigatório), email (obrigatório e validado), telefone (opcional, exatamente 9 dígitos), data (não pode ser anterior a 2026-01-01), especialidade (lista com três opções) e uma caixa de aceitação obrigatória. Todos os campos com `<label>` ligada. Não escrevas JavaScript de validação — só HTML.',
      hint: '`pattern="[0-9]{9}"` para o telefone e `min="2026-01-01"` na data. O `title` de um campo com `pattern` explica o formato ao utilizador.',
      solution: `<form action="/marcar" method="post">
  <p>
    <label for="nome">Nome</label>
    <input id="nome" name="nome" required minlength="3">
  </p>
  <p>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>
  </p>
  <p>
    <label for="tel">Telefone (opcional)</label>
    <input id="tel" name="telefone" type="tel" pattern="[0-9]{9}"
           title="Nove dígitos, sem espaços">
  </p>
  <p>
    <label for="data">Data</label>
    <input id="data" name="data" type="date" min="2026-01-01" required>
  </p>
  <p>
    <label for="esp">Especialidade</label>
    <select id="esp" name="especialidade">
      <option value="geral">Medicina geral</option>
      <option value="dentaria">Medicina dentária</option>
      <option value="oftalmo">Oftalmologia</option>
    </select>
  </p>
  <p>
    <label><input type="checkbox" name="termos" required> Aceito a política de dados</label>
  </p>
  <button>Marcar</button>
</form>`,
    },
    {
      id: 'e21-5', difficulty: 3, kind: 'code', lang: 'html', title: 'Tabela acessível',
      statement: 'Faz uma tabela com as notas de três alunos a duas disciplinas, com legenda, cabeçalhos de coluna e de linha corretamente marcados, e uma linha final com as médias dentro de `<tfoot>`.',
      hint: 'Cabeçalhos de coluna: `<th scope="col">` dentro de `<thead>`. O nome do aluno em cada linha é `<th scope="row">`.',
      solution: `<table>
  <caption>Notas do 1.º período</caption>
  <thead>
    <tr>
      <th scope="col">Aluno</th>
      <th scope="col">Matemática</th>
      <th scope="col">Português</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ana</th><td>16</td><td>15</td></tr>
    <tr><th scope="row">Rui</th><td>12</td><td>14</td></tr>
    <tr><th scope="row">Sara</th><td>18</td><td>17</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Média</th><td>15,3</td><td>15,3</td></tr>
  </tfoot>
</table>`,
    },
    {
      id: 'e21-6', difficulty: 3, kind: 'open', title: 'Auditoria a uma página real',
      statement: 'Abre um site que uses todos os dias e inspeciona-o (F12). Responde: quantos `<h1>` tem? As imagens têm `alt` útil? Consegues chegar ao botão principal só com o Tab? Corre o Lighthouse e regista a pontuação de acessibilidade. Escolhe as três correções que darias primeiro.',
      hint: 'No Console, `document.querySelectorAll("h1").length` e `[...document.images].filter(i => !i.alt).length` respondem às duas primeiras perguntas em dois segundos.',
      solution: 'Não há resposta certa, mas há padrões que se repetem: vários `<h1>` (ou nenhum), imagens com `alt="imagem"` ou `alt="logo"` — que não descrevem nada —, botões feitos de `<div>` que o Tab não alcança, e contraste insuficiente em texto cinzento-claro. As três correções de maior impacto são quase sempre: (1) pôr `alt` descritivo nas imagens com conteúdo e `alt=""` nas decorativas, (2) trocar os `<div>` clicáveis por `<button>`, (3) corrigir a hierarquia de títulos. Nenhuma delas muda o aspeto da página.',
    },
  ],
};
