import type { QuizQuestion } from "@/lib/types";

// Deterministic option ordering for multiple-choice questions.
//
// The authored content clusters the correct answer at the same position
// (mostly ב'/index 1). To remove that tell, we place the correct answer at a
// position derived from a hash of the question id, so the correct position is
// spread uniformly across options — yet stays STABLE for a given question
// (important so the answer/feedback mapping never shifts between renders).

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  if (
    q.type !== "mc" ||
    !q.options ||
    q.options.length < 2 ||
    q.correctIndex == null
  ) {
    return q;
  }
  const n = q.options.length;
  const correct = q.options[q.correctIndex];
  const distractors = q.options.filter((_, i) => i !== q.correctIndex);

  // Deterministically reorder the distractors.
  const rand = mulberry32(hashString(q.id));
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  // Uniformly spread the correct answer's position across options.
  const target = hashString(q.id + "#pos") % n;
  const options: string[] = [];
  let d = 0;
  for (let i = 0; i < n; i++) {
    options.push(i === target ? correct : distractors[d++]);
  }
  return { ...q, options, correctIndex: target };
}

export function prepareQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map(shuffleQuestionOptions);
}
