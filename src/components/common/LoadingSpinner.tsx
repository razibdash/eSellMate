import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return <span className={cn("inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950", className)} />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-80 items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}
