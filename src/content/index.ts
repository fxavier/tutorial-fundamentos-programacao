import type { Module, GlossaryEntry } from '../types';
import { m01 } from './m01-computador';
import { m02 } from './m02-binario';
import { m03 } from './m03-memoria';
import { m04 } from './m04-redes';
import { m05 } from './m05-logica';
import { m06 } from './m06-controlo';
import { m07 } from './m07-algoritmos';
import { m08 } from './m08-estruturas';
import { m09 } from './m09-complexidade';
import { m10 } from './m10-paradigmas';
import { m11 } from './m11-ferramentas';
import { m12 } from './m12-proximos-passos';
import { m13 } from './m13-python';
import { m14 } from './m14-python-estruturas';
import { m15 } from './m15-python-poo';
import { m16 } from './m16-pandas';
import { m17 } from './m17-javascript';
import { m18 } from './m18-javascript-async';
import { m19 } from './m19-javascript-avancado';
import { m20 } from './m20-nodejs';

export const MODULES: Module[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20];

export const TRACKS = [
  { id: 'hardware', name: 'Como a máquina funciona', modules: ['computador', 'binario', 'memoria', 'redes'], color: 'from-sky-500 to-cyan-500' },
  { id: 'logica', name: 'Lógica e algoritmos', modules: ['logica', 'controlo', 'algoritmos'], color: 'from-violet-500 to-fuchsia-500' },
  { id: 'engenharia', name: 'Engenharia de software', modules: ['estruturas', 'complexidade', 'paradigmas', 'ferramentas', 'proximos-passos'], color: 'from-emerald-500 to-teal-500' },
  { id: 'python', name: 'Python na prática', modules: ['python', 'python-estruturas', 'python-poo', 'pandas'], color: 'from-amber-500 to-orange-500' },
  { id: 'javascript', name: 'JavaScript e Node.js', modules: ['javascript', 'javascript-async', 'javascript-avancado', 'nodejs'], color: 'from-yellow-500 to-lime-500' },
];

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function moduleNeighbours(id: string): { prev?: Module; next?: Module } {
  const i = MODULES.findIndex((m) => m.id === id);
  return { prev: i > 0 ? MODULES[i - 1] : undefined, next: i >= 0 && i < MODULES.length - 1 ? MODULES[i + 1] : undefined };
}

