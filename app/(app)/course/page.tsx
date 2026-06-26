"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { modules } from "@/lib/data/modules";
import {
  getModuleProgress,
  isModuleUnlocked,
  getOverallProgress,
} from "@/lib/selectors";
import { getLessonsForModule } from "@/lib/data/lessons";
import { ProgressBar, Badge, Disclaimer } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function CoursePage() {
  const { state, ready } = useProgress();
  const overall = getOverallProgress(state);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">הקורס המלא</h1>
        <p className="mt-1 text-sm text-muted">
          10 מודולים, {overall.totalLessons} שיעורים. מודול נפתח לאחר השלמת
          השיעורים והמבחן של המודול שלפניו.
        </p>
      </div>

      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">התקדמות כללית</span>
          <span className="text-muted">{ready ? overall.overallPercent : 0}%</span>
        </div>
        <ProgressBar value={ready ? overall.overallPercent : 0} />
      </div>

      <div className="space-y-4">
        {modules.map((m) => {
          const unlocked = ready ? isModuleUnlocked(state, m) : m.order === 1;
          const mp = getModuleProgress(state, m);
          const lessons = getLessonsForModule(m.id);
          const isProject = m.order === 10;

          return (
            <div
              key={m.id}
              className={`card overflow-hidden ${!unlocked ? "opacity-70" : ""}`}
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${m.accent} text-2xl text-white shadow-sm`}
                >
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted">
                      מודול {m.order}
                    </span>
                    {mp.complete && <Badge tone="success">הושלם ✓</Badge>}
                    {!unlocked && (
                      <Badge tone="neutral">
                        <Icons.lock className="h-3.5 w-3.5" /> נעול
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-0.5 text-lg font-bold">{m.title}</h2>
                  <p className="text-sm text-muted">{m.goal}</p>
                  {!isProject && (
                    <div className="mt-3">
                      <ProgressBar value={mp.percent} />
                      <p className="mt-1 text-xs text-muted">
                        {mp.completedLessons}/{mp.totalLessons} שיעורים
                        {mp.quizPassed && " · מבחן עבר ✓"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {unlocked ? (
                    <Link
                      href={isProject ? "/final-project" : `/course/${m.id}`}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {mp.complete
                        ? "חזור על המודול"
                        : mp.completedLessons > 0
                        ? "המשך"
                        : "התחל"}
                      <Icons.arrow className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button disabled className="btn-secondary w-full sm:w-auto">
                      <Icons.lock className="h-4 w-4" /> נעול
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson list */}
              {unlocked && !isProject && lessons.length > 0 && (
                <div className="border-t px-5 py-3">
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {lessons.map((l) => {
                      const done = state.completedLessons.includes(l.id);
                      return (
                        <Link
                          key={l.id}
                          href={`/course/${m.id}/${l.id}`}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                              done
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-current opacity-40"
                            }`}
                          >
                            {done ? "✓" : l.order}
                          </span>
                          <span className={done ? "text-muted line-through" : ""}>
                            {l.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  {lessons.length > 0 && (
                    <Link
                      href={`/course/${m.id}/quiz`}
                      className="mt-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                        ✦
                      </span>
                      מבחן סיכום המודול
                      {mp.quizPassed && (
                        <Badge tone="success" className="text-[10px]">
                          {mp.quizBestScore}%
                        </Badge>
                      )}
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Disclaimer compact />
    </div>
  );
}
