import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-slate-950 text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-900",
  secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
};

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}
