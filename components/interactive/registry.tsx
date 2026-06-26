"use client";

import React from "react";
import { CandleBuilder } from "./CandleBuilder";
import { SpreadSimulator } from "./SpreadSimulator";
import { MythVsReality } from "./MythVsReality";
import { MatchingExercise } from "./MatchingExercise";
import { ChartLabeling } from "./ChartLabeling";
import { DailyLossSimulator } from "./DailyLossSimulator";
import { EmotionalSelfCheck } from "./EmotionalSelfCheck";
import { ShouldITradeChecklist } from "./ShouldITradeChecklist";
import { SetupCards } from "./SetupCards";
import { ScenarioDeck } from "./ScenarioDeck";
import { Flashcards } from "./Flashcards";
import { BacktestTracker } from "./BacktestTracker";
import { PaperTracker } from "./PaperTracker";
import { ReadinessChecklist } from "./ReadinessChecklist";
import { MonthlyReview } from "./MonthlyReview";
import {
  PositionSizeCalculator,
  RiskRewardCalculator,
} from "@/components/Calculators";
import { flashcards } from "@/lib/data/flashcards";
import { scenarios } from "@/lib/data/scenarios";

// Maps a lessonId to an interactive widget rendered inside the lesson page.
const REGISTRY: Record<string, React.ReactNode> = {
  // Module 1 — myths
  m1l2: <MythVsReality />,
  // Module 2 — market basics
  m2l1: <Flashcards cards={flashcards.slice(0, 12)} title="כרטיסיות מונחי שוק" />,
  m2l3: <SpreadSimulator />,
  m2l4: <MatchingExercise />,
  // Module 3 — chart reading
  m3l1: <CandleBuilder />,
  m3l3: <CandleBuilder />,
  m3l6: <ChartLabeling />,
  // Module 4 — risk
  m4l3: <PositionSizeCalculator />,
  m4l6: <RiskRewardCalculator />,
  m4l7: <DailyLossSimulator />,
  // Module 5 — psychology
  m5l1: <EmotionalSelfCheck />,
  m5l6: <ShouldITradeChecklist />,
  // Module 6 — strategies
  m6l1: <SetupCards />,
  m6l6: <ScenarioDeck scenarios={scenarios} title="Setup אמיתי או רעש? תרחישי החלטה" />,
  // Module 8 — backtesting & paper trading
  m8l2: <BacktestTracker />,
  m8l7: <PaperTracker />,
  // Module 9 — going live carefully
  m9l1: <ReadinessChecklist />,
  m9l6: <MonthlyReview />,
};

export function LessonInteractive({ lessonId }: { lessonId: string }) {
  const widget = REGISTRY[lessonId];
  if (!widget) return null;
  return (
    <div className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        <span>🧩</span> תרגול אינטראקטיבי
      </div>
      {widget}
    </div>
  );
}
