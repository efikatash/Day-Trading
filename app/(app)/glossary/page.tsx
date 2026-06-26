"use client";

import { useMemo, useState } from "react";
import { glossary } from "@/lib/data/glossary";
import type { GlossaryTerm } from "@/lib/types";
import { Badge, EmptyState } from "@/components/ui";

const CATEGORIES: GlossaryTerm["category"][] = ["בסיס", "סיכון", "פסיכולוגיה", "טכני", "פקודות"];

const CAT_TONE: Record<string, "brand" | "danger" | "warning" | "info" | "neutral"> = {
  בסיס: "brand",
  סיכון: "danger",
  פסיכולוגיה: "warning",
  טכני: "info",
  פקודות: "neutral",
};

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary
      .filter((t) => (cat === "all" ? true : t.category === cat))
      .filter(
        (t) =>
          q === "" ||
          t.term.toLowerCase().includes(q) ||
          t.hebrew.includes(query) ||
          t.definition.includes(query)
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query, cat]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">מילון מונחים 📖</h1>
        <p className="mt-1 text-sm text-muted">
          {glossary.length} מונחים חיוניים למסחר יומי, בעברית פשוטה.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="חפש מונח..."
        className="input"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={`btn text-xs ${cat === "all" ? "btn-primary" : "btn-secondary"}`}
        >
          הכל
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`btn text-xs ${cat === c ? "btn-primary" : "btn-secondary"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="לא נמצאו מונחים" description="נסה חיפוש אחר." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((t) => (
            <div key={t.term} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold">
                  {t.term}
                  {t.hebrew && t.hebrew !== t.term && (
                    <span className="mr-2 text-sm font-normal text-muted">
                      · {t.hebrew}
                    </span>
                  )}
                </h3>
                <Badge tone={CAT_TONE[t.category] ?? "neutral"}>{t.category}</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-soft">
                {t.definition}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
