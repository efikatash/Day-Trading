"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/lib/progress";

export interface SpeechSegment {
  label: string;
  text: string;
}

type Status = "idle" | "playing" | "paused";

// Split text into short utterance-sized chunks. Short chunks avoid the
// ~15s cutoff bug some engines have on long utterances, and let us track
// reading progress per segment.
function toChunks(segments: SpeechSegment[]): { text: string; seg: number }[] {
  const chunks: { text: string; seg: number }[] = [];
  segments.forEach((s, segIndex) => {
    const raw = `${s.text}`.trim();
    if (!raw) return;
    const sentences = raw
      .split(/(?<=[.!?])\s+|\n+/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.length <= 200) {
        chunks.push({ text: sentence, seg: segIndex });
      } else {
        let buf = "";
        for (const word of sentence.split(/\s+/)) {
          if ((buf + " " + word).trim().length > 180) {
            if (buf) chunks.push({ text: buf.trim(), seg: segIndex });
            buf = word;
          } else {
            buf = `${buf} ${word}`.trim();
          }
        }
        if (buf) chunks.push({ text: buf.trim(), seg: segIndex });
      }
    }
  });
  return chunks;
}

// Rank a voice for naturalness — higher is better.
function voiceScore(v: SpeechSynthesisVoice): number {
  const n = `${v.name} ${v.voiceURI}`.toLowerCase();
  let s = 0;
  if (/neural|natural/.test(n)) s += 6;
  if (/enhanced|premium|siri/.test(n)) s += 5;
  if (/google/.test(n)) s += 4;
  if (/carmit/.test(n)) s += 3; // Apple's Hebrew voice
  if (v.localService === false) s += 1; // online voices are often nicer
  return s;
}

function bestHebrewVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const heb = voices.filter((v) => v.lang?.toLowerCase().startsWith("he"));
  if (!heb.length) return null;
  return [...heb].sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}

