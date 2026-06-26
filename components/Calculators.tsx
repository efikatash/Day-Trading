"use client";

import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/lib/progress";
import { InfoBox, WarningBox, Badge } from "@/components/ui";

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  value,
  onChange,
  unit,
  step = "any",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
        {unit && <span className="text-sm font-semibold text-muted">{unit}</span>}
      </div>
    </div>
  );
}

function Result({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "bad" }) {
  return (
    <div className="rounded-xl border surface-2 p-3 text-center">
      <div className="text-xs text-muted">{label}</div>
      <div
        className={`mt-0.5 text-lg font-bold ${
          tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// ---------- A. Position Size ----------
export function PositionSizeCalculator() {
  const { bumpCalcUsage } = useProgress();
  const [account, setAccount] = useState("20000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("50");
  const [stop, setStop] = useState("48");
  const [touched, setTouched] = useState(false);

  const a = num(account);
  const rp = num(riskPct);
  const e = num(entry);
  const s = num(stop);

  const riskAmount = (a * rp) / 100;
  const riskPerUnit = Math.abs(e - s);
  const positionSize = riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
  const positionValue = positionSize * e;
  const stopPct = e > 0 ? (riskPerUnit / e) * 100 : 0;
  const exposurePct = a > 0 ? (positionValue / a) * 100 : 0;

  useEffect(() => {
    if (touched) bumpCalcUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched]);

  return (
    <div className="card p-5" onFocus={() => !touched && setTouched(true)}>
      <h3 className="font-bold">📦 מחשבון גודל פוזיציה</h3>
      <p className="mt-1 text-sm text-muted">
        כמה יחידות לקנות כך שתסכן בדיוק את הסכום שהחלטת עליו — לא יותר.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="גודל חשבון" value={account} onChange={setAccount} unit="₪" />
        <Field label="סיכון לעסקה" value={riskPct} onChange={setRiskPct} unit="%" />
        <Field label="מחיר כניסה (Entry)" value={entry} onChange={setEntry} unit="₪" />
        <Field label="מחיר Stop" value={stop} onChange={setStop} unit="₪" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Result label="סכום בסיכון" value={`${riskAmount.toFixed(0)} ₪`} />
        <Result label="סיכון ליחידה" value={`${riskPerUnit.toFixed(2)} ₪`} />
        <Result label="גודל פוזיציה" value={`${positionSize.toFixed(1)}`} tone="good" />
        <Result label="שווי פוזיציה" value={`${positionValue.toFixed(0)} ₪`} />
      </div>

      <div className="mt-4 space-y-2">
        {riskPerUnit === 0 && (
          <WarningBox title="חסר Stop" tone="warning">
            ה-Stop שווה למחיר הכניסה. אין עסקה בלי Stop — קבע מרחק עצירה כדי לחשב
            גודל פוזיציה.
          </WarningBox>
        )}
        {rp > 2 && (
          <WarningBox title="סיכון גבוה מדי לעסקה" tone="danger">
            אתה מסכן {rp}% מהחשבון בעסקה אחת. מתחילים מסכנים בדרך כלל 0.5%–1%.
            סיכון גבוה מאיץ Drawdown ומוחק חשבונות.
          </WarningBox>
        )}
        {stopPct > 0 && stopPct > 8 && (
          <WarningBox title="Stop רחב מאוד" tone="warning">
            ה-Stop נמצא במרחק {stopPct.toFixed(1)}% מהכניסה. Stop רחב מקטין את
            גודל הפוזיציה ועלול לסמן כניסה לא מדויקת. בדוק אם יש כניסה טובה יותר.
          </WarningBox>
        )}
        {exposurePct > 100 && (
          <WarningBox title="חשיפה מעבר לחשבון" tone="danger">
            שווי הפוזיציה ({positionValue.toFixed(0)} ₪) גדול מהחשבון שלך. זה
            דורש מינוף — מסוכן מאוד למתחילים. הקטן את הפוזיציה או הרחב את ה-Stop.
          </WarningBox>
        )}
        {riskPerUnit > 0 && rp <= 2 && exposurePct <= 100 && (
          <InfoBox title="תקציר" emoji="✅" tone="example">
            בקנייה של {positionSize.toFixed(0)} יחידות במחיר {e} ₪ עם Stop ב-{s} ₪,
            ההפסד המקסימלי שלך הוא {riskAmount.toFixed(0)} ₪ — בדיוק {rp}% מהחשבון.
            זה 1R.
          </InfoBox>
        )}
      </div>
    </div>
  );
}

// ---------- B. Risk / Reward ----------
export function RiskRewardCalculator() {
  const { bumpCalcUsage } = useProgress();
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("98");
  const [target, setTarget] = useState("106");
  const [touched, setTouched] = useState(false);

  const e = num(entry);
  const s = num(stop);
  const t = num(target);
  const risk = Math.abs(e - s);
  const reward = Math.abs(t - e);
  const rr = risk > 0 ? reward / risk : 0;

  useEffect(() => {
    if (touched) bumpCalcUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched]);

  let cls = "—";
  let tone: "neutral" | "good" | "bad" = "neutral";
  if (risk > 0) {
    if (rr < 1) {
      cls = "חלש";
      tone = "bad";
    } else if (rr < 1.5) {
      cls = "סביר";
      tone = "neutral";
    } else if (rr < 2.5) {
      cls = "טוב";
      tone = "good";
    } else {
      cls = "מצוין";
      tone = "good";
    }
  }

  return (
    <div className="card p-5" onFocus={() => !touched && setTouched(true)}>
      <h3 className="font-bold">⚖️ מחשבון יחס סיכון/סיכוי (R:R)</h3>
      <p className="mt-1 text-sm text-muted">
        כמה אתה מסכן לעומת כמה אתה יכול להרוויח. ידע חובה לפני כל עסקה.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="כניסה (Entry)" value={entry} onChange={setEntry} unit="₪" />
        <Field label="Stop" value={stop} onChange={setStop} unit="₪" />
        <Field label="יעד (Target)" value={target} onChange={setTarget} unit="₪" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Result label="סיכון ליחידה" value={`${risk.toFixed(2)} ₪`} tone="bad" />
        <Result label="סיכוי ליחידה" value={`${reward.toFixed(2)} ₪`} tone="good" />
        <Result label="יחס R:R" value={risk > 0 ? `1 : ${rr.toFixed(2)}` : "—"} tone={tone} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-sm">דירוג העסקה:</span>
        <Badge tone={tone === "good" ? "success" : tone === "bad" ? "danger" : "neutral"}>
          {cls}
        </Badge>
      </div>

      <div className="mt-4">
        {risk === 0 ? (
          <WarningBox title="חסר Stop" tone="warning">
            בלי Stop אי אפשר לחשב סיכון. אין עסקה בלי Stop.
          </WarningBox>
        ) : rr < 1 ? (
          <WarningBox title="יחס לא משתלם" tone="danger">
            אתה מסכן יותר ממה שאתה יכול להרוויח. גם עם אחוז הצלחה גבוה, יחס כזה
            מקשה מאוד להיות רווחי לאורך זמן. חפש עסקאות עם R:R של 1:2 ומעלה.
          </WarningBox>
        ) : (
          <InfoBox title="מה זה אומר" emoji="💡" tone="example">
            על כל 1 ₪ שאתה מסכן, היעד מציע {rr.toFixed(2)} ₪. עם R:R של{" "}
            {rr.toFixed(1)} מספיק לנצח בחלק מהעסקאות כדי להישאר רווחי — אבל זה
            תלוי גם ב-Win Rate שלך.
          </InfoBox>
        )}
      </div>
    </div>
  );
}

// ---------- C. Daily Loss ----------
export function DailyLossCalculator() {
  const { bumpCalcUsage } = useProgress();
  const [riskPerTrade, setRiskPerTrade] = useState("200");
  const [maxDailyR, setMaxDailyR] = useState("2");
  const [touched, setTouched] = useState(false);

  const r = num(riskPerTrade);
  const maxR = num(maxDailyR);
  const maxLoss = r * maxR;

  useEffect(() => {
    if (touched) bumpCalcUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched]);

  return (
    <div className="card p-5" onFocus={() => !touched && setTouched(true)}>
      <h3 className="font-bold">🛑 מחשבון הפסד יומי מרבי</h3>
      <p className="mt-1 text-sm text-muted">
        כמה מותר להפסיד ביום לפני שסוגרים את הפלטפורמה.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="סיכון לעסקה (1R)" value={riskPerTrade} onChange={setRiskPerTrade} unit="₪" />
        <Field label="הפסד יומי מרבי" value={maxDailyR} onChange={setMaxDailyR} unit="R" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Result label="הפסד יומי מרבי" value={`${maxLoss.toFixed(0)} ₪`} tone="bad" />
        <Result label="מספר עסקאות מפסידות עד עצירה" value={`${maxR.toFixed(0)}`} />
      </div>

      <div className="mt-4">
        <WarningBox title="חוק העצירה היומית" tone="danger">
          ברגע שהפסדת {maxR}R ({maxLoss.toFixed(0)} ₪) ביום — סוגרים את הפלטפורמה,
          בלי "עסקה אחת אחרונה". זה הכלל שמונע ימים שחורים ומסחר נקמה.
        </WarningBox>
      </div>
    </div>
  );
}
