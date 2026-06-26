"use client";

import { useState } from "react";
import type { MiniExercise } from "@/lib/types";
import { useProgress } from "@/lib/progress";
import { Icons } from "@/components/icons";

export function MiniExerciseWidget({ exercise }: { exercise: MiniExercise }) {
  const { saveExercise, getExercise } = useProgress();
  const saved = getExercise(exercise.id);

  const [text, setText] = useState<string>(
    typeof saved === "string" ? saved : ""
  );
  const [choice, setChoice] = useState<string>(
    typeof saved === "string" ? saved : ""
  );
  const [checks, setChecks] = useState<string[]>(
    Array.isArray(saved) ? saved : []
  );
  const [savedFlash, setSavedFlash] = useState(false);

  function flash() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function saveText() {
    saveExercise(exercise.id, text);
    flash();
  }
  function pick(opt: string) {
    setChoice(opt);
    saveExercise(exercise.id, opt);
    flash();
  }
  function toggle(item: string) {
    const nextSet = checks.includes(item)
      ? checks.filter((c) => c !== item)
      : [...checks, item];
    setChecks(nextSet);
    saveExercise(exercise.id, nextSet);
  }

  return (
    <div className="rounded-2xl border border-brand-300/50 bg-brand-50/60 p-5 dark:border-brand-500/30 dark:bg-brand-500/10">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300">
        <span>✍️</span> תרגיל קצר
      </div>
      <p className="text-sm font-medium leading-relaxed">{exercise.prompt}</p>
      {exercise.helper && (
        <p className="mt-1 text-xs text-muted">{exercise.helper}</p>
      )}

      <div className="mt-4">
        {(exercise.type === "reflection" || exercise.type === "input") && (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={exercise.placeholder ?? "כתוב כאן את התשובה שלך..."}
              rows={exercise.type === "reflection" ? 4 : 2}
              className="input resize-y"
            />
            <div className="flex items-center gap-3">
              <button onClick={saveText} className="btn-primary text-xs">
                שמור תשובה
              </button>
              {savedFlash && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <Icons.check className="h-4 w-4" /> נשמר
                </span>
              )}
            </div>
          </div>
        )}

        {exercise.type === "choice" && exercise.options && (
          <div className="space-y-2">
            {exercise.options.map((opt) => {
              const selected = choice === opt;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className={`flex w-full items-center gap-2.5 rounded-xl border p-3 text-right text-sm transition ${
                    selected
                      ? "border-brand-500 bg-white dark:bg-brand-500/20"
                      : "surface-2 hover:border-brand-300"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-current opacity-40"
                    }`}
                  >
                    {selected && <Icons.check className="h-3.5 w-3.5" />}
                  </span>
                  {opt}
                </button>
              );
            })}
            {savedFlash && (
              <span className="text-xs text-emerald-600">הבחירה נשמרה ✓</span>
            )}
          </div>
        )}

        {exercise.type === "checklist" && exercise.items && (
          <div className="space-y-2">
            {exercise.items.map((item) => {
              const checked = checks.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-right text-sm transition ${
                    checked
                      ? "border-emerald-400 bg-white dark:bg-emerald-500/15"
                      : "surface-2 hover:border-brand-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-current opacity-40"
                    }`}
                  >
                    {checked && <Icons.check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={checked ? "text-muted" : ""}>{item}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
