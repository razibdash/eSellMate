import Link from "next/link";
import { Bot } from "lucide-react";
import { siteConfig } from "@/config/site";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-glow"><Bot className="h-6 w-6" /></div>
          <div>
            <p className="font-bold text-slate-950">{siteConfig.name}</p>
            <p className="text-xs text-slate-500">Smart Order Manager</p>
          </div>
        </Link>
        <section className="glass-card p-7">
          <h1 className="text-2xl font-black text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
