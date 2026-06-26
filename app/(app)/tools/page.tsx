"use client";

import { useState } from "react";
import {
  PositionSizeCalculator,
  RiskRewardCalculator,
  DailyLossCalculator,
} from "@/components/Calculators";
import { Disclaimer } from "@/components/ui";

const TABS = [
  { id: "position", label: "גודל פוזיציה", emoji: "📦" },
  { id: "rr", label: "סיכון/סיכוי", emoji: "⚖️" },
  { id: "daily", label: "הפסד יומי", emoji: "🛑" },
] as const;

export default function ToolsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("position");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">המחשבון של הסוחר 🧮</h1>
        <p className="mt-1 text-sm text-muted">
          הכלים שהופכים החלטות מסחר ממ"רגש" ל"מספרים". חשב לפני שאתה נכנס, לא
          אחרי.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn text-sm ${
              tab === t.id ? "btn-primary" : "btn-secondary"
            }`}
          >
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === "position" && <PositionSizeCalculator />}
        {tab === "rr" && <RiskRewardCalculator />}
        {tab === "daily" && <DailyLossCalculator />}
      </div>

      <Disclaimer compact />
    </div>
  );
}
