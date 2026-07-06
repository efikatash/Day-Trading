"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/lib/progress";
import { getOverallProgress } from "@/lib/selectors";
import { Icons } from "@/components/icons";

export function BackupPanel() {
  const { state, exportState, importState } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(
    null
  );
  const overall = getOverallProgress(state);

  function onExport() {
    exportState();
    setMsg({
      tone: "ok",
      text: "הקובץ ירד. שמור אותו במקום בטוח (למשל Google Drive או מייל לעצמך).",
    });
  }

  function onPick() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const ok = importState(data);
        setMsg(
          ok
            ? { tone: "ok", text: "ההתקדמות שוחזרה בהצלחה! 🎉" }
            : { tone: "err", text: "הקובץ לא תקין. ודא שזה קובץ גיבוי מהאפליקציה." }
        );
      } catch {
        setMsg({ tone: "err", text: "לא הצלחתי לקרוא את הקובץ. ודא שזה קובץ גיבוי JSON." });
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-importing same file
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">💾</span>
        <h3 className="font-bold">גיבוי ושחזור התקדמות</h3>
      </div>
      <p className="mt-1 text-sm text-muted">
        ההתקדמות נשמרת בדפדפן בלבד. תוכנות ניקוי (כמו CCleaner) או מחיקת נתוני
        גלישה ימחקו אותה. ייצא קובץ גיבוי מדי פעם — ותוכל לשחזר בכל רגע, גם אחרי
        ניקוי או במחשב אחר.
      </p>

      <div className="mt-3 rounded-xl border surface-2 p-3 text-xs text-muted">
        מה שמור כרגע: {overall.completedLessons}/{overall.totalLessons} שיעורים ·{" "}
        {overall.quizCount} מבחנים · {state.journal.length} עסקאות ביומן
        {state.plan ? " · תוכנית מסחר" : ""}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onExport} className="btn-primary text-sm">
          <Icons.arrow className="h-4 w-4 rotate-90" /> ייצא קובץ גיבוי
        </button>
        <button onClick={onPick} className="btn-secondary text-sm">
          <Icons.arrow className="h-4 w-4 -rotate-90" /> שחזר מקובץ גיבוי
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="hidden"
        />
      </div>

      {msg && (
        <div
          className={`mt-3 rounded-xl p-3 text-sm ${
            msg.tone === "ok"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer font-semibold">
          איך למנוע שזה יימחק שוב?
        </summary>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <b>הכי בטוח:</b> ייצא קובץ גיבוי בסוף כל יום לימוד ושמור אותו (Drive /
            מייל). אחרי ניקוי — פשוט "שחזר מקובץ גיבוי".
          </li>
          <li>
            <b>ב-CCleaner:</b> אפשר להחריג את האתר — Options → Cookies → העבר את
            <span dir="ltr"> efikatash.github.io </span> ל"Cookies to Keep", וגם
            לבטל סימון של ניקוי נתוני דפדפן אם לא הכרחי.
          </li>
          <li>
            <b>בדפדפן:</b> אל תבחר "מחק עוגיות ונתוני אתרים" כשמנקים היסטוריה.
          </li>
        </ul>
      </details>
    </div>
  );
}
