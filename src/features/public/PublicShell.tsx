import Link from "next/link";
import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-glow"><Bot className="h-6 w-6" /></div>
            <div>
              <p className="font-bold text-slate-950">{siteConfig.name}</p>
              <p className="text-xs text-slate-500">AI Order Manager</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/demo-request">Demo</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Start free</Button></Link>
            <button className="rounded-2xl p-2 md:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
