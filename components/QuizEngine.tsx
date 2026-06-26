"use client";

import React, { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { useProgress } from "@/lib/progress";
import { Badge } from "@/components/ui";
import { Icons } from "@/components/icons";

interface QuizEngineProps {
  questions: QuizQuestion[];
  quizId?: string;
  title?: string;
  passingScore?: number;
  /** Compact mode for lesson understanding-checks. */
  compact?: boolean;
  onPassed?: () => void;
}

type AnswerValue = number | boolean | string | null;

function isCorrect(q: QuizQuestion, a: AnswerValue): boolean {
  if (a === null || a === "") return false;
  if (q.type === "mc") return a === q.correctIndex;
  if (q.type === "tf") return a === q.correctBool;
  if (q.type === "calc") {
    const num = typeof a === "string" ? parseFloat(a) : (a as number);
    if (Number.isNaN(num)) return false;
    const tol = q.tolerance ?? 0.01;
    return Math.abs(num - (q.answer ?? 0)) <= tol;
  }
  return false;
}

export function QuizEngine({
  questions,
  quizId,
  title,
  passingScore = 70,
  compact = false,
  onPassed,
}: QuizEngineProps) {
  const { saveQuizResult } = useProgress();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>(
    () => questions.map(() => null)
  );
  const [checked, setChecked] = useState<boolean[]>(
    () => questions.map(() => false)
  );
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const q = questions[index];
  const total = questions.length;

  const correctCount = useMemo(
    () => questions.reduce((s, qq, i) => s + (isCorrect(qq, answers[i]) ? 1 : 0), 0),
    [questions, answers]
  );
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = score >= passingScore;

  function setAnswer(v: AnswerValue) {
    if (checked[index]) return;
    setAnswers((prev) => prev.map((x, i) => (i === index ? v : x)));
  }

  function checkAnswer() {
    if (answers[index] === null || answers[index] === "") return;
    setChecked((prev) => prev.map((x, i) => (i === index ? true : x)));
  }

  function next() {
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      if (quizId) {
        saveQuizResult({
          quizId,
          score,
          total,
          correct: correctCount,
          passed,
          lastTakenAt: new Date().toISOString(),
        });
      }
      if (passed) onPassed?.();
    }
  }

  function retry() {
    setAnswers(questions.map(() => null));
    setChecked(questions.map(() => false));
    setIndex(0);
    setFinished(false);
    setAttempt((a) => a + 1);
  }

  if (finished) {
    return (
      <div className="card animate-fade-in p-6 text-center">
        <div className="mb-2 text-5xl" aria-hidden>
          {passed ? "🎉" : "💪"}
        </div>
        <h3 className="text-xl font-bold">
          {passed ? "עברת את המבחן!" : "כמעט שם"}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {passed
            ? "כל הכבוד — שלטת בחומר ברמה מספקת."
            : `צריך לפחות ${passingScore}% כדי לעבור. כדאי לחזור על השיעורים ולנסות שוב.`}
        </p>
        <div className="mx-auto my-5 flex max-w-xs items-center justify-around">
          <div>
            <div className="text-3xl font-extrabold">{score}%</div>
            <div className="text-xs text-muted">ציון</div>
          </div>
          <div className="h-10 w-px bg-current opacity-10" />
          <div>
            <div className="text-3xl font-extrabold">
              {correctCount}/{total}
            </div>
            <div className="text-xs text-muted">תשובות נכונות</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={retry} className="btn-secondary">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  const answered = answers[index] !== null && answers[index] !== "";
  const isChecked = checked[index];
  const thisCorrect = isCorrect(q, answers[index]);

  return (
    <div className={compact ? "" : "card p-5 sm:p-6"}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-base font-bold">{title}</h3>}
          <p className="text-xs text-muted">
            שאלה {index + 1} מתוך {total}
          </p>
        </div>
        <Badge tone="brand">{q.type === "calc" ? "חישוב" : q.type === "tf" ? "נכון/לא נכון" : "בחירה"}</Badge>
      </div>

      {/* progress dots */}
      <div className="mb-5 flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < index || (i === index && isChecked)
                ? checked[i] && isCorrect(questions[i], answers[i])
                  ? "bg-emerald-500"
                  : checked[i]
                  ? "bg-rose-400"
                  : "bg-brand-600"
                : i === index
                ? "bg-brand-300"
                : "track"
            }`}
          />
        ))}
      </div>

      <p className="mb-4 text-base font-semibold leading-relaxed">{q.question}</p>

      {/* MC */}
      {q.type === "mc" && q.options && (
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const selected = answers[index] === i;
            const showCorrect = isChecked && i === q.correctIndex;
            const showWrong = isChecked && selected && i !== q.correctIndex;
            return (
              <button
                key={i}
                onClick={() => setAnswer(i)}
                disabled={isChecked}
                className={`flex items-center gap-3 rounded-xl border p-3 text-right text-sm transition no-tap-highlight ${
                  showCorrect
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : showWrong
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-500/10"
                    : selected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "surface-2 hover:border-brand-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : showWrong
                      ? "border-rose-500 bg-rose-500 text-white"
                      : selected
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-current opacity-50"
                  }`}
                >
                  {String.fromCharCode(1488 + i)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TF */}
      {q.type === "tf" && (
        <div className="flex gap-3">
          {[
            { label: "נכון", val: true },
            { label: "לא נכון", val: false },
          ].map(({ label, val }) => {
            const selected = answers[index] === val;
            const showCorrect = isChecked && val === q.correctBool;
            const showWrong = isChecked && selected && val !== q.correctBool;
            return (
              <button
                key={label}
                onClick={() => setAnswer(val)}
                disabled={isChecked}
                className={`flex-1 rounded-xl border p-4 text-sm font-semibold transition no-tap-highlight ${
                  showCorrect
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : showWrong
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-500/10"
                    : selected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "surface-2 hover:border-brand-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* CALC */}
      {q.type === "calc" && (
        <div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={(answers[index] as string) ?? ""}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isChecked}
              placeholder="הקלד תשובה מספרית"
              className="input max-w-xs"
            />
            {q.unit && <span className="text-sm font-semibold text-muted">{q.unit}</span>}
          </div>
          {isChecked && (
            <p className="mt-2 text-sm">
              התשובה הנכונה:{" "}
              <span className="font-bold">
                {q.answer} {q.unit}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Feedback */}
      {isChecked && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed ${
            thisCorrect
              ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
          }`}
        >
          <div className="mb-1 flex items-center gap-1.5 font-bold">
            {thisCorrect ? <Icons.check className="h-4 w-4" /> : <Icons.close className="h-4 w-4" />}
            {thisCorrect ? "תשובה נכונה" : "תשובה שגויה"}
          </div>
          {q.explanation}
        </div>
      )}

      {/* Controls */}
      <div className="mt-5 flex justify-end gap-2">
        {!isChecked ? (
          <button
            onClick={checkAnswer}
            disabled={!answered}
            className="btn-primary"
          >
            בדוק תשובה
          </button>
        ) : (
          <button onClick={next} className="btn-primary">
            {index < total - 1 ? "השאלה הבאה" : "סיים מבחן"}
          </button>
        )}
      </div>
    </div>
  );
}
