"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { courseFullyComplete } from "@/lib/final-project";
import { getOverallProgress } from "@/lib/selectors";
import { WarningBox } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function CertificatePage() {
  const { state } = useProgress();
  const complete = courseFullyComplete(state) && state.quizResults["m10q"]?.passed;
  const overall = getOverallProgress(state);
  const dateStr = new Date().toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!complete) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-extrabold">תעודת סיום 🎓</h1>
        <WarningBox title="התעודה עדיין נעולה" tone="info">
          עוד לא השלמת את כל דרישות הקורס. כדי לפתוח את התעודה צריך: להשלים את כל
          המודולים, למלא את צ׳קליסט פרויקט הגמר, לתעד לפחות 20 עסקאות ביומן, ולעבור
          את מבחן הגמר.
        </WarningBox>
        <Link href="/final-project" className="btn-primary">
          חזרה לפרויקט הגמר
          <Icons.arrow className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">תעודת סיום 🎓</h1>
        <button onClick={() => window.print()} className="btn-primary">
          הדפס תעודה
        </button>
      </div>

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-white to-amber-50 p-8 text-center shadow-xl dark:from-[#14110a] dark:to-[#1c1606] sm:p-12">
        <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_10%_10%,#f59e0b,transparent_40%),radial-gradient(circle_at_90%_90%,#f59e0b,transparent_40%)]" />
        <div className="relative">
          <div className="text-6xl">🏆</div>
          <div className="mt-3 inline-block rounded-full bg-amber-400/20 px-4 py-1 text-sm font-bold text-amber-700 dark:text-amber-300">
            תעודת סיום
          </div>
          <h2 className="mt-5 text-2xl font-extrabold leading-snug sm:text-3xl">
            מסחר יומי למתחילים
            <span className="block text-lg font-bold text-amber-600">
              מ־0 לתוכנית מסחר ממושמעת
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-soft sm:text-base">
            השלמת את קורס מסחר יומי למתחילים — מ־0 לתוכנית מסחר ממושמעת. התעודה
            אינה רישיון למסחר ואינה המלצה להשקעה. היא מעידה על השלמת תהליך לימודי,
            תרגול, ניהול סיכונים ובניית תוכנית מסחר ראשונית.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border surface-2 p-3">
              <div className="text-xl font-bold">{overall.totalLessons}</div>
              <div className="text-[11px] text-muted">שיעורים</div>
            </div>
            <div className="rounded-xl border surface-2 p-3">
              <div className="text-xl font-bold">{overall.quizAverage ?? 0}%</div>
              <div className="text-[11px] text-muted">ממוצע מבחנים</div>
            </div>
            <div className="rounded-xl border surface-2 p-3">
              <div className="text-xl font-bold">{state.journal.length}</div>
              <div className="text-[11px] text-muted">עסקאות ביומן</div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
            <span>הונפק בתאריך {dateStr}</span>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Icons.check className="h-4 w-4" /> סוחר מתחיל ממושמע
          </div>
        </div>
      </div>

      <WarningBox title="לפני שאתה עובר לכסף אמיתי" tone="warning">
        תעודה זו היא סיום של שלב הלמידה — לא אישור שאתה רווחי. המשך לתרגל ב-Paper
        Trading, התחל בסיכון זעיר, הגדל סיכון רק לפי נתונים, ולעולם אל תסכן כסף
        שאתה לא יכול להרשות לעצמך להפסיד. מסחר יומי נשאר פעילות בסיכון גבוה.
      </WarningBox>
    </div>
  );
}
