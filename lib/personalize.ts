import type { OnboardingAnswers, Weakness } from "@/lib/app-types";

const WEAKNESS_MSG: Record<Weakness, string> = {
  impatience:
    "ציינת שחוסר סבלנות הוא אתגר. זכור: השוק נפתח כל יום מחדש — אין עסקה שאתה חייב לתפוס.",
  "fear-loss":
    "ציינת פחד מהפסד. הדרך להקטין אותו היא לדעת מראש בדיוק כמה אתה מסכן בכל עסקה.",
  fomo: "ציינת FOMO. הכלי הכי חזק נגדו הוא תוכנית כתובה — אם זה לא ב-Setup שלך, זה לא קיים.",
  "no-plan":
    "ציינת כניסה בלי תוכנית. המודולים על ניהול סיכון ובניית תוכנית נבנו בדיוק בשבילך.",
  revenge:
    "ציינת מסחר נקמה. החוק שיגן עליך: הפסדת את ההפסד היומי המרבי — סוגרים את הפלטפורמה.",
  unknown:
    "עוד לא בטוח מה החולשה שלך? מצוין — היומן הרגשי בקורס יעזור לך לגלות אותה.",
};

const EXPERIENCE_MSG: Record<string, string> = {
  none: "מתחיל מאפס זה יתרון — אין הרגלים רעים לתקן. נתקדם צעד אחר צעד.",
  "seen-charts": "כבר ראית גרפים — נהפוך את ההיכרות הזו לקריאה שיטתית עם חוקים.",
  "traded-lost":
    "הפסדת בעבר? זה הזמן לבנות תהליך מסודר במקום לאלתר. ניהול סיכון הוא הלב.",
  "traded-want-structure":
    "רוצה סדר ומסגרת — בדיוק מה שהקורס נותן: שיטה, חוקים ומדידה.",
};

export function getPersonalGreeting(onboarding: OnboardingAnswers | null): {
  title: string;
  message: string;
} {
  if (!onboarding) {
    return {
      title: "ברוך הבא 👋",
      message: "בוא נתחיל לבנות בסיס איתן למסחר ממושמע.",
    };
  }
  return {
    title: "טוב שחזרת 👋",
    message:
      WEAKNESS_MSG[onboarding.weakness] ??
      EXPERIENCE_MSG[onboarding.experience] ??
      "נמשיך לבנות את התהליך שלך, שיעור אחר שיעור.",
  };
}

export function getStudyTimeLabel(t: string): string {
  switch (t) {
    case "15":
      return "15 דקות ביום";
    case "30":
      return "30 דקות ביום";
    case "45":
      return "45 דקות ביום";
    case "60":
      return "שעה ומעלה ביום";
    default:
      return "";
  }
}
