"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { getQuiz } from "@/lib/data/lessons";
import { getModuleProgress } from "@/lib/selectors";
import { modules } from "@/lib/data/modules";
import {
  FINAL_CHECKLIST,
  isItemDone,
  finalChecklistProgress,
  allModulesComplete,
  courseFullyComplete,
} from "@/lib/final-project";
import { QuizEngine } from "@/components/QuizEngine";
import { ProgressBar, Badge, WarningBox, InfoBox, Disclaimer } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function FinalProjectPage() {
  const { state, updateFinalProject } = useProgress();
  const quiz = getQuiz("m10q");
  const progress = finalChecklistProgress(state);
  const modulesDone = allModulesComplete(state);
  const complete = courseFullyComplete(state);
  const quizResult = state.quizResults["m10q"];

  function toggleManual(id: string) {
    updateFinalProject({
      checklist: {
        ...state.finalProject.checklist,
        [id]: !state.finalProject.checklist[id],
      },
    });
  }

  function setMistake(i: number, val: string) {
    const next = [...state.finalProject.recurringMistakes];
    next[i] = val;
    updateFinalProject({ recurringMistakes: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">פרויקט גמר — תיק סוחר מתחיל 🏆</h1>
        <p className="mt-1 text-sm text-muted">
          זה המבחן האמיתי: להרכיב את כל מה שלמדת לתיק אחד שלם ומוכן. השלם את
          הצ׳קליסט, נתח את הטעויות שלך, ועבור את מבחן הגמר.
        </p>
      </div>

      {/* Overall final progress */}
      <div className="card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">השלמת הפרויקט</span>
          <span className="text-muted">
            {progress.done}/{progress.total} פריטים
          </span>
        </div>
        <ProgressBar value={(progress.done / progress.total) * 100} />
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone={modulesDone ? "success" : "neutral"}>
            {modulesDone ? "✓" : "○"} כל המודולים הושלמו
          </Badge>
          <Badge tone={progress.allDone ? "success" : "neutral"}>
            {progress.allDone ? "✓" : "○"} צ׳קליסט מלא
          </Badge>
          <Badge tone={state.journal.length >= 20 ? "success" : "neutral"}>
            {state.journal.length >= 20 ? "✓" : "○"} 20 עסקאות ({state.journal.length}/20)
          </Badge>
          <Badge tone={quizResult?.passed ? "success" : "neutral"}>
            {quizResult?.passed ? "✓" : "○"} מבחן הגמר
          </Badge>
        </div>
      </div>

      {!modulesDone && (
        <WarningBox title="עוד לא סיימת את כל המודולים" tone="info">
          כדי לקבל את התעודה צריך להשלים את כל 9 המודולים הראשונים (שיעורים +
          מבחנים). אפשר כבר לעבוד על הפרויקט במקביל.
        </WarningBox>
      )}

      {/* Checklist */}
      <section>
        <h2 className="mb-3 text-lg font-bold">צ׳קליסט תיק הסוחר</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {FINAL_CHECKLIST.map((item) => {
            const done = isItemDone(state, item);
            const isAuto = item.auto && item.auto(state);
            return (
              <button
                key={item.id}
                onClick={() => !isAuto && toggleManual(item.id)}
                className={`flex items-start gap-3 rounded-xl border p-3 text-right text-sm transition ${
                  done
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : "surface-2 hover:border-brand-300"
                } ${isAuto ? "cursor-default" : ""}`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-current opacity-40"
                  }`}
                >
                  {done && <Icons.check className="h-3.5 w-3.5" />}
                </span>
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="block text-xs text-muted">{item.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          חלק מהפריטים מסומנים אוטומטית לפי תוכנית המסחר והיומן שלך. אפשר לסמן
          ידנית פריטים שאין להם מקור אוטומטי.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/plan" className="btn-secondary text-sm">פתח תוכנית מסחר</Link>
          <Link href="/journal" className="btn-secondary text-sm">פתח יומן מסחר</Link>
        </div>
      </section>

      {/* Recurring mistakes */}
      <section className="card p-5">
        <h2 className="text-lg font-bold">ניתוח 5 טעויות חוזרות</h2>
        <p className="mt-1 text-sm text-muted">
          עבור על היומן שלך וזהה את הטעויות שחוזרות. ההכרה בהן היא חצי מהתיקון.
        </p>
        <div className="mt-3 space-y-2">
          {state.finalProject.recurringMistakes.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                {i + 1}
              </span>
              <input
                value={m}
                onChange={(e) => setMistake(i, e.target.value)}
                placeholder={`טעות חוזרת מספר ${i + 1}`}
                className="input"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Improvement plan */}
      <section className="card p-5">
        <h2 className="text-lg font-bold">תוכנית שיפור לחודש הבא</h2>
        <p className="mt-1 text-sm text-muted">
          על סמך הטעויות — מה תעשה אחרת? היה ספציפי וניתן למדידה.
        </p>
        <textarea
          value={state.finalProject.improvementPlan}
          onChange={(e) => updateFinalProject({ improvementPlan: e.target.value })}
          rows={5}
          placeholder="לדוגמה: 1) לא אכנס לעסקה בלי שכל 4 הרכיבים ידועים. 2) אחרי 2 הפסדים ברצף — הפסקה של 15 דקות. 3) אסחור רק את 2 ה-Setups שבחרתי..."
          className="input mt-2 resize-y"
        />
      </section>

      {/* Final quiz */}
      <section>
        <h2 className="mb-3 text-lg font-bold">מבחן הגמר</h2>
        {quiz && (
          <QuizEngine
            questions={quiz.questions}
            quizId={quiz.id}
            title={quiz.title}
            passingScore={quiz.passingScore}
          />
        )}
      </section>

      {/* Module overview */}
      <section className="card p-5">
        <h2 className="text-lg font-bold">סטטוס המודולים</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {modules.slice(0, 9).map((m) => {
            const mp = getModuleProgress(state, m);
            return (
              <div key={m.id} className="flex items-center justify-between rounded-lg border surface-2 px-3 py-2 text-sm">
                <span>{m.order}. {m.title}</span>
                {mp.complete ? (
                  <Badge tone="success">✓</Badge>
                ) : (
                  <Link href={`/course/${m.id}`} className="text-xs text-brand-600 hover:underline">
                    להשלמה
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate gate */}
      {complete && quizResult?.passed ? (
        <div className="card bg-gradient-to-br from-amber-400 to-yellow-500 p-6 text-center text-amber-950">
          <div className="text-5xl">🎓</div>
          <h2 className="mt-2 text-xl font-extrabold">השלמת את הקורס!</h2>
          <p className="mt-1 text-sm">
            עברת את כל המודולים, השלמת את הפרויקט, תיעדת 20+ עסקאות ועברת את מבחן
            הגמר.
          </p>
          <Link href="/certificate" className="btn mt-4 bg-amber-950 text-white hover:bg-amber-900">
            צפה בתעודת הסיום
            <Icons.arrow className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <InfoBox title="כדי לקבל תעודת סיום" emoji="🎓" tone="objective">
          השלם את כל 9 המודולים, מלא את כל הצ׳קליסט, תעד לפחות 20 עסקאות ביומן,
          ועבור את מבחן הגמר (70%+). חסר לך: {[
            !modulesDone && "השלמת מודולים",
            !progress.allDone && "צ׳קליסט מלא",
            state.journal.length < 20 && `${20 - state.journal.length} עסקאות`,
            !quizResult?.passed && "מבחן גמר",
          ].filter(Boolean).join(" · ") || "—"}.
        </InfoBox>
      )}

      <Disclaimer compact />
    </div>
  );
}
