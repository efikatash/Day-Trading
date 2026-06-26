"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useProgress } from "@/lib/progress";
import { getModule, getModuleByOrder } from "@/lib/data/modules";
import { getQuiz } from "@/lib/data/lessons";
import { getModuleProgress } from "@/lib/selectors";
import { QuizEngine } from "@/components/QuizEngine";
import { Badge, WarningBox } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function QuizClient({
  params,
}: {
  params: { moduleId: string };
}) {
  const { moduleId } = params;
  const { state } = useProgress();
  const mod = getModule(moduleId);
  if (!mod) notFound();
  const quiz = getQuiz(mod.quizId);
  if (!quiz) notFound();

  const mp = getModuleProgress(state, mod);
  const result = state.quizResults[mod.quizId];
  const nextModule = getModuleByOrder(mod.order + 1);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/course" className="hover:underline">
          הקורס
        </Link>
        <span>/</span>
        <Link href={`/course/${moduleId}`} className="hover:underline">
          {mod.title}
        </Link>
        <span>/</span>
        <span>מבחן</span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">מודול {mod.order}</Badge>
          {mp.quizPassed && (
            <Badge tone="success">עברת — הציון הטוב ביותר {mp.quizBestScore}%</Badge>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold">{quiz.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {quiz.questions.length} שאלות · נדרש {quiz.passingScore}% כדי לעבור · ניתן
          לנסות שוב
        </p>
      </div>

      {!mp.lessonsDone && (
        <WarningBox title="עוד לא סיימת את כל השיעורים" tone="info">
          מומלץ להשלים את כל שיעורי המודול לפני המבחן כדי שתצליח. אפשר בכל זאת
          לתרגל את המבחן עכשיו.
        </WarningBox>
      )}

      <QuizEngine
        questions={quiz.questions}
        quizId={quiz.id}
        title={quiz.title}
        passingScore={quiz.passingScore}
      />

      {/* After-pass navigation appears if already passed */}
      {result?.passed && (
        <div className="card flex flex-col items-center gap-3 p-5 text-center">
          <div className="text-3xl">✅</div>
          <p className="text-sm font-semibold">
            עברת את המבחן הזה. המודול הושלם!
          </p>
          {nextModule ? (
            <Link
              href={
                nextModule.order === 10
                  ? "/final-project"
                  : `/course/${nextModule.id}`
              }
              className="btn-primary"
            >
              המשך למודול {nextModule.order}: {nextModule.title}
              <Icons.arrow className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/final-project" className="btn-primary">
              המשך לפרויקט הגמר
              <Icons.arrow className="h-4 w-4" />
            </Link>
          )}
          <Link href="/course" className="btn-ghost text-sm">
            חזרה למפת הקורס
          </Link>
        </div>
      )}
    </div>
  );
}
