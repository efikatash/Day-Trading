import { modules } from "@/lib/data/modules";
import { getLessonsForModule } from "@/lib/data/lessons";
import LessonClient from "./LessonClient";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { moduleId: string; lessonId: string }[] = [];
  for (const m of modules) {
    for (const lesson of getLessonsForModule(m.id)) {
      params.push({ moduleId: m.id, lessonId: lesson.id });
    }
  }
  return params;
}

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  return <LessonClient params={params} />;
}
