import type { Module } from '../types';

export const m22: Module = {
  id: 'css',
  number: 22,
  title: 'CSS: apresentação e layout',
  subtitle: 'Seletores, cascata, box model, flexbox, grid e páginas que funcionam em qualquer ecrã',
  icon: '🎨',
  minutes: 70,
  goals: [
    'Escrever seletores precisos e prever qual das regras ganha',
    'Dominar o box model e nunca mais lutar com larguras que não batem certo',
    'Dispor uma página com flexbox e com grid, sabendo quando usar cada um',
    'Fazer uma página responsiva sem escrever uma media query para cada ecrã',
    'Usar variáveis CSS, tema escuro e transições sem bibliotecas',
  ],
  sections: [
    {
      id: 'como-aplicar',
      title: 'A anatomia de uma regra',
      blocks: [
        { type: 'p', text: 'O CSS — *Cascading Style Sheets* — descreve como o HTML deve ser apresentado. Uma regra tem duas partes: o **seletor**, que diz a que elementos se aplica, e o **bloco de declarações**, cada uma um par `propriedade: valor;`.' },
        { type: 'code', lang: 'css', caption: 'a regra e as três formas de a aplicar', code: `/* seletor */
.cartao {
  /* propriedade: valor; */
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
}` },
        {
          type: 'table',
          head: ['Onde', 'Como', 'Quando'],
          rows: [
            ['Ficheiro separado', '`<link rel="stylesheet" href="estilo.css">`', 'Sempre. Cacheável e partilhado por todas as páginas'],
            ['`<style>` no `<head>`', 'CSS escrito na própria página', 'Página única, ou o mínimo crítico para o primeiro desenho'],
            ['Atributo `style`', '`<p style="color: red">`', 'Quase nunca à mão — só valores calculados por JavaScript'],
          ],
        },
        { type: 'callout', tone: 'tip', text: 'O CSS ignora o que não percebe. Uma propriedade escrita com erro, ou um valor inválido, é descartado em silêncio e o resto da regra continua a valer. Isso torna a linguagem robusta e a depuração estranha: quando uma declaração "não faz nada", o inspetor mostra-a riscada e diz porquê.' },
        { type: 'widget', id: 'web-lab', props: { set: 'css' } },
      ],
    },
    {
      id: 'seletores',
      title: 'Seletores',
      blocks: [
        {
          type: 'table',
          head: ['Seletor', 'Escolhe', 'Exemplo'],
          rows: [
            ['`p`', 'Todos os elementos desse tipo', '`p { … }`'],
            ['`.classe`', 'Todos os que têm a classe', '`.destaque`'],
            ['`#id`', 'O elemento com aquele id (único)', '`#menu`'],
            ['`a, b`', 'Lista: um **ou** outro', '`h1, h2 { … }`'],
            ['`a b`', 'Descendente, a qualquer profundidade', '`nav a`'],
            ['`a > b`', 'Filho direto', '`ul > li`'],
            ['`a + b`', 'Irmão imediatamente a seguir', '`h2 + p`'],
            ['`[attr="v"]`', 'Por atributo', '`input[type="email"]`'],
            ['`:hover`, `:focus`', 'Estado do elemento', '`button:hover`'],
            ['`:nth-child(2n)`', 'Por posição entre os irmãos', '`tr:nth-child(even)`'],
            ['`:not(.x)`', 'Os que **não** correspondem', '`li:not(.feito)`'],
            ['`::before`, `::after`', 'Pseudo-elemento gerado', '`.aviso::before { content: "⚠ " }`'],
          ],
        },
        { type: 'callout', tone: 'key', text: 'Duas dicas que evitam metade dos problemas de CSS: **estiliza sobretudo por classe** (o `#id` é difícil de vencer, o seletor de elemento é abrangente de mais) e **mantém os seletores curtos**. `.cartao__titulo` é mais fácil de manter do que `main section div.cartao > h2 span`.' },
        { type: 'code', lang: 'css', caption: 'pseudo-classes que se usam todos os dias', code: `a:hover        { text-decoration: underline; }   /* rato por cima */
button:focus-visible { outline: 2px solid #0ea5e9; }  /* foco por teclado */
input:disabled { opacity: 0.5; }
input:invalid  { border-color: #ef4444; }
li:first-child { margin-top: 0; }
li:last-child  { border-bottom: none; }
tr:nth-child(even) { background: #f8fafc; }
.cartao:has(img)   { padding: 0; }               /* cartão QUE CONTÉM imagem */` },
        { type: 'callout', tone: 'trap', title: 'Nunca remover o `outline` do foco', text: '`:focus { outline: none }` é a linha mais destrutiva do CSS: quem navega por teclado deixa de saber onde está. Se o contorno padrão não combina com o design, **substitui-o** por outro visível — não o apagues.' },
      ],
    },
    {
      id: 'cascata',
      title: 'Cascata, especificidade e herança',
      blocks: [
        { type: 'p', text: 'Quando duas regras querem pintar o mesmo elemento, o CSS decide por uma ordem fixa. É o "cascading" do nome, e é a parte que mais confunde no início — mas são só três critérios, aplicados por esta ordem:' },
        {
          type: 'steps',
          items: [
            { title: '1. Importância', text: 'Uma declaração com `!important` vence qualquer outra sem ele. Reserva-a para emergências: é uma dívida que se paga depois.' },
            { title: '2. Especificidade', text: 'Conta-se um trio (ids, classes, elementos). `#menu a` é `1,0,1` e ganha a `nav ul li a`, que é `0,0,4`. Um id vale mais do que mil classes.' },
            { title: '3. Ordem', text: 'Empate em tudo? Ganha a última regra escrita. É por isso que a ordem dos ficheiros CSS importa.' },
          ],
        },
        {
          type: 'table',
          head: ['Seletor', 'Especificidade (id, classe, elemento)', 'Vence'],
          rows: [
            ['`p`', '0, 0, 1', 'Nada'],
            ['`.destaque`', '0, 1, 0', '`p`'],
            ['`p.destaque`', '0, 1, 1', '`.destaque`'],
            ['`#unico`', '1, 0, 0', 'Todos os anteriores'],
            ['`style="…"` em linha', 'Fora da tabela — acima de tudo', 'Todos os seletores'],
            ['`!important`', 'Fora da tabela — acima do estilo em linha', 'Tudo'],
          ],
        },
        { type: 'code', lang: 'css', caption: 'qual das cores ganha?', code: `/* <p class="destaque" id="unico">texto</p> */

p         { color: cinzento; }   /* 0,0,1 */
.destaque { color: laranja;  }   /* 0,1,0 — ganha ao anterior */
#unico    { color: roxo;     }   /* 1,0,0 — ganha à classe */
p.destaque{ color: verde;    }   /* 0,1,1 — perde para o id */

/* resultado: roxo */` },
        { type: 'h', text: 'Herança' },
        { type: 'p', text: 'Algumas propriedades passam de pai para filho: `color`, `font-family`, `font-size`, `line-height`, `text-align`. A maioria não: `border`, `padding`, `margin`, `background` ficam onde foram declaradas. É por isso que definir a tipografia no `body` chega para a página inteira, mas o mesmo não acontece com as margens.' },
        { type: 'code', lang: 'css', caption: 'o reset mínimo que vale a pena', code: `*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, sans-serif;   /* herdado por tudo lá dentro */
  line-height: 1.5;
  color: #0f172a;
}

img, video { max-width: 100%; height: auto; }   /* nunca transbordam */` },
      ],
    },
    {
      id: 'box-model',
      title: 'O box model',
      blocks: [
        { type: 'p', text: 'Cada elemento é uma caixa retangular composta por quatro anéis: o **conteúdo**, o **padding** (espaço por dentro, dentro da borda), a **borda** e a **margin** (espaço por fora, entre caixas). Perceber isto resolve a maior parte das perguntas do género "porque é que isto tem 250 px se eu escrevi 200?".' },
        { type: 'code', lang: 'css', caption: 'a conta que apanha toda a gente', code: `.caixa {
  width: 200px;
  padding: 20px;
  border: 5px solid azul;
}

/* box-sizing: content-box  (a omissão do CSS)
   largura no ecrã = 200 + 20 + 20 + 5 + 5 = 250 px
   o "width" refere-se só ao conteúdo                        */

/* box-sizing: border-box
   largura no ecrã = 200 px, dos quais 150 sobram para o conteúdo
   o "width" inclui padding e borda                           */` },
        { type: 'callout', tone: 'key', title: 'Põe `border-box` em tudo e esquece o assunto', text: 'A primeira regra de qualquer folha de estilos moderna é `*, *::before, *::after { box-sizing: border-box; }`. A partir daí, `width: 50%` significa mesmo metade — com padding e borda incluídos.' },
        {
          type: 'table',
          head: ['`display`', 'Comporta-se como', 'Aceita `width`/`height`?'],
          rows: [
            ['`block`', 'Ocupa a linha toda: `div`, `p`, `h1`', 'Sim'],
            ['`inline`', 'Flui no texto: `span`, `a`, `strong`', 'Não'],
            ['`inline-block`', 'Flui no texto mas tem caixa própria', 'Sim'],
            ['`flex` / `grid`', 'Bloco que dispõe os filhos', 'Sim'],
            ['`none`', 'Desaparece e não ocupa espaço', '—'],
          ],
        },
        { type: 'callout', tone: 'trap', title: 'Colapso de margens', text: 'Duas margens verticais que se tocam **fundem-se na maior** em vez de se somarem: 20 px em baixo de um parágrafo e 30 px em cima do seguinte dão 30 px, não 50. Só acontece na vertical e não acontece dentro de um contentor flex ou grid — mais uma razão para usar `gap` em vez de margens.' },
        { type: 'p', text: 'Carrega o exemplo *Box model e box-sizing* no laboratório para veres as duas caixas lado a lado e a largura real na consola.' },
      ],
    },
    {
      id: 'flexbox',
      title: 'Flexbox: dispor numa direção',
      blocks: [
        { type: 'p', text: 'O flexbox distribui os filhos ao longo de **um eixo**. É a ferramenta certa para barras de navegação, listas de cartões, um botão alinhado à direita do título — praticamente tudo o que é "uma fila de coisas".' },
        { type: 'code', lang: 'css', caption: 'no contentor', code: `.barra {
  display: flex;
  flex-direction: row;          /* row (omissão) | column */
  justify-content: space-between;  /* alinhamento no eixo PRINCIPAL */
  align-items: center;             /* alinhamento no eixo TRANSVERSAL */
  gap: 16px;                       /* espaço entre itens — melhor que margens */
  flex-wrap: wrap;                 /* deixa passar para a linha seguinte */
}` },
        {
          type: 'table',
          head: ['`justify-content`', 'Distribui os itens'],
          rows: [
            ['`flex-start` / `flex-end`', 'Encostados ao início / ao fim'],
            ['`center`', 'Ao centro'],
            ['`space-between`', 'Primeiro na ponta, último na outra, espaço igual entre eles'],
            ['`space-around` / `space-evenly`', 'Espaço também nas pontas (metade / igual)'],
          ],
        },
        { type: 'code', lang: 'css', caption: 'nos itens', code: `.cartao {
  flex: 1 1 200px;   /* crescer | encolher | tamanho base */
}

/* atalhos que se veem por todo o lado */
.igual   { flex: 1; }        /* todos com a mesma largura */
.fixo    { flex: 0 0 auto; } /* nunca cresce nem encolhe */
.empurra { margin-left: auto; }  /* atira este item (e os seguintes) para a direita */` },
        { type: 'callout', tone: 'tip', title: 'Centrar na vertical e na horizontal', text: 'A pergunta mais antiga do CSS tem hoje três linhas: `display: flex; justify-content: center; align-items: center;` no contentor. Com `place-items: center` num grid é uma só.' },
        { type: 'widget', id: 'web-lab', props: { set: 'layout' } },
      ],
    },
    {
      id: 'grid',
      title: 'Grid: dispor em duas direções',
      blocks: [
        { type: 'p', text: 'O grid divide o espaço em **linhas e colunas** ao mesmo tempo. É a ferramenta para o esqueleto da página e para galerias — sempre que a posição interessa nas duas dimensões.' },
        { type: 'code', lang: 'css', caption: 'as três formas que resolvem quase tudo', code: `/* 1. colunas explícitas: a unidade fr é "uma fatia do espaço livre" */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;   /* barra lateral fixa + conteúdo elástico */
  gap: 16px;
}

/* 2. galeria que se adapta sozinha, sem uma única media query */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

/* 3. áreas com nome — o layout desenhado no próprio CSS */
.pagina {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "cabecalho cabecalho"
    "menu      conteudo"
    "rodape    rodape";
}
header { grid-area: cabecalho; }
nav    { grid-area: menu; }
main   { grid-area: conteudo; }
footer { grid-area: rodape; }` },
        {
          type: 'compare',
          left: { title: 'Usa flexbox quando', items: ['O conteúdo manda no tamanho', 'É uma fila (ou coluna) de coisas', 'Barra de navegação, grupo de botões, cartão interno', 'Não sabes quantos itens vão existir'] },
          right: { title: 'Usa grid quando', items: ['O layout manda no tamanho', 'Precisas de alinhar em linhas **e** colunas', 'Esqueleto da página, galeria, formulário em duas colunas', 'Queres áreas com nome'] },
        },
        { type: 'callout', tone: 'key', text: '`repeat(auto-fill, minmax(180px, 1fr))` é a linha mais útil do CSS moderno: "tantas colunas quantas couberem, cada uma com pelo menos 180 px, dividindo o resto por igual". Uma galeria responsiva sem media queries nenhumas.' },
      ],
    },
    {
      id: 'responsivo',
      title: 'Responsivo: uma página, todos os ecrãs',
      blocks: [
        {
          type: 'list',
          ordered: true,
          items: [
            '**`<meta name="viewport">` no HTML.** Sem esta linha nada do resto funciona no telemóvel.',
            '**Escreve primeiro para o ecrã pequeno** (*mobile-first*) e acrescenta com `min-width`. É mais fácil somar do que desfazer.',
            '**Usa unidades relativas**: `rem` para tipografia e espaçamentos, `%` e `fr` para larguras, `px` só para bordas e detalhes finos.',
            '**Deixa o layout adaptar-se sozinho** com `flex-wrap`, `minmax` e `clamp()` antes de escrever media queries.',
            '**Media queries só nos pontos onde o design parte** — não um por marca de telemóvel.',
          ],
        },
        { type: 'code', lang: 'css', caption: 'mobile-first e media queries', code: `/* base: telemóvel */
.cartoes { display: grid; grid-template-columns: 1fr; gap: 12px; }

/* tablet para cima */
@media (min-width: 640px) {
  .cartoes { grid-template-columns: repeat(2, 1fr); }
}

/* computador */
@media (min-width: 1024px) {
  .cartoes { grid-template-columns: repeat(3, 1fr); }
}

/* respeitar quem pediu menos animação no sistema */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}` },
        {
          type: 'table',
          head: ['Unidade', 'Vale', 'Usa para'],
          rows: [
            ['`px`', 'Um pixel de CSS', 'Bordas, sombras, detalhes que não devem escalar'],
            ['`rem`', 'O tamanho de letra da raiz (16 px por omissão)', 'Tipografia e espaçamentos — respeita quem aumentou a letra'],
            ['`em`', 'O tamanho de letra do próprio elemento', 'Espaçamento proporcional ao texto local'],
            ['`%`', 'Percentagem do pai', 'Larguras dentro de um contentor'],
            ['`vw` / `vh`', '1% da largura / altura da janela', 'Secções de ecrã inteiro'],
            ['`fr`', 'Fração do espaço livre de um grid', 'Colunas'],
            ['`ch`', 'Largura do algarismo "0"', 'Limitar o comprimento da linha: `max-width: 65ch`'],
          ],
        },
        { type: 'code', lang: 'css', caption: 'clamp: mínimo, ideal e máximo numa linha', code: `h1 {
  /* nunca abaixo de 1.8rem, nunca acima de 3rem, e no meio cresce com o ecrã */
  font-size: clamp(1.8rem, 5vw, 3rem);
}

.conteudo {
  width: min(100% - 2rem, 70ch);   /* margens no telemóvel, linha legível no ecrã grande */
  margin-inline: auto;
}` },
        { type: 'callout', tone: 'tip', text: 'Testa arrastando a barra entre o editor e a pré-visualização no laboratório, e no DevTools com o modo dispositivo (Ctrl+Shift+M). Se o design só parte a 1200 px, é aí que a media query deve estar — os "breakpoints padrão" são um ponto de partida, não uma regra.' },
      ],
    },
    {
      id: 'moderno',
      title: 'Variáveis, temas e manutenção',
      blocks: [
        { type: 'code', lang: 'css', caption: 'variáveis CSS e tema escuro — sem uma linha de JavaScript', code: `:root {
  --cor-texto: #0f172a;
  --cor-fundo: #ffffff;
  --cor-marca: #0ea5e9;
  --espaco: 1rem;
  --raio: 12px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --cor-texto: #e2e8f0;
    --cor-fundo: #0f172a;
  }
}

body { color: var(--cor-texto); background: var(--cor-fundo); }

.botao {
  background: var(--cor-marca);
  padding: var(--espaco);
  border-radius: var(--raio);
  transition: transform 150ms ease, opacity 150ms ease;
}
.botao:hover { transform: translateY(-1px); opacity: 0.9; }` },
        { type: 'p', text: 'As variáveis são propriedades a sério: herdam-se, podem ser redefinidas dentro de um seletor (`.cartao.destaque { --cor-marca: red; }`) e são legíveis e alteráveis por JavaScript. É a base de qualquer sistema de temas — incluindo o deste tutorial.' },
        {
          type: 'terms',
          items: [
            { term: '`position: static`', def: 'O normal: o elemento fica onde o fluxo o põe.' },
            { term: '`relative`', def: 'Desloca-se em relação a si próprio e passa a servir de referência aos filhos absolutos.' },
            { term: '`absolute`', def: 'Sai do fluxo e posiciona-se em relação ao antepassado posicionado mais próximo.' },
            { term: '`fixed`', def: 'Sai do fluxo e fica preso à janela — barras que acompanham a rolagem.' },
            { term: '`sticky`', def: 'Normal até chegar ao limite indicado, e a partir daí fixo. Cabeçalhos de tabela que ficam à vista.' },
            { term: '`z-index`', def: 'Ordem de empilhamento entre elementos posicionados. Só funciona com `position` diferente de `static`.' },
          ],
        },
        { type: 'h', text: 'Como não ter uma folha de estilos ingovernável' },
        {
          type: 'list',
          items: [
            'Define **tokens** (cores, espaçamentos, raios) em variáveis, num sítio só.',
            'Estiliza por **classe de componente** (`.cartao`, `.botao`), não por percursos longos de elementos.',
            'Evita `!important` e `#id` no CSS: são difíceis de vencer e obrigam ao `!important` seguinte.',
            'Junta o CSS de um componente ao componente — por ficheiro, por módulo CSS ou por utilitários.',
            'Frameworks de utilitários como o **Tailwind** (usado neste tutorial) trocam classes semânticas por classes atómicas no HTML: menos CSS morto e menos nomes a inventar, em troca de um HTML mais verboso.',
          ],
        },
        { type: 'callout', tone: 'warn', title: 'O CSS que não se apaga', text: 'Numa base de código grande, o problema não é escrever CSS — é ter medo de o apagar. Quando ninguém sabe se `.caixa-2-nova` ainda é usada, a folha só cresce. Nomes de classe ligados a componentes e ferramentas que detetam CSS não usado resolvem quase tudo isto.' },
      ],
    },
  ],
  quiz: [
    { id: 'c1', prompt: 'Com `box-sizing: content-box`, que largura ocupa no ecrã `width: 300px; padding: 10px; border: 2px solid`?', options: ['300 px', '312 px', '324 px', '340 px'], answer: 2, explain: '300 + 10 + 10 + 2 + 2 = 324 px. Com `border-box` seriam 300 px, com 276 px de conteúdo — é por isso que se põe `border-box` em tudo.' },
    { id: 'c2', prompt: 'Entre `#menu a` e `nav ul li a.destaque`, qual ganha?', options: ['`nav ul li a.destaque`, tem mais seletores', '`#menu a`, porque um id vale mais do que classes e elementos', 'A que estiver escrita por último', 'Nenhuma, é conflito'], answer: 1, explain: 'Especificidade compara-se por trio: `#menu a` é 1,0,1 e `nav ul li a.destaque` é 0,1,4. O primeiro número decide logo — um id vence qualquer quantidade de classes.' },
    { id: 'c3', prompt: 'Quais destas propriedades são herdadas pelos filhos?', options: ['`border` e `padding`', '`color` e `font-family`', '`margin` e `background`', 'Todas'], answer: 1, explain: 'Herdam-se sobretudo as de texto: `color`, `font-*`, `line-height`, `text-align`. As de caixa (borda, margem, padding, fundo) não — senão cada filho repetiria a borda do pai.' },
    { id: 'c4', prompt: 'O que faz `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`?', options: ['Cria sempre 3 colunas', 'Cria tantas colunas quantas couberem, com pelo menos 180 px cada', 'Cria uma coluna de 180 px', 'Só funciona com media queries'], answer: 1, explain: 'É a galeria responsiva sem media queries: o browser calcula quantas colunas de 180 px cabem e distribui o espaço restante por igual (`1fr`).' },
    { id: 'c5', prompt: 'No flexbox, `align-items` alinha os itens em que eixo?', options: ['No eixo principal', 'No eixo transversal (perpendicular ao principal)', 'Sempre na vertical', 'Sempre na horizontal'], answer: 1, explain: '`justify-content` trata do eixo principal e `align-items` do transversal. Com `flex-direction: column` os papéis invertem-se em relação ao ecrã.' },
    { id: 'c6', prompt: 'O que acontece a duas margens verticais que se tocam — 20 px e 30 px?', options: ['Somam-se: 50 px', 'Colapsam na maior: 30 px', 'Anulam-se', 'Ficam 20 px'], answer: 1, explain: 'É o colapso de margens: só na vertical, e não dentro de contentores flex ou grid. Usar `gap` em vez de margens evita a surpresa.' },
    { id: 'c7', prompt: 'Porque é que `rem` costuma ser melhor do que `px` para tipografia?', options: ['É mais preciso', 'Escala com o tamanho de letra base do utilizador, respeitando quem o aumentou', 'É mais rápido a renderizar', 'Funciona em mais browsers'], answer: 1, explain: 'Quem tem dificuldade de visão aumenta a letra base do browser. Tamanhos em `px` ignoram essa preferência; em `rem` a página inteira acompanha.' },
    { id: 'c8', prompt: 'Qual é o problema de `:focus { outline: none; }`?', options: ['Não funciona em Firefox', 'Quem navega por teclado deixa de saber onde está', 'Torna a página mais lenta', 'Nenhum, é uma prática comum'], answer: 1, explain: 'O contorno de foco é a única pista visual de quem não usa rato. Se não combina com o design, substitui-se por outro visível — nunca se remove.' },
  ],
  exercises: [
    {
      id: 'e22-1', difficulty: 1, kind: 'input', title: 'Largura real',
      statement: 'Um elemento tem `box-sizing: content-box; width: 240px; padding: 16px; border: 4px solid; margin: 10px`. Quantos pixels ocupa em largura no ecrã, sem contar a margem? Escreve só o número.',
      accept: ['280', '280px'],
      hint: 'Com `content-box`, o `width` é só o conteúdo: soma o padding e a borda dos dois lados. A margem fica de fora da caixa.',
      solution: '**280**. 240 + 16 + 16 + 4 + 4 = 280 px. A margem (10 px de cada lado) é espaço *entre* caixas e não faz parte da largura do elemento. Com `box-sizing: border-box` a resposta seria 240 px, e o conteúdo ficaria com 200.',
    },
    {
      id: 'e22-2', difficulty: 2, kind: 'input', title: 'Especificidade',
      statement: 'Dado `<p class="aviso" id="topo">`, e as regras `p { color: azul }`, `.aviso { color: verde }`, `p.aviso { color: rosa }` e `#topo { color: preto }` — qual é a cor final? Escreve só a cor.',
      accept: ['preto', 'preta', '#topo', 'a do id'],
      hint: 'Conta o trio (ids, classes, elementos) de cada seletor. O primeiro número que difere decide.',
      solution: '**Preto**. As especificidades são 0,0,1 · 0,1,0 · 0,1,1 · **1,0,0**. Basta um id para vencer qualquer combinação de classes e elementos. Se o `#topo` fosse removido, ganhava o `p.aviso` (0,1,1) e o texto ficaria rosa.',
    },
    {
      id: 'e22-3', difficulty: 2, kind: 'code', lang: 'css', title: 'Barra de navegação',
      statement: 'No laboratório, faz uma barra de navegação com o logótipo à esquerda, três ligações ao centro-direita e um botão "Entrar" na ponta direita. Tem de continuar utilizável abaixo de 500 px (as ligações passam para baixo, nada transborda). Usa flexbox e `gap` — nenhuma margem entre itens.',
      hint: '`display: flex; align-items: center; gap: 1rem;` e `margin-left: auto` no primeiro elemento do grupo da direita. `flex-wrap: wrap` trata do ecrã pequeno.',
      solution: `.barra {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #0f172a;
  border-radius: 12px;
}

.logo { font-weight: 700; color: #38bdf8; }

.barra nav {
  display: flex;
  gap: 1rem;
  margin-left: auto;          /* empurra a navegação e o botão para a direita */
}

.barra a { color: #e2e8f0; text-decoration: none; }
.barra a:hover { text-decoration: underline; }

.entrar {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

@media (max-width: 500px) {
  .barra nav { margin-left: 0; width: 100%; }
}`,
    },
    {
      id: 'e22-4', difficulty: 2, kind: 'code', lang: 'css', title: 'Galeria sem media queries',
      statement: 'Faz uma galeria de cartões que mostre 4 colunas num ecrã largo, 2 num tablet e 1 no telemóvel — **sem escrever uma única media query**. Cada cartão tem imagem, título e texto, e todos os cartões da mesma linha têm de ficar com a mesma altura.',
      hint: '`repeat(auto-fill, minmax(220px, 1fr))` trata das colunas. Os itens de um grid já esticam por omissão (`align-items: stretch`).',
      solution: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.cartao {
  display: flex;                /* para o texto poder ocupar o espaço restante */
  flex-direction: column;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;             /* a imagem não sai dos cantos arredondados */
}

.cartao img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }

.cartao .corpo { padding: 1rem; flex: 1; }   /* empurra o rodapé do cartão para baixo */

.cartao h3 { margin: 0 0 0.25rem; font-size: 1.05rem; }
.cartao p  { margin: 0; color: #475569; }`,
    },
    {
      id: 'e22-5', difficulty: 3, kind: 'code', lang: 'css', title: 'Tema claro e escuro',
      statement: 'Define um conjunto de variáveis CSS (fundo, texto, borda, cor de marca) e usa-as num cartão e num botão. O tema tem de seguir a preferência do sistema (`prefers-color-scheme`) e, além disso, poder ser forçado com um atributo `data-tema="escuro"` no `<html>`.',
      hint: 'Declara as variáveis claras em `:root`, redefine-as dentro do `@media (prefers-color-scheme: dark)` e outra vez em `[data-tema="escuro"]`. A regra do atributo, escrita depois, vence por ordem.',
      solution: `:root {
  --fundo: #ffffff;
  --texto: #0f172a;
  --borda: #cbd5e1;
  --marca: #0ea5e9;
}

/* segue o sistema… */
@media (prefers-color-scheme: dark) {
  :root {
    --fundo: #0f172a;
    --texto: #e2e8f0;
    --borda: #334155;
  }
}

/* …e a escolha explícita ganha, em qualquer dos sentidos */
[data-tema="escuro"] { --fundo: #0f172a; --texto: #e2e8f0; --borda: #334155; }
[data-tema="claro"]  { --fundo: #ffffff; --texto: #0f172a; --borda: #cbd5e1; }

body { background: var(--fundo); color: var(--texto); transition: background 200ms; }

.cartao {
  background: var(--fundo);
  border: 1px solid var(--borda);
  border-radius: 12px;
  padding: 1rem;
}

.botao {
  background: var(--marca);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}`,
    },
    {
      id: 'e22-6', difficulty: 3, kind: 'open', title: 'Reconstruir um layout',
      statement: 'Escolhe uma página simples de um site que conheças e reconstrói o seu esqueleto no laboratório: cabeçalho, barra lateral, conteúdo e rodapé. Faz duas versões — uma com flexbox, outra com `grid-template-areas`. Qual delas ficou mais curta e mais fácil de mudar? O que aconteceria se o cliente pedisse a barra lateral do outro lado?',
      hint: 'Com áreas nomeadas, trocar a barra de lado é reescrever duas linhas de `grid-template-areas`. Com flexbox aninhado, mexe-se em vários contentores.',
      solution: 'A versão em grid costuma ser mais curta e muito mais fácil de alterar: o layout está desenhado num sítio só, e trocar a barra de lado (ou reordenar tudo numa media query) é reescrever as linhas de `grid-template-areas`. A versão em flexbox precisa de contentores aninhados e de `order` ou de mudar o HTML. A regra que fica: **grid para o esqueleto da página, flexbox para os componentes lá dentro** — e os dois usam-se juntos, não são alternativas.',
    },
  ],
};
