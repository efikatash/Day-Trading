import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 text-2xl font-extrabold">הדף לא נמצא</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        ייתכן שהקישור שגוי או שהתוכן הוסר. בוא נחזור למסלול הלמידה.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard" className="btn-primary">
          ללוח הבקרה
        </Link>
        <Link href="/course" className="btn-secondary">
          למפת הקורס
        </Link>
      </div>
    </div>
  );
}
