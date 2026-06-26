"use client";

import { useState } from "react";
import { InfoBox } from "@/components/ui";

export function CandleBuilder() {
  const [open, setOpen] = useState(50);
  const [close, setClose] = useState(70);
  const [high, setHigh] = useState(85);
  const [low, setLow] = useState(40);

  // clamp so high is highest and low is lowest
  const top = Math.max(open, close, high);
  const bottom = Math.min(open, close, low);
  const realHigh = Math.max(high, open, close);
  const realLow = Math.min(low, open, close);
  const bullish = close >= open;

  const chartH = 240;
  const scale = (v: number) => chartH - (v / 100) * chartH;

  const bodyTop = scale(Math.max(open, close));
  const bodyBottom = scale(Math.min(open, close));
  const bodyHeight = Math.max(2, bodyBottom - bodyTop);
  const wickTop = scale(realHigh);
  const wickBottom = scale(realLow);

  return (
    <div className="card p-5">
      <h3 className="font-bold">🕯️ בונה הנרות האינטראקטיבי</h3>
      <p className="mt-1 text-sm text-muted">
        שנה את ערכי הפתיחה, הסגירה, הגבוה והנמוך וראה איך הנר מצייר את עצמו.
        נר ירוק = הסגירה מעל הפתיחה (עלייה). נר אדום = הסגירה מתחת לפתיחה (ירידה).
      </p>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row">
        {/* Chart */}
        <div className="flex items-center justify-center rounded-xl border surface-2 p-4 sm:w-56">
          <svg width="80" height={chartH} className="overflow-visible">
            {/* wick */}
            <line
              x1="40"
              x2="40"
              y1={wickTop}
              y2={wickBottom}
              stroke={bullish ? "#10b981" : "#ef4444"}
              strokeWidth="2"
            />
            {/* body */}
            <rect
              x="22"
              y={bodyTop}
              width="36"
              height={bodyHeight}
              rx="3"
              fill={bullish ? "#10b981" : "#ef4444"}
            />
            {/* labels */}
            <text x="62" y={scale(open) + 4} fontSize="10" fill="currentColor">
              O
            </text>
            <text x="62" y={scale(close) + 4} fontSize="10" fill="currentColor">
              C
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3">
          {[
            { label: "פתיחה (Open)", val: open, set: setOpen },
            { label: "סגירה (Close)", val: close, set: setClose },
            { label: "גבוה (High)", val: high, set: setHigh },
            { label: "נמוך (Low)", val: low, set: setLow },
          ].map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted">{c.val}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={c.val}
                onChange={(e) => c.set(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <InfoBox
          title={bullish ? "נר עולה (Bullish)" : "נר יורד (Bearish)"}
          emoji={bullish ? "🟢" : "🔴"}
          tone={bullish ? "example" : "mistake"}
        >
          {bullish
            ? "הסגירה גבוהה מהפתיחה — הקונים שלטו בנר הזה. גוף הנר מראה את הטווח בין הפתיחה לסגירה, והפתילים מראים עד לאן הגיע המחיר ונדחה."
            : "הסגירה נמוכה מהפתיחה — המוכרים שלטו בנר הזה. שים לב לאורך הפתיל התחתון/עליון: פתיל ארוך מסמן דחייה של המחיר באותו כיוון."}
          {realHigh - top > 0 || bottom - realLow > 0 ? "" : ""}
        </InfoBox>
      </div>
    </div>
  );
}
