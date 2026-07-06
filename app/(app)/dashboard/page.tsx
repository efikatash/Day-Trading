"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { modules } from "@/lib/data/modules";
import {
  getOverallProgress,
  getNextAction,
  getModuleProgress,
  isModuleUnlocked,
  getJournalStats,
} from "@/lib/selectors";
import { getLesson } from "@/lib/data/lessons";
import { getPersonalGreeting, getStudyTimeLabel } from "@/lib/personalize";
import { Ring, StatCard, ProgressBar, Badge, Disclaimer } from "@/components/ui";
import { Icons } from "@/components/icons";
import { BackupPanel } from "@/components/BackupPanel";

export default function DashboardPage() {
  const { state, ready } = useProgress();
  const overall = getOverallProgress(state);
  const next = getNextAction(state);
  const journal = getJournalStats(state);
  const greeting = getPersonalGreeting(state.onboarding);

  // current module = first not-complete unlocked module
  const currentModule =
    modules.find(
      (m) => isModuleUnlocked(state, m) && !getModuleProgress(state, m).complete
    ) ?? modules[modules.length - 1];

  const lastLesson = state.lastVisited
    ? getLesson(state.lastVisited.lessonId)
    : null;

  if (!ready) {
    return <div className="h-40" />;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">{greeting.title}</h1>
        <p className="text-sm text-muted">{greeting.message}</p>
        {state.onboarding && (
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge tone="info">⏱️ {getStudyTimeLabel(state.onboarding.studyTime)}</Badge>
            {state.streak && state.streak.count > 1 && (
              <Badge tone="warning">🔥 רצף {state.streak.count} ימים</Badge>
            )}
          </div>
        )}
      </div>

      {/* Hero: progress + next action */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card flex items-center gap-5 p-6 lg:col-span-2">
          <Ring value={overall.overallPercent} size={104} label="כללי" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold">ההתקדמות שלך בקורס</h2>
            <p className="mt-0.5 text-sm text-muted">
              {overall.modulesComplete} מתוך {overall.totalModules} מודולים הושלמו
            </p>
            <ProgressBar value={overall.lessonPercent} className="mt-3" />
            <p className="mt-1.5 text-xs text-muted">
              {overall.completedLessons}/{overall.totalLessons} שיעורים הושלמו
            </p>
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
          <div>
            <p className="text-xs font-medium text-brand-100">
              הפעולה הבאה המומלצת
            </p>
            <h3 className="mt-1 text-lg font-bold">{next.label}</h3>
            <p className="mt-1 text-sm text-brand-100">{next.hint}</p>
          </div>
          <Link
            href={next.href}
            className="btn mt-4 bg-white text-brand-700 hover:bg-brand-50"
          >
            המשך עכשיו
            <Icons.arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Current module + last lesson */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-xs font-semibold text-muted">המודול הנוכחי</p>
          <div className="mt-2 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${currentModule.accent} text-xl text-white`}
            >
              {currentModule.icon}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold">{currentModule.title}</h3>
              <p className="truncate text-xs text-muted">
                {currentModule.subtitle}
              </p>
            </div>
          </div>
          <ProgressBar
            value={getModuleProgress(state, currentModule).percent}
            className="mt-3"
          />
          <Link
            href={`/course/${currentModule.id}`}
            className="btn-secondary mt-3 w-full"
          >
            פתח את המודול
          </Link>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold text-muted">השיעור האחרון שלך</p>
          {lastLesson && state.lastVisited ? (
            <>
              <h3 className="mt-2 font-bold">{lastLesson.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted">
                {lastLesson.objective}
              </p>
              <Link
                href={`/course/${state.lastVisited.moduleId}/${lastLesson.id}`}
                className="btn-primary mt-3 w-full"
              >
                המשך מהשיעור הזה
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">
                עוד לא התחלת שיעור. בוא נתחיל מהמודול הראשון.
              </p>
              <Link href="/course/m1/m1l1" className="btn-primary mt-3 w-full">
                התחל את השיעור הראשון
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="שיעורים"
          value={`${overall.completedLessons}/${overall.totalLessons}`}
          emoji="📚"
        />
        <StatCard
          label="ממוצע מבחנים"
          value={overall.quizAverage !== null ? `${overall.quizAverage}%` : "—"}
          sub={`${overall.quizCount} מבחנים`}
          emoji="✅"
        />
        <StatCard
          label="עסקאות ביומן"
          value={journal.count}
          emoji="📓"
        />
        <StatCard
          label="Win Rate"
          value={journal.winRate !== null ? `${journal.winRate}%` : "—"}
          emoji="🎯"
        />
        <StatCard
          label="שימוש במחשבון"
          value={state.calcUsage}
          emoji="🧮"
        />
        <StatCard
          label="מודולים"
          value={`${overall.modulesComplete}/${overall.totalModules}`}
          emoji="🧩"
        />
      </div>

      {/* Quick tools */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/course", label: "המשך ללמוד", emoji: "📖", desc: "כל המודולים והשיעורים" },
          { href: "/journal", label: "יומן מסחר", emoji: "📓", desc: "תיעוד וניתוח עסקאות" },
          { href: "/tools", label: "מחשבון הסוחר", emoji: "🧮", desc: "סיכון, R:R וגודל פוזיציה" },
          { href: "/plan", label: "תוכנית מסחר", emoji: "📋", desc: "בנה את התוכנית שלך" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="card p-4 transition hover:shadow-cardhover">
            <div className="text-2xl">{t.emoji}</div>
            <div className="mt-2 font-bold">{t.label}</div>
            <div className="text-xs text-muted">{t.desc}</div>
          </Link>
        ))}
      </div>

      <BackupPanel />

      <Disclaimer compact />
    </div>
  );
}
