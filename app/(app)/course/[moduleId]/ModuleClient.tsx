"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useProgress } from "@/lib/progress";
import { getModule } from "@/lib/data/modules";
import { getLessonsForModule } from "@/lib/data/lessons";
import {
  getModuleProgress,
  isModuleUnlocked,
} from "@/lib/selectors";
import { ProgressBar, Badge, WarningBox, InfoBox } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function ModuleClient({ moduleId }: { moduleId: string }) {
  const { state, ready } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) notFound();

  // Module 10 is the final project — send the user there.
  if (mod.order === 10) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/course" className="hover:underline">הקורס</Link>
          <span>/</span>
          <span>{mod.title}</span>
        </div>
        <InfoBox title="פרויקט הגמר" emoji="🏆" tone="objective">
          המודול הזה הוא פרויקט הגמר — מרכיבים בו את תיק הסוחר המלא.
        </InfoBox>
        <Link href="/final-project" className="btn-primary">
          פתח את פרויקט הגמר <Icons.arrow className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const lessons = getLessonsForModule(moduleId);
  const mp = getModuleProgress(state, mod);
  const unlocked = ready ? isModuleUnlocked(state, mod) : mod.order === 1;

  // First incomplete lesson → "continue", else the quiz.
  const firstIncomplete = lessons.find(
    (l) => !state.completedLessons.includes(l.id)
  );
  const ctaHref = firstIncomplete
    ? `/course/${moduleId}/${firstIncomplete.id}`
    : `/course/${moduleId}/quiz`;
  const ctaLabel = firstIncomplete
    ? mp.completedLessons > 0
      ? "המשך מהשיעור הבא"
      : "התחל מהשיעור הראשון"
    : "גש למבחן המודול";

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/course" className="hover:underline">הקורס</Link>
        <span>/</span>
        <span>{mod.title}</span>
      </div>

      {/* Header */}
      <div className="card overflow-hidden">
        <div className={`bg-gradient-to-br ${mod.accent} p-5 text-white`}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
              {mod.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-white/80">מודול {mod.order}</div>
              <h1 className="text-xl font-extrabold leading-tight">{mod.title}</h1>
              <p className="text-sm text-white/85">{mod.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-soft">{mod.goal}</p>
          <div className="mt-3">
            <ProgressBar value={mp.percent} />
            <p className="mt-1 text-xs text-muted">
              {mp.completedLessons}/{mp.totalLessons} שיעורים
              {mp.quizPassed && ` · מבחן עבר (${mp.quizBestScore}%)`}
            </p>
          </div>
        </div>
      </div>

      {!unlocked && (
        <WarningBox title="המודול עדיין נעול" tone="info">
          כדי לפתוח את המודול הזה צריך להשלים את השיעורים והמבחן של המודול שלפניו.
          אפשר בכל זאת לעיין בשיעורים.
        </WarningBox>
      )}

      {/* Lessons list */}
      <div className="space-y-2">
        {lessons.map((l) => {
          const done = state.completedLessons.includes(l.id);
          return (
            <Link
              key={l.id}
              href={`/course/${moduleId}/${l.id}`}
              className="card flex items-center gap-3 p-4 transition hover:shadow-cardhover"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-current opacity-50"
                }`}
              >
                {done ? <Icons.check className="h-4 w-4" /> : l.order}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{l.title}</div>
                <div className="truncate text-xs text-muted">{l.objective}</div>
              </div>
              <Icons.arrow className="h-5 w-5 shrink-0 text-muted" />
            </Link>
          );
        })}

        {/* Quiz row */}
        <Link
          href={`/course/${moduleId}/quiz`}
          className="card flex items-center gap-3 p-4 transition hover:shadow-cardhover"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm">
            ✦
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-bold">מבחן סיכום המודול</div>
            <div className="text-xs text-muted">
              נדרש 70% כדי לעבור ולפתוח את המודול הבא
            </div>
          </div>
          {mp.quizPassed ? (
            <Badge tone="success">{mp.quizBestScore}%</Badge>
          ) : (
            <Icons.arrow className="h-5 w-5 shrink-0 text-muted" />
          )}
        </Link>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/course" className="btn-ghost">
          <Icons.arrowRight className="h-4 w-4" /> חזרה למפת הקורס
        </Link>
        <Link href={ctaHref} className="btn-primary">
          {ctaLabel} <Icons.arrow className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
