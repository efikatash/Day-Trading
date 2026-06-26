import type { Lesson, Quiz } from "@/lib/types";
import { module1Lessons, module1Quiz } from "./lessons/module1";
import { module2Lessons, module2Quiz } from "./lessons/module2";
import { module3Lessons, module3Quiz } from "./lessons/module3";
import { module4Lessons, module4Quiz } from "./lessons/module4";
import { module5Lessons, module5Quiz } from "./lessons/module5";
import { module6Lessons, module6Quiz } from "./lessons/module6";
import { module7Lessons, module7Quiz } from "./lessons/module7";
import { module8Lessons, module8Quiz } from "./lessons/module8";
import { module9Lessons, module9Quiz } from "./lessons/module9";
import { module10Lessons, module10Quiz } from "./lessons/module10";

export const allLessons: Lesson[] = [
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons,
  ...module6Lessons,
  ...module7Lessons,
  ...module8Lessons,
  ...module9Lessons,
  ...module10Lessons,
];

export const allQuizzes: Quiz[] = [
  module1Quiz,
  module2Quiz,
  module3Quiz,
  module4Quiz,
  module5Quiz,
  module6Quiz,
  module7Quiz,
  module8Quiz,
  module9Quiz,
  module10Quiz,
];

const lessonsById = new Map(allLessons.map((l) => [l.id, l]));
const quizzesById = new Map(allQuizzes.map((q) => [q.id, q]));

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id);
}

export function getQuiz(id: string): Quiz | undefined {
  return quizzesById.get(id);
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  return allLessons
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

export const totalLessons = allLessons.length;