export const TOTAL_SECTIONS = MODULES.reduce((a, m) => a + m.sections.length, 0);
export const TOTAL_QUESTIONS = MODULES.reduce((a, m) => a + m.quiz.length, 0);
export const TOTAL_EXERCISES = MODULES.reduce((a, m) => a + m.exercises.length, 0);
export const TOTAL_MINUTES = MODULES.reduce((a, m) => a + m.minutes, 0);

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Algoritmo', def: 'Sequência finita de passos não ambíguos que resolve um problema.', module: 'algoritmos' },
  { term: 'Bit', def: 'Menor unidade de informação: 0 ou 1.', module: 'binario' },
  { term: 'Byte', def: 'Conjunto de 8 bits; representa 256 valores distintos.', module: 'memoria' },
  { term: 'Big-O', def: 'Notação que descreve como o custo de um algoritmo cresce com o tamanho da entrada.', module: 'complexidade' },
  { term: 'Cache', def: 'Memória rápida e pequena entre a CPU e a RAM, que guarda os dados usados recentemente.', module: 'memoria' },
  { term: 'Compilador', def: 'Programa que traduz código-fonte em código-máquina antes da execução.', module: 'computador' },
  { term: 'Complemento de dois', def: 'Convenção para representar números negativos em binário, dando peso negativo ao bit mais significativo.', module: 'binario' },
  { term: 'CPU', def: 'Unidade central de processamento: executa as instruções do programa.', module: 'computador' },
  { term: 'DNS', def: 'Serviço que traduz nomes de domínio em endereços IP.', module: 'redes' },
  { term: 'Encapsulamento (redes)', def: 'Processo em que cada camada acrescenta o seu cabeçalho aos dados da camada superior.', module: 'redes' },
  { term: 'Encapsulamento (POO)', def: 'Esconder o estado interno de um objeto, expondo apenas operações válidas.', module: 'paradigmas' },
  { term: 'Escopo', def: 'Zona do programa onde um nome é visível.', module: 'algoritmos' },
  { term: 'Fila (FIFO)', def: 'Estrutura em que o primeiro a entrar é o primeiro a sair.', module: 'estruturas' },
  { term: 'Hexadecimal', def: 'Base 16; cada dígito representa exatamente 4 bits.', module: 'binario' },
  { term: 'IEEE 754', def: 'Norma de representação de números com vírgula flutuante.', module: 'memoria' },
  { term: 'Índice', def: 'Posição de um elemento num vetor. Começa em 0 na maioria das linguagens.', module: 'estruturas' },
  { term: 'IP', def: 'Endereço lógico que identifica uma máquina numa rede.', module: 'redes' },
  { term: 'Mapa (hash)', def: 'Estrutura que associa chaves a valores com acesso médio em O(1).', module: 'estruturas' },
  { term: 'Overflow', def: 'Resultado que ultrapassa o valor máximo representável e "dá a volta".', module: 'binario' },
  { term: 'Pilha (LIFO)', def: 'Estrutura em que o último a entrar é o primeiro a sair; também a zona de memória das chamadas de função.', module: 'estruturas' },
  { term: 'Ponteiro', def: 'Variável que guarda o endereço de outra posição de memória.', module: 'memoria' },
  { term: 'Portugol', def: 'Pseudocódigo estruturado em português, usado para aprender lógica.', module: 'algoritmos' },
  { term: 'Pseudocódigo', def: 'Descrição estruturada de um algoritmo, independente de linguagem.', module: 'algoritmos' },
  { term: 'RAM', def: 'Memória principal, volátil e rápida, onde vivem os programas em execução.', module: 'computador' },
  { term: 'Recursão', def: 'Função que se chama a si própria com um problema menor até chegar ao caso base.', module: 'algoritmos' },
  { term: 'Sistema operativo', def: 'Software que gere recursos e faz de intermediário entre os programas e o hardware.', module: 'computador' },
  { term: 'TCP', def: 'Protocolo de transporte fiável, com ligação, ordem e retransmissão.', module: 'redes' },
  { term: 'Teste de mesa', def: 'Execução manual de um algoritmo, registando as variáveis passo a passo.', module: 'algoritmos' },
  { term: 'UDP', def: 'Protocolo de transporte rápido e sem garantias de entrega.', module: 'redes' },
  { term: 'Unicode / UTF-8', def: 'Catálogo universal de caracteres e a sua codificação dominante em bytes.', module: 'memoria' },
  { term: 'Variável', def: 'Nome dado a um espaço de memória que guarda um valor.', module: 'logica' },
  { term: 'Vetor (array)', def: 'Coleção de elementos do mesmo tipo em posições contíguas, acedidos por índice.', module: 'estruturas' },
  { term: 'Classe', def: 'Molde que define os atributos e os métodos que os seus objetos vão ter.', module: 'python-poo' },
  { term: 'Compreensão de lista', def: 'Expressão que constrói uma lista a partir de outra sequência: `[n ** 2 for n in numeros]`.', module: 'python-estruturas' },
  { term: 'DataFrame', def: 'Tabela do pandas: um conjunto de colunas (Series) que partilham o mesmo índice.', module: 'pandas' },
  { term: 'Dicionário (dict)', def: 'Estrutura de Python que associa chaves imutáveis a valores, com acesso médio em O(1).', module: 'python-estruturas' },
  { term: 'f-string', def: 'Literal de texto prefixado por `f` onde as expressões entre chavetas são substituídas pelo seu valor.', module: 'python' },
  { term: 'groupby', def: 'Operação do pandas que divide as linhas por grupos, aplica uma agregação a cada um e combina os resultados.', module: 'pandas' },
  { term: 'Herança', def: 'Mecanismo pelo qual uma classe recebe os atributos e métodos de outra, podendo especializá-los.', module: 'python-poo' },
  { term: 'Método', def: 'Função definida dentro de uma classe, que recebe o próprio objeto como primeiro argumento (`self`).', module: 'python-poo' },
  { term: 'Mutável / imutável', def: 'Um objeto mutável pode ser alterado depois de criado (lista, dicionário); um imutável não (string, tuplo).', module: 'python-estruturas' },
  { term: 'NaN', def: 'Marca de valor em falta em pandas. É ignorado nas agregações e não é o mesmo que zero.', module: 'pandas' },
  { term: 'Objeto (instância)', def: 'Exemplar concreto criado a partir de uma classe, com os seus próprios valores de atributos.', module: 'python-poo' },
  { term: 'Polimorfismo', def: 'A mesma chamada de método executa implementações diferentes conforme o tipo real do objeto.', module: 'python-poo' },
  { term: 'Property', def: 'Método que se lê e escreve como se fosse um atributo, permitindo validar ou calcular o valor.', module: 'python-poo' },
  { term: 'self', def: 'O próprio objeto, passado automaticamente como primeiro argumento de qualquer método.', module: 'python-poo' },
  { term: 'Series', def: 'Estrutura unidimensional do pandas: valores mais um índice. Uma coluna de um DataFrame.', module: 'pandas' },
  { term: 'Tuplo (tuple)', def: 'Sequência imutável. Pode ser chave de dicionário ou elemento de conjunto; uma lista não pode.', module: 'python-estruturas' },
  { term: 'Vetorização', def: 'Aplicar uma operação a uma coluna inteira de uma vez, em código compilado, em vez de percorrer linha a linha.', module: 'pandas' },
  { term: 'async / await', def: 'Sintaxe que faz código assíncrono ler-se como síncrono: `await` espera que uma promessa resolva.', module: 'javascript-async' },
  { term: 'Closure', def: 'Função que se lembra do escopo onde foi criada, mesmo depois de esse escopo terminar. Dá estado privado.', module: 'javascript-avancado' },
  { term: 'CommonJS / ESM', def: 'Os dois sistemas de módulos do JavaScript: `require`/`module.exports` e `import`/`export`.', module: 'javascript-avancado' },
  { term: 'Coerção de tipos', def: 'Conversão automática entre tipos feita pelo JavaScript, por exemplo em `1 == "1"`.', module: 'javascript' },
  { term: 'Event loop', def: 'Ciclo que executa o código síncrono, esvazia as microtarefas e só então tira uma macrotarefa.', module: 'javascript-async' },
  { term: 'Macrotarefa', def: 'Callback de `setTimeout`, `setInterval` ou de E/S. Só corre depois de esvaziadas todas as microtarefas.', module: 'javascript-async' },
  { term: 'Microtarefa', def: 'Continuação de uma promessa (`.then`, `await`). Tem prioridade sobre as macrotarefas.', module: 'javascript-async' },
  { term: 'Node.js', def: 'Ambiente que corre JavaScript fora do browser, com acesso a ficheiros, rede e processos.', module: 'nodejs' },
  { term: 'npm / package.json', def: 'O gestor de pacotes do Node e o ficheiro que declara nome, scripts e dependências de um projeto.', module: 'javascript-avancado' },
  { term: 'Promessa (Promise)', def: 'Objeto que representa um valor que ainda não existe: fica pendente, cumprida ou rejeitada.', module: 'javascript-async' },
  { term: 'Protótipo', def: 'Objeto de onde outro herda propriedades. As classes de JavaScript são açúcar sobre esta cadeia.', module: 'javascript-avancado' },
  { term: 'this', def: 'Em JavaScript depende de como a função é chamada, não de onde foi escrita.', module: 'javascript-avancado' },
  { term: 'TypeScript', def: 'JavaScript com tipos verificados na compilação. Os tipos são apagados e não existem em execução.', module: 'javascript-avancado' },
];
