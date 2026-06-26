"use client";

import { useState } from "react";
import type { ScenarioCard } from "@/lib/types";
import { Icons } from "@/components/icons";

export function ScenarioDeck({
  scenarios,
  title = "תרחישי החלטה",
}: {
  scenarios: ScenarioCard[];
  title?: string;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const sc = scenarios[i];

  if (!sc) return null;

  function next() {
    setPicked(null);
    setI((prev) => (prev + 1) % scenarios.length);
  }

  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold">🎬 {title}</h3>
        <span className="text-xs text-muted">
          {i + 1} / {scenarios.length}
        </span>
      </div>

      <h4 className="text-sm font-bold text-brand-700 dark:text-brand-300">
        {sc.title}
      </h4>
      <p className="mt-1 text-sm leading-relaxed text-soft">{sc.situation}</p>
      <p className="mt-3 text-sm font-semibold">{sc.question}</p>

      <div className="mt-3 space-y-2">
        {sc.options.map((opt, idx) => {
          const isPicked = picked === idx;
          const reveal = picked !== null;
          return (
            <button
              key={idx}
              onClick={() => picked === null && setPicked(idx)}
              disabled={reveal}
              className={`w-full rounded-xl border p-3 text-right text-sm transition ${
                reveal && opt.correct
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                  : isPicked
                  ? "border-rose-400 bg-rose-50 dark:bg-rose-500/10"
                  : "surface-2 hover:border-brand-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {reveal &&
                  (opt.correct ? (
                    <Icons.check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : isPicked ? (
                    <Icons.close className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  ) : (
                    <span className="mt-0.5 h-4 w-4 shrink-0" />
                  ))}
                <div>
                  <div className="font-medium">{opt.text}</div>
                  {reveal && (
                    <div className="mt-1 text-xs text-muted">{opt.feedback}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-3 flex justify-end">
          <button onClick={next} className="btn-primary text-sm">
            התרחיש הבא <Icons.arrow className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
