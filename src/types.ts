export type WidgetId =
  | 'base-converter'
  | 'bit-toggler'
  | 'storage-calculator'
  | 'memory-visualizer'
  | 'osi-simulator'
  | 'truth-table'
  | 'portugol'
  | 'sorting-visualizer'
  | 'binary-search'
  | 'ascii-explorer'
  | 'float-bits'
  | 'twos-complement'
  | 'bigo-chart'
  | 'flowchart'
  | 'desk-check'
  | 'cpu-cycle'
  | 'stack-heap'
  | 'packet-inspector'
  | 'complexity-race'
  | 'python-lab'
  | 'js-lab'
  | 'web-lab'
  | 'react-lab';

export type Tone = 'info' | 'tip' | 'warn' | 'key' | 'trap';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; code: string; lang?: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; tone: Tone; title?: string; text: string }
  | { type: 'widget'; id: WidgetId; props?: Record<string, unknown> }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'terms'; items: { term: string; def: string }[] }
  | { type: 'compare'; left: { title: string; items: string[] }; right: { title: string; items: string[] } };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export type ExerciseKind = 'input' | 'open' | 'code' | 'predict';

export interface Exercise {
  id: string;
  title: string;
  statement: string;
  kind: ExerciseKind;
  /** Respostas aceites (normalizadas) quando kind === 'input' ou 'predict'. */
  accept?: string[];
  /** Código a prever/executar quando kind === 'predict'. */
  code?: string;
  /** Pacotes Python a carregar antes de executar `code` (ex.: ['pandas']). */
  packages?: string[];
  /** Linguagem de `code` e da solução. Por omissão, 'python'. Só 'python' e 'js' são executáveis. */
  lang?: 'python' | 'js' | 'html' | 'css' | 'jsx';
  hint?: string;
  solution: string;
  difficulty: 1 | 2 | 3;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  minutes: number;
  goals: string[];
  sections: Section[];
  quiz: Question[];
  exercises: Exercise[];
}

export interface GlossaryEntry {
  term: string;
  def: string;
  module?: string;
}
