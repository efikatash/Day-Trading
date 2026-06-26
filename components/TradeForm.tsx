"use client";

import { useState } from "react";
import type { Trade, TradeDirection } from "@/lib/app-types";
import { computeR, computePnl } from "@/lib/trade-utils";
import { Icons } from "@/components/icons";

const SETUPS = [
  "Trend Pullback",
  "Breakout Retest",
  "VWAP Bounce",
  "Opening Range Breakout",
  "אחר",
];

const EMOTIONS = ["רגוע", "בטוח", "מהוסס", "חרד", "נלהב", "מתוסכל", "חמדן"];

function numOrNull(v: string): number | null {
  if (v === "") return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function TradeForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Trade;
  onSave: (t: Trade) => void;
  onCancel: () => void;
}) {
  const [t, setT] = useState<Trade>(initial);

  function set<K extends keyof Trade>(key: K, value: Trade[K]) {
    setT((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    const resultR = computeR(t.entry, t.stop, t.exit, t.direction);
    const pnl = computePnl(t.entry, t.exit, t.positionSize, t.direction);
    onSave({
      ...t,
      resultR: t.resultR ?? resultR,
      pnl: t.pnl ?? pnl,
    });
  }

  const previewR = computeR(t.entry, t.stop, t.exit, t.direction);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border surface p-5 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {initial.market ? "עריכת עסקה" : "עסקה חדשה"}
          </h3>
          <button onClick={onCancel} className="btn-ghost p-2">
            <Icons.close />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">תאריך</label>
            <input
              type="date"
              value={t.date}
              onChange={(e) => set("date", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">שוק / טיקר</label>
            <input
              value={t.market}
              onChange={(e) => set("market", e.target.value)}
              placeholder="לדוגמה: AAPL, BTC, מדד..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Setup</label>
            <select
              value={t.setup}
              onChange={(e) => set("setup", e.target.value)}
              className="input"
            >
              <option value="">בחר Setup</option>
              {SETUPS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">כיוון</label>
            <div className="flex gap-2">
              {([["long", "Long (קנייה)"], ["short", "Short (מכירה)"]] as [TradeDirection, string][]).map(
                ([dir, label]) => (
                  <button
                    key={dir}
                    onClick={() => set("direction", dir)}
                    className={`btn flex-1 text-sm ${
                      t.direction === dir ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <label className="label">כניסה (Entry)</label>
            <input type="number" step="any" value={t.entry ?? ""} onChange={(e) => set("entry", numOrNull(e.target.value))} className="input" />
          </div>
          <div>
            <label className="label">Stop</label>
            <input type="number" step="any" value={t.stop ?? ""} onChange={(e) => set("stop", numOrNull(e.target.value))} className="input" />
          </div>
          <div>
            <label className="label">יעד (Target)</label>
            <input type="number" step="any" value={t.target ?? ""} onChange={(e) => set("target", numOrNull(e.target.value))} className="input" />
          </div>
          <div>
            <label className="label">גודל פוזיציה</label>
            <input type="number" step="any" value={t.positionSize ?? ""} onChange={(e) => set("positionSize", numOrNull(e.target.value))} className="input" />
          </div>
          <div>
            <label className="label">מחיר יציאה (Exit)</label>
            <input type="number" step="any" value={t.exit ?? ""} onChange={(e) => set("exit", numOrNull(e.target.value))} className="input" />
          </div>
          <div>
            <label className="label">
              תוצאה ב-R {previewR !== null && <span className="text-muted">(מחושב: {previewR}R)</span>}
            </label>
            <input
              type="number"
              step="any"
              value={t.resultR ?? ""}
              onChange={(e) => set("resultR", numOrNull(e.target.value))}
              placeholder={previewR !== null ? String(previewR) : "ידני"}
              className="input"
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">רגש לפני העסקה</label>
            <select value={t.emotionBefore} onChange={(e) => set("emotionBefore", e.target.value)} className="input">
              <option value="">בחר</option>
              {EMOTIONS.map((em) => (<option key={em} value={em}>{em}</option>))}
            </select>
          </div>
          <div>
            <label className="label">רגש אחרי העסקה</label>
            <select value={t.emotionAfter} onChange={(e) => set("emotionAfter", e.target.value)} className="input">
              <option value="">בחר</option>
              {EMOTIONS.map((em) => (<option key={em} value={em}>{em}</option>))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">סיבת כניסה</label>
            <textarea value={t.reasonEntry} onChange={(e) => set("reasonEntry", e.target.value)} rows={2} className="input resize-y" placeholder="מה היה ה-Setup? למה נכנסת?" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">סיבת יציאה</label>
            <textarea value={t.reasonExit} onChange={(e) => set("reasonExit", e.target.value)} rows={2} className="input resize-y" placeholder="הגעת ליעד? נגעת ב-Stop? יצאת מוקדם?" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">טעות בעסקה (אם הייתה)</label>
            <input value={t.mistake} onChange={(e) => set("mistake", e.target.value)} className="input" placeholder="לדוגמה: נכנסתי בלי Setup, הזזתי Stop, גודל פוזיציה גדול מדי" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">לקח שלמדתי</label>
            <textarea value={t.lessonLearned} onChange={(e) => set("lessonLearned", e.target.value)} rows={2} className="input resize-y" placeholder="מה תעשה אחרת בפעם הבאה?" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">ביטול</button>
          <button onClick={submit} className="btn-primary">שמור עסקה</button>
        </div>
      </div>
    </div>
  );
}
