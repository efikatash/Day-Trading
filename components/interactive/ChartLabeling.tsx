"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

// Deterministic uptrend sample (Higher Highs / Higher Lows)
const UPTREND: Candle[] = [
  { o: 20, c: 26, h: 28, l: 19 },
  { o: 26, c: 24, h: 27, l: 22 },
  { o: 24, c: 32, h: 34, l: 23 },
  { o: 32, c: 30, h: 33, l: 28 },
  { o: 30, c: 40, h: 42, l: 29 },
  { o: 40, c: 37, h: 41, l: 35 },
  { o: 37, c: 48, h: 50, l: 36 },
  { o: 48, c: 46, h: 49, l: 43 },
  { o: 46, c: 56, h: 58, l: 45 },
  { o: 56, c: 60, h: 64, l: 54 },
];

function CandleChart({
  candles,
  support,
  resistance,
}: {
  candles: Candle[];
  support?: number;
  resistance?: number;
}) {
  const W = 360;
  const H = 220;
  const pad = 10;
  const n = candles.length;
  const slot = (W - pad * 2) / n;
  const max = Math.max(...candles.map((c) => c.h)) + 4;
  const min = Math.min(...candles.map((c) => c.l)) - 4;
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border surface-2">
      {resistance !== undefined && (
        <line
          x1={pad}
          x2={W - pad}
          y1={y(resistance)}
          y2={y(resistance)}
          stroke="#ef4444"
          strokeDasharray="5 4"
          strokeWidth="1.5"
        />
      )}
      {support !== undefined && (
        <line
          x1={pad}
          x2={W - pad}
          y1={y(support)}
          y2={y(support)}
          stroke="#10b981"
          strokeDasharray="5 4"
          strokeWidth="1.5"
        />
      )}
      {candles.map((c, i) => {
        const cx = pad + slot * i + slot / 2;
        const bull = c.c >= c.o;
        const color = bull ? "#10b981" : "#ef4444";
        const bodyTop = y(Math.max(c.o, c.c));
        const bodyBottom = y(Math.min(c.o, c.c));
        return (
          <g key={i}>
            <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1.5" />
            <rect
              x={cx - slot * 0.3}
              y={bodyTop}
              width={slot * 0.6}
              height={Math.max(2, bodyBottom - bodyTop)}
              fill={color}
              rx="1.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

interface LabelQ {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: LabelQ[] = [
  {
    q: "מה המגמה בגרף הזה?",
    options: ["מגמת עלייה", "מגמת ירידה", "דשדוש ללא כיוון"],
    correct: 0,
    explanation:
      "מגמת עלייה: כל שיא גבוה מהקודם (Higher High) וכל שפל גבוה מהקודם (Higher Low).",
  },
  {
    q: "מה מאפיין מגמת עלייה?",
    options: [
      "שיאים יורדים ושפלים יורדים",
      "שיאים עולים ושפלים עולים",
      "מחיר תקוע באותו טווח",
    ],
    correct: 1,
    explanation: "Higher Highs ו-Higher Lows הם חתימת מגמת עלייה.",
  },
  {
    q: "הקו הירוק המקווקו בגרף הבא מסמן...",
    options: ["התנגדות", "תמיכה", "ממוצע נע"],
    correct: 1,
    explanation:
      "תמיכה (Support): אזור שמתחת למחיר שבו קונים נוטים להיכנס. התנגדות מסומנת בדרך כלל מעל המחיר.",
  },
];

export function ChartLabeling() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    QUESTIONS.map(() => null)
  );

  return (
    <div className="card p-5">
      <h3 className="font-bold">📐 תרגול: סמן מגמה, תמיכה והתנגדות</h3>
      <p className="mt-1 text-sm text-muted">
        התבונן בגרף וענה על השאלות. הקו האדום = התנגדות, הקו הירוק = תמיכה.
      </p>

      <div className="mt-4">
        <CandleChart candles={UPTREND} support={19} resistance={64} />
      </div>

      <div className="mt-4 space-y-3">
        {QUESTIONS.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <div key={qi} className="rounded-xl border surface-2 p-3.5">
              <p className="text-sm font-semibold">{q.q}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const reveal = chosen !== null;
                  return (
                    <button
                      key={oi}
                      onClick={() =>
                        chosen === null &&
                        setAnswers((prev) =>
                          prev.map((a, i) => (i === qi ? oi : a))
                        )
                      }
                      disabled={reveal}
                      className={`btn text-xs ${
                        reveal && oi === q.correct
                          ? "bg-emerald-500 text-white"
                          : isChosen
                          ? "bg-rose-500 text-white"
                          : "btn-secondary"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {chosen !== null && (
                <div
                  className={`mt-2 flex items-start gap-1.5 text-xs ${
                    chosen === q.correct ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {chosen === q.correct ? (
                    <Icons.check className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <Icons.close className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span className="text-soft">{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
