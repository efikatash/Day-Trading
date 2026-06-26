"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type ProgressState,
  type OnboardingAnswers,
  type QuizResult,
  type Trade,
  type TradingPlan,
  type BacktestEntry,
  type PaperDay,
  type FinalProjectState,
  STORAGE_KEY,
  createInitialState,
} from "@/lib/app-types";

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  // onboarding
  setOnboarding: (a: OnboardingAnswers) => void;
  // lessons
  completeLesson: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  setLastVisited: (moduleId: string, lessonId: string) => void;
  // exercises
  saveExercise: (id: string, value: string | string[]) => void;
  getExercise: (id: string) => string | string[] | undefined;
  // quizzes
  saveQuizResult: (r: Omit<QuizResult, "attempts" | "bestScore">) => void;
  // journal
  addTrade: (t: Trade) => void;
  updateTrade: (t: Trade) => void;
  deleteTrade: (id: string) => void;
  // plan
  savePlan: (p: TradingPlan) => void;
  // backtests / paper
  addBacktest: (b: BacktestEntry) => void;
  deleteBacktest: (id: string) => void;
  setPaperDay: (d: PaperDay) => void;
  // calc
  bumpCalcUsage: () => void;
  // final project
  updateFinalProject: (patch: Partial<FinalProjectState>) => void;
  // theme
  toggleTheme: () => void;
  // tool state (generic)
  setToolState: (key: string, value: unknown) => void;
  getToolState: <T,>(key: string, fallback: T) => T;
  // reset
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak(state: ProgressState): ProgressState["streak"] {
  const today = todayISO();
  const prev = state.streak;
  if (!prev) return { count: 1, lastDate: today };
  if (prev.lastDate === today) return prev;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (prev.lastDate === yesterday) {
    return { count: prev.count + 1, lastDate: today };
  }
  return { count: 1, lastDate: today };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(createInitialState);
  const [ready, setReady] = useState(false);
  const firstLoad = useRef(true);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgressState>;
        setState({ ...createInitialState(), ...parsed });
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  // Persist on change (after first load).
  useEffect(() => {
    if (!ready) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage may be full / unavailable
    }
  }, [state, ready]);

  // Apply theme class to <html>.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.theme, ready]);

  const setOnboarding = useCallback((a: OnboardingAnswers) => {
    setState((s) => ({ ...s, onboarding: a, streak: bumpStreak(s) }));
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setState((s) => {
      if (s.completedLessons.includes(lessonId)) return s;
      return {
        ...s,
        completedLessons: [...s.completedLessons, lessonId],
        streak: bumpStreak(s),
      };
    });
  }, []);

  const isLessonComplete = useCallback(
    (lessonId: string) => state.completedLessons.includes(lessonId),
    [state.completedLessons]
  );

  const setLastVisited = useCallback((moduleId: string, lessonId: string) => {
    setState((s) => ({ ...s, lastVisited: { moduleId, lessonId } }));
  }, []);

  const saveExercise = useCallback((id: string, value: string | string[]) => {
    setState((s) => ({
      ...s,
      miniExercises: { ...s.miniExercises, [id]: value },
    }));
  }, []);

  const getExercise = useCallback(
    (id: string) => state.miniExercises[id],
    [state.miniExercises]
  );

  const saveQuizResult = useCallback(
    (r: Omit<QuizResult, "attempts" | "bestScore">) => {
      setState((s) => {
        const prev = s.quizResults[r.quizId];
        const attempts = (prev?.attempts ?? 0) + 1;
        const bestScore = Math.max(prev?.bestScore ?? 0, r.score);
        return {
          ...s,
          quizResults: {
            ...s.quizResults,
            [r.quizId]: { ...r, attempts, bestScore },
          },
          streak: bumpStreak(s),
        };
      });
    },
    []
  );

  const addTrade = useCallback((t: Trade) => {
    setState((s) => ({ ...s, journal: [t, ...s.journal] }));
  }, []);

  const updateTrade = useCallback((t: Trade) => {
    setState((s) => ({
      ...s,
      journal: s.journal.map((x) => (x.id === t.id ? t : x)),
    }));
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setState((s) => ({ ...s, journal: s.journal.filter((x) => x.id !== id) }));
  }, []);

  const savePlan = useCallback((p: TradingPlan) => {
    setState((s) => ({ ...s, plan: p }));
  }, []);

  const addBacktest = useCallback((b: BacktestEntry) => {
    setState((s) => ({ ...s, backtests: [b, ...s.backtests] }));
  }, []);

  const deleteBacktest = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      backtests: s.backtests.filter((x) => x.id !== id),
    }));
  }, []);

  const setPaperDay = useCallback((d: PaperDay) => {
    setState((s) => {
      const others = s.paperDays.filter((x) => x.date !== d.date);
      return { ...s, paperDays: [...others, d] };
    });
  }, []);

  const bumpCalcUsage = useCallback(() => {
    setState((s) => ({ ...s, calcUsage: s.calcUsage + 1 }));
  }, []);

  const updateFinalProject = useCallback(
    (patch: Partial<FinalProjectState>) => {
      setState((s) => ({
        ...s,
        finalProject: { ...s.finalProject, ...patch },
      }));
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));
  }, []);

  const setToolState = useCallback((key: string, value: unknown) => {
    setState((s) => ({ ...s, toolState: { ...s.toolState, [key]: value } }));
  }, []);

  const getToolState = useCallback(
    <T,>(key: string, fallback: T): T => {
      const v = state.toolState[key];
      return (v === undefined ? fallback : (v as T));
    },
    [state.toolState]
  );

  const resetAll = useCallback(() => {
    const fresh = createInitialState();
    fresh.theme = state.theme;
    setState(fresh);
  }, [state.theme]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      setOnboarding,
      completeLesson,
      isLessonComplete,
      setLastVisited,
      saveExercise,
      getExercise,
      saveQuizResult,
      addTrade,
      updateTrade,
      deleteTrade,
      savePlan,
      addBacktest,
      deleteBacktest,
      setPaperDay,
      bumpCalcUsage,
      updateFinalProject,
      toggleTheme,
      setToolState,
      getToolState,
      resetAll,
    }),
    [
      state,
      ready,
      setOnboarding,
      completeLesson,
      isLessonComplete,
      setLastVisited,
      saveExercise,
      getExercise,
      saveQuizResult,
      addTrade,
      updateTrade,
      deleteTrade,
      savePlan,
      addBacktest,
      deleteBacktest,
      setPaperDay,
      bumpCalcUsage,
      updateFinalProject,
      toggleTheme,
      setToolState,
      getToolState,
      resetAll,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
