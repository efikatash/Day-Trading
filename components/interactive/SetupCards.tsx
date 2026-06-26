"use client";

import { useState } from "react";

interface Setup {
  name: string;
  emoji: string;
  idea: string;
  entry: string;
  stop: string;
  target: string;
  note: string;
}

const SETUPS: Setup[] = [
  {
    name: "Trend Pullback",
    emoji: "📈",
    idea: "במגמת עלייה ברורה, ממתינים לתיקון קטן כלפי מטה (Pullback) ומחפשים כניסה בכיוון המגמה.",
    entry: "כשהמחיר חוזר לאזור תמיכה/ממוצע נע ומראה סימן התייצבות.",
    stop: "מתחת לשפל האחרון של התיקון.",
    target: "השיא הקודם או יחס R:R של לפחות 1:2.",
    note: "סוחרים עם המגמה, לא נגדה. דוגמה חינוכית בלבד — לא אות מסחר.",
  },
  {
    name: "Breakout Retest",
    emoji: "🚀",
    idea: "המחיר שובר רמת התנגדות, ואז חוזר לבדוק אותה ('Retest') כתמיכה חדשה.",
    entry: "כשה-Retest מחזיק והמחיר חוזר לעלות מהרמה.",
    stop: "מתחת לרמה שנשברה.",
    target: "תנועה בגודל הטווח שלפני הפריצה, או R:R 1:2.",
    note: "Retest בטוח יותר מרדיפה אחרי הפריצה הראשונית.",
  },
  {
    name: "VWAP Bounce",
    emoji: "⚖️",
    idea: "VWAP הוא מחיר ממוצע משוקלל בנפח. מחיר לעיתים מגיב סביבו כרמה דינמית.",
    entry: "כשמחיר נוגע ב-VWAP במגמה ומראה דחייה לכיוון המגמה.",
    stop: "מעבר ל-VWAP בכיוון ההפוך.",
    target: "רמת התנגדות/תמיכה הבאה או R:R מוגדר.",
    note: "כלי הקשר, לא קסם. לא לסחור 'כי נגע ב-VWAP' בלי הקשר.",
  },
  {
    name: "Opening Range Breakout",
    emoji: "🔔",
    idea: "טווח הדקות הראשונות של המסחר (Opening Range). פריצה ממנו עשויה לסמן כיוון ליום.",
    entry: "פריצה מאוששת של גבול הטווח הפותח.",
    stop: "בצד השני של הטווח הפותח.",
    target: "מכפלה של גובה הטווח או R:R מוגדר.",
    note: "זהירות מ-Fakeouts בפתיחה התנודתית. דורש תרגול בדמו.",
  },
];

export function SetupCards() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="card p-5">
      <h3 className="font-bold">♟️ כרטיסי Setup</h3>
      <p className="mt-1 text-sm text-muted">
        לחץ על כרטיס כדי לראות את מבנה ה-Setup. כל אלה הם דוגמאות חינוכיות — לא
        המלצות מסחר.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SETUPS.map((s, i) => {
          const open = flipped === i;
          return (
            <button
              key={s.name}
              onClick={() => setFlipped(open ? null : i)}
              className="rounded-2xl border surface-2 p-4 text-right transition hover:border-brand-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.emoji}</span>
                <span className="font-bold">{s.name}</span>
              </div>
              {!open ? (
                <p className="mt-2 text-sm text-soft">{s.idea}</p>
              ) : (
                <div className="mt-2 space-y-1.5 text-xs">
                  <p>
                    <span className="font-bold text-brand-600">כניסה:</span>{" "}
                    {s.entry}
                  </p>
                  <p>
                    <span className="font-bold text-rose-600">Stop:</span>{" "}
                    {s.stop}
                  </p>
                  <p>
                    <span className="font-bold text-emerald-600">יעד:</span>{" "}
                    {s.target}
                  </p>
                  <p className="text-muted">{s.note}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
