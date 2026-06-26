"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { useProgress } from "@/lib/progress";
import { getOverallProgress } from "@/lib/selectors";

const NAV = [
  { href: "/dashboard", label: "לוח בקרה", icon: Icons.dashboard },
  { href: "/course", label: "הקורס", icon: Icons.book },
  { href: "/tools", label: "מחשבון הסוחר", icon: Icons.calculator },
  { href: "/journal", label: "יומן מסחר", icon: Icons.journal },
  { href: "/plan", label: "תוכנית מסחר", icon: Icons.plan },
  { href: "/glossary", label: "מילון מונחים", icon: Icons.glossary },
  { href: "/final-project", label: "פרויקט גמר", icon: Icons.trophy },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition no-tap-highlight ${
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-soft hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg shadow-sm">
        📈
      </div>
      <div className="leading-tight">
        <div className="text-sm font-extrabold">מסחר יומי למתחילים</div>
        <div className="text-[10px] text-muted">מ־0 לתוכנית ממושמעת</div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { state, toggleTheme } = useProgress();
  const dark = state.theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      className="btn-ghost rounded-xl p-2"
      aria-label="החלף מצב תצוגה"
      title={dark ? "מצב בהיר" : "מצב כהה"}
    >
      {dark ? <Icons.sun /> : <Icons.moon />}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, ready } = useProgress();
  const router = useRouter();
  const overall = getOverallProgress(state);

  // If onboarding not done, gently route to onboarding from dashboard entry.
  // (Handled per-page; shell just renders.)

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 flex-col border-l p-4 lg:flex surface">
        <div className="px-1 pb-4">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="mt-4 rounded-xl border p-3 surface-2">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold">התקדמות כללית</span>
            <span className="text-muted">{ready ? overall.overallPercent : 0}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full track">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${ready ? overall.overallPercent : 0}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-muted">
            {overall.completedLessons}/{overall.totalLessons} שיעורים הושלמו
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden surface">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-ghost rounded-xl p-2"
          aria-label="פתח תפריט"
        >
          <Icons.menu />
        </button>
        <Brand />
        <ThemeToggle />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] animate-fade-in p-4 surface">
            <div className="mb-4 flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-ghost rounded-xl p-2"
                aria-label="סגור תפריט"
              >
                <Icons.close />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop top-right controls */}
      <div className="fixed left-4 top-4 z-20 hidden lg:block">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="lg:mr-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
