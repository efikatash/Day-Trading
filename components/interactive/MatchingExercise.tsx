"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";

interface Pair {
  term: string;
  def: string;
}

const PAIRS: Pair[] = [
  { term: "Bid", def: "המחיר הגבוה ביותר שקונה מוכן לשלם כרגע" },
  { term: "Ask", def: "המחיר הנמוך ביותר שמוכר מוכן לקבל כרגע" },
  { term: "Spread", def: "הפער בין ה-Ask ל-Bid — עלות מובנית של העסקה" },
  { term: "Volume", def: "כמות היחידות שנסחרו בפרק זמן" },
  { term: "Liquidity", def: "הקלות לקנות ולמכור בלי להזיז את המחיר" },
  { term: "Volatility", def: "מידת התנודתיות של המחיר — הזדמנות וגם סיכון" },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchingExercise() {
  const [defsOrder] = useState(() => shuffle(PAIRS, 7));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const allMatched = Object.keys(matches).length === PAIRS.length;
  const correctCount = Object.entries(matches).filter(
    ([term, def]) => PAIRS.find((p) => p.term === term)?.def === def
  ).length;

  function pickDef(def: string) {
    if (!selectedTerm) return;
    setMatches((prev) => ({ ...prev, [selectedTerm]: def }));
    setSelectedTerm(null);
  }

  function reset() {
    setMatches({});
    setSelectedTerm(null);
  }

  const usedDefs = new Set(Object.values(matches));

  return (
    <div className="card p-5">
      <h3 className="font-bold">🔗 תרגיל התאמה</h3>
      <p className="mt-1 text-sm text-muted">
        בחר מונח, ואז את ההגדרה המתאימה לו.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Terms */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted">מונחים</div>
          {PAIRS.map((p) => {
            const matched = matches[p.term];
            const isCorrect = matched === p.def;
            return (
              <button
                key={p.term}
                onClick={() => !matched && setSelectedTerm(p.term)}
                disabled={!!matched}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-right text-sm font-medium transition ${
                  matched
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-rose-400 bg-rose-50 dark:bg-rose-500/10"
                    : selectedTerm === p.term
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "surface-2 hover:border-brand-300"
                }`}
              >
                <span>{p.term}</span>
                {matched &&
                  (isCorrect ? (
                    <Icons.check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Icons.close className="h-4 w-4 text-rose-600" />
                  ))}
              </button>
            );
          })}
        </div>

        {/* Defs */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted">הגדרות</div>
          {defsOrder.map((p) => {
            const used = usedDefs.has(p.def);
            return (
              <button
                key={p.def}
                onClick={() => !used && pickDef(p.def)}
                disabled={used || !selectedTerm}
                className={`w-full rounded-xl border p-3 text-right text-xs leading-relaxed transition ${
                  used
                    ? "opacity-40"
                    : selectedTerm
                    ? "surface-2 hover:border-brand-400"
                    : "surface-2"
                }`}
              >
                {p.def}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={reset} className="btn-ghost text-sm">
          אפס
        </button>
        {allMatched && (
          <span className="text-sm font-semibold">
            התאמת נכון {correctCount}/{PAIRS.length} 🎯
          </span>
        )}
      </div>
    </div>
  );
}