export function SpeechReader({ segments }: { segments: SpeechSegment[] }) {
  const { getToolState, setToolState } = useProgress();
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(1);
  const [currentSeg, setCurrentSeg] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedURI, setSelectedURI] = useState<string>("");
  const [showTip, setShowTip] = useState(false);

  const chunksRef = useRef<{ text: string; seg: number }[]>([]);
  const idxRef = useRef(0);
  const rateRef = useRef(1);
  const seqRef = useRef(0); // generation token — invalidates stale chains
  const selectedURIRef = useRef("");

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    selectedURIRef.current = selectedURI;
  }, [selectedURI]);

  const hebVoices = useMemo(
    () => voices.filter((v) => v.lang?.toLowerCase().startsWith("he")),
    [voices]
  );

  // Feature detection + load voices (async on most browsers).
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setVoices(list);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Pick a default voice once voices are known (respect saved preference).
  useEffect(() => {
    if (!voices.length || selectedURI) return;
    const saved = getToolState<string>("ttsVoice", "");
    const savedExists = saved && voices.some((v) => v.voiceURI === saved);
    const best = bestHebrewVoice(voices);
    const initial = savedExists ? saved : best?.voiceURI ?? "";
    if (initial) setSelectedURI(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voices]);

  function resolveVoice(): SpeechSynthesisVoice | null {
    const uri = selectedURIRef.current;
    return (
      voices.find((v) => v.voiceURI === uri) ||
      bestHebrewVoice(voices) ||
      null
    );
  }

  const speakFrom = useCallback(
    (startIdx: number, gen: number) => {
      if (gen !== seqRef.current) return; // stale chain — ignore
      const chunks = chunksRef.current;
      if (startIdx >= chunks.length) {
        setStatus("idle");
        setCurrentSeg(null);
        idxRef.current = 0;
        return;
      }
      idxRef.current = startIdx;
      const { text, seg } = chunks[startIdx];
      setCurrentSeg(seg);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "he-IL";
      u.rate = rateRef.current;
      u.pitch = 1;
      const v = resolveVoice();
      if (v) u.voice = v;
      u.onend = () => {
        if (gen !== seqRef.current) return;
        speakFrom(startIdx + 1, gen);
      };
      u.onerror = () => {
        if (gen !== seqRef.current) return;
        speakFrom(startIdx + 1, gen);
      };
      window.speechSynthesis.speak(u);
    },
    // resolveVoice reads from refs/voices; voices captured below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voices]
  );

  const play = useCallback(() => {
    if (!supported) return;
    const ss = window.speechSynthesis;
    const gen = ++seqRef.current; // invalidate any previous chain first
    // Only cancel if something is actually queued/speaking — calling cancel()
    // right before speak() on an idle engine can itself trigger a double-read
    // bug in some Chrome builds.
    if (ss.speaking || ss.pending) ss.cancel();
    chunksRef.current = toChunks(segments);
    idxRef.current = 0;
    setStatus("playing");
    speakFrom(0, gen);
  }, [supported, segments, speakFrom]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus("playing");
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    seqRef.current++; // invalidate chain
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurrentSeg(null);
    idxRef.current = 0;
  }, [supported]);

  const changeRate = useCallback(
    (r: number) => {
      setRate(r);
      rateRef.current = r;
      if (status === "playing") {
        const gen = ++seqRef.current; // invalidate, then re-speak current chunk
        const ss = window.speechSynthesis;
        if (ss.speaking || ss.pending) ss.cancel();
        speakFrom(idxRef.current, gen);
      }
    },
    [status, speakFrom]
  );

  function pickVoice(uri: string) {
    setSelectedURI(uri);
    selectedURIRef.current = uri;
    setToolState("ttsVoice", uri);
    if (status === "playing") {
      const gen = ++seqRef.current;
      const ss = window.speechSynthesis;
      if (ss.speaking || ss.pending) ss.cancel();
      speakFrom(idxRef.current, gen);
    }
  }

  // Stop speech when leaving the lesson / unmounting.
  useEffect(() => {
    const seq = seqRef;
    return () => {
      seq.current++;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber-300/50 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        🔇 הדפדפן הזה לא תומך בהקראה קולית. נסה דפדפן עדכני (Chrome, Safari, Edge).
      </div>
    );
  }

  const playing = status === "playing";
  const paused = status === "paused";

  return (
    <div className="rounded-2xl border surface-2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <span aria-hidden>🔊</span> הקראה קולית
        </div>

        <div className="mx-1 h-5 w-px bg-current opacity-10" />

        {status === "idle" ? (
          <button onClick={play} className="btn-primary py-1.5 text-sm" aria-label="הקרא את השיעור">
            <PlayIcon /> הקרא את השיעור
          </button>
        ) : (
          <>
            {playing ? (
              <button onClick={pause} className="btn-secondary py-1.5 text-sm" aria-label="השהה">
                <PauseIcon /> השהה
              </button>
            ) : (
              <button onClick={resume} className="btn-primary py-1.5 text-sm" aria-label="המשך">
                <PlayIcon /> המשך
              </button>
            )}
            <button onClick={stop} className="btn-ghost py-1.5 text-sm" aria-label="עצור">
              <StopIcon /> עצור
            </button>
          </>
        )}

        {/* Speed */}
        <div className="ms-auto flex items-center gap-1">
          <span className="text-xs text-muted">מהירות</span>
          {[0.85, 1, 1.15, 1.3].map((r) => (
            <button
              key={r}
              onClick={() => changeRate(r)}
              className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                rate === r ? "bg-brand-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {r}×
            </button>
          ))}
        </div>
      </div>

      {/* Voice selection */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">קול</span>
        {hebVoices.length > 0 ? (
          <select
            value={selectedURI}
            onChange={(e) => pickVoice(e.target.value)}
            className="input max-w-[240px] py-1.5 text-xs"
          >
            {hebVoices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
                {v.localService === false ? " (אונליין)" : ""}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            לא נמצא קול עברי במכשיר — תישמע ברירת המחדל.
          </span>
        )}
        <button
          onClick={() => setShowTip((s) => !s)}
          className="text-xs text-brand-600 hover:underline"
        >
          איך לשפר את הקול?
        </button>
      </div>

      {(playing || paused) && currentSeg !== null && segments[currentSeg] && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            {playing && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
          </span>
          קורא כעת: {segments[currentSeg].label}
        </div>
      )}

      {showTip && (
        <div className="mt-2 rounded-xl border surface p-3 text-xs leading-relaxed text-soft">
          <p className="mb-1 font-bold">לשמיעת קול עברי טבעי יותר (פעם אחת):</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <b>אייפון / אייפד:</b> הגדרות → נגישות → תוכן מדובר → קולות → עברית →
              בחר קול והורד גרסה משופרת (Enhanced). אחר כך בחר אותו כאן ברשימה.
            </li>
            <li>
              <b>אנדרואיד:</b> הגדרות → נגישות → פלט טקסט לדיבור → התקן/בחר את מנוע
              Google והורד עברית.
            </li>
            <li>
              <b>מחשב (Chrome):</b> קולות בשם "Google" או "Natural" נשמעים הכי טוב.
              אם אין — אפשר להוסיף שפת עברית בהגדרות מערכת ההפעלה.
            </li>
          </ul>
          <p className="mt-1 text-muted">
            ה-API של הדפדפן מנגן קולות מותקנים בלבד (בלי שירות חיצוני בתשלום), לכן
            איכות הקול תלויה במכשיר.
          </p>
        </div>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
