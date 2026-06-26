import type { Module } from "@/lib/types";

// Module metadata. Lesson content lives in lib/data/lessons/moduleN.ts
// and is aggregated in lib/data/lessons.ts.

export const modules: Module[] = [
  {
    id: "m1",
    order: 1,
    title: "האמת על מסחר יומי",
    subtitle: "ציפיות ריאליות ושבירת מיתוסים",
    goal: "לשבור מיתוסים, להבין מה מסחר יומי באמת, ולמה רוב המתחילים מפסידים.",
    icon: "🎯",
    accent: "from-rose-500 to-orange-500",
    lessonIds: ["m1l1", "m1l2", "m1l3", "m1l4"],
    quizId: "m1q",
  },
  {
    id: "m2",
    order: 2,
    title: "יסודות השוק",
    subtitle: "מה סוחרים ואיך השוק עובד",
    goal: "להבין מה באמת קונים ומוכרים, מהו ספרד, נזילות, ואיך פקודות עובדות.",
    icon: "📊",
    accent: "from-sky-500 to-blue-600",
    lessonIds: ["m2l1", "m2l2", "m2l3", "m2l4", "m2l5", "m2l6"],
    quizId: "m2q",
  },
  {
    id: "m3",
    order: 3,
    title: "קריאת גרף למתחילים",
    subtitle: "נרות, מגמות, תמיכה והתנגדות",
    goal: "ללמוד לקרוא נרות יפניים, לזהות מגמה, ולסמן תמיכה והתנגדות.",
    icon: "🕯️",
    accent: "from-violet-500 to-purple-600",
    lessonIds: ["m3l1", "m3l2", "m3l3", "m3l4", "m3l5", "m3l6", "m3l7", "m3l8"],
    quizId: "m3q",
  },
  {
    id: "m4",
    order: 4,
    title: "ניהול סיכונים - הלב של הקורס",
    subtitle: "הגנה על ההון לפני רווחים",
    goal: "לשלוט בגודל פוזיציה, סטופ, יחס סיכון/סיכוי והפסד יומי מקסימלי.",
    icon: "🛡️",
    accent: "from-emerald-500 to-green-600",
    lessonIds: ["m4l1", "m4l2", "m4l3", "m4l4", "m4l5", "m4l6", "m4l7", "m4l8", "m4l9"],
    quizId: "m4q",
  },
  {
    id: "m5",
    order: 5,
    title: "פסיכולוגיית מסחר",
    subtitle: "משמעת, רגשות ושליטה עצמית",
    goal: "לזהות ולנהל FOMO, מסחר נקמה, אוברטריידינג ולבנות משמעת אישית.",
    icon: "🧠",
    accent: "from-amber-500 to-yellow-500",
    lessonIds: ["m5l1", "m5l2", "m5l3", "m5l4", "m5l5", "m5l6", "m5l7"],
    quizId: "m5q",
  },
  {
    id: "m6",
    order: 6,
    title: "אסטרטגיות בסיסיות למתחילים",
    subtitle: "Setups פשוטים ואמינים",
    goal: "להכיר Setups בסיסיים ולהבדיל בין הזדמנות אמיתית לרעש.",
    icon: "♟️",
    accent: "from-cyan-500 to-teal-600",
    lessonIds: ["m6l1", "m6l2", "m6l3", "m6l4", "m6l5", "m6l6", "m6l7"],
    quizId: "m6q",
  },
  {
    id: "m7",
    order: 7,
    title: "בניית תוכנית מסחר",
    subtitle: "החוקים שמגנים עליך מעצמך",
    goal: "לבנות תוכנית מסחר כתובה עם חוקי כניסה, יציאה, סיכון ועצירה.",
    icon: "📋",
    accent: "from-indigo-500 to-blue-700",
    lessonIds: ["m7l1", "m7l2", "m7l3", "m7l4", "m7l5", "m7l6", "m7l7", "m7l8"],
    quizId: "m7q",
  },
  {
    id: "m8",
    order: 8,
    title: "Backtesting ו-Paper Trading",
    subtitle: "לבדוק לפני שמסכנים כסף",
    goal: "ללמוד למדוד Setup היסטורית, להבין Expectancy ולתרגל ב-Paper Trading.",
    icon: "🧪",
    accent: "from-fuchsia-500 to-pink-600",
    lessonIds: ["m8l1", "m8l2", "m8l3", "m8l4", "m8l5", "m8l6", "m8l7", "m8l8"],
    quizId: "m8q",
  },
  {
    id: "m9",
    order: 9,
    title: "מעבר לכסף אמיתי בזהירות",
    subtitle: "סיכון זעיר וגדילה לפי נתונים",
    goal: "להבין איך עוברים לכסף אמיתי בצורה זהירה ומתי להפסיק לסחור.",
    icon: "🪜",
    accent: "from-slate-500 to-slate-700",
    lessonIds: ["m9l1", "m9l2", "m9l3", "m9l4", "m9l5", "m9l6"],
    quizId: "m9q",
  },
  {
    id: "m10",
    order: 10,
    title: "פרויקט גמר - תיק סוחר מתחיל",
    subtitle: "הרכבת התוכנית המלאה שלך",
    goal: "להרכיב תיק סוחר מתחיל שלם: תוכנית, יומן, 20 עסקאות דמו וניתוח טעויות.",
    icon: "🏆",
    accent: "from-yellow-500 to-amber-600",
    lessonIds: [],
    quizId: "m10q",
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getModuleByOrder(order: number): Module | undefined {
  return modules.find((m) => m.order === order);
}
