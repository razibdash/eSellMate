import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EmptyState({ title = "No data found", message = "Try changing filters or create a new item." }: { title?: string; message?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-3xl bg-slate-100 p-4 text-slate-500">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
    </Card>
  );
}
