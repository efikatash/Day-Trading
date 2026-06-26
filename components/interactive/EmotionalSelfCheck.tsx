"use client";

import { useState } from "react";
import { InfoBox } from "@/components/ui";

const STATES = [
  { emoji: "😌", label: "רגוע וממוקד", score: 2, advice: "מצב אידיאלי. אתה יכול לסחור לפי התוכנית — בלי לאלתר." },
  { emoji: "😐", label: "ניטרלי", score: 1, advice: "תקין. עקוב אחרי החוקים והישאר ער למצב הרגשי שלך במהלך היום." },
  { emoji: "😟", label: "חרד / לחוץ", score: -1, advice: "סימן אזהרה. חרדה גורמת ליציאות מוקדמות והיסוס. שקול להקטין סיכון או לוותר." },
  { emoji: "😤", label: "מתוסכל / כועס", score: -2, advice: "סכנה. כעס מוביל למסחר נקמה. עדיף לא לסחור היום." },
  { emoji: "🤩", label: "נלהב / בטוח מדי", score: -1, advice: "זהירות. ביטחון יתר אחרי יום טוב מוביל להגדלת סיכון וחמדנות." },
  { emoji: "😴", label: "עייף", score: -2, advice: "עייפות פוגעת בריכוז ובמשמעת. יום מסחר טוב מתחיל בשינה טובה." },
];

export function EmotionalSelfCheck() {
  const [picked, setPicked] = useState<number | null>(null);
  const sel = picked !== null ? STATES[picked] : null;

  return (
    <div className="card p-5">
      <h3 className="font-bold">💗 בדיקת מצב רגשי</h3>
      <p className="mt-1 text-sm text-muted">
        איך אתה מרגיש עכשיו? המצב הרגשי משפיע ישירות על איכות ההחלטות שלך.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STATES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setPicked(i)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center text-xs font-medium transition ${
              picked === i
                ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                : "surface-2 hover:border-brand-300"
            }`}
          >
            <span className="text-2xl">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {sel && (
        <div className="mt-4">
          <InfoBox
            title={`${sel.emoji} ${sel.label}`}
            tone={sel.score >= 1 ? "example" : sel.score === -1 ? "objective" : "mistake"}
          >
            {sel.advice}
          </InfoBox>
        </div>
      )}
    </div>
  );
}
