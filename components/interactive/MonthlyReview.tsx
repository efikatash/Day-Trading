"use client";

import { useProgress } from "@/lib/progress";

const FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "stats", label: "מספרים יבשים", placeholder: "מספר עסקאות, Win Rate, ממוצע R, סה״כ R, הפסד מקסימלי..." },
  { key: "best", label: "מה עבד החודש", placeholder: "אילו Setups / החלטות / הרגלים תרמו לי?" },
  { key: "worst", label: "מה לא עבד", placeholder: "אילו טעויות חזרו? איפה שברתי את התוכנית?" },
  { key: "rules", label: "הפרות חוקים", placeholder: "כמה פעמים הזזתי Stop? נכנסתי בלי Setup? עברתי הפסד יומי?" },
  { key: "next", label: "מטרה אחת לחודש הבא", placeholder: "מטרת תהליך אחת, ספציפית ומדידה (לא מטרת רווח)." },
];

export function MonthlyReview() {
  const { getToolState, setToolState } = useProgress();
  const data = getToolState<Record<string, string>>("monthlyReview", {});

  function set(key: string, val: string) {
    setToolState("monthlyReview", { ...data, [key]: val });
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold">🗓️ תבנית סקירה חודשית</h3>
      <p className="mt-1 text-sm text-muted">
        פעם בחודש — עצור ובדוק. בלי סקירה אין שיפור. התשובות נשמרות במכשיר שלך.
      </p>

      <div className="mt-4 space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <textarea
              value={data[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={2}
              className="input resize-y"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
