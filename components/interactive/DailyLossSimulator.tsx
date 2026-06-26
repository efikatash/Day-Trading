"use client";

import { useState } from "react";
import { InfoBox } from "@/components/ui";

export function DailyLossSimulator() {
  const [account, setAccount] = useState(20000);
  const [riskPct, setRiskPct] = useState(1);
  const [maxDailyR, setMaxDailyR] = useState(2);

  const riskAmount = (account * riskPct) / 100;
  const maxDailyLoss = riskAmount * maxDailyR;
  const maxDailyPct = account > 0 ? (maxDailyLoss / account) * 100 : 0;

  // simulate a losing streak
  const trades = Array.from({ length: 5 }, (_, i) => {
    const cumulativeR = -(i + 1);
    const stopHit = i + 1 >= maxDailyR;
    return { trade: i + 1, cumulativeR, loss: riskAmount * (i + 1), stopHit };
  });

  return (
    <div className="card p-5">
      <h3 className="font-bold">🛑 סימולטור הפסד יומי מרבי</h3>
      <p className="mt-1 text-sm text-muted">
        כלל ההפסד היומי מגן עליך מ"יום שחור". כשמגיעים להפסד היומי המרבי — סוגרים
        את הפלטפורמה, בלי ויכוחים.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">גודל חשבון (₪)</label>
          <input
            type="number"
            value={account}
            onChange={(e) => setAccount(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">סיכון לעסקה (%)</label>
          <input
            type="number"
            step="0.1"
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">הפסד יומי מרבי (R)</label>
          <input
            type="number"
            step="0.5"
            value={maxDailyR}
            onChange={(e) => setMaxDailyR(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">סיכון לעסקה (1R)</div>
          <div className="text-lg font-bold">{riskAmount.toFixed(0)} ₪</div>
        </div>
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">הפסד יומי מרבי</div>
          <div className="text-lg font-bold text-rose-600">
            {maxDailyLoss.toFixed(0)} ₪
          </div>
        </div>
        <div className="rounded-xl border surface-2 p-3 text-center">
          <div className="text-xs text-muted">% מהחשבון</div>
          <div className="text-lg font-bold">{maxDailyPct.toFixed(1)}%</div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="surface-2 text-xs text-muted">
            <tr>
              <th className="p-2 text-right">עסקה</th>
              <th className="p-2 text-right">תוצאה מצטברת</th>
              <th className="p-2 text-right">הפסד מצטבר</th>
              <th className="p-2 text-right">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr
                key={t.trade}
                className={`border-t ${
                  t.stopHit ? "bg-rose-50 dark:bg-rose-500/10" : ""
                }`}
              >
                <td className="p-2">#{t.trade}</td>
                <td className="p-2 font-medium">{t.cumulativeR}R</td>
                <td className="p-2">{t.loss.toFixed(0)} ₪</td>
                <td className="p-2">
                  {t.stopHit ? (
                    <span className="font-bold text-rose-600">
                      🛑 עצור — הגעת לגבול
                    </span>
                  ) : (
                    <span className="text-muted">ממשיך</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <InfoBox title="החוק שמציל חשבונות" emoji="🛡️" tone="rule">
          ברגע שההפסד המצטבר מגיע ל-{maxDailyR}R ({maxDailyLoss.toFixed(0)} ₪),
          המסחר ליום נגמר. זה מונע את הספירלה של מסחר נקמה שמוחקת חשבונות.
        </InfoBox>
      </div>
    </div>
  );
}
