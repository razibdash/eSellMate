import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, MessageCircle, PackageCheck, Receipt, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { PublicShell } from "./PublicShell";

const features = [
  { icon: PackageCheck, title: "Product & stock", text: "Track products, categories, low stock and movement history." },
  { icon: Receipt, title: "Order & invoice", text: "Create orders, update status and preview printable invoices." },
  { icon: MessageCircle, title: "WhatsApp flow", text: "Copy templates and open WhatsApp with pre-filled messages." },
  { icon: Sparkles, title: "AI seller tools", text: "Generate captions, replies and business insights fast." }
];

export function HomePage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              <Bot className="h-4 w-4" /> AI-powered SaaS for Facebook & WhatsApp sellers
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">Order হারাবে না, customer miss হবে না.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{siteConfig.description} Built for Bangladeshi small sellers who sell through Facebook, WhatsApp, Instagram and phone calls.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login"><Button className="px-6 py-3">Open dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/features"><Button variant="outline" className="px-6 py-3">See features</Button></Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["No lost orders", "Smart invoices", "AI captions"].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item}</div>)}
            </div>
          </div>
          <Card className="relative overflow-hidden p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-200 blur-3xl" />
            <div className="relative rounded-3xl bg-slate-950 p-5 text-white shadow-glow">
              <div className="flex items-center justify-between"><p className="font-bold">ShopBot BD</p><span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">Live API</span></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Today sales</p><p className="mt-2 text-2xl font-black">৳12,640</p></div>
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Orders</p><p className="mt-2 text-2xl font-black">58</p></div>
              </div>
              <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900">
                <div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-brand-600" /><p className="font-semibold">Garlic Pickle is trending this week.</p></div>
                <p className="mt-2 text-sm text-slate-500">AI predicts stock may finish within 3 days.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => <Card key={feature.title}><feature.icon className="h-7 w-7 text-brand-600" /><h3 className="mt-5 font-bold text-slate-950">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p></Card>)}
      </section>
    </PublicShell>
  );
}
