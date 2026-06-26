"use client";

import React from "react";

export function ProgressBar({
  value,
  className = "",
  showLabel = false,
  color = "brand",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  color?: "brand" | "accent";
}) {
  const v = Math.max(0, Math.min(100, value));
  const bar = color === "accent" ? "bg-accent-500" : "bg-brand-600";
  return (
    <div className={className}>
      <div className="h-2.5 w-full overflow-hidden rounded-full track">
        <div
          className={`h-full rounded-full ${bar} transition-all duration-500`}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-muted">{v}% הושלם</div>
      )}
    </div>
  );
}

export function Ring({
  value,
  size = 84,
  stroke = 9,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-black/10 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-brand-600 transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{v}%</span>
        {label && <span className="text-[10px] text-muted">{label}</span>}
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    brand:
      "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  };
  return <span className={`chip ${tones[tone]} ${className}`}>{children}</span>;
}

export function WarningBox({
  title = "אזהרת סיכון",
  children,
  tone = "danger",
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "danger" | "warning" | "info";
}) {
  const styles: Record<string, string> = {
    danger:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    warning:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    info: "border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100",
  };
  const icon = tone === "info" ? "ℹ️" : "⚠️";
  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <div className="mb-1 flex items-center gap-2 font-bold">
        <span aria-hidden>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function InfoBox({
  title,
  children,
  emoji,
  tone = "neutral",
}: {
  title: string;
  children: React.ReactNode;
  emoji?: string;
  tone?: "neutral" | "rule" | "mistake" | "example" | "objective";
}) {
  const styles: Record<string, string> = {
    neutral: "surface-2 border",
    rule: "border-brand-300/60 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10",
    mistake:
      "border-rose-300/50 bg-rose-50/70 dark:border-rose-500/25 dark:bg-rose-500/10",
    example:
      "border-emerald-300/50 bg-emerald-50/70 dark:border-emerald-500/25 dark:bg-emerald-500/10",
    objective:
      "border-violet-300/50 bg-violet-50/70 dark:border-violet-500/25 dark:bg-violet-500/10",
  };
  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
        {emoji && <span aria-hidden>{emoji}</span>}
        <span>{title}</span>
      </div>
      <div className="text-sm leading-relaxed text-soft">{children}</div>
    </div>
  );
}

export function EmptyState({
  emoji = "📭",
  title,
  description,
  action,
}: {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center surface-2">
      <div className="mb-3 text-4xl" aria-hidden>
        {emoji}
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  emoji,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  emoji?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {emoji && <span aria-hidden>{emoji}</span>}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{children}</h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-muted">
        ⚠️ התוכן באפליקציה הוא לחינוך בלבד ואינו מהווה ייעוץ השקעות, המלצה לקנייה
        או מכירה, או הבטחה לרווח. מסחר יומי כרוך בסיכון גבוה ורוב המתחילים מפסידים
        כסף ללא משמעת וניהול סיכונים.
      </p>
    );
  }
  return (
    <WarningBox title="הבהרה חשובה" tone="warning">
      האפליקציה הזו נועדה ללימוד עצמי בלבד. אין כאן ייעוץ השקעות אישי, איתותי
      מסחר, או המלצה מה לקנות או למכור. מסחר יומי הוא פעילות בסיכון גבוה. רוב
      המתחילים מפסידים כסף, במיוחד בלי תוכנית, ניהול סיכונים ומשמעת. לעולם אל
      תסכן כסף שאתה לא יכול להרשות לעצמך להפסיד, והשתמש במינוף בזהירות רבה — או
      בכלל לא בתחילת הדרך.
    </WarningBox>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
    </div>
  );
}
