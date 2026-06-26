"use client";

import { useMemo, useState } from "react";
import { useProgress } from "@/lib/progress";
import { getJournalStats } from "@/lib/selectors";
import type { Trade } from "@/lib/app-types";
import { emptyTrade } from "@/lib/trade-utils";
import { TradeForm } from "@/components/TradeForm";
import { StatCard, EmptyState, Badge, Disclaimer, WarningBox } from "@/components/ui";
import { Icons } from "@/components/icons";

type Filter = "all" | "win" | "loss";

export default function JournalPage() {
  const { state, addTrade, updateTrade, deleteTrade } = useProgress();
  const [editing, setEditing] = useState<Trade | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [setupFilter, setSetupFilter] = useState<string>("all");

  const stats = getJournalStats(state);

  const setups = useMemo(
    () => Array.from(new Set(state.journal.map((t) => t.setup).filter(Boolean))),
    [state.journal]
  );

  const filtered = state.journal.filter((t) => {
    if (setupFilter !== "all" && t.setup !== setupFilter) return false;
    if (filter === "win") return (t.resultR ?? 0) > 0;
    if (filter === "loss") return (t.resultR ?? 0) < 0;
    return true;
  });

  function openNew() {
    setEditing(emptyTrade());
    setShowForm(true);
  }
  function openEdit(t: Trade) {
    setEditing(t);
    setShowForm(true);
  }
  function save(t: Trade) {
    if (state.journal.some((x) => x.id === t.id)) updateTrade(t);
    else addTrade(t);
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">יומן מסחר 📓</h1>
          <p className="mt-1 text-sm text-muted">
            יומן מסחר הוא לא רשות. בלי תיעוד אין למידה אמיתית. תעד כל עסקה — כולל
            הרגש והטעות.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary shrink-0">
          + עסקה חדשה
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <StatCard label="עסקאות" value={stats.count} emoji="📊" />
        <StatCard label="Win Rate" value={stats.winRate !== null ? `${stats.winRate}%` : "—"} emoji="🎯" />
        <StatCard label="ממוצע R" value={stats.avgR !== null ? `${stats.avgR}R` : "—"} emoji="📈" />
        <StatCard label="סה״כ R" value={`${stats.totalR}R`} emoji="➕" />
        <StatCard label="רווח גדול" value={stats.biggestWin !== null ? `${stats.biggestWin}R` : "—"} emoji="🟢" />
        <StatCard label="הפסד גדול" value={stats.biggestLoss !== null ? `${stats.biggestLoss}R` : "—"} emoji="🔴" />
        <StatCard label="טעות נפוצה" value={<span className="text-sm">{stats.mostCommonMistake ?? "—"}</span>} emoji="⚠️" />
      </div>

      {stats.mostCommonMistake && (
        <WarningBox title="הטעות החוזרת שלך" tone="warning">
          הטעות שחוזרת הכי הרבה ביומן שלך היא: "{stats.mostCommonMistake}". זה
          המקום הכי משתלם להשתפר בו. הפוך אותה לחוק בתוכנית המסחר שלך.
        </WarningBox>
      )}

      {/* Filters */}
      {state.journal.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">סינון:</span>
          {([["all", "הכל"], ["win", "מנצחות"], ["loss", "מפסידות"]] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn text-xs ${filter === f ? "btn-primary" : "btn-secondary"}`}
            >
              {label}
            </button>
          ))}
          {setups.length > 0 && (
            <select
              value={setupFilter}
              onChange={(e) => setSetupFilter(e.target.value)}
              className="input max-w-[180px] py-1.5 text-xs"
            >
              <option value="all">כל ה-Setups</option>
              {setups.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* List */}
      {state.journal.length === 0 ? (
        <EmptyState
          emoji="📓"
          title="עוד אין עסקאות ביומן"
          description="התחל לתעד עסקאות דמו (Paper Trading). תזדקק ל-20 עסקאות מתועדות לפרויקט הגמר."
          action={<button onClick={openNew} className="btn-primary">הוסף עסקה ראשונה</button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="אין עסקאות שמתאימות לסינון" />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const r = t.resultR;
            const tone = r === null ? "neutral" : r > 0 ? "success" : r < 0 ? "danger" : "neutral";
            return (
              <div key={t.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{t.market || "—"}</span>
                      {t.setup && <Badge tone="info">{t.setup}</Badge>}
                      <Badge tone={t.direction === "long" ? "success" : "danger"}>
                        {t.direction === "long" ? "Long" : "Short"}
                      </Badge>
                      <span className="text-xs text-muted">{t.date}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-soft">
                      {t.entry !== null && <span>כניסה: {t.entry}</span>}
                      {t.stop !== null && <span>Stop: {t.stop}</span>}
                      {t.target !== null && <span>יעד: {t.target}</span>}
                      {t.exit !== null && <span>יציאה: {t.exit}</span>}
                      {t.positionSize !== null && <span>כמות: {t.positionSize}</span>}
                    </div>
                    {(t.mistake || t.lessonLearned) && (
                      <div className="mt-2 space-y-1 text-xs">
                        {t.mistake && <p className="text-rose-600">טעות: {t.mistake}</p>}
                        {t.lessonLearned && <p className="text-muted">לקח: {t.lessonLearned}</p>}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone={tone}>
                      {r !== null ? `${r > 0 ? "+" : ""}${r}R` : "פתוחה"}
                    </Badge>
                    {t.pnl !== null && (
                      <span className={`text-sm font-bold ${t.pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.pnl >= 0 ? "+" : ""}{t.pnl} ₪
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                  <button onClick={() => openEdit(t)} className="btn-ghost text-xs">ערוך</button>
                  <button
                    onClick={() => {
                      if (confirm("למחוק את העסקה הזו?")) deleteTrade(t.id);
                    }}
                    className="btn-ghost text-xs text-rose-600"
                  >
                    מחק
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Disclaimer compact />

      {showForm && editing && (
        <TradeForm
          initial={editing}
          onSave={save}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
