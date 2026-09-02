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

export const MODULES: Module[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12];

export const TRACKS = [
  { id: 'hardware', name: 'Como a máquina funciona', modules: ['computador', 'binario', 'memoria', 'redes'], color: 'from-sky-500 to-cyan-500' },
  { id: 'logica', name: 'Lógica e algoritmos', modules: ['logica', 'controlo', 'algoritmos'], color: 'from-violet-500 to-fuchsia-500' },
  { id: 'engenharia', name: 'Engenharia de software', modules: ['estruturas', 'complexidade', 'paradigmas', 'ferramentas', 'proximos-passos'], color: 'from-emerald-500 to-teal-500' },
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
];
