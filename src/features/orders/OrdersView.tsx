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
import { formatCurrency, formatDate } from "@/lib/formatters";
import { orderStatuses } from "@/lib/constants";
import { usePermission } from "@/hooks/usePermission";
import { useGetOrdersQuery } from "@/store/api/orderApi";
import type { Order } from "@/types/order";

export function OrdersView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data = [] } = useGetOrdersQuery({ search, status: status || undefined });
  const canCreateOrders = usePermission("create_orders");
  return <div><PageHeader title="Orders" description="Create orders, track payment and delivery status, generate invoice and share WhatsApp messages." actions={canCreateOrders ? <Link href="/orders/create"><Button><Plus className="h-4 w-4" />Create order</Button></Link> : null} /><div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]"><div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-11" placeholder="Search order, invoice, customer" value={search} onChange={(e)=>setSearch(e.target.value)} /></div><Select value={status} onChange={(e)=>setStatus(e.target.value)}><option value="">All status</option>{orderStatuses.map((s)=><option key={s} value={s}>{s}</option>)}</Select></div><DataTable<Order & Record<string, unknown>> data={data as (Order & Record<string, unknown>)[]} columns={[{key:"order_number",header:"Order",render:(row)=><Link className="font-semibold text-brand-700" href={`/orders/${row.id}`}>{row.order_number}<span className="block text-xs font-normal text-slate-500">{row.invoice_number}</span></Link>},{key:"customer_name_snapshot",header:"Customer"},{key:"order_source",header:"Source",render:(row)=><Badge value={row.order_source} />},{key:"total_amount",header:"Total",render:(row)=>formatCurrency(row.total_amount)},{key:"payment_status",header:"Payment",render:(row)=><Badge value={row.payment_status} />},{key:"order_status",header:"Order status",render:(row)=><Badge value={row.order_status} />},{key:"created_at",header:"Date",render:(row)=>formatDate(row.created_at)}]} /></div>;
}
