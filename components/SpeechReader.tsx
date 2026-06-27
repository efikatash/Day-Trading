"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";

export interface SpeechSegment {
  label: string;
  text: string;
}

type Status = "idle" | "playing" | "paused";

// Split text into short utterance-sized chunks. Short chunks avoid the
// ~15s cutoff bug that several speech engines have on long utterances,
// and let us track reading progress per segment.
function toChunks(segments: SpeechSegment[]): { text: string; seg: number }[] {
  const chunks: { text: string; seg: number }[] = [];
  segments.forEach((s, segIndex) => {
    const raw = `${s.text}`.trim();
    if (!raw) return;
    // Split on sentence enders (Hebrew uses . ! ? too) and newlines.
    const sentences = raw
      .split(/(?<=[.!?])\s+|\n+/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.length <= 200) {
        chunks.push({ text: sentence, seg: segIndex });
      } else {
        // Further break very long sentences at word boundaries (~180 chars).
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

function pickHebrewVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  return (
    voices.find((v) => v.lang === "he-IL") ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("he")) ||
    voices.find((v) => /hebrew|עברית/i.test(v.name)) ||
    null
  );
}

export function SpeechReader({ segments }: { segments: SpeechSegment[] }) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(1);
  const [currentSeg, setCurrentSeg] = useState<number | null>(null);
  const [hasHebrewVoice, setHasHebrewVoice] = useState(true);

  const chunksRef = useRef<{ text: string; seg: number }[]>([]);
  const idxRef = useRef(0);
  const rateRef = useRef(1);
  const stoppedRef = useRef(false);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  // Feature detection + voice availability.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) setHasHebrewVoice(!!pickHebrewVoice(voices));
    };
    check();
    window.speechSynthesis.onvoiceschanged = check;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;
    const chunks = chunksRef.current;
    const i = idxRef.current;
    if (i >= chunks.length) {
      setStatus("idle");
      setCurrentSeg(null);
      idxRef.current = 0;
      return;
    }
    const { text, seg } = chunks[i];
    setCurrentSeg(seg);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = rateRef.current;
    const voice = pickHebrewVoice(window.speechSynthesis.getVoices());
    if (voice) u.voice = voice;
    u.onend = () => {
      if (stoppedRef.current) return;
      idxRef.current = i + 1;
      speakNext();
    };
    u.onerror = () => {
      if (stoppedRef.current) return;
      idxRef.current = i + 1;
      speakNext();
    };
    window.speechSynthesis.speak(u);
  }, []);

  const play = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    stoppedRef.current = false;
    chunksRef.current = toChunks(segments);
    idxRef.current = 0;
    setStatus("playing");
    speakNext();
  }, [supported, segments, speakNext]);

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
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurrentSeg(null);
    idxRef.current = 0;
  }, [supported]);

  const changeRate = useCallback(
    (r: number) => {
      setRate(r);
      rateRef.current = r;
      // Apply immediately by re-speaking from the current chunk.
      if (status === "playing") {
        window.speechSynthesis.cancel();
        speakNext();
      }
    },
    [status, speakNext]
  );

  // Cleanup: stop speech when leaving the lesson.
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
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
          {[0.75, 1, 1.25, 1.5].map((r) => (
            <button
              key={r}
              onClick={() => changeRate(r)}
              className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                rate === r
                  ? "bg-brand-600 text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {r}×
            </button>
          ))}
        </div>
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

      {!hasHebrewVoice && (
        <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
          💡 לא נמצא קול עברי במכשיר — ההקראה תשתמש בקול ברירת המחדל. אפשר להוסיף
          קול עברי בהגדרות המערכת (נגישות / דיבור) לאיכות טובה יותר.
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
