import type { Module } from '../types';

export const m24: Module = {
  id: 'react-avancado',
  number: 24,
  title: 'React na prática',
  subtitle: 'Efeitos, dados, hooks próprios, estado partilhado e a estrutura de um projeto a sério',
  icon: '🧩',
  minutes: 75,
  goals: [
    'Usar `useEffect` para sincronizar com o exterior — e saber quando não precisas dele',
    'Buscar dados com estados de carregamento, erro e cancelamento',
    'Escolher entre `useRef`, `useMemo`, `useCallback` e não otimizar às cegas',
    'Extrair lógica para hooks próprios e partilhar estado com Context e `useReducer`',
    'Montar um projeto React real com Vite, e reconhecer as armadilhas de desempenho',
  ],
  sections: [
    {
      id: 'efeitos',
      title: 'useEffect: sincronizar com o mundo exterior',
      blocks: [
        { type: 'p', text: 'Um componente React devolve JSX e mais nada — é uma função pura. Quando é preciso tocar em algo **fora** do React (um temporizador, uma subscrição, o título da página, uma API do browser), esse trabalho vai para um efeito: código que corre **depois** de o React desenhar.' },
        { type: 'code', lang: 'jsx', caption: 'a anatomia de um efeito', code: `useEffect(() => {
  // 1. o efeito: corre depois do render
  const id = setInterval(() => setSegundos((s) => s + 1), 1000);

  // 2. a limpeza: corre antes do efeito seguinte e ao desmontar
  return () => clearInterval(id);
}, [ativo]);
//  └ 3. as dependências: o efeito volta a correr quando alguma delas muda` },
        {
          type: 'table',
          head: ['Dependências', 'O efeito corre', 'Usa-se para'],
          rows: [
            ['Omitidas', 'Depois de **todos** os renders', 'Quase nunca — costuma ser um erro'],
            ['`[]`', 'Uma vez, depois do primeiro render', 'Subscrever algo que não depende de nada'],
            ['`[a, b]`', 'No primeiro render e sempre que `a` ou `b` mudarem', 'O caso normal'],
          ],
        },
        { type: 'callout', tone: 'key', title: 'A limpeza não é opcional', text: 'Tudo o que se liga tem de se desligar: `clearInterval`, `removeEventListener`, `abort()`, fechar o websocket. Sem limpeza, cada vez que o componente é redesenhado ou desmontado fica lixo a correr — é a origem dos avisos de "atualizar estado num componente desmontado" e de fugas de memória.' },
        { type: 'callout', tone: 'trap', title: 'Em desenvolvimento, o efeito corre duas vezes', text: 'O `StrictMode` monta, desmonta e volta a montar cada componente de propósito, para revelar efeitos sem limpeza. Não é um bug e não acontece em produção: se o teu efeito parte com a repetição, é o efeito que tem um problema.' },
        { type: 'h', text: 'Quando **não** usar um efeito' },
        { type: 'code', lang: 'jsx', caption: 'três efeitos que não deviam existir', code: `// ✗ dados derivados: um render a mais e uma fonte de dessincronização
const [total, setTotal] = useState(0);
useEffect(() => setTotal(itens.reduce((s, i) => s + i.preco, 0)), [itens]);

// ✓ calcula durante o render
const total = itens.reduce((s, i) => s + i.preco, 0);

// ✗ reagir a um clique dentro de um efeito
useEffect(() => { if (submetido) enviar(dados); }, [submetido]);

// ✓ faz isso no próprio evento
const aoSubmeter = () => enviar(dados);

// ✗ acertar o estado por causa de uma prop
useEffect(() => setSelecionado(null), [lista]);

// ✓ dá uma key ao componente e o React reinicia-lhe o estado
<Painel key={lista.id} lista={lista} />` },
        { type: 'p', text: 'A regra: efeitos servem para **sincronizar com sistemas externos**. Se o que queres fazer é calcular um valor ou responder a uma interação, o sítio é o corpo do componente ou o tratador do evento.' },
        { type: 'widget', id: 'react-lab', props: { set: 'hooks' } },
      ],
    },
    {
      id: 'dados',
      title: 'Buscar dados',
      blocks: [
        { type: 'p', text: 'Ir buscar dados a um servidor é o efeito mais comum de todos, e o que tem mais detalhes a acertar: os três estados possíveis, o cancelamento e a ordem de chegada das respostas.' },
        { type: 'code', lang: 'jsx', caption: 'a versão completa, com os quatro cuidados', code: `function Alunos({ curso }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    const controlador = new AbortController();   // 1. poder cancelar
    setACarregar(true);
    setErro(null);

    fetch(\`/api/alunos?curso=\${curso}\`, { signal: controlador.signal })
      .then((r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);   // 2. fetch não rejeita em 404!
        return r.json();
      })
      .then(setDados)
      .catch((e) => { if (e.name !== "AbortError") setErro(e.message); })
      .finally(() => setACarregar(false));

    return () => controlador.abort();            // 3. cancelar ao mudar de curso
  }, [curso]);                                   // 4. voltar a pedir quando a prop muda

  if (aCarregar) return <p>A carregar…</p>;
  if (erro) return <p className="erro">Não foi possível carregar: {erro}</p>;
  return <ul>{dados.map((a) => <li key={a.id}>{a.nome}</li>)}</ul>;
}` },
        { type: 'callout', tone: 'trap', title: 'Condição de corrida', text: 'Sem cancelamento, mudar rapidamente de curso dispara vários pedidos — e nada garante que cheguem pela ordem em que foram feitos. A resposta do curso antigo pode chegar depois e sobrepor-se à nova. `AbortController`, ou uma variável `cancelado` na limpeza, resolve.' },
        {
          type: 'list',
          items: [
            'Mostra **sempre** os três estados: a carregar, erro e sucesso. Uma interface que só desenha o caso feliz é uma interface por acabar.',
            '`fetch` só rejeita por falha de rede: um 404 ou um 500 chegam como resposta com `ok: false`. Verifica sempre o `r.ok`.',
            'Em vez de repetir isto em cada ecrã, extrai um hook (`usePedido`) — ou usa uma biblioteca como o TanStack Query, que traz cache, revalidação e nova tentativa.',
            'Em aplicações com servidor próprio (Next.js, Remix), a busca costuma acontecer no servidor e o componente já recebe os dados prontos.',
          ],
        },
      ],
    },
    {
      id: 'refs-memo',
      title: 'useRef, useMemo e useCallback',
      blocks: [
        {
          type: 'terms',
          items: [
            { term: '`useRef(valor)`', def: 'Uma caixa (`ref.current`) que sobrevive aos renders e **não** provoca render nenhum quando muda. Para elementos do DOM e para valores que não afetam o ecrã.' },
            { term: '`useMemo(fn, deps)`', def: 'Guarda o **resultado** de um cálculo e só o repete quando as dependências mudam.' },
            { term: '`useCallback(fn, deps)`', def: 'Guarda a própria **função**, para que a identidade dela não mude entre renders. É `useMemo` a devolver uma função.' },
            { term: '`memo(Componente)`', def: 'Evita redesenhar um filho cujas props não mudaram (comparadas por identidade).' },
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'os dois usos do useRef', code: `function Pesquisa() {
  const campo = useRef(null);          // 1. aceder a um elemento do DOM
  const renders = useRef(0);           // 2. um valor que não desenha nada

  renders.current++;
  useEffect(() => { campo.current.focus(); }, []);

  return (
    <>
      <input ref={campo} />
      <p>renders: {renders.current}</p>
    </>
  );
}` },
        { type: 'code', lang: 'jsx', caption: 'memorizar — depois de medir', code: `function Tabela({ linhas, filtro }) {
  // só recalcula quando as linhas ou o filtro mudam
  const visiveis = useMemo(
    () => linhas.filter((l) => l.nome.includes(filtro)).sort((a, b) => b.valor - a.valor),
    [linhas, filtro],
  );

  // identidade estável: senão o <Filho memo> voltava a desenhar em todos os renders
  const aoEscolher = useCallback((id) => console.log("escolhido", id), []);

  return <Filho linhas={visiveis} aoEscolher={aoEscolher} />;
}` },
        { type: 'callout', tone: 'warn', title: 'Otimização sem medição é ruído', text: 'Memorizar tem custo: mais código, mais memória, mais uma lista de dependências para manter certa. Redesenhar um componente pequeno é barato — o React foi feito para isso. Mede primeiro no *Profiler* das React DevTools, e só depois memoriza o que aparecer lá. (O React Compiler, que faz isto automaticamente, está a mudar esta conversa.)' },
        { type: 'callout', tone: 'trap', title: 'Objetos e funções nas dependências', text: 'Um objeto literal ou uma arrow function criados no corpo do componente são **novos em cada render**. Se aparecerem numa lista de dependências, o efeito ou o `useMemo` correm sempre. Ou os defines fora do componente, ou os envolves em `useMemo`/`useCallback`.' },
      ],
    },
    {
      id: 'hooks-proprios',
      title: 'Hooks próprios',
      blocks: [
        { type: 'p', text: 'Um hook próprio é apenas **uma função que começa por `use` e usa outros hooks**. Não há nada de mágico: serve para tirar lógica de dentro do componente e reutilizá-la — cada componente que o chama fica com o seu próprio estado, independente.' },
        { type: 'code', lang: 'jsx', caption: 'um hook para o localStorage', code: `function useGuardado(chave, inicial) {
  const [valor, setValor] = useState(() => {
    // função no useState: só corre no primeiro render
    try { return JSON.parse(localStorage.getItem(chave)) ?? inicial; }
    catch { return inicial; }
  });

  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);

  return [valor, setValor];        // a mesma forma do useState
}

// no componente, isto é tudo o que se vê:
const [tema, setTema] = useGuardado("tema", "claro");` },
        {
          type: 'callout', tone: 'key', title: 'As regras dos hooks',
          text: 'Só se chamam hooks **no topo** de um componente ou de outro hook: nunca dentro de `if`, de ciclos ou de funções aninhadas. O React identifica cada estado pela **ordem** das chamadas, e essa ordem tem de ser igual em todos os renders. O plugin de ESLint verifica isto por ti — quando ele avisa, tem razão.',
        },
        { type: 'code', lang: 'jsx', caption: 'errado e certo', code: `// ✗ a ordem das chamadas muda entre renders
if (ativo) {
  const [x, setX] = useState(0);
}

// ✓ o hook corre sempre; a condição vai para dentro
const [x, setX] = useState(0);
useEffect(() => {
  if (!ativo) return;
  // …
}, [ativo]);` },
        { type: 'p', text: 'Hooks que aparecem em quase todos os projetos: `useDebounce` (esperar que o utilizador pare de escrever), `useLocalStorage`, `useMediaQuery`, `useFetch`. Escrevê-los uma vez é um bom exercício; a partir daí, quase todos existem em bibliotecas pequenas.' },
      ],
    },
    {
      id: 'estado-partilhado',
      title: 'Estado partilhado: elevar, Context, reducer',
      blocks: [
        {
          type: 'steps',
          items: [
            { title: '1. Estado local', text: 'Enquanto só um componente precisar do dado, ele fica lá. É o caso mais comum e o mais fácil de manter.' },
            { title: '2. Elevar o estado', text: 'Dois irmãos precisam do mesmo dado? Sobe-o para o pai comum mais próximo e desce-o por props, com as funções de alteração.' },
            { title: '3. Context', text: 'O dado é preciso em muitos níveis abaixo (tema, utilizador autenticado, língua) e passá-lo por props tornou-se ruído — o *props drilling*.' },
            { title: '4. Biblioteca de estado', text: 'A aplicação é grande, o estado muda muito e o desempenho começa a doer: Zustand, Redux Toolkit, Jotai. Só quando os três passos anteriores já não chegam.' },
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'Context: criar, fornecer, consumir', code: `const TemaContexto = createContext("claro");        // 1. criar

function App() {
  const [tema, setTema] = useState("claro");
  const valor = useMemo(() => ({ tema, setTema }), [tema]);   // identidade estável

  return (
    <TemaContexto.Provider value={valor}>            {/* 2. fornecer */}
      <Pagina />
    </TemaContexto.Provider>
  );
}

function Botao() {
  const { tema, setTema } = useContext(TemaContexto);          // 3. consumir
  return <button className={tema} onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>tema</button>;
}` },
        { type: 'callout', tone: 'warn', title: 'Context não é um gestor de estado', text: 'Todos os componentes que consomem um contexto voltam a desenhar quando o `value` muda de identidade. Um contexto com muitos dados que mudam a toda a hora redesenha meia aplicação. Divide em contextos pequenos por assunto, e memoriza o objeto do `value`.' },
        { type: 'h', text: '`useReducer`: quando o estado tem regras' },
        { type: 'code', lang: 'jsx', caption: 'todas as transições num sítio só', code: `function reducer(estado, acao) {
  switch (acao.tipo) {
    case "juntar":  return { ...estado, itens: [...estado.itens, acao.item] };
    case "remover": return { ...estado, itens: estado.itens.filter((i) => i.id !== acao.id) };
    case "limpar":  return { ...estado, itens: [] };
    default: throw new Error("ação desconhecida: " + acao.tipo);
  }
}

const [estado, despachar] = useReducer(reducer, { itens: [] });
despachar({ tipo: "juntar", item: { id: 1, nome: "Caderno" } });` },
        {
          type: 'compare',
          left: { title: '`useState` quando', items: ['O estado é um valor simples e independente', 'As atualizações são diretas', 'Há dois ou três estados no componente'] },
          right: { title: '`useReducer` quando', items: ['Vários campos mudam em conjunto e têm regras', 'A mesma transição acontece em sítios diferentes', 'Queres testar a lógica sozinha: o reducer é uma função pura'] },
        },
        { type: 'p', text: 'O reducer é JavaScript puro — recebe estado e ação, devolve estado novo. Testa-se sem React nenhum, e é o mesmo padrão do Redux e do `dispatch` de muitas bibliotecas.' },
      ],
    },
    {
      id: 'projeto',
      title: 'Um projeto React a sério',
      blocks: [
        { type: 'code', lang: 'bash', caption: 'do zero até correr', code: `npm create vite@latest a-minha-app -- --template react-ts
cd a-minha-app
npm install
npm run dev        # servidor de desenvolvimento com recarga instantânea

npm run build      # produção: dist/ com HTML, CSS e JS minificados
npm run preview    # servir o dist/ localmente para confirmar` },
        {
          type: 'table',
          head: ['Peça', 'Escolha comum', 'Para que serve'],
          rows: [
            ['Ferramenta de build', 'Vite', 'Servidor rápido, empacota para produção'],
            ['Linguagem', 'TypeScript', 'Props e estado com tipos — apanha erros antes de correr'],
            ['Navegação', 'React Router', 'Várias páginas sem recarregar (é o que este tutorial usa)'],
            ['Estilos', 'CSS Modules, Tailwind ou CSS-in-JS', 'Isolar o CSS de cada componente'],
            ['Dados do servidor', 'TanStack Query', 'Cache, revalidação e nova tentativa'],
            ['Testes', 'Vitest + Testing Library', 'Testar como o utilizador usa, não os detalhes internos'],
            ['Framework completa', 'Next.js', 'Rotas, servidor e SEO já resolvidos'],
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'componentes com tipos', code: `type Aluno = { id: number; nome: string; media: number };

type CartaoProps = {
  aluno: Aluno;
  destacado?: boolean;
  aoEscolher: (id: number) => void;
};

function Cartao({ aluno, destacado = false, aoEscolher }: CartaoProps) {
  return (
    <button className={destacado ? "cartao ativo" : "cartao"} onClick={() => aoEscolher(aluno.id)}>
      {aluno.nome} — {aluno.media.toFixed(1)}
    </button>
  );
}

const [aluno, setAluno] = useState<Aluno | null>(null);   // estado tipado` },
        { type: 'callout', tone: 'tip', title: 'Este tutorial é um projeto React', text: 'Vinte e quatro módulos, cerca de 60 componentes, cinco laboratórios de código e progresso guardado no browser — feito com Vite, React, React Router e Tailwind, sem uma única biblioteca de interface. O código está todo aberto: `src/content/` para o conteúdo, `src/components/` para a interface, `src/lib/` para a lógica pura. É o melhor exercício que te posso propor: abre-o e muda alguma coisa.' },
      ],
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e desempenho',
      blocks: [
        {
          type: 'table',
          head: ['Sintoma', 'Causa provável', 'Correção'],
          rows: [
            ['O ecrã não atualiza', 'Estado mutado em vez de substituído', 'Cria um array/objeto novo (`[...]`, `{...}`)'],
            ['Ciclo infinito de renders', '`setEstado` no corpo do componente, ou dependências que mudam sempre', 'Move para um evento ou efeito; estabiliza as dependências'],
            ['O texto salta de linha ao apagar itens', '`key={indice}`', 'Usa um id estável'],
            ['"Too many re-renders"', 'Chamaste a função em vez de a passar: `onClick={f()}`', '`onClick={f}` ou `onClick={() => f(x)}`'],
            ['Aviso de campo não controlado', 'O `value` começou em `undefined`', 'Inicia o estado com `""`'],
            ['Estado antigo dentro de um `setTimeout`', 'Closure com o valor do render antigo', 'Usa `setValor(v => …)` ou uma ref'],
            ['A lista de 5000 linhas arrasta', 'Desenhar tudo de uma vez', 'Paginação ou virtualização (`react-window`)'],
          ],
        },
        { type: 'code', lang: 'jsx', caption: 'o erro que dá "too many re-renders"', code: `// ✗ setContagem corre durante o render, que provoca outro render, que…
function Mau() {
  const [contagem, setContagem] = useState(0);
  setContagem(contagem + 1);
  return <p>{contagem}</p>;
}

// ✓ o estado só muda em resposta a alguma coisa
function Bom() {
  const [contagem, setContagem] = useState(0);
  return <button onClick={() => setContagem((c) => c + 1)}>{contagem}</button>;
}` },
        {
          type: 'list',
          items: [
            'Desenhar de novo **não** é o mesmo que tocar no DOM: o React compara o resultado e só escreve no DOM o que mudou. Um render a mais é quase sempre irrelevante.',
            'A otimização com mais retorno é **desenhar menos coisas** (paginar, virtualizar, dividir por rotas), não memorizar mais.',
            'As **React DevTools** têm um separador *Profiler* que grava uma interação e mostra o que redesenhou e porquê. Usa-o antes de mudar código.',
            '`React.lazy` + `Suspense` dividem o código por rota: a primeira página deixa de descarregar a aplicação inteira.',
            'Testa o comportamento visível — "ao clicar em Guardar aparece a mensagem" —, não o estado interno. É o que a Testing Library encoraja.',
          ],
        },
        { type: 'callout', tone: 'key', title: 'Para onde ir a seguir', text: 'Com estes dois módulos tens o React que se usa no dia a dia. Os passos seguintes naturais são: **React Router** para várias páginas, **TypeScript** a sério nas props (módulo 19), uma framework como o **Next.js** quando precisares de servidor e SEO, e **testes** com Vitest e Testing Library. Mas antes disso: constrói qualquer coisa tua, do princípio ao fim.' },
      ],
    },
  ],
  quiz: [
    { id: 'ra1', prompt: 'Para que serve a função devolvida por um `useEffect`?', options: ['Devolver o resultado do efeito', 'Limpar: corre antes do efeito seguinte e ao desmontar', 'Adiar o efeito', 'Nada, é opcional e ignorada'], answer: 1, explain: 'É onde se desliga o que se ligou: `clearInterval`, `removeEventListener`, `abort()`. Sem limpeza acumulam-se subscrições e temporizadores.' },
    { id: 'ra2', prompt: 'Um `useEffect` com `[]` como dependências corre…', options: ['Depois de todos os renders', 'Uma vez, depois do primeiro render', 'Nunca', 'Antes do primeiro render'], answer: 1, explain: 'Lista vazia significa "não depende de nada", logo não há razão para repetir. Em desenvolvimento, o StrictMode monta duas vezes de propósito para revelar efeitos sem limpeza.' },
    { id: 'ra3', prompt: 'Qual destes casos **não** deve ser um efeito?', options: ['Subscrever um evento do `window`', 'Calcular o total a partir da lista de itens', 'Ligar um `setInterval`', 'Abrir uma ligação websocket'], answer: 1, explain: 'Valores derivados calculam-se durante o render. Guardá-los em estado através de um efeito acrescenta um render e cria uma segunda fonte de verdade que pode dessincronizar-se.' },
    { id: 'ra4', prompt: 'Qual é a diferença entre `useRef` e `useState`?', options: ['Nenhuma, são sinónimos', 'Alterar uma ref não provoca render; alterar estado provoca', '`useRef` só serve para o DOM', '`useRef` é mais rápido a desenhar'], answer: 1, explain: 'A ref é uma caixa que sobrevive aos renders e passa despercebida ao React. Serve para elementos do DOM e para valores que não têm de aparecer no ecrã.' },
    { id: 'ra5', prompt: 'Porque é que se envolve o `value` de um Context em `useMemo`?', options: ['Para ser mais rápido a criar', 'Porque um objeto literal é novo em cada render e faria redesenhar todos os consumidores', 'Porque o Context exige um objeto memorizado', 'Para evitar erros de tipos'], answer: 1, explain: 'Os consumidores reagem à identidade do `value`. Um `{ tema, setTema }` criado no render muda sempre, e todos os componentes que usam o contexto voltam a desenhar.' },
    { id: 'ra6', prompt: 'Onde é que se pode chamar um hook?', options: ['Em qualquer sítio', 'Só no topo de um componente ou de outro hook, nunca dentro de `if` ou de ciclos', 'Só dentro de `useEffect`', 'Só em componentes de classe'], answer: 1, explain: 'O React associa cada estado à ordem das chamadas. Se essa ordem mudar entre renders, os valores trocam de sítio. O plugin de ESLint dos hooks deteta as violações.' },
    { id: 'ra7', prompt: 'O que faz `AbortController` numa busca de dados?', options: ['Repete o pedido', 'Permite cancelar o pedido na limpeza, evitando respostas fora de ordem', 'Guarda a resposta em cache', 'Converte a resposta em JSON'], answer: 1, explain: 'Sem cancelamento, a resposta de um pedido antigo pode chegar depois da nova e sobrepor-se-lhe — a condição de corrida clássica em interfaces com filtros.' },
    { id: 'ra8', prompt: 'Qual é a primeira coisa a fazer quando uma página React está lenta?', options: ['Envolver tudo em `useMemo`', 'Medir com o Profiler das React DevTools', 'Trocar de biblioteca de estado', 'Acrescentar `memo` a todos os componentes'], answer: 1, explain: 'Memorizar às cegas acrescenta código e raramente resolve o problema real, que costuma ser desenhar demasiados elementos. O Profiler mostra o que redesenhou e porquê.' },
  ],
  exercises: [
    {
      id: 'e24-1', difficulty: 2, kind: 'predict', lang: 'js', title: 'Dependências comparadas por identidade',
      statement: 'O React compara cada dependência com `Object.is`. Escreve as três saídas.',
      code: `const deps1 = [1, "a"];
const deps2 = [1, "a"];
console.log(deps1.every((d, i) => Object.is(d, deps2[i])));

const o1 = { limite: 10 };
const o2 = { limite: 10 };
console.log(Object.is(o1, o2));
console.log([o1].every((d, i) => Object.is(d, [o2][i])));`,
      accept: ['true false false'],
      hint: 'Números e strings comparam-se por valor; objetos por referência.',
      solution: '`true`, `false`, `false`. É por isto que um objeto ou uma arrow function criados no corpo do componente fazem o efeito correr em todos os renders: são valores novos de cada vez, mesmo tendo o mesmo conteúdo. Ou se definem fora do componente, ou se envolvem em `useMemo`/`useCallback`.',
    },
    {
      id: 'e24-2', difficulty: 2, kind: 'predict', lang: 'js', title: 'A ordem do efeito e da limpeza',
      statement: 'Este código simula um efeito que corre na montagem, volta a correr porque a dependência mudou, e desmonta. Que ordem é registada?',
      code: `const registo = [];
function efeito(id) {
  registo.push("efeito " + id);
  return () => registo.push("limpeza " + id);
}

let limpar = efeito(1);     // montagem
limpar();                   // a dependência mudou: limpa o anterior…
limpar = efeito(2);         // …e corre outra vez
limpar();                   // desmontagem

console.log(registo.join(" | "));`,
      accept: ['efeito 1 | limpeza 1 | efeito 2 | limpeza 2'],
      hint: 'A limpeza do efeito antigo corre **antes** do efeito novo.',
      solution: '`efeito 1 | limpeza 1 | efeito 2 | limpeza 2`. É esta a garantia do React: nunca há dois efeitos ativos ao mesmo tempo para a mesma linha de `useEffect`. Por isso é que a limpeza pode assumir que o que ela desliga foi ligado pelo efeito imediatamente anterior.',
    },
    {
      id: 'e24-3', difficulty: 2, kind: 'predict', lang: 'js', title: 'Um reducer é uma função pura',
      statement: 'O reducer nunca altera o estado que recebe. Escreve a saída.',
      code: `function reducer(estado, acao) {
  switch (acao.tipo) {
    case "juntar": return { ...estado, itens: [...estado.itens, acao.item] };
    case "limpar": return { ...estado, itens: [] };
    default: return estado;
  }
}

const inicial = { itens: [], filtro: "" };
let e = inicial;
e = reducer(e, { tipo: "juntar", item: "livro" });
e = reducer(e, { tipo: "juntar", item: "caneta" });
e = reducer(e, { tipo: "desconhecida" });

console.log(e.itens.length, e === inicial, inicial.itens.length);`,
      accept: ['2 false 0'],
      hint: 'Cada `case` devolve um objeto novo; a ação desconhecida devolve o mesmo estado que recebeu.',
      solution: '`2 false 0`. O estado final tem dois itens, não é o mesmo objeto que o inicial, e o **inicial continua vazio** — nunca foi tocado. É esta pureza que torna o reducer testável sem React e que permite ao React saber que houve mudança.',
    },
    {
      id: 'e24-4', difficulty: 3, kind: 'predict', lang: 'js', title: 'Closure com valor antigo',
      statement: 'Uma função criada num render "congela" as variáveis desse render. Escreve os dois valores.',
      code: `function criarHandler(valor) {
  return () => valor + 1;      // captura o valor do "render" atual
}

let contagem = 0;
const handler = criarHandler(contagem);

contagem = 5;                  // um "render" novo, com outro valor

console.log(handler());
console.log(contagem + 1);`,
      accept: ['1 6'],
      hint: 'O `handler` guardou uma cópia do valor que existia quando foi criado.',
      solution: '`1` e `6`. O handler foi criado quando `contagem` valia 0 e ficou com esse valor para sempre — é o *stale closure* que aparece dentro de `setTimeout`, de subscrições e de efeitos com dependências em falta. As duas saídas: usar `setValor(v => …)`, que recebe sempre o valor mais recente, ou guardar o valor numa ref.',
    },
    {
      id: 'e24-5', difficulty: 3, kind: 'code', lang: 'jsx', title: 'Hook de pesquisa com atraso',
      statement: 'Escreve um hook `useAtraso(valor, ms)` que devolva o valor apenas depois de ele estar `ms` milissegundos sem mudar (*debounce*), e usa-o num componente de pesquisa que só "procura" (um `console.log` chega) quando o utilizador para de escrever. Mostra o número de pesquisas feitas.',
      hint: 'Um `useState` para o valor atrasado e um `useEffect` com `setTimeout` cuja limpeza faz `clearTimeout`. Depois, um segundo efeito que reage ao valor atrasado.',
      solution: `function useAtraso(valor, ms = 400) {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), ms);
    return () => clearTimeout(id);      // cada tecla cancela o temporizador anterior
  }, [valor, ms]);

  return atrasado;
}

function Pesquisa() {
  const [texto, setTexto] = useState("");
  const termo = useAtraso(texto, 400);
  const [pesquisas, setPesquisas] = useState(0);

  useEffect(() => {
    if (!termo) return;
    console.log("a procurar:", termo);
    setPesquisas((p) => p + 1);
  }, [termo]);

  return (
    <div className="cartao">
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Pesquisar" />
      <p>a escrever: {texto || "—"}</p>
      <p>termo procurado: {termo || "—"}</p>
      <p>pesquisas feitas: {pesquisas}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Pesquisa />);`,
    },
    {
      id: 'e24-6', difficulty: 3, kind: 'code', lang: 'jsx', title: 'Carrinho com reducer e context',
      statement: 'Constrói um carrinho de compras onde: o estado vive num `useReducer` com as ações `juntar`, `remover` e `limpar`; o estado e o `despachar` são partilhados por Context; um componente `Catalogo` junta artigos e um `Resumo`, noutro ramo da árvore, mostra o total — **sem receber props nenhumas**.',
      hint: 'Um só contexto com `{ estado, despachar }`, memorizado com `useMemo`. O total calcula-se dentro do `Resumo` a partir do estado.',
      solution: `const CarrinhoContexto = createContext(null);

function reducer(estado, acao) {
  switch (acao.tipo) {
    case "juntar":  return { itens: [...estado.itens, acao.item] };
    case "remover": return { itens: estado.itens.filter((i) => i.id !== acao.id) };
    case "limpar":  return { itens: [] };
    default: throw new Error("ação desconhecida: " + acao.tipo);
  }
}

function useCarrinho() {
  const ctx = useContext(CarrinhoContexto);
  if (!ctx) throw new Error("useCarrinho tem de estar dentro do Provider");
  return ctx;
}

const CATALOGO = [
  { id: 1, nome: "Caderno", preco: 3.5 },
  { id: 2, nome: "Caneta", preco: 1.2 },
  { id: 3, nome: "Mochila", preco: 24 },
];

function Catalogo() {
  const { despachar } = useCarrinho();
  return (
    <ul>
      {CATALOGO.map((p) => (
        <li key={p.id}>
          {p.nome} — {p.preco.toFixed(2)} €
          <button onClick={() => despachar({ tipo: "juntar", item: { ...p, id: Date.now() } })}>juntar</button>
        </li>
      ))}
    </ul>
  );
}

function Resumo() {
  const { estado, despachar } = useCarrinho();
  const total = estado.itens.reduce((s, i) => s + i.preco, 0);   // derivado
  return (
    <div>
      <h3>{estado.itens.length} artigos — {total.toFixed(2)} €</h3>
      <ul>
        {estado.itens.map((i) => (
          <li key={i.id}>{i.nome} <button onClick={() => despachar({ tipo: "remover", id: i.id })}>×</button></li>
        ))}
      </ul>
      <button onClick={() => despachar({ tipo: "limpar" })}>limpar</button>
    </div>
  );
}

function App() {
  const [estado, despachar] = useReducer(reducer, { itens: [] });
  const valor = useMemo(() => ({ estado, despachar }), [estado]);

  return (
    <CarrinhoContexto.Provider value={valor}>
      <div className="cartao">
        <h2>Loja</h2>
        <Catalogo />
        <Resumo />
      </div>
    </CarrinhoContexto.Provider>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
    },
  ],
};
