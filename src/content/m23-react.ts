import type { Module } from '../types';

export const m23: Module = {
  id: 'react',
  number: 23,
  title: 'React: componentes e estado',
  subtitle: 'Interfaces declarativas — JSX, componentes, props, estado, listas e formulários',
  icon: '⚛️',
  minutes: 70,
  goals: [
    'Perceber o que o React resolve face a manipular o DOM à mão',
    'Ler e escrever JSX, sabendo em que é que ele se transforma',
    'Partir uma interface em componentes e passar dados por props',
    'Guardar estado com `useState` e atualizá-lo sem nunca o mutar',
    'Desenhar listas com keys corretas e formulários controlados',
  ],
  sections: [
    {
      id: 'porque-react',
      title: 'O problema que o React resolve',
      blocks: [
        { type: 'p', text: 'No módulo 21 construíste uma lista de tarefas com o DOM à mão. Funciona — mas repara no que foi preciso: criar o elemento, escrever o texto, ligar o evento, inserir na lista, **e depois atualizar o contador**. Cada dado aparece em dois sítios (na variável e no ecrã) e é responsabilidade tua mantê-los sincronizados. Numa página com uma dúzia de estados, é aí que nascem os bugs de "o número em cima não corresponde à lista em baixo".' },
        {
          type: 'compare',
          left: { title: 'DOM à mão (imperativo)', items: ['Descreves **os passos**: cria, insere, atualiza, remove', 'O estado vive espalhado pelos elementos do ecrã', 'Cada nova funcionalidade acrescenta sincronizações', 'Rápido em coisas pequenas, ingovernável em grande'] },
          right: { title: 'React (declarativo)', items: ['Descreves **o resultado**: dado este estado, a interface é esta', 'O estado vive num sítio; o ecrã é uma função dele', 'Mudas o estado e o React trata de atualizar o ecrã', 'Mais estrutura ao início, muito menos bugs de sincronização'] },
        },
        { type: 'callout', tone: 'key', title: 'A ideia toda numa linha', text: '**UI = f(estado)**. Escreves uma função que, dado o estado, devolve o aspeto da interface. Quando o estado muda, o React volta a chamar essa função, compara o resultado com o anterior e altera no DOM real apenas o que mudou.' },
        { type: 'code', lang: 'jsx', caption: 'o mesmo contador, das duas maneiras', code: `// imperativo: eu é que mando no DOM
let valor = 0;
const botao = document.querySelector("button");
const saida = document.querySelector("#valor");
botao.addEventListener("click", () => {
  valor++;
  saida.textContent = valor;            // não me posso esquecer desta linha
});

// declarativo: eu descrevo o que se vê para cada valor
function Contador() {
  const [valor, setValor] = useState(0);
  return <button onClick={() => setValor(valor + 1)}>{valor}</button>;
}` },
        { type: 'p', text: 'O laboratório abaixo corre React a sério: o teu JSX é compilado no browser e desenhado ao lado. `React`, os hooks e o `createRoot` já estão disponíveis — não escrevas `import`. (Esta é, com o Python, a única parte do tutorial que descarrega alguma coisa da internet.)' },
        { type: 'widget', id: 'react-lab', props: { set: 'react' } },
        { type: 'callout', tone: 'info', title: 'React não é obrigatório', text: 'Para uma página institucional, HTML e CSS chegam e sobram; para um formulário de contacto, um pouco de JavaScript resolve. O React compensa quando há **muito estado a mudar ao longo do tempo** e interface a acompanhá-lo — painéis, editores, aplicações. Escolher a ferramenta pesada para um problema leve é um erro tão comum como o contrário.' },
      ],
    },
    {
      id: 'jsx',
      title: 'JSX: parece HTML, é JavaScript',
      blocks: [
        { type: 'p', text: 'JSX é uma extensão de sintaxe que deixa escrever marcação dentro do JavaScript. Não vai como está para o browser: uma ferramenta de compilação (o Vite, o Babel, o TypeScript) traduz cada etiqueta numa chamada de função.' },
        { type: 'code', lang: 'jsx', caption: 'o que o JSX é, por baixo', code: `// o que escreves
const elemento = <h1 className="titulo">Olá, {nome}</h1>;

// no que é compilado (React clássico)
const elemento = React.createElement("h1", { className: "titulo" }, "Olá, ", nome);

// e o resultado é apenas um objeto — não é HTML nem é o DOM
// { type: "h1", props: { className: "titulo", children: [...] } }` },
        {
          type: 'table',
          head: ['Em HTML', 'Em JSX', 'Porquê'],
          rows: [
            ['`class="x"`', '`className="x"`', '`class` é palavra reservada do JavaScript'],
            ['`for="id"`', '`htmlFor="id"`', 'O mesmo motivo: `for` é um ciclo'],
            ['`onclick="f()"`', '`onClick={f}`', 'camelCase, e o valor é a **função**, não uma string'],
            ['`style="color: red"`', '`style={{ color: "red" }}`', 'Um objeto JavaScript, com propriedades em camelCase'],
            ['`<br>`', '`<br />`', 'Todas as etiquetas têm de fechar'],
            ['`<!-- … -->`', '`{/* … */}`', 'Comentários são expressões JavaScript'],
            ['`tabindex`', '`tabIndex`', 'Atributos compostos em camelCase (exceto `data-` e `aria-`)'],
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'chavetas: o que está lá dentro é JavaScript', code: `function Cartao({ aluno }) {
  const aprovado = aluno.media >= 9.5;

  return (
    <div className={aprovado ? "cartao ok" : "cartao falha"}>
      <h2>{aluno.nome}</h2>
      <p>Média: {aluno.media.toFixed(1)}</p>
      <p>{aprovado ? "Aprovado" : "Reprovado"}</p>
      {aluno.bolseiro && <span className="etiqueta">bolseiro</span>}
      <img src={aluno.foto} alt={\`Fotografia de \${aluno.nome}\`} />
    </div>
  );
}` },
        {
          type: 'list',
          items: [
            'Dentro das chavetas vale qualquer **expressão** — uma variável, uma chamada, um ternário —, mas não uma instrução: não há `if` nem `for` soltos no meio do JSX.',
            'Um componente devolve **um só** elemento de raiz. Para devolver vários irmãos, envolve-os num `<>…</>` (Fragment), que não gera nenhuma etiqueta no HTML.',
            '`false`, `null`, `undefined` e `true` não desenham nada — é isso que faz `{condicao && <p/>}` funcionar.',
            'Um array de elementos é desenhado elemento a elemento: é assim que o `.map()` produz listas.',
          ],
        },
        { type: 'callout', tone: 'trap', title: 'O `0` que aparece no ecrã', text: '`{lista.length && <p>Há itens</p>}` mostra **`0`** quando a lista está vazia: o `&&` devolve o `0`, e o React desenha os números. Escreve sempre uma condição booleana: `{lista.length > 0 && <p>…</p>}`.' },
      ],
    },
    {
      id: 'componentes',
      title: 'Componentes e props',
      blocks: [
        { type: 'p', text: 'Um componente é uma **função que devolve JSX**. O nome começa por maiúscula — é assim que o JSX distingue `<Cartao />` (o teu componente) de `<div />` (um elemento do browser). As props são os argumentos: um objeto com os atributos que lhe passaste.' },
        { type: 'code', lang: 'jsx', caption: 'props, valores por omissão e children', code: `function Aviso({ titulo, tipo = "info", children }) {
  return (
    <div className={\`aviso aviso--\${tipo}\`}>
      <strong>{titulo}</strong>
      <div>{children}</div>
    </div>
  );
}

function App() {
  return (
    <>
      <Aviso titulo="Prazo">A entrega é na sexta-feira.</Aviso>
      <Aviso titulo="Erro" tipo="erro">
        <p>O ficheiro não foi encontrado.</p>
      </Aviso>
    </>
  );
}` },
        {
          type: 'terms',
          items: [
            { term: 'Props', def: 'Os dados que o pai passa ao filho. São **só de leitura**: um componente nunca altera as suas próprias props.' },
            { term: '`children`', def: 'A prop especial com o que está entre a etiqueta de abertura e a de fecho. É a base da composição.' },
            { term: 'Desestruturação na assinatura', def: '`function Cartao({ nome, media })` em vez de `props.nome`. É o estilo dominante.' },
            { term: 'Composição', def: 'Construir componentes grandes juntando pequenos, em vez de herdar. Em React não se usa herança de componentes.' },
            { term: 'Fluxo de dados unidirecional', def: 'Os dados descem do pai para os filhos; as mudanças sobem por funções passadas como props.' },
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'as mudanças sobem por funções', code: `function Botao({ children, aoClicar }) {          // não sabe o que faz
  return <button onClick={aoClicar}>{children}</button>;
}

function App() {
  const [total, setTotal] = useState(0);          // o estado vive aqui
  return (
    <>
      <p>{total} €</p>
      <Botao aoClicar={() => setTotal(total + 5)}>+5 €</Botao>
      <Botao aoClicar={() => setTotal(0)}>limpar</Botao>
    </>
  );
}` },
        { type: 'callout', tone: 'tip', title: 'Quando partir um componente', text: 'Parte quando o componente faz duas coisas, quando queres reutilizar um pedaço, ou quando já não cabe no ecrã sem rolar. Não partas por partir: quinze ficheiros de dez linhas cada são tão maus de ler como um de trezentas.' },
      ],
    },
    {
      id: 'estado',
      title: 'Estado com useState',
      blocks: [
        { type: 'p', text: 'Props são os dados que **vêm de fora**; estado são os dados que o componente **guarda e altera ao longo do tempo**. Uma variável normal não serve: ao voltar a desenhar o componente, a função corre de novo e a variável volta ao valor inicial — e ninguém avisa o React de que há algo para redesenhar.' },
        { type: 'code', lang: 'jsx', caption: 'a assinatura, e o que cada parte é', code: `const [valor, setValor] = useState(0);
//     │       │                     └ valor inicial (só usado no primeiro render)
//     │       └ função que ATUALIZA e pede novo render
//     └ o valor atual, nesta passagem

// atualizar a partir do valor atual: usa a forma de função
setValor(valor + 1);        // usa o valor capturado neste render
setValor((v) => v + 1);     // usa sempre o valor mais recente — mais seguro` },
        { type: 'callout', tone: 'key', title: 'A atualização não é imediata', text: 'Depois de `setValor(1)`, a variável `valor` continua a valer o que valia **até ao próximo render**. O React agrupa as atualizações de um mesmo evento e redesenha uma vez só. É por isso que dois `setValor(valor + 1)` seguidos somam **um**, e dois `setValor(v => v + 1)` somam **dois**.' },
        { type: 'h', text: 'Nunca mutar o estado' },
        { type: 'code', lang: 'jsx', caption: 'o React compara referências, não conteúdos', code: `const [tarefas, setTarefas] = useState([]);

// ✗ o React não vê diferença nenhuma: é o mesmo array
tarefas.push(nova);
setTarefas(tarefas);

// ✓ um array novo
setTarefas([...tarefas, nova]);

// alterar um item: map devolve um array novo com um objeto novo
setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));

// remover: filter
setTarefas(tarefas.filter((t) => t.id !== id));

// objetos: espalha e substitui
setUtilizador({ ...utilizador, email: novoEmail });` },
        {
          type: 'list',
          items: [
            '**Um estado por preocupação**, e não um objeto gigante — nem quinze estados que mudam sempre juntos.',
            '**Não guardes o que podes calcular.** Se o total é a soma dos itens, calcula-o no render; um estado a mais é um estado que pode ficar dessincronizado.',
            '**O estado é local ao componente.** Duas instâncias do mesmo componente têm estados independentes.',
            'Se dois componentes precisam do mesmo estado, **eleva-o** para o pai comum (módulo 24).',
          ],
        },
        { type: 'callout', tone: 'trap', title: 'Estado derivado', text: 'Guardar `total` num estado e atualizá-lo em cada alteração dos itens é o erro mais comum depois de aprender `useState`. Mais tarde ou mais cedo há um caminho que atualiza os itens e se esquece do total. `const total = itens.reduce(…)` no corpo do componente não tem esse problema — e não custa nada.' },
      ],
    },
    {
      id: 'eventos',
      title: 'Eventos e renderização condicional',
      blocks: [
        { type: 'code', lang: 'jsx', caption: 'passar a função, não chamá-la', code: `<button onClick={guardar}>Guardar</button>          {/* ✓ passa a função */}
<button onClick={guardar()}>Guardar</button>        {/* ✗ chama-a durante o render! */}
<button onClick={() => apagar(id)}>Apagar</button>  {/* ✓ com argumento: arrow */}

function aoEnviar(e) {
  e.preventDefault();          // impede o browser de recarregar a página
  console.log(e.target.value);
}` },
        {
          type: 'table',
          head: ['Padrão', 'Escreve-se', 'Quando'],
          rows: [
            ['E/ou nada', '`{erro && <p>{erro}</p>}`', 'Mostrar só se houver valor (com booleano!)'],
            ['Ternário', '`{ok ? <Sucesso /> : <Falha />}`', 'Um de dois'],
            ['Saída antecipada', '`if (aCarregar) return <Spinner />;`', 'O componente inteiro muda'],
            ['Variável de elemento', '`let conteudo; if (…) conteudo = …`', 'Três ou mais casos'],
            ['Mapa de componentes', '`const ECRAS = { a: A, b: B }`', 'Muitos casos, escolhidos por chave'],
          ],
        },
        { type: 'callout', tone: 'info', text: 'Os eventos do React são *sintéticos*: têm a mesma interface dos eventos do DOM (`e.target`, `e.preventDefault()`), mas são geridos pelo React, o que lhe permite tratar diferenças entre browsers e otimizar a ligação. Na prática, escreve-se como no DOM — só com nomes em camelCase.' },
      ],
    },
    {
      id: 'listas',
      title: 'Listas e keys',
      blocks: [
        { type: 'code', lang: 'jsx', caption: 'uma lista é um array de elementos', code: `function Lista({ alunos }) {
  return (
    <ul>
      {alunos.map((a) => (
        <li key={a.id}>{a.nome} — {a.media}</li>
      ))}
    </ul>
  );
}` },
        { type: 'p', text: 'A `key` é uma pista de identidade: diz ao React qual elemento da lista antiga corresponde a qual da nova. Com ela, inserir um item no início move os restantes; sem ela, o React compara por posição e pode reaproveitar o elemento errado — mantendo o estado interno (o texto de um input, o foco, uma animação) no sítio errado.' },
        {
          type: 'table',
          head: ['`key`', 'Serve?', 'Porquê'],
          rows: [
            ['`key={item.id}`', '✓ ideal', 'Estável, único e ligado ao dado'],
            ['`key={item.email}`', '✓ se for único e não mudar', 'Um identificador natural também serve'],
            ['`key={indice}`', '⚠ só em listas que nunca mudam de ordem nem de tamanho', 'A posição muda quando se insere ou remove'],
            ['`key={Math.random()}`', '✗ nunca', 'Muda a cada render: o React destrói e recria tudo'],
            ['sem `key`', '✗', 'Aviso na consola e comparação por posição'],
          ],
        },
        { type: 'callout', tone: 'trap', title: 'O bug clássico do índice como key', text: 'Uma lista de inputs com `key={i}`: apagas o primeiro item e o texto que estava escrito no segundo passa a aparecer no primeiro. O React viu "a posição 0 continua a existir" e reaproveitou o input com o estado antigo. Com `key={item.id}` isso não acontece.' },
        { type: 'p', text: 'A `key` só é lida pelo React: não chega ao componente como prop. Se precisares do valor lá dentro, passa-o outra vez (`<Item key={a.id} id={a.id} />`).' },
      ],
    },
    {
      id: 'formularios',
      title: 'Formulários controlados',
      blocks: [
        { type: 'p', text: 'Num formulário controlado, o valor de cada campo vem do estado e cada tecla escrita atualiza esse estado. O React passa a ser a **única fonte de verdade** — o que permite validar em tempo real, desativar o botão, formatar enquanto se escreve.' },
        { type: 'code', lang: 'jsx', caption: 'um estado, um handler, validação derivada', code: `function Inscricao() {
  const [dados, setDados] = useState({ nome: "", email: "" });
  const mudar = (e) => setDados({ ...dados, [e.target.name]: e.target.value });

  // derivado: nunca guardado em estado
  const erros = {
    nome: dados.nome.trim().length < 3 ? "mínimo 3 letras" : null,
    email: dados.email.includes("@") ? null : "email inválido",
  };
  const valido = Object.values(erros).every((e) => e === null);

  return (
    <form onSubmit={(e) => { e.preventDefault(); enviar(dados); }}>
      <label htmlFor="nome">Nome</label>
      <input id="nome" name="nome" value={dados.nome} onChange={mudar} />
      {erros.nome && <span className="erro">{erros.nome}</span>}

      <button disabled={!valido}>Enviar</button>
    </form>
  );
}` },
        {
          type: 'list',
          items: [
            '`value` **e** `onChange` andam sempre juntos: com `value` sozinho o campo fica bloqueado (e o React avisa na consola).',
            'Para começar vazio usa `""`, nunca `undefined` — senão o campo passa de não-controlado a controlado e o React reclama.',
            'Checkbox usa `checked` em vez de `value`; um `<select multiple>` guarda um array.',
            '`[e.target.name]: e.target.value` — uma chave calculada — dá um único handler para o formulário inteiro.',
            'Em formulários muito grandes, os campos não controlados (`useRef` + `defaultValue`) evitam um render por tecla. Só vale a pena quando se nota.',
          ],
        },
        { type: 'callout', tone: 'tip', text: 'A validação continua a ser a do módulo 21: `required`, `type="email"` e `minlength` funcionam na mesma dentro do React e dão mensagens traduzidas de graça. Usa as duas — a nativa para o essencial, a do estado para o que exige lógica própria.' },
        { type: 'widget', id: 'react-lab', props: { set: 'react' } },
      ],
    },
  ],
  quiz: [
    { id: 'r1', prompt: 'Em que é que `<h1 className="t">Olá</h1>` se transforma depois de compilado?', options: ['Numa string de HTML', 'Numa chamada `React.createElement("h1", { className: "t" }, "Olá")`', 'Num nó do DOM', 'Em nada, o browser percebe JSX'], answer: 1, explain: 'JSX é açúcar sintático para chamadas de função que devolvem objetos simples. O DOM só aparece quando o React desenha esse objeto.' },
    { id: 'r2', prompt: 'Um componente pode alterar as suas próprias props?', options: ['Sim, com `props.x = valor`', 'Não: as props são só de leitura e vêm do pai', 'Só se forem objetos', 'Só dentro de um evento'], answer: 1, explain: 'O fluxo de dados é unidirecional: os dados descem por props, as mudanças sobem por funções que o pai passou. Para dados que mudam dentro do componente existe o estado.' },
    { id: 'r3', prompt: 'Que valor tem `contagem` logo a seguir a `setContagem(contagem + 1)`, dentro do mesmo evento?', options: ['O novo valor', 'O valor antigo — só muda no próximo render', '`undefined`', 'Depende do browser'], answer: 1, explain: 'A variável do render atual é uma constante. O React agrupa as atualizações do evento e volta a chamar o componente com o valor novo.' },
    { id: 'r4', prompt: 'Porque é que `tarefas.push(nova); setTarefas(tarefas);` não atualiza o ecrã?', options: ['Porque `push` é lento', 'Porque é o mesmo array: o React compara referências e não vê mudança', 'Porque falta um `await`', 'Porque `push` devolve um número'], answer: 1, explain: 'A comparação é por identidade (`Object.is`). Mutar o array mantém a mesma referência, logo o React conclui que nada mudou. `setTarefas([...tarefas, nova])` cria um array novo.' },
    { id: 'r5', prompt: 'O que faz `<button onClick={apagar()}>`?', options: ['Chama `apagar` ao clicar', 'Chama `apagar` durante o render e passa o resultado ao onClick', 'Dá erro de sintaxe', 'O mesmo que `onClick={apagar}`'], answer: 1, explain: 'Os parêntesis executam a função imediatamente. Para passar argumentos, envolve numa arrow: `onClick={() => apagar(id)}`.' },
    { id: 'r6', prompt: 'Qual é a melhor `key` para uma lista de tarefas que se pode reordenar?', options: ['O índice do `map`', 'O `id` de cada tarefa', '`Math.random()`', 'Nenhuma, a key é opcional'], answer: 1, explain: 'A key tem de ser estável e ligada ao dado. O índice muda quando se insere, remove ou reordena, e o React acaba por reaproveitar o elemento errado.' },
    { id: 'r7', prompt: 'O que aparece no ecrã em `{lista.length && <p>Há itens</p>}` com a lista vazia?', options: ['Nada', 'O número `0`', '`false`', 'Um erro'], answer: 1, explain: 'O `&&` devolve `0`, e o React desenha números. `false`, `null` e `undefined` é que não desenham nada. Solução: `lista.length > 0 && …`.' },
    { id: 'r8', prompt: 'Num campo controlado, o que tem de acompanhar sempre o `value`?', options: ['Um `id`', 'Um `onChange` que atualiza o estado', 'Um `defaultValue`', 'Um `key`'], answer: 1, explain: 'Sem `onChange`, o valor fica preso ao estado e o utilizador não consegue escrever — o React até avisa na consola. Para campos não controlados usa-se `defaultValue`.' },
  ],
  exercises: [
    {
      id: 'e23-1', difficulty: 1, kind: 'predict', lang: 'js', title: 'Mutar ou copiar',
      statement: 'É esta comparação que decide se o React redesenha. Escreve a saída.',
      code: `const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a === b, a.length);

const c = [...a, 5];
console.log(a === c, c.length);`,
      accept: ['true 4 false 5'],
      hint: 'O `push` altera o array existente; o spread cria um array novo.',
      solution: '`true 4` e depois `false 5`. O `push` mantém a mesma referência — é exatamente por isso que `setTarefas(tarefas)` depois de um `push` não desenha nada. O spread produz um array novo, com identidade diferente, e aí o React vê a mudança.',
    },
    {
      id: 'e23-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'Dois cliques no mesmo evento',
      statement: 'Este código simula o que o React faz com duas atualizações no mesmo evento. Escreve os dois números.',
      code: `let estado = 0;
const fila = [];
const definir = (x) => fila.push(typeof x === "function" ? x : () => x);

const valor = estado;        // o valor "capturado" neste render
definir(valor + 1);
definir(valor + 1);
for (const f of fila) estado = f(estado);
console.log(estado);

estado = 0;
fila.length = 0;
definir((v) => v + 1);       // a forma de função
definir((v) => v + 1);
for (const f of fila) estado = f(estado);
console.log(estado);`,
      accept: ['1 2'],
      hint: 'Na primeira metade, ambas as atualizações usam o mesmo `valor` capturado.',
      solution: '`1` e depois `2`. As duas primeiras atualizações mandam o mesmo valor absoluto (`0 + 1`), e a segunda apenas repete a primeira. Com a forma de função, cada atualização recebe o resultado da anterior. É a razão da regra: **quando o novo valor depende do antigo, usa `setValor(v => …)`**.',
    },
    {
      id: 'e23-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'JSX é uma chamada de função',
      statement: 'Uma versão mínima do `createElement`. Que saída produz?',
      code: `const createElement = (tipo, props, ...filhos) => ({ tipo, props: props ?? {}, filhos });

const el = createElement("h1", { className: "titulo" }, "Olá, ", "Ana");
console.log(el.tipo, el.filhos.length, el.props.className);

const vazio = createElement("br", null);
console.log(vazio.tipo, vazio.filhos.length, Object.keys(vazio.props).length);`,
      accept: ['h1 2 titulo br 0 0'],
      hint: 'Os filhos chegam como parâmetro rest; `props ?? {}` transforma o `null` num objeto vazio.',
      solution: '`h1 2 titulo` e depois `br 0 0`. É isto que o JSX produz: objetos simples, sem DOM nenhum à vista. `<h1 className="titulo">Olá, {nome}</h1>` tem dois filhos porque o texto e a expressão são elementos separados.',
    },
    {
      id: 'e23-4', difficulty: 2, kind: 'predict', lang: 'js', title: 'O `0` que aparece no ecrã',
      statement: 'O React desenha o que estas expressões devolvem — exceto `false`, `null` e `undefined`. Escreve as quatro saídas.',
      code: `const vazia = [];
const cheia = ["a", "b"];

console.log(vazia.length && "tem itens");
console.log(vazia.length > 0 && "tem itens");
console.log(cheia.length && "tem itens");
console.log(cheia.length > 0 && "tem itens");`,
      accept: ['0 false tem itens tem itens'],
      hint: 'O `&&` devolve o operando da esquerda quando ele é falso — e `0` é falso.',
      solution: '`0`, `false`, `tem itens`, `tem itens`. Com a lista vazia, a primeira expressão devolve `0` — e o React **desenha** o zero, porque números são conteúdo válido. O `false` não desenha nada. Daí a regra: converte sempre a condição para booleano antes do `&&`.',
    },
    {
      id: 'e23-5', difficulty: 2, kind: 'code', lang: 'jsx', title: 'Lista de compras',
      statement: 'No laboratório de React, faz um componente `Compras` com: um campo de texto e um botão para acrescentar artigos, a lista dos artigos com uma caixa para marcar como comprado, um botão para remover cada artigo, e um resumo "x de y comprados". Nunca mutes o array de estado e usa uma key estável.',
      hint: 'Um estado para a lista e outro para o texto do campo. `Date.now()` serve de id. O resumo calcula-se com `filter`, não se guarda.',
      solution: `function Compras() {
  const [artigos, setArtigos] = useState([]);
  const [texto, setTexto] = useState("");

  function acrescentar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setArtigos([...artigos, { id: Date.now(), nome: texto.trim(), comprado: false }]);
    setTexto("");
  }

  const alternar = (id) =>
    setArtigos(artigos.map((a) => (a.id === id ? { ...a, comprado: !a.comprado } : a)));

  const remover = (id) => setArtigos(artigos.filter((a) => a.id !== id));

  const comprados = artigos.filter((a) => a.comprado).length;   // derivado

  return (
    <div className="cartao">
      <h2>Compras ({comprados} de {artigos.length} comprados)</h2>

      <form onSubmit={acrescentar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Artigo" />
        <button>Acrescentar</button>
      </form>

      <ul>
        {artigos.map((a) => (
          <li key={a.id}>
            <input type="checkbox" checked={a.comprado} onChange={() => alternar(a.id)} />
            <span style={{ textDecoration: a.comprado ? "line-through" : "none" }}>{a.nome}</span>
            <button onClick={() => remover(a.id)}>×</button>
          </li>
        ))}
      </ul>

      {artigos.length === 0 && <p>A lista está vazia.</p>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Compras />);`,
    },
    {
      id: 'e23-6', difficulty: 3, kind: 'code', lang: 'jsx', title: 'Filtrar e ordenar sem estado a mais',
      statement: 'Dada uma constante com uma dúzia de alunos (`{ id, nome, curso, media }`), faz uma página com: caixa de pesquisa por nome, seletor de curso, botão que alterna a ordenação por média (crescente/decrescente) e a tabela dos resultados com o total encontrado. **Só podes ter estado para o que o utilizador escreve ou escolhe** — a lista visível é sempre calculada.',
      hint: 'Três estados: `pesquisa`, `curso`, `ordem`. A lista visível é `ALUNOS.filter(…).sort(…)` no corpo do componente — copia o array antes de ordenar.',
      solution: `const ALUNOS = [
  { id: 1, nome: "Ana", curso: "Informática", media: 15.5 },
  { id: 2, nome: "Rui", curso: "Gestão", media: 12 },
  { id: 3, nome: "Sara", curso: "Informática", media: 18 },
  { id: 4, nome: "Tomás", curso: "Design", media: 14 },
];

function Alunos() {
  const [pesquisa, setPesquisa] = useState("");
  const [curso, setCurso] = useState("todos");
  const [ordem, setOrdem] = useState("desc");

  const cursos = ["todos", ...new Set(ALUNOS.map((a) => a.curso))];

  const visiveis = ALUNOS
    .filter((a) => a.nome.toLowerCase().includes(pesquisa.toLowerCase()))
    .filter((a) => curso === "todos" || a.curso === curso)
    .slice()                                   // cópia: sort ordena no sítio
    .sort((a, b) => (ordem === "desc" ? b.media - a.media : a.media - b.media));

  return (
    <div className="cartao">
      <h2>Alunos ({visiveis.length})</h2>

      <input value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Pesquisar nome" />

      <select value={curso} onChange={(e) => setCurso(e.target.value)}>
        {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <button onClick={() => setOrdem(ordem === "desc" ? "asc" : "desc")}>
        média {ordem === "desc" ? "↓" : "↑"}
      </button>

      <table>
        <thead>
          <tr><th>Nome</th><th>Curso</th><th>Média</th></tr>
        </thead>
        <tbody>
          {visiveis.map((a) => (
            <tr key={a.id}><td>{a.nome}</td><td>{a.curso}</td><td>{a.media.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>

      {visiveis.length === 0 && <p>Nenhum aluno corresponde.</p>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Alunos />);`,
    },
  ],
};
