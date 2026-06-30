import { modules } from "@/lib/data/modules";
import ModuleClient from "./ModuleClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export default function ModulePage({
  params,
}: {
  params: { moduleId: string };
}) {
  return <ModuleClient moduleId={params.moduleId} />;
}
