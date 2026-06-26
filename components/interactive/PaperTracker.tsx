"use client";

import { useProgress } from "@/lib/progress";
import { ProgressBar, InfoBox } from "@/components/ui";

// 30-day paper trading tracker: each day marked as "followed plan" or not.
export function PaperTracker() {
  const { getToolState, setToolState } = useProgress();
  const days = getToolState<boolean[]>("paper30", Array(30).fill(false));
  const completed = days.filter(Boolean).length;

  function toggle(i: number) {
    const next = [...days];
    next[i] = !next[i];
    setToolState("paper30", next);
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold">📅 מעקב 30 ימי Paper Trading</h3>
      <p className="mt-1 text-sm text-muted">
        סמן כל יום שבו תרגלת מסחר דמו ועקבת אחרי התוכנית. המטרה: 30 ימי תרגול
        מתועדים לפני מעבר לסיכון אמיתי זעיר.
      </p>

      <div className="mt-4">
        <ProgressBar value={(completed / 30) * 100} color="accent" />
        <p className="mt-1 text-xs text-muted">{completed}/30 ימים הושלמו</p>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition ${
              d
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "surface-2 hover:border-brand-300"
            }`}
            title={`יום ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {completed >= 30 && (
        <div className="mt-4">
          <InfoBox title="כל הכבוד — 30 ימי תרגול!" emoji="🎉" tone="example">
            השלמת 30 ימי Paper Trading. אם ה-Expectancy שלך חיובי ועקבת אחרי
            התוכנית, אתה מוכן לשקול מעבר לסיכון אמיתי זעיר — לא לפני.
          </InfoBox>
        </div>
      )}
    </div>
  );
}
