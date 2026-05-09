"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency } from "@/lib/formatters";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/store/api/productApi";
import type { Product } from "@/types/product";

export function ProductsView() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data = [], isLoading } = useGetProductsQuery({ search, category_id: categoryId || undefined });
  if (isLoading) return <PageLoader />;
  return (
    <div>
      <PageHeader title="Products" description="Manage product image, SKU, price, discount price, stock and low-stock alert." actions={<Link href="/products/create"><Button><Plus className="h-4 w-4" />Add product</Button></Link>} />
      <div className="mb-5 grid gap-3 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur md:grid-cols-[1fr_240px]">
        <div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-11" placeholder="Search product name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">All categories</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</Select>
      </div>
      <DataTable<Product & Record<string, unknown>>
        data={data as (Product & Record<string, unknown>)[]}
        columns={[
          { key: "name", header: "Product", render: (row) => <Link href={`/products/${row.id}`} className="font-semibold text-slate-950 hover:text-brand-700">{row.name}<span className="block text-xs font-normal text-slate-500">{row.sku}</span></Link> },
          { key: "category_name", header: "Category" },
          { key: "price", header: "Price", render: (row) => formatCurrency(row.discount_price || row.price) },
          { key: "stock_quantity", header: "Stock", render: (row) => <span className={row.stock_quantity <= row.low_stock_alert ? "font-bold text-rose-600" : "font-semibold text-slate-700"}>{row.stock_quantity} {row.unit}</span> },
          { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> },
          { key: "action", header: "Action", render: (row) => <Link className="font-semibold text-brand-700" href={`/products/${row.id}/edit`}>Edit</Link> }
        ]}
      />
    </div>
  );
}
