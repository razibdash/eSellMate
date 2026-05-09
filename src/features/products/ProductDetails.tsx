"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency } from "@/lib/formatters";
import { useGetProductQuery } from "@/store/api/productApi";

export function ProductDetails({ id }: { id: string }) {
  const { data, isLoading } = useGetProductQuery(id);
  if (isLoading || !data) return <PageLoader />;
  return (
    <div>
      <PageHeader title={data.name} description={data.description} actions={<Link href={`/products/${id}/edit`}><Button>Edit product</Button></Link>} />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><img src={data.image || "https://placehold.co/800x600"} alt={data.name} className="h-80 w-full rounded-3xl object-cover" /></Card>
        <Card className="space-y-4">
          <Badge value={data.status} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="SKU" value={data.sku || "—"} />
            <Info label="Category" value={data.category_name || "—"} />
            <Info label="Price" value={formatCurrency(data.price)} />
            <Info label="Discount" value={data.discount_price ? formatCurrency(data.discount_price) : "—"} />
            <Info label="Stock" value={`${data.stock_quantity} ${data.unit}`} />
            <Info label="Low alert" value={`${data.low_stock_alert} ${data.unit}`} />
          </div>
        </Card>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-950">{value}</p></div>; }
