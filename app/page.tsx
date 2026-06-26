"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { modules } from "@/lib/data/modules";
import { getOverallProgress, getNextAction } from "@/lib/selectors";
import { allLessons } from "@/lib/data/lessons";
import { Disclaimer, ProgressBar } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function LandingPage() {
  const { state, ready } = useProgress();
  const overall = getOverallProgress(state);
  const next = getNextAction(state);
  const hasProgress = ready && (state.onboarding || state.completedLessons.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_0%,white,transparent_35%)]" />
        <div className="relative mx-auto max-w-5xl px-5 py-14 text-white sm:py-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <span>🎓</span> קורס לימוד עצמי · עברית · לחינוך בלבד
          </div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            מסחר יומי למתחילים
            <span className="mt-2 block bg-gradient-to-l from-white to-brand-200 bg-clip-text text-2xl text-transparent sm:text-3xl">
              מ־0 לתוכנית מסחר ממושמעת
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-50 sm:text-lg">
            מסחר יומי הוא לא משחק ניחושים. הקורס הזה ילמד אותך להבין את השוק, לקרוא
            גרפים, לנהל סיכונים, לשלוט ברגשות, לתרגל בלי לסכן כסף, ולבנות תוכנית
            מסחר ראשונה — צעד אחר צעד, לבד, מההתחלה ועד הסוף.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={hasProgress ? "/dashboard" : "/onboarding"}
              className="btn bg-white px-6 py-3 text-brand-700 hover:bg-brand-50 shadow-lg"
            >
              התחל ללמוד
            </Link>
            {hasProgress && (
              <Link
                href={next.href}
                className="btn border border-white/40 bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20"
              >
                המשך מהנקודה האחרונה
                <Icons.arrow className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Progress preview */}
          {hasProgress && (
            <div className="mt-8 max-w-md rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">ההתקדמות שלך</span>
                <span>{overall.overallPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${overall.overallPercent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-brand-100">
                {overall.completedLessons}/{overall.totalLessons} שיעורים ·{" "}
                {overall.modulesComplete}/{overall.totalModules} מודולים הושלמו
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        {/* Value props */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              emoji: "🛡️",
              title: "ניהול סיכונים תחילה",
              text: "לפני שחושבים על רווח לומדים כמה מסכנים, איפה יוצאים, ומתי עוצרים.",
            },
            {
              emoji: "🧠",
              title: "משמעת מעל הכל",
              text: "FOMO, נקמה, חמדנות — מזהים את האויב הפנימי ובונים חוקים נגדו.",
            },
            {
              emoji: "🧪",
              title: "תרגול לפני כסף אמיתי",
              text: "Backtesting, Paper Trading ויומן מסחר — מתאמנים בלי לשרוף הון.",
            },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <div className="text-2xl">{c.emoji}</div>
              <h3 className="mt-2 font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted">{c.text}</p>
            </div>
          ))}
        </section>

        {/* Course map preview */}
        <section className="mt-12">
          <h2 className="text-xl font-bold">מפת הקורס</h2>
          <p className="mt-1 text-sm text-muted">
            10 מודולים · {allLessons.length} שיעורים · מבחנים, מחשבונים, יומן
            ותוכנית מסחר אישית
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {modules.map((m) => (
              <div key={m.id} className="card flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-2xl text-white shadow-sm`}
                >
                  {m.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted">
                      מודול {m.order}
                    </span>
                  </div>
                  <h3 className="truncate font-bold">{m.title}</h3>
                  <p className="truncate text-xs text-muted">{m.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mt-12 card p-6">
          <h2 className="text-lg font-bold">העקרונות שמלווים את כל הקורס</h2>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {[
              "התפקיד של מתחיל הוא ללמוד תהליך, משמעת וניהול סיכון — לא להרוויח מיד.",
              "עסקה תקפה רק אם ידועים מראש כניסה, Stop, יעד וגודל פוזיציה.",
              "אחוז הצלחה לבדו חסר משמעות בלי רווח ממוצע, הפסד ממוצע ויחס סיכון/סיכוי.",
              "Paper Trading הוא חובה לפני מסחר בכסף אמיתי.",
              "המצב הרגשי שלך משפיע על ההחלטות — תתעד אותו.",
              "יומן מסחר הוא לא רשות. השוק לא חייב לך כלום.",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Icons.check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-soft">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <Disclaimer />
        </section>

        <div className="mt-10 text-center">
          <Link
            href={hasProgress ? "/dashboard" : "/onboarding"}
            className="btn-primary px-8 py-3"
          >
            {hasProgress ? "המשך ללוח הבקרה" : "התחל ללמוד עכשיו"}
          </Link>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-5xl px-5">
          <Disclaimer compact />
          <p className="mt-3 text-xs text-muted">
            © מסחר יומי למתחילים — מ־0 לתוכנית מסחר ממושמעת. אפליקציה חינוכית.
          </p>
        </div>
      </footer>
    </div>
  );
}
