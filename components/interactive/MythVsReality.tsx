"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";

interface Item {
  statement: string;
  isMyth: boolean;
  explanation: string;
}

const ITEMS: Item[] = [
  {
    statement: "אפשר להתעשר מהר ממסחר יומי אם רק מתאמצים מספיק.",
    isMyth: true,
    explanation:
      "מיתוס. מסחר יומי הוא מקצוע בסיכון גבוה. רוב המתחילים מפסידים. המטרה ההתחלתית היא ללמוד תהליך וניהול סיכון — לא להתעשר.",
  },
  {
    statement: "עסקה תקפה רק אם ידועים מראש כניסה, Stop, יעד וגודל פוזיציה.",
    isMyth: false,
    explanation:
      "אמת. בלי ארבעת הרכיבים האלה אתה מהמר, לא סוחר. זה הבסיס לכל עסקה ממושמעת.",
  },
  {
    statement: "אם הפסדתי, הדרך הנכונה היא להגדיל את העסקה הבאה כדי להחזיר.",
    isMyth: true,
    explanation:
      "מיתוס מסוכן (מסחר נקמה). הגדלת סיכון אחרי הפסד היא אחת הסיבות המובילות לאיבוד חשבון. החוק: אין הגדלת סיכון אחרי הפסד.",
  },
  {
    statement: "אחוז הצלחה גבוה לבדו מבטיח רווחיות.",
    isMyth: true,
    explanation:
      "מיתוס. אחוז הצלחה חסר משמעות בלי רווח ממוצע, הפסד ממוצע ויחס סיכון/סיכוי. אפשר לנצח 70% מהעסקאות ועדיין להפסיד.",
  },
  {
    statement: "Paper Trading ויומן מסחר הם שלב חובה לפני כסף אמיתי.",
    isMyth: false,
    explanation:
      "אמת. תרגול מתועד בלי סיכון הון הוא הדרך ללמוד בזול. בלי יומן אין למידה אמיתית.",
  },
  {
    statement: "מינוף גבוה הוא דרך חכמה למתחיל להאיץ רווחים.",
    isMyth: true,
    explanation:
      "מיתוס מסוכן. מינוף מגדיל גם את ההפסדים ועלול למחוק חשבון במהירות. מתחיל צריך להימנע ממינוף.",
  },
];

export function MythVsReality() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    ITEMS.map(() => null)
  );

  function answer(i: number, asMyth: boolean) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? asMyth : a)));
  }

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === ITEMS[i].isMyth).length;

  return (
    <div className="card p-5">
      <h3 className="font-bold">🎯 מיתוס מול מציאות</h3>
      <p className="mt-1 text-sm text-muted">
        לכל משפט — האם זה מיתוס או מציאות? בחר וקבל הסבר מיד.
      </p>

      <div className="mt-4 space-y-3">
        {ITEMS.map((item, i) => {
          const chosen = answers[i];
          const isAnswered = chosen !== null;
          const isCorrect = chosen === item.isMyth;
          return (
            <div key={i} className="rounded-xl border surface-2 p-3.5">
              <p className="text-sm font-medium">{item.statement}</p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => answer(i, true)}
                  disabled={isAnswered}
                  className={`btn text-xs ${
                    chosen === true
                      ? item.isMyth
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                      : "btn-secondary"
                  }`}
                >
                  מיתוס
                </button>
                <button
                  onClick={() => answer(i, false)}
                  disabled={isAnswered}
                  className={`btn text-xs ${
                    chosen === false
                      ? !item.isMyth
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                      : "btn-secondary"
                  }`}
                >
                  מציאות
                </button>
              </div>
              {isAnswered && (
                <div
                  className={`mt-2.5 flex items-start gap-1.5 rounded-lg p-2.5 text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
                      : "bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100"
                  }`}
                >
                  {isCorrect ? (
                    <Icons.check className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <Icons.close className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{item.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {answered === ITEMS.length && (
        <div className="mt-4 rounded-xl bg-brand-50 p-3 text-center text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          זיהית נכון {correct} מתוך {ITEMS.length} 🎉
        </div>
      )}
    </div>
  );
}
