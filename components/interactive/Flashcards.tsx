"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { Icons } from "@/components/icons";

export function Flashcards({
  cards,
  title = "כרטיסיות מונחים",
}: {
  cards: Flashcard[];
  title?: string;
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[i];

  function go(dir: number) {
    setFlipped(false);
    setI((prev) => (prev + dir + cards.length) % cards.length);
  }

  if (cards.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">🃏 {title}</h3>
        <span className="text-xs text-muted">
          {i + 1} / {cards.length}
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="relative flex min-h-[160px] w-full items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition surface-2 hover:border-brand-400"
      >
        <div>
          <div className="text-xs font-semibold text-muted">
            {flipped ? "הגדרה" : "מונח"} · לחץ להפיכה
          </div>
          <div className="mt-2 text-lg font-bold leading-relaxed">
            {flipped ? card.back : card.front}
          </div>
        </div>
      </button>

      <div className="mt-3 flex items-center justify-between">
        <button onClick={() => go(1)} className="btn-secondary text-sm">
          <Icons.arrowRight className="h-4 w-4" /> הקודם
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="btn-ghost text-sm"
        >
          {flipped ? "הצג מונח" : "הצג הגדרה"}
        </button>
        <button onClick={() => go(-1)} className="btn-secondary text-sm">
          הבא <Icons.arrow className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
