import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function MetricCard({ title, value, hint, icon: Icon }: { title: string; value: string | number; hint?: string; icon: LucideIcon }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand-100 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          {hint ? <p className="mt-2 text-xs font-medium text-emerald-600">{hint}</p> : null}
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
