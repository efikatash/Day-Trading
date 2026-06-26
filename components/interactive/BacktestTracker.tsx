"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import type { BacktestEntry } from "@/lib/app-types";
import { genId } from "@/lib/trade-utils";
import { Badge, EmptyState, InfoBox } from "@/components/ui";

export function BacktestTracker() {
  const { state, addBacktest, deleteBacktest } = useProgress();
  const [setup, setSetup] = useState("Trend Pullback");
  const [result, setResult] = useState<"win" | "loss" | "be">("win");
  const [r, setR] = useState("1");
  const [note, setNote] = useState("");

  const entries = state.backtests;

  function add() {
    const entry: BacktestEntry = {
      id: genId(),
      setup,
      result,
      rMultiple: parseFloat(r) || 0,
      note,
      createdAt: new Date().toISOString(),
    };
    addBacktest(entry);
    setNote("");
    setR(result === "loss" ? "-1" : "1");
  }

  // stats
  const wins = entries.filter((e) => e.result === "win");
  const losses = entries.filter((e) => e.result === "loss");
  const decided = wins.length + losses.length;
  const winRate = decided > 0 ? Math.round((wins.length / decided) * 100) : 0;
  const avgWin =
    wins.length > 0
      ? wins.reduce((s, e) => s + Math.abs(e.rMultiple), 0) / wins.length
      : 0;
  const avgLoss =
    losses.length > 0
      ? losses.reduce((s, e) => s + Math.abs(e.rMultiple), 0) / losses.length
      : 0;
  const lossRate = decided > 0 ? losses.length / decided : 0;
  const winRateFrac = decided > 0 ? wins.length / decided : 0;
  const expectancy = winRateFrac * avgWin - lossRate * avgLoss;

  return (
    <div className="card p-5">
      <h3 className="font-bold">🧪 טבלת Backtest</h3>
      <p className="mt-1 text-sm text-muted">
        רשום כל הופעה היסטורית של ה-Setup שלך. אחרי 20–30 רשומות תראה אם יש לך
        Expectancy חיובי. הכל נשמר במכשיר שלך.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div>
          <label className="label">Setup</label>
          <select value={setup} onChange={(e) => setSetup(e.target.value)} className="input">
            {["Trend Pullback", "Breakout Retest", "VWAP Bounce", "Opening Range Breakout", "אחר"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">תוצאה</label>
          <select value={result} onChange={(e) => setResult(e.target.value as "win" | "loss" | "be")} className="input">
            <option value="win">רווח</option>
            <option value="loss">הפסד</option>
            <option value="be">איזון</option>
          </select>
        </div>
        <div>
          <label className="label">תוצאה ב-R</label>
          <input type="number" step="any" value={r} onChange={(e) => setR(e.target.value)} className="input" />
        </div>
        <div className="flex items-end">
          <button onClick={add} className="btn-primary w-full">הוסף</button>
        </div>
      </div>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="הערה (אופציונלי): מה אפיין את ההזדמנות?" className="input mt-2" />

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["רשומות", String(entries.length)],
          ["Win Rate", `${winRate}%`],
          ["ממוצע רווח", `${avgWin.toFixed(2)}R`],
          ["ממוצע הפסד", `${avgLoss.toFixed(2)}R`],
          ["Expectancy", `${expectancy.toFixed(2)}R`],
        ].map(([label, val]) => (
          <div key={label} className="rounded-xl border surface-2 p-2.5 text-center">
            <div className="text-[11px] text-muted">{label}</div>
            <div className="font-bold">{val}</div>
          </div>
        ))}
      </div>

      {entries.length >= 3 && (
        <div className="mt-3">
          <InfoBox
            title={expectancy > 0 ? "Expectancy חיובי 🟢" : "Expectancy שלילי 🔴"}
            tone={expectancy > 0 ? "example" : "mistake"}
          >
            {expectancy > 0
              ? `בממוצע אתה מרוויח ${expectancy.toFixed(2)}R לכל עסקה במדגם הזה. זכור: מדגם קטן עדיין לא מספיק — שאף ל-20+ רשומות לפני מסקנות.`
              : `במדגם הזה ה-Setup מפסיד בממוצע. בדוק את חוקי הכניסה/יציאה, או שזה לא ה-Setup בשבילך. זה בדיוק מה ש-Backtesting אמור לחשוף — לפני שסיכנת כסף.`}
          </InfoBox>
        </div>
      )}

      {/* List */}
      <div className="mt-4 space-y-1.5">
        {entries.length === 0 ? (
          <EmptyState emoji="🧪" title="אין רשומות Backtest עדיין" description="הוסף את ההופעה ההיסטורית הראשונה." />
        ) : (
          entries.slice(0, 12).map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border surface-2 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge tone={e.result === "win" ? "success" : e.result === "loss" ? "danger" : "neutral"}>
                  {e.result === "win" ? "רווח" : e.result === "loss" ? "הפסד" : "איזון"}
                </Badge>
                <span>{e.setup}</span>
                <span className="text-muted">{e.rMultiple}R</span>
                {e.note && <span className="hidden text-xs text-muted sm:inline">· {e.note}</span>}
              </div>
              <button onClick={() => deleteBacktest(e.id)} className="text-xs text-rose-600">מחק</button>
            </div>
          ))
        )}
        {entries.length > 12 && (
          <p className="text-center text-xs text-muted">ועוד {entries.length - 12} רשומות...</p>
        )}
      </div>
    </div>
  );
}
