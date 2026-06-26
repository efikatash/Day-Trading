"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useProgress } from "@/lib/progress";
import { getModule } from "@/lib/data/modules";
import { getLesson, getLessonsForModule } from "@/lib/data/lessons";
import { InfoBox, WarningBox, Badge } from "@/components/ui";
import { Icons } from "@/components/icons";
import { MiniExerciseWidget } from "@/components/MiniExercise";
import { QuizEngine } from "@/components/QuizEngine";
import { LessonInteractive } from "@/components/interactive/registry";

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const router = useRouter();
  const { moduleId, lessonId } = params;
  const { state, completeLesson, isLessonComplete, setLastVisited } =
    useProgress();

  const mod = getModule(moduleId);
  const lesson = getLesson(lessonId);

  useEffect(() => {
    if (mod && lesson) setLastVisited(moduleId, lessonId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, lessonId]);

  if (!mod || !lesson || lesson.moduleId !== moduleId) {
    notFound();
  }

  const lessons = getLessonsForModule(moduleId);
  const index = lessons.findIndex((l) => l.id === lessonId);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const done = isLessonComplete(lessonId);

  const nextHref = next
    ? `/course/${moduleId}/${next.id}`
    : `/course/${moduleId}/quiz`;
  const nextLabel = next ? "השיעור הבא" : "למבחן המודול";

  function handleComplete() {
    completeLesson(lessonId);
    router.push(nextHref);
  }

  return (
    <div className="pb-24">
      {/* breadcrumb + lesson strip */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/course" className="hover:underline">
            הקורס
          </Link>
          <span>/</span>
          <Link href={`/course/${moduleId}`} className="hover:underline">
            {mod.title}
          </Link>
        </div>
      </div>

      {/* Lesson nav pills */}
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
        {lessons.map((l) => {
          const lDone = state.completedLessons.includes(l.id);
          const active = l.id === lessonId;
          return (
            <Link
              key={l.id}
              href={`/course/${moduleId}/${l.id}`}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : lDone
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                  : "surface-2"
              }`}
              title={l.title}
            >
              {lDone && !active ? "✓" : l.order}
            </Link>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">
              מודול {mod.order} · שיעור {lesson.order}
            </Badge>
            {done && <Badge tone="success">הושלם ✓</Badge>}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Objective */}
      <div className="mt-4">
        <InfoBox title="מטרת השיעור" emoji="🎯" tone="objective">
          {lesson.objective}
        </InfoBox>
      </div>

      {/* Explanation */}
      <article className="mt-6 space-y-4 text-[15px] leading-8 text-soft">
        {lesson.explanation.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {/* Example */}
      <div className="mt-6">
        <InfoBox title="דוגמה מעשית" emoji="🔍" tone="example">
          {lesson.example}
        </InfoBox>
      </div>

      {/* Interactive widget (if any) */}
      <div className="mt-6">
        <LessonInteractive lessonId={lessonId} />
      </div>

      {/* Common mistake */}
      <div className="mt-6">
        <InfoBox title="טעות נפוצה של מתחילים" emoji="⚠️" tone="mistake">
          {lesson.commonMistake}
        </InfoBox>
      </div>

      {/* Key rule */}
      <div className="mt-4">
        <InfoBox title="חוק מפתח" emoji="📌" tone="rule">
          <span className="font-semibold">{lesson.keyRule}</span>
        </InfoBox>
      </div>

      {/* Mini exercise */}
      <div className="mt-6">
        <MiniExerciseWidget exercise={lesson.miniExercise} />
      </div>

      {/* Summary */}
      <div className="mt-6 card p-5">
        <h3 className="flex items-center gap-2 font-bold">
          <span>📝</span> סיכום השיעור
        </h3>
        <ul className="mt-3 space-y-2">
          {lesson.summary.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icons.check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-soft">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Understanding check */}
      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 font-bold">
          <span>🧠</span> בדיקת הבנה
        </h3>
        <div className="card p-5">
          <QuizEngine
            questions={lesson.understandingCheck}
            title=""
            compact
          />
        </div>
      </div>

      {/* Complete / next */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {prev ? (
          <Link
            href={`/course/${moduleId}/${prev.id}`}
            className="btn-secondary"
          >
            <Icons.arrowRight className="h-4 w-4" /> השיעור הקודם
          </Link>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          {!done && (
            <button onClick={() => completeLesson(lessonId)} className="btn-secondary">
              <Icons.check className="h-4 w-4" /> סמן כשיעור הושלם
            </button>
          )}
        </div>
      </div>

      {/* Sticky next CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t p-3 surface lg:mr-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-1">
          <div className="hidden text-sm sm:block">
            <span className="text-muted">{done ? "השיעור הושלם — " : "מוכן להמשיך? "}</span>
            <span className="font-semibold">
              {next ? next.title : "מבחן סיכום המודול"}
            </span>
          </div>
          <button onClick={handleComplete} className="btn-primary w-full sm:w-auto">
            {done ? nextLabel : "סמן כהושלם והמשך"}
            <Icons.arrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
