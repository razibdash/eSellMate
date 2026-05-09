"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useGetCustomersQuery } from "@/store/api/customerApi";
import type { Customer } from "@/types/customer";

export function CustomersView() {
  const [search, setSearch] = useState("");
  const { data = [] } = useGetCustomersQuery({ search });
  return (
    <div>
      <PageHeader title="Customers" description="Store customer phone, address, purchase history, total spent and follow-up notes." actions={<Link href="/customers/create"><Button><Plus className="h-4 w-4" />Add customer</Button></Link>} />
      <div className="relative mb-5 max-w-xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-11" placeholder="Search customer name, phone, area" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <DataTable<Customer & Record<string, unknown>> data={data as (Customer & Record<string, unknown>)[]} columns={[{ key: "name", header: "Customer", render: (row) => <Link href={`/customers/${row.id}`} className="font-semibold text-slate-950 hover:text-brand-700">{row.name}<span className="block text-xs font-normal text-slate-500">{row.phone}</span></Link> }, { key: "area", header: "Area" }, { key: "total_orders", header: "Orders" }, { key: "total_spent", header: "Total spent", render: (row) => formatCurrency(row.total_spent) }, { key: "last_order_at", header: "Last order", render: (row) => formatDate(row.last_order_at) }, { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> }]} />
    </div>
  );
}
