"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";

const ITEMS = [
  "ישנתי מספיק ואני מרוכז, לא עייף ולא לחוץ.",
  "אני לא במצב רגשי של נקמה, חרדה או התלהבות יתר.",
  "התוכנית שלי לפניי ואני יודע אילו Setups מותרים לי היום.",
  "הגדרתי מראש את הסיכון לעסקה ואת ההפסד היומי המרבי.",
  "השוק שאני סוחר בו פעיל ויש בו נזילות.",
  "אני לא מנסה 'להחזיר' הפסד מאתמול או מהבוקר.",
  "אני מוכן לא לסחור היום אם אין Setup איכותי.",
];

export function ShouldITradeChecklist({ embedded = false }: { embedded?: boolean }) {
  const [checks, setChecks] = useState<boolean[]>(ITEMS.map(() => false));
  const yes = checks.filter(Boolean).length;
  const ready = yes >= 6;
  const started = checks.some(Boolean);

  return (
    <div className={embedded ? "" : "card p-5"}>
      <h3 className="font-bold">🚦 האם לסחור היום?</h3>
      <p className="mt-1 text-sm text-muted">
        עבור על הרשימה בכנות. זו לא בחינה — זו הגנה עליך מפני יום מסחר רע.
      </p>

      <div className="mt-4 space-y-2">
        {ITEMS.map((item, i) => {
          const checked = checks[i];
          return (
            <button
              key={i}
              onClick={() =>
                setChecks((prev) =>
                  prev.map((c, idx) => (idx === i ? !c : c))
                )
              }
              className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-right text-sm transition ${
                checked
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                  : "surface-2 hover:border-brand-300"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  checked
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-current opacity-40"
                }`}
              >
                {checked && <Icons.check className="h-3.5 w-3.5" />}
              </span>
              <span>{item}</span>
            </button>
          );
        })}
      </div>

      {started && (
        <div
          className={`mt-4 rounded-xl p-3.5 text-sm font-medium ${
            ready
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
          }`}
        >
          {ready
            ? `סימנת ${yes}/${ITEMS.length}. אתה במצב סביר למסחר ממושמע — אבל רק אם יש Setup שעומד בתוכנית.`
            : `סימנת רק ${yes}/${ITEMS.length}. כשהרשימה לא מלאה — זה סימן אזהרה. שקול לוותר על מסחר היום. אין בושה ביום ללא עסקאות.`}
        </div>
      )}
    </div>
  );
}
