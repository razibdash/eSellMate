"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import { useGetActiveFlashSalesQuery } from "@/store/api/flashSaleApi";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function timeLeft(endsAt: string, now: number) {
  const diff = new Date(endsAt).getTime() - now;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function FlashSaleBanner() {
  const { data: flashSales = [] } = useGetActiveFlashSalesQuery(undefined, {
    pollingInterval: 60000,
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const visibleSales = flashSales.filter((sale) => new Date(sale.ends_at).getTime() > now);

  if (!visibleSales.length) return null;

  return (
    <section className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">
        {visibleSales.map((sale) => {
          const product = sale.product;
          if (!product) return null;

          const originalPrice = Number(product.price || 0);
          const discountedPrice =
            originalPrice * (1 - Number(sale.discount_percent) / 100);
          const countdown = timeLeft(sale.ends_at, now);

          return (
            <Card
              key={String(sale.id)}
              className="flex min-w-[280px] items-center gap-4 border border-orange-200 bg-white/90"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white">
                <Flame className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
                  {sale.discount_percent}% off · ends in {countdown ?? "00:00:00"}
                </p>
                <p className="truncate font-bold text-slate-950">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-950">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
