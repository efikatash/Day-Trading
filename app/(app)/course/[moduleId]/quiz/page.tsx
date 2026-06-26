import { modules } from "@/lib/data/modules";
import QuizClient from "./QuizClient";

export const dynamicParams = false;

export function generateStaticParams() {
  // Modules 1-9 have a lesson quiz page; module 10 quiz lives in the final project.
  return modules
    .filter((m) => m.order <= 9)
    .map((m) => ({ moduleId: m.id }));
}

export default function ModuleQuizPage({
  params,
}: {
  params: { moduleId: string };
}) {
  return <QuizClient params={params} />;
}
