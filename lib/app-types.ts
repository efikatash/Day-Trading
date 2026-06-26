// Application state types (user-generated data persisted in localStorage).

export type ExperienceLevel =
  | "none"
  | "seen-charts"
  | "traded-lost"
  | "traded-want-structure";

export type Weakness =
  | "impatience"
  | "fear-loss"
  | "fomo"
  | "no-plan"
  | "revenge"
  | "unknown";

export type StudyTime = "15" | "30" | "45" | "60";

export interface OnboardingAnswers {
  experience: ExperienceLevel;
  weakness: Weakness;
  studyTime: StudyTime;
  completedAt: string;
}

export interface QuizResult {
  quizId: string;
  score: number; // percentage 0-100
  total: number;
  correct: number;
  passed: boolean;
  attempts: number;
  bestScore: number;
  lastTakenAt: string;
}

export type TradeDirection = "long" | "short";

export interface Trade {
  id: string;
  date: string;
  market: string;
  setup: string;
  direction: TradeDirection;
  entry: number | null;
  stop: number | null;
  target: number | null;
  positionSize: number | null;
  exit: number | null;
  resultR: number | null;
  pnl: number | null;
  reasonEntry: string;
  reasonExit: string;
  emotionBefore: string;
  emotionAfter: string;
  mistake: string;
  lessonLearned: string;
  createdAt: string;
}

export interface TradingPlan {
  markets: string[];
  tradingHours: string;
  setups: string[];
  riskPerTrade: string;
  maxDailyLoss: string;
  maxWeeklyLoss: string;
  entryRules: string;
  exitRules: string;
  emotionalRules: string;
  createdAt: string;
  updatedAt: string;
}

export interface BacktestEntry {
  id: string;
  setup: string;
  result: "win" | "loss" | "be";
  rMultiple: number;
  note: string;
  createdAt: string;
}

export interface PaperDay {
  date: string;
  followedPlan: boolean;
  note: string;
}

export interface FinalProjectState {
  checklist: Record<string, boolean>;
  recurringMistakes: string[];
  improvementPlan: string;
}

export interface ProgressState {
  version: number;
  onboarding: OnboardingAnswers | null;
  completedLessons: string[];
  // exerciseId -> answer (string for input/reflection/choice; string[] for checklist)
  miniExercises: Record<string, string | string[]>;
  quizResults: Record<string, QuizResult>;
  journal: Trade[];
  plan: TradingPlan | null;
  backtests: BacktestEntry[];
  paperDays: PaperDay[];
  calcUsage: number;
  finalProject: FinalProjectState;
  lastVisited: { moduleId: string; lessonId: string } | null;
  theme: "light" | "dark";
  streak: { count: number; lastDate: string } | null;
  // free-form tool state (checklists, trackers)
  toolState: Record<string, unknown>;
}

export const STORAGE_KEY = "dtc_progress_v1";

export function createInitialState(): ProgressState {
  return {
    version: 1,
    onboarding: null,
    completedLessons: [],
    miniExercises: {},
    quizResults: {},
    journal: [],
    plan: null,
    backtests: [],
    paperDays: [],
    calcUsage: 0,
    finalProject: {
      checklist: {},
      recurringMistakes: ["", "", "", "", ""],
      improvementPlan: "",
    },
    lastVisited: null,
    theme: "light",
    streak: null,
    toolState: {},
  };
}
