"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import type { TradingPlan } from "@/lib/app-types";
import { ProgressBar, InfoBox, WarningBox, Badge } from "@/components/ui";
import { Icons } from "@/components/icons";

const MARKET_OPTIONS = ["מניות נזילות בארה״ב", "ETFs / מדדים", "קריפטו (BTC/ETH)", "פורקס", "חוזים עתידיים"];
const HOUR_OPTIONS = ["שעת הפתיחה הראשונה", "שעתיים ראשונות אחרי הפתיחה", "אמצע היום", "שעת הסגירה"];
const SETUP_OPTIONS = ["Trend Pullback", "Breakout Retest", "VWAP Bounce", "Opening Range Breakout"];

function emptyPlan(): TradingPlan {
  return {
    markets: [],
    tradingHours: "",
    setups: [],
    riskPerTrade: "",
    maxDailyLoss: "",
    maxWeeklyLoss: "",
    entryRules: "",
    exitRules: "",
    emotionalRules: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function planScore(p: TradingPlan): number {
  const checks = [
    p.markets.length > 0,
    p.tradingHours.trim() !== "",
    p.setups.length > 0 && p.setups.length <= 2,
    p.riskPerTrade.trim() !== "",
    p.maxDailyLoss.trim() !== "",
    p.maxWeeklyLoss.trim() !== "",
    p.entryRules.trim().length > 10,
    p.exitRules.trim().length > 10,
    p.emotionalRules.trim().length > 10,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function PlanPage() {
  const { state, savePlan } = useProgress();
  const [draft, setDraft] = useState<TradingPlan>(state.plan ?? emptyPlan());
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"wizard" | "final">(state.plan ? "final" : "wizard");

  function set<K extends keyof TradingPlan>(k: K, v: TradingPlan[K]) {
    setDraft((p) => ({ ...p, [k]: v }));
  }
  function toggleArr(key: "markets" | "setups", value: string, max = 99) {
    setDraft((p) => {
      const arr = p[key];
      const has = arr.includes(value);
      let next = has ? arr.filter((x) => x !== value) : [...arr, value];
      if (!has && next.length > max) next = [...arr.slice(1), value];
      return { ...p, [key]: next };
    });
  }

  function finish() {
    const plan = { ...draft, updatedAt: new Date().toISOString() };
    savePlan(plan);
    setView("final");
  }

  const score = planScore(draft);

  const steps = [
    {
      title: "באיזה שוק תסחור?",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">בחר שוק אחד או שניים בלבד כדי להתמקד.</p>
          {MARKET_OPTIONS.map((m) => (
            <OptionToggle key={m} label={m} active={draft.markets.includes(m)} onClick={() => toggleArr("markets", m)} />
          ))}
        </div>
      ),
    },
    {
      title: "באילו שעות תסחור?",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">חלון מסחר מוגדר מונע מסחר מתוך שעמום.</p>
          {HOUR_OPTIONS.map((h) => (
            <OptionToggle key={h} label={h} active={draft.tradingHours === h} onClick={() => set("tradingHours", h)} />
          ))}
          <input
            value={HOUR_OPTIONS.includes(draft.tradingHours) ? "" : draft.tradingHours}
            onChange={(e) => set("tradingHours", e.target.value)}
            placeholder="או הקלד חלון שעות משלך..."
            className="input mt-2"
          />
        </div>
      ),
    },
    {
      title: "אילו Setups מותרים לך?",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">מתחיל צריך 1–2 שיטות בלבד. כל השאר = אין עסקה.</p>
          {SETUP_OPTIONS.map((s) => (
            <OptionToggle key={s} label={s} active={draft.setups.includes(s)} onClick={() => toggleArr("setups", s, 2)} />
          ))}
          {draft.setups.length > 2 && (
            <p className="text-xs text-rose-600">בחר עד 2 Setups בלבד.</p>
          )}
        </div>
      ),
    },
    {
      title: "סיכון לעסקה",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">כמה אחוז מהחשבון תסכן בעסקה אחת? (מומלץ 0.5%–1%)</p>
          <input value={draft.riskPerTrade} onChange={(e) => set("riskPerTrade", e.target.value)} placeholder="לדוגמה: 1% מהחשבון, מקסימום 200 ₪" className="input" />
        </div>
      ),
    },
    {
      title: "הפסד יומי מרבי",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">מתי אתה סוגר את הפלטפורמה ליום?</p>
          <input value={draft.maxDailyLoss} onChange={(e) => set("maxDailyLoss", e.target.value)} placeholder="לדוגמה: 2R או 3% מהחשבון" className="input" />
        </div>
      ),
    },
    {
      title: "הפסד שבועי מרבי",
      body: (
        <div className="space-y-2">
          <p className="text-sm text-muted">מתי אתה עוצר לשבוע ועובר לבדיקה?</p>
          <input value={draft.maxWeeklyLoss} onChange={(e) => set("maxWeeklyLoss", e.target.value)} placeholder="לדוגמה: 5R או 6% מהחשבון" className="input" />
        </div>
      ),
    },
    {
      title: "חוקי כניסה",
      body: (
        <textarea value={draft.entryRules} onChange={(e) => set("entryRules", e.target.value)} rows={4} placeholder="מה חייב להיות נכון כדי שתיכנס? (הקשר מגמה, טריגר, אישור, נזילות...)" className="input resize-y" />
      ),
    },
    {
      title: "חוקי יציאה",
      body: (
        <textarea value={draft.exitRules} onChange={(e) => set("exitRules", e.target.value)} rows={4} placeholder="איפה ה-Stop? איפה היעד? מתי עוברים לאיזון? יציאות חלקיות?" className="input resize-y" />
      ),
    },
    {
      title: "חוקים רגשיים",
      body: (
        <textarea value={draft.emotionalRules} onChange={(e) => set("emotionalRules", e.target.value)} rows={4} placeholder="לדוגמה: אחרי 2 הפסדים ברצף אני קם להפסקה. לא נכנס מתוך FOMO. לא מגדיל סיכון אחרי הפסד." className="input resize-y" />
      ),
    },
    {
      title: "סקירה אחרונה",
      body: <PlanPreview plan={draft} score={score} />,
    },
  ];

  if (view === "final" && state.plan) {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">תוכנית המסחר שלי 📋</h1>
            <p className="mt-1 text-sm text-muted">
              עודכן לאחרונה: {new Date(state.plan.updatedAt).toLocaleDateString("he-IL")}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setDraft(state.plan!); setView("wizard"); setStep(0); }} className="btn-secondary">
              ערוך
            </button>
            <button onClick={() => window.print()} className="btn-primary">
              הדפס / ייצא
            </button>
          </div>
        </div>
        <PlanPreview plan={state.plan} score={planScore(state.plan)} />
        <InfoBox title="זכור" emoji="📌" tone="rule">
          תוכנית טובה היא תוכנית שאתה באמת מציית לה. כל סטייה מהתוכנית — תעד ביומן
          המסחר כדי לזהות דפוסים.
        </InfoBox>
      </div>
    );
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">בניית תוכנית מסחר 📋</h1>
        <p className="mt-1 text-sm text-muted">
          10 צעדים לתוכנית כתובה. אין מסחר בלי תוכנית.
        </p>
      </div>

      <div className="card p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold">צעד {step + 1} מתוך {steps.length}</span>
          <span className="text-muted">איכות התוכנית: {score}%</span>
        </div>
        <ProgressBar value={((step + 1) / steps.length) * 100} />
      </div>

      <div className="card animate-fade-in p-5">
        <h2 className="text-lg font-bold">{current.title}</h2>
        <div className="mt-3">{current.body}</div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-ghost">
            <Icons.arrowRight className="h-4 w-4" /> חזור
          </button>
          {isLast ? (
            <button onClick={finish} className="btn-primary">
              <Icons.check className="h-4 w-4" /> שמור תוכנית
            </button>
          ) : (
            <button onClick={() => setStep(step + 1)} className="btn-primary">
              המשך <Icons.arrow className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OptionToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl border p-3 text-right text-sm font-medium transition ${
        active ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "surface-2 hover:border-brand-300"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded border ${active ? "border-brand-500 bg-brand-500 text-white" : "border-current opacity-40"}`}>
        {active && <Icons.check className="h-3.5 w-3.5" />}
      </span>
      {label}
    </button>
  );
}

function PlanPreview({ plan, score }: { plan: TradingPlan; score: number }) {
  const rows: [string, string][] = [
    ["שוק מותר למסחר", plan.markets.join(", ") || "—"],
    ["שעות מסחר", plan.tradingHours || "—"],
    ["Setups מותרים", plan.setups.join(", ") || "—"],
    ["סיכון לעסקה", plan.riskPerTrade || "—"],
    ["הפסד יומי מרבי", plan.maxDailyLoss || "—"],
    ["הפסד שבועי מרבי", plan.maxWeeklyLoss || "—"],
    ["חוקי כניסה", plan.entryRules || "—"],
    ["חוקי יציאה", plan.exitRules || "—"],
    ["חוקים רגשיים", plan.emotionalRules || "—"],
  ];
  return (
    <div className="rounded-2xl border surface-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">תוכנית המסחר שלי</h3>
        <Badge tone={score >= 80 ? "success" : score >= 50 ? "warning" : "danger"}>
          איכות: {score}%
        </Badge>
      </div>
      <dl className="space-y-3">
        {rows.map(([k, v]) => (
          <div key={k} className="border-b pb-2 last:border-0">
            <dt className="text-xs font-semibold text-muted">{k}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm">{v}</dd>
          </div>
        ))}
      </dl>
      {score < 80 && (
        <p className="mt-3 text-xs text-amber-600">
          טיפ: מלא את כל השדות בפירוט (במיוחד חוקי כניסה/יציאה/רגש) כדי לשפר את
          איכות התוכנית.
        </p>
      )}
    </div>
  );
}
