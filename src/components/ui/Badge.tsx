import { statusColorMap } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { titleCase } from "@/lib/formatters";

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusColorMap[value] || "bg-slate-100 text-slate-700 ring-slate-200", className)}>
      {titleCase(value)}
    </span>
  );
}
