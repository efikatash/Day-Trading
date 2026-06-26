"use client";

import { useProgress } from "@/lib/progress";
import { InfoBox, ProgressBar } from "@/components/ui";
import { Icons } from "@/components/icons";

const ITEMS = [
  "השלמתי לפחות 30 ימי Paper Trading מתועדים.",
  "ל-Setups שלי יש Expectancy חיובי על מדגם של 20+ עסקאות.",
  "יש לי תוכנית מסחר כתובה שאני מציית לה.",
  "אני מתעד כל עסקה ביומן — כולל רגש וטעות.",
  "הגדרתי סיכון זעיר לעסקה (סכום שלא יכאב להפסיד).",
  "הגדרתי הפסד יומי ושבועי מרבי ואני עומד בהם.",
  "אני לא משתמש במינוף.",
  "אני יודע מתי להקטין סיכון ומתי להפסיק לסחור.",
];

export function ReadinessChecklist() {
  const { getToolState, setToolState } = useProgress();
  const checks = getToolState<boolean[]>("readiness", Array(ITEMS.length).fill(false));
  const done = checks.filter(Boolean).length;
  const ready = done === ITEMS.length;

  function toggle(i: number) {
    const next = [...checks];
    next[i] = !next[i];
    setToolState("readiness", next);
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold">✅ צ׳קליסט מוכנות לכסף אמיתי</h3>
      <p className="mt-1 text-sm text-muted">
        עבור על הרשימה בכנות מוחלטת. רק כשכל הסעיפים מסומנים — שקול מעבר לסיכון
        אמיתי זעיר.
      </p>

      <div className="mt-3">
        <ProgressBar value={(done / ITEMS.length) * 100} />
      </div>

      <div className="mt-4 space-y-2">
        {ITEMS.map((item, i) => {
          const c = checks[i];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-right text-sm transition ${
                c ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "surface-2 hover:border-brand-300"
              }`}
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${c ? "border-emerald-500 bg-emerald-500 text-white" : "border-current opacity-40"}`}>
                {c && <Icons.check className="h-3.5 w-3.5" />}
              </span>
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <InfoBox
          title={ready ? "אתה עומד בתנאי המוכנות" : "עדיין לא מוכן — וזה בסדר"}
          emoji={ready ? "🟢" : "🟡"}
          tone={ready ? "example" : "objective"}
        >
          {ready
            ? "סימנת את כל הסעיפים. גם עכשיו — התחל בסיכון הכי קטן שאפשר, והגדל רק לפי נתונים. הזמן לא בורח."
            : `סימנת ${done}/${ITEMS.length}. אין שום לחץ לעבור לכסף אמיתי. הסעיפים שחסרים הם בדיוק מה שמגן עליך מהפסדים מיותרים.`}
        </InfoBox>
      </div>
    </div>
  );
}
