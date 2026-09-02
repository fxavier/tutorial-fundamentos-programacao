/** Geradores de "frames" para visualizar algoritmos de ordenação e pesquisa. */

export interface Frame {
  array: number[];
  compare: number[];
  swapped: boolean;
  done: number[];
  note: string;
  comparisons: number;
  swaps: number;
}

export type SortId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export const SORTS: { id: SortId; name: string; best: string; avg: string; worst: string; space: string; stable: boolean; idea: string }[] = [
  { id: 'bubble', name: 'Bolha (Bubble Sort)', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, idea: 'Compara vizinhos e troca-os; os maiores "sobem" até ao fim a cada passagem.' },
  { id: 'selection', name: 'Seleção (Selection Sort)', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false, idea: 'Procura o menor elemento restante e coloca-o na posição correta.' },
  { id: 'insertion', name: 'Inserção (Insertion Sort)', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, idea: 'Insere cada elemento na posição certa da parte já ordenada, como cartas na mão.' },
  { id: 'merge', name: 'Intercalação (Merge Sort)', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, idea: 'Divide ao meio, ordena cada metade e intercala as duas metades ordenadas.' },
  { id: 'quick', name: 'Rápida (Quick Sort)', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false, idea: 'Escolhe um pivô, separa menores e maiores, e repete em cada lado.' },
];

class Recorder {
  frames: Frame[] = [];
  comparisons = 0;
  swaps = 0;
  a: number[];
  constructor(a: number[]) { this.a = a; }
  snap(compare: number[], swapped: boolean, done: number[], note: string) {
    if (this.frames.length > 1500) return;
    this.frames.push({ array: [...this.a], compare: [...compare], swapped, done: [...done], note, comparisons: this.comparisons, swaps: this.swaps });
  }
}

export function sortFrames(input: number[], algo: SortId): Frame[] {
  const r = new Recorder([...input]);
  const a = r.a;
  const n = a.length;
  r.snap([], false, [], 'Estado inicial.');

  if (algo === 'bubble') {
    const done: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      let trocou = false;
      for (let j = 0; j < n - 1 - i; j++) {
        r.comparisons++;
        r.snap([j, j + 1], false, done, `Comparo ${a[j]} com ${a[j + 1]}.`);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          r.swaps++;
          trocou = true;
          r.snap([j, j + 1], true, done, `Troco: ${a[j + 1]} era maior.`);
        }
      }
      done.unshift(n - 1 - i);
      if (!trocou) { for (let k = 0; k < n; k++) if (!done.includes(k)) done.push(k); r.snap([], false, done, 'Nenhuma troca nesta passagem: já está ordenado.'); break; }
    }
  }

  if (algo === 'selection') {
    const done: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        r.comparisons++;
        r.snap([min, j], false, done, `O menor até agora é ${a[min]}; comparo com ${a[j]}.`);
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; r.swaps++; }
      done.push(i);
      r.snap([i, min], min !== i, done, `Coloco ${a[i]} na posição ${i + 1}.`);
    }
    done.push(n - 1);
    r.snap([], false, done, 'Fim.');
  }

  if (algo === 'insertion') {
    const done = [0];
    for (let i = 1; i < n; i++) {
      const chave = a[i];
      let j = i - 1;
      r.snap([i], false, [...done], `Vou inserir ${chave} na parte ordenada.`);
      while (j >= 0 && a[j] > chave) {
        r.comparisons++;
        a[j + 1] = a[j];
        r.swaps++;
        r.snap([j, j + 1], true, [...done], `${a[j]} é maior que ${chave}: desloco para a direita.`);
        j--;
      }
      if (j >= 0) r.comparisons++;
      a[j + 1] = chave;
      done.push(i);
      r.snap([j + 1], false, [...done], `${chave} fica na posição ${j + 2}.`);
    }
  }

  if (algo === 'merge') {
    const done: number[] = [];
    const buf = new Array<number>(n);
    const mergeSort = (lo: number, hi: number) => {
      if (hi - lo < 1) return;
      const mid = Math.floor((lo + hi) / 2);
      mergeSort(lo, mid);
      mergeSort(mid + 1, hi);
      let i = lo, j = mid + 1, k = lo;
      r.snap([lo, hi], false, done, `Intercalo [${lo + 1}..${mid + 1}] com [${mid + 2}..${hi + 1}].`);
      while (i <= mid && j <= hi) {
        r.comparisons++;
        buf[k++] = a[i] <= a[j] ? a[i++] : a[j++];
      }
      while (i <= mid) buf[k++] = a[i++];
      while (j <= hi) buf[k++] = a[j++];
      for (let t = lo; t <= hi; t++) { a[t] = buf[t]; r.swaps++; }
      r.snap([lo, hi], true, done, `Bloco [${lo + 1}..${hi + 1}] ordenado.`);
    };
    mergeSort(0, n - 1);
    r.snap([], false, a.map((_, i) => i), 'Fim.');
  }

  if (algo === 'quick') {
    const done: number[] = [];
    const quick = (lo: number, hi: number) => {
      if (lo >= hi) { if (lo === hi) done.push(lo); return; }
      const pivot = a[hi];
      r.snap([hi], false, done, `Pivô = ${pivot} (último de [${lo + 1}..${hi + 1}]).`);
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        r.comparisons++;
        r.snap([j, hi], false, done, `${a[j]} ${a[j] < pivot ? '<' : '>='} pivô ${pivot}.`);
        if (a[j] < pivot) {
          i++;
          if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; r.swaps++; r.snap([i, j], true, done, 'Troco para a esquerda do pivô.'); }
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      r.swaps++;
      done.push(i + 1);
      r.snap([i + 1], true, done, `Pivô ${pivot} fica na posição final ${i + 2}.`);
      quick(lo, i);
      quick(i + 2, hi);
    };
    quick(0, n - 1);
    r.snap([], false, a.map((_, i) => i), 'Fim.');
  }

  r.snap([], false, a.map((_, i) => i), `Ordenado com ${r.comparisons} comparações e ${r.swaps} movimentos.`);
  return r.frames;
}

export interface SearchStep { lo: number; hi: number; mid: number; note: string; found: boolean }

export function binarySearchSteps(sorted: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) {
      steps.push({ lo, hi, mid, note: `${sorted[mid]} = ${target} → encontrado na posição ${mid + 1}.`, found: true });
      return steps;
    }
    if (sorted[mid] < target) {
      steps.push({ lo, hi, mid, note: `${sorted[mid]} < ${target} → descarto a metade esquerda.`, found: false });
      lo = mid + 1;
    } else {
      steps.push({ lo, hi, mid, note: `${sorted[mid]} > ${target} → descarto a metade direita.`, found: false });
      hi = mid - 1;
    }
  }
  steps.push({ lo, hi, mid: -1, note: `${target} não existe no vetor.`, found: false });
  return steps;
}

export function linearSearchCount(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i + 1;
  return arr.length;
}
