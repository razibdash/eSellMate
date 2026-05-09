"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import { useGetPlansQuery } from "@/store/api/settingsApi";
import { PublicShell } from "./PublicShell";

export function PricingPage() {
  const { data = [] } = useGetPlansQuery();
  return (
    <PublicShell>
      <main className="page-container py-14">
        <PageHeader title="Simple pricing for growing sellers" description="Start free, upgrade when your orders, products, staff and AI needs grow." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.map((plan) => (
            <Card key={plan.id} className={plan.slug === "pro" ? "border-brand-200 bg-brand-50/80" : ""}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
                {plan.slug === "pro" ? <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">Popular</span> : null}
              </div>
              <p className="mt-4 text-3xl font-black text-slate-950">{formatCurrency(plan.price_monthly)}</p>
              <p className="mt-1 text-sm text-slate-500">per month</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => <p key={feature} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{feature}</p>)}
              </div>
              <Link href="/register"><Button className="mt-7 w-full" variant={plan.slug === "pro" ? "primary" : "outline"}>Choose plan</Button></Link>
            </Card>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
