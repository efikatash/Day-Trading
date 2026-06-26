"use client";

import { useState } from "react";
import { InfoBox } from "@/components/ui";

export function SpreadSimulator() {
  const [bid, setBid] = useState(100.0);
  const [ask, setAsk] = useState(100.1);
  const [shares, setShares] = useState(100);

  const spread = Math.max(0, ask - bid);
  // Buy at ask, immediately sell at bid -> instant loss = spread * shares
  const instantCost = spread * shares;
  const spreadPct = bid > 0 ? (spread / bid) * 100 : 0;

  return (
    <div className="card p-5">
      <h3 className="font-bold">💱 סימולטור Spread</h3>
      <p className="mt-1 text-sm text-muted">
        הספרד הוא הפער בין מחיר הקנייה (Ask) למחיר המכירה (Bid). אתה קונה ב-Ask
        ומוכר ב-Bid, כך שברגע הכניסה אתה כבר "במינוס" של הספרד. ראה כמה זה עולה.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Bid (מכירה)</label>
          <input
            type="number"
            step="0.01"
            value={bid}
            onChange={(e) => setBid(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">Ask (קנייה)</label>
          <input
            type="number"
            step="0.01"
            value={ask}
            onChange={(e) => setAsk(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">כמות (מניות)</label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">Spread</div>
          <div className="text-lg font-bold">{spread.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">Spread באחוזים</div>
          <div className="text-lg font-bold">{spreadPct.toFixed(3)}%</div>
        </div>
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">עלות מיידית</div>
          <div className="text-lg font-bold text-rose-600">
            {instantCost.toFixed(2)} ₪
          </div>
        </div>
      </div>

      <div className="mt-4">
        <InfoBox title="מה זה אומר עבורך?" emoji="💡" tone="objective">
          ברגע שנכנסת לעסקה, המחיר צריך לעלות לפחות ב-{spread.toFixed(2)} רק כדי
          שתחזור לאפס. בנייר עם ספרד רחב או בכמות גדולה זה מצטבר מהר. לכן מתחילים
          מעדיפים ניירות נזילים עם ספרד צר, ולעיתים פקודת Limit במקום Market.
        </InfoBox>
      </div>
    </div>
  );
}
