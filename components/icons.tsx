import React from "react";

type IconProps = { className?: string };

const base = "h-5 w-5";

export const Icons = {
  dashboard: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" fill="currentColor" />
    </svg>
  ),
  book: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M19 17H6a2 2 0 0 0-2 2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  calculator: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 7h8M8 11h0M12 11h0M16 11h0M8 15h0M12 15h0M16 15v3M8 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  journal: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M6 3h10l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  plan: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 3v3M15 3v3M8.5 11l1.2 1.2L12 10M8.5 16l1.2 1.2L12 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  glossary: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M5 5a2 2 0 0 1 2-2h12v18H7a2 2 0 0 0-2 2V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  trophy: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 20h6M12 13v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  sun: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  moon: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  menu: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  close: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  check: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  arrow: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowRight: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
