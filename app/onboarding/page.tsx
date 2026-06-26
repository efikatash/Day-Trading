"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import type {
  ExperienceLevel,
  Weakness,
  StudyTime,
} from "@/lib/app-types";
import { Disclaimer } from "@/components/ui";
import { Icons } from "@/components/icons";

const EXPERIENCE: { value: ExperienceLevel; label: string; emoji: string }[] = [
  { value: "none", label: "אין לי ניסיון בכלל", emoji: "🌱" },
  { value: "seen-charts", label: "ראיתי גרפים אבל לא סחרתי", emoji: "👀" },
  { value: "traded-lost", label: "סחרתי קצת והפסדתי", emoji: "📉" },
  { value: "traded-want-structure", label: "סחרתי קצת ורוצה ללמוד מסודר", emoji: "🧭" },
];

const WEAKNESS: { value: Weakness; label: string; emoji: string }[] = [
  { value: "impatience", label: "חוסר סבלנות", emoji: "⏱️" },
  { value: "fear-loss", label: "פחד להפסיד", emoji: "😰" },
  { value: "fomo", label: "FOMO — פחד לפספס", emoji: "🏃" },
  { value: "no-plan", label: "כניסה בלי תוכנית", emoji: "🎲" },
  { value: "revenge", label: "נקמה אחרי הפסד", emoji: "🔥" },
  { value: "unknown", label: "אני עדיין לא יודע", emoji: "🤔" },
];

const STUDY: { value: StudyTime; label: string; emoji: string }[] = [
  { value: "15", label: "15 דקות", emoji: "⚡" },
  { value: "30", label: "30 דקות", emoji: "☕" },
  { value: "45", label: "45 דקות", emoji: "📚" },
  { value: "60", label: "שעה ומעלה", emoji: "🚀" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setOnboarding } = useProgress();
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [weakness, setWeakness] = useState<Weakness | null>(null);
  const [studyTime, setStudyTime] = useState<StudyTime | null>(null);

  const steps = [
    {
      title: "מה רמת הניסיון שלך?",
      sub: "אין תשובה נכונה — זה רק עוזר לנו להתאים לך מסרים.",
      options: EXPERIENCE,
      value: experience,
      set: (v: string) => setExperience(v as ExperienceLevel),
    },
    {
      title: "מה החולשה המרכזית שלך?",
      sub: "הכרה בחולשה היא הצעד הראשון לבנות נגדה חוקים.",
      options: WEAKNESS,
      value: weakness,
      set: (v: string) => setWeakness(v as Weakness),
    },
    {
      title: "כמה דקות ביום אתה יכול ללמוד?",
      sub: "עדיף מעט וקבוע מהרבה ולא עקבי.",
      options: STUDY,
      value: studyTime,
      set: (v: string) => setStudyTime(v as StudyTime),
    },
  ];

  const current = steps[step];
  const canNext = current.value !== null;
  const isLast = step === steps.length - 1;

  function next() {
    if (!canNext) return;
    if (isLast) {
      setOnboarding({
        experience: experience!,
        weakness: weakness!,
        studyTime: studyTime!,
        completedAt: new Date().toISOString(),
      });
      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-50 p-4 dark:from-[#0b1020] dark:to-[#10162b]">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <Link href="/" className="text-sm text-muted hover:underline">
            ← חזרה לדף הבית
          </Link>
          <h1 className="mt-3 text-2xl font-extrabold">בוא נכיר אותך</h1>
          <p className="mt-1 text-sm text-muted">
            3 שאלות קצרות כדי להתאים לך את הלמידה. הכל נשמר רק במכשיר שלך.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-brand-600" : "track"
              }`}
            />
          ))}
        </div>

        <div className="card animate-fade-in p-6">
          <h2 className="text-lg font-bold">{current.title}</h2>
          <p className="mt-1 text-sm text-muted">{current.sub}</p>

          <div className="mt-5 grid gap-2.5">
            {current.options.map((opt) => {
              const selected = current.value === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => current.set(opt.value)}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-right text-sm font-medium transition no-tap-highlight ${
                    selected
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "surface-2 hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="flex-1">{opt.label}</span>
                  {selected && (
                    <Icons.check className="h-5 w-5 text-brand-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-ghost"
            >
              חזור
            </button>
            <button onClick={next} disabled={!canNext} className="btn-primary">
              {isLast ? "סיום והתחלה" : "המשך"}
              <Icons.arrow className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Disclaimer compact />
        </div>
      </div>
    </div>
  );
}
