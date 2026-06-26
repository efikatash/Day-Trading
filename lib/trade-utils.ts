import type { Trade, TradeDirection } from "@/lib/app-types";

export function genId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/** Compute R multiple from entry/stop/exit and direction. */
export function computeR(
  entry: number | null,
  stop: number | null,
  exit: number | null,
  direction: TradeDirection
): number | null {
  if (entry === null || stop === null || exit === null) return null;
  const riskPerUnit =
    direction === "long" ? entry - stop : stop - entry;
  if (riskPerUnit <= 0) return null;
  const move = direction === "long" ? exit - entry : entry - exit;
  return Math.round((move / riskPerUnit) * 100) / 100;
}

export function computePnl(
  entry: number | null,
  exit: number | null,
  size: number | null,
  direction: TradeDirection
): number | null {
  if (entry === null || exit === null || size === null) return null;
  const move = direction === "long" ? exit - entry : entry - exit;
  return Math.round(move * size * 100) / 100;
}

export function emptyTrade(): Trade {
  return {
    id: genId(),
    date: new Date().toISOString().slice(0, 10),
    market: "",
    setup: "",
    direction: "long",
    entry: null,
    stop: null,
    target: null,
    positionSize: null,
    exit: null,
    resultR: null,
    pnl: null,
    reasonEntry: "",
    reasonExit: "",
    emotionBefore: "",
    emotionAfter: "",
    mistake: "",
    lessonLearned: "",
    createdAt: new Date().toISOString(),
  };
}
