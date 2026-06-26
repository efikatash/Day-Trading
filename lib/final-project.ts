import type { ProgressState } from "@/lib/app-types";
import { modules } from "@/lib/data/modules";
import { getModuleProgress } from "@/lib/selectors";

export interface ChecklistItem {
  id: string;
  label: string;
  hint: string;
  /** Auto-derive completion from existing data; null = manual only. */
  auto?: (s: ProgressState) => boolean;
}

export const FINAL_CHECKLIST: ChecklistItem[] = [
  {
    id: "fp-markets",
    label: "הגדרת שוק מותר למסחר",
    hint: "בתוכנית המסחר נבחר לפחות שוק אחד",
    auto: (s) => !!s.plan && s.plan.markets.length > 0,
  },
  {
    id: "fp-hours",
    label: "הגדרת שעות מסחר",
    hint: "חלון שעות מוגדר בתוכנית",
    auto: (s) => !!s.plan && s.plan.tradingHours.trim() !== "",
  },
  {
    id: "fp-setups",
    label: "בחירת 2 Setups בלבד",
    hint: "1–2 Setups מוגדרים בתוכנית",
    auto: (s) =>
      !!s.plan && s.plan.setups.length >= 1 && s.plan.setups.length <= 2,
  },
  {
    id: "fp-entry",
    label: "חוקי Entry כתובים",
    hint: "מילאת חוקי כניסה בתוכנית",
    auto: (s) => !!s.plan && s.plan.entryRules.trim().length > 10,
  },
  {
    id: "fp-stop",
    label: "חוקי Stop כתובים",
    hint: "חוקי יציאה/Stop מוגדרים בתוכנית",
    auto: (s) => !!s.plan && s.plan.exitRules.trim().length > 10,
  },
  {
    id: "fp-target",
    label: "חוקי Target כתובים",
    hint: "יעדים מוגדרים (אפשר לסמן ידנית)",
  },
  {
    id: "fp-sizing",
    label: "חוקי Position Sizing",
    hint: "סיכון לעסקה מוגדר בתוכנית",
    auto: (s) => !!s.plan && s.plan.riskPerTrade.trim() !== "",
  },
  {
    id: "fp-daily",
    label: "Max Daily Loss מוגדר",
    hint: "הפסד יומי מרבי בתוכנית",
    auto: (s) => !!s.plan && s.plan.maxDailyLoss.trim() !== "",
  },
  {
    id: "fp-weekly",
    label: "Max Weekly Loss מוגדר",
    hint: "הפסד שבועי מרבי בתוכנית",
    auto: (s) => !!s.plan && s.plan.maxWeeklyLoss.trim() !== "",
  },
  {
    id: "fp-journal",
    label: "תבנית יומן מסחר קיימת",
    hint: "השתמשת ביומן המסחר באפליקציה",
    auto: (s) => s.journal.length > 0,
  },
  {
    id: "fp-trades",
    label: "לפחות 20 עסקאות דמו מתועדות",
    hint: "20 עסקאות ביומן",
    auto: (s) => s.journal.length >= 20,
  },
  {
    id: "fp-mistakes",
    label: "ניתוח 5 טעויות חוזרות",
    hint: "מילאת 5 טעויות חוזרות בפרויקט",
    auto: (s) =>
      s.finalProject.recurringMistakes.filter((m) => m.trim() !== "").length >= 5,
  },
  {
    id: "fp-improve",
    label: "תוכנית שיפור לחודש הבא",
    hint: "כתבת תוכנית שיפור",
    auto: (s) => s.finalProject.improvementPlan.trim().length > 15,
  },
];

export function isItemDone(s: ProgressState, item: ChecklistItem): boolean {
  if (item.auto && item.auto(s)) return true;
  return !!s.finalProject.checklist[item.id];
}

export function finalChecklistProgress(s: ProgressState): {
  done: number;
  total: number;
  allDone: boolean;
} {
  const done = FINAL_CHECKLIST.filter((i) => isItemDone(s, i)).length;
  return {
    done,
    total: FINAL_CHECKLIST.length,
    allDone: done === FINAL_CHECKLIST.length,
  };
}

export function allModulesComplete(s: ProgressState): boolean {
  return modules.every((m) => getModuleProgress(s, m).complete);
}

export function courseFullyComplete(s: ProgressState): boolean {
  return (
    allModulesComplete(s) &&
    finalChecklistProgress(s).allDone &&
    s.journal.length >= 20
  );
}
