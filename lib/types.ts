// Core domain types for the day-trading course app.
// All educational content conforms to these shapes.

export type QuestionType = "mc" | "tf" | "calc";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  /** Multiple-choice options (type "mc"). */
  options?: string[];
  /** Index of the correct option (type "mc"). */
  correctIndex?: number;
  /** Correct answer for true/false (type "tf"). */
  correctBool?: boolean;
  /** Expected numeric answer (type "calc"). */
  answer?: number;
  /** Allowed absolute tolerance for calc answers. */
  tolerance?: number;
  /** Unit hint shown next to calc input, e.g. "₪". */
  unit?: string;
  /** Explanation shown after answering. */
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  passingScore: number; // percentage, e.g. 70
  questions: QuizQuestion[];
}

export type MiniExerciseType = "reflection" | "input" | "choice" | "checklist";

export interface MiniExercise {
  id: string;
  type: MiniExerciseType;
  prompt: string;
  helper?: string;
  /** For "choice": the selectable options. */
  options?: string[];
  /** For "checklist": items the student ticks. */
  items?: string[];
  placeholder?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  /** מטרת השיעור */
  objective: string;
  /** Simple explanation, one entry per paragraph. */
  explanation: string[];
  /** דוגמה מעשית */
  example: string;
  /** טעות נפוצה של מתחילים */
  commonMistake: string;
  /** חוק מפתח */
  keyRule: string;
  miniExercise: MiniExercise;
  /** סיכום השיעור — bullet points. */
  summary: string[];
  /** בדיקת הבנה — short check, 1-3 questions. */
  understandingCheck: QuizQuestion[];
}

export interface Module {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  goal: string;
  /** Emoji / icon key for the card. */
  icon: string;
  /** Accent gradient classes for the module card. */
  accent: string;
  lessonIds: string[];
  quizId: string;
}

export interface GlossaryTerm {
  term: string;
  hebrew: string;
  definition: string;
  category: "בסיס" | "סיכון" | "פסיכולוגיה" | "טכני" | "פקודות";
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ScenarioCard {
  id: string;
  title: string;
  situation: string;
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
}
