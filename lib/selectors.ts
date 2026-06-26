import type { ProgressState } from "@/lib/app-types";
import type { Module } from "@/lib/types";
import { modules } from "@/lib/data/modules";
import { getLessonsForModule, allLessons } from "@/lib/data/lessons";

// Dev bypass: set to true to unlock everything for testing.
export const DEV_UNLOCK_ALL = false;

export interface ModuleProgress {
  module: Module;
  totalLessons: number;
  completedLessons: number;
  lessonsDone: boolean;
  quizPassed: boolean;
  quizBestScore: number | null;
  percent: number; // 0-100, includes quiz weight
  complete: boolean;
}

export function getModuleProgress(
  state: ProgressState,
  mod: Module
): ModuleProgress {
  const lessons = getLessonsForModule(mod.id);
  const total = lessons.length;
  const completed = lessons.filter((l) =>
    state.completedLessons.includes(l.id)
  ).length;
  const quiz = state.quizResults[mod.quizId];
  const quizPassed = !!quiz?.passed;
  const lessonsDone = total > 0 ? completed === total : true;

  // Module 10 (project) has no lessons; completion is driven by quiz + project.
  let percent: number;
  if (total === 0) {
    percent = quizPassed ? 100 : 0;
  } else {
    // lessons worth 80%, quiz worth 20%
    const lessonPart = (completed / total) * 80;
    const quizPart = quizPassed ? 20 : 0;
    percent = Math.round(lessonPart + quizPart);
  }

  const complete = lessonsDone && quizPassed;

  return {
    module: mod,
    totalLessons: total,
    completedLessons: completed,
    lessonsDone,
    quizPassed,
    quizBestScore: quiz?.bestScore ?? null,
    percent,
    complete,
  };
}

export function isModuleUnlocked(
  state: ProgressState,
  mod: Module
): boolean {
  if (DEV_UNLOCK_ALL) return true;
  if (mod.order === 1) return true;
  const prev = modules.find((m) => m.order === mod.order - 1);
  if (!prev) return true;
  const prevProgress = getModuleProgress(state, prev);
  return prevProgress.complete;
}

export interface OverallProgress {
  completedLessons: number;
  totalLessons: number;
  lessonPercent: number;
  modulesComplete: number;
  totalModules: number;
  overallPercent: number;
  quizCount: number;
  quizAverage: number | null;
}

export function getOverallProgress(state: ProgressState): OverallProgress {
  const totalLessonsCount = allLessons.length;
  const completed = state.completedLessons.length;
  const lessonPercent =
    totalLessonsCount > 0
      ? Math.round((completed / totalLessonsCount) * 100)
      : 0;

  const moduleProgresses = modules.map((m) => getModuleProgress(state, m));
  const modulesComplete = moduleProgresses.filter((m) => m.complete).length;
  const overallPercent = Math.round(
    moduleProgresses.reduce((sum, m) => sum + m.percent, 0) / modules.length
  );

  const quizResults = Object.values(state.quizResults);
  const quizCount = quizResults.length;
  const quizAverage =
    quizCount > 0
      ? Math.round(
          quizResults.reduce((s, q) => s + q.bestScore, 0) / quizCount
        )
      : null;

  return {
    completedLessons: completed,
    totalLessons: totalLessonsCount,
    lessonPercent,
    modulesComplete,
    totalModules: modules.length,
    overallPercent,
    quizCount,
    quizAverage,
  };
}

export interface NextAction {
  label: string;
  href: string;
  hint: string;
}

export function getNextAction(state: ProgressState): NextAction {
  // Find first incomplete lesson in order, in the first unlocked-not-complete module.
  for (const mod of modules) {
    if (!isModuleUnlocked(state, mod)) continue;
    const lessons = getLessonsForModule(mod.id);
    for (const lesson of lessons) {
      if (!state.completedLessons.includes(lesson.id)) {
        return {
          label: "המשך ללמוד",
          href: `/course/${mod.id}/${lesson.id}`,
          hint: `${mod.title} · ${lesson.title}`,
        };
      }
    }
    // lessons done — check quiz
    const mp = getModuleProgress(state, mod);
    if (lessons.length > 0 && !mp.quizPassed) {
      return {
        label: "גש למבחן המודול",
        href: `/course/${mod.id}/quiz`,
        hint: `${mod.title} · מבחן סיכום`,
      };
    }
    if (mod.order === 10 && !mp.quizPassed) {
      return {
        label: "המשך לפרויקט הגמר",
        href: `/final-project`,
        hint: "פרויקט גמר · תיק סוחר מתחיל",
      };
    }
  }
  return {
    label: "סקור את התעודה",
    href: "/final-project",
    hint: "סיימת את כל המודולים — בדוק את פרויקט הגמר",
  };
}

export interface JournalStats {
  count: number;
  wins: number;
  losses: number;
  winRate: number | null;
  avgR: number | null;
  totalR: number;
  biggestWin: number | null;
  biggestLoss: number | null;
  mostCommonMistake: string | null;
}

export function getJournalStats(state: ProgressState): JournalStats {
  const trades = state.journal;
  const count = trades.length;
  if (count === 0) {
    return {
      count: 0,
      wins: 0,
      losses: 0,
      winRate: null,
      avgR: null,
      totalR: 0,
      biggestWin: null,
      biggestLoss: null,
      mostCommonMistake: null,
    };
  }
  const withR = trades.filter((t) => typeof t.resultR === "number");
  const wins = withR.filter((t) => (t.resultR as number) > 0).length;
  const losses = withR.filter((t) => (t.resultR as number) < 0).length;
  const decided = wins + losses;
  const totalR = withR.reduce((s, t) => s + (t.resultR as number), 0);
  const avgR = withR.length > 0 ? totalR / withR.length : null;
  const winRate = decided > 0 ? Math.round((wins / decided) * 100) : null;

  const rs = withR.map((t) => t.resultR as number);
  const biggestWin = rs.length ? Math.max(...rs) : null;
  const biggestLoss = rs.length ? Math.min(...rs) : null;

  const mistakeCounts = new Map<string, number>();
  for (const t of trades) {
    const m = (t.mistake || "").trim();
    if (m) mistakeCounts.set(m, (mistakeCounts.get(m) ?? 0) + 1);
  }
  let mostCommonMistake: string | null = null;
  let best = 0;
  for (const [m, c] of mistakeCounts) {
    if (c > best) {
      best = c;
      mostCommonMistake = m;
    }
  }

  return {
    count,
    wins,
    losses,
    winRate,
    avgR: avgR !== null ? Math.round(avgR * 100) / 100 : null,
    totalR: Math.round(totalR * 100) / 100,
    biggestWin,
    biggestLoss,
    mostCommonMistake,
  };
}

export function isCourseComplete(state: ProgressState): boolean {
  const allModulesComplete = modules.every(
    (m) => getModuleProgress(state, m).complete
  );
  const finalChecklistDone = Object.keys(state.finalProject.checklist).length > 0
    ? FINAL_CHECKLIST_IDS.every((id) => state.finalProject.checklist[id])
    : false;
  const enoughTrades = state.journal.length >= 20;
  return allModulesComplete && finalChecklistDone && enoughTrades;
}

export const FINAL_CHECKLIST_IDS = [
  "fp-markets",
  "fp-hours",
  "fp-setups",
  "fp-entry",
  "fp-stop",
  "fp-target",
  "fp-sizing",
  "fp-daily",
  "fp-weekly",
  "fp-journal",
  "fp-trades",
  "fp-mistakes",
  "fp-improve",
];
