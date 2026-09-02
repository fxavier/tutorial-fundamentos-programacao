import { useSyncExternalStore } from 'react';

const KEY = 'fip:progress:v1';

export interface QuizState { answers: Record<string, number>; submitted: boolean }
export interface ProgressState {
  sections: Record<string, string[]>;        // moduleId -> sectionIds concluídas
  quiz: Record<string, QuizState>;           // moduleId -> respostas
  exercises: Record<string, boolean>;        // exerciseId -> resolvido
  lastModule?: string;
  lastVisit?: string;
}

const empty: ProgressState = { sections: {}, quiz: {}, exercises: {} };

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...empty, ...parsed, sections: parsed.sections ?? {}, quiz: parsed.quiz ?? {}, exercises: parsed.exercises ?? {} };
  } catch {
    return empty;
  }
}

let state: ProgressState = typeof localStorage === 'undefined' ? empty : read();
const listeners = new Set<() => void>();

function commit(next: ProgressState) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* modo privado */ }
  listeners.forEach((l) => l());
}

export const progress = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },

  toggleSection(moduleId: string, sectionId: string, done?: boolean) {
    const cur = state.sections[moduleId] ?? [];
    const has = cur.includes(sectionId);
    const want = done ?? !has;
    if (want === has) return;
    const next = want ? [...cur, sectionId] : cur.filter((s) => s !== sectionId);
    commit({ ...state, sections: { ...state.sections, [moduleId]: next } });
  },

  setQuizAnswer(moduleId: string, qid: string, option: number) {
    const q = state.quiz[moduleId] ?? { answers: {}, submitted: false };
    if (q.submitted) return;
    commit({ ...state, quiz: { ...state.quiz, [moduleId]: { ...q, answers: { ...q.answers, [qid]: option } } } });
  },

  submitQuiz(moduleId: string) {
    const q = state.quiz[moduleId] ?? { answers: {}, submitted: false };
    commit({ ...state, quiz: { ...state.quiz, [moduleId]: { ...q, submitted: true } } });
  },

  resetQuiz(moduleId: string) {
    commit({ ...state, quiz: { ...state.quiz, [moduleId]: { answers: {}, submitted: false } } });
  },

  markExercise(id: string, done: boolean) {
    commit({ ...state, exercises: { ...state.exercises, [id]: done } });
  },

  visit(moduleId: string) {
    if (state.lastModule === moduleId) return;
    commit({ ...state, lastModule: moduleId, lastVisit: new Date().toISOString() });
  },

  resetAll() { commit(empty); },
};

export function useProgress(): ProgressState {
  return useSyncExternalStore(progress.subscribe, progress.get, () => empty);
}

/* ------------------------------------------------------------------ tema */

const THEME_KEY = 'fip:theme';
export type Theme = 'light' | 'dark';

let theme: Theme = (() => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
})();
const themeListeners = new Set<() => void>();

export const themeStore = {
  get: () => theme,
  subscribe(l: () => void) { themeListeners.add(l); return () => { themeListeners.delete(l); }; },
  toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignora */ }
    themeListeners.forEach((l) => l());
  },
};

export function useTheme(): Theme {
  return useSyncExternalStore(themeStore.subscribe, themeStore.get, () => 'light' as Theme);
}
