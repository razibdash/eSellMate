"use client";

import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bot, Package, Receipt, ShoppingCart, TrendingUp, Users, Warehouse, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { usePermission } from "@/hooks/usePermission";
import { useGetDashboardReportQuery } from "@/store/api/reportApi";

export function DashboardView() {
  const { data, isLoading } = useGetDashboardReportQuery();
  const canCreateOrders = usePermission("create_orders");
  const canUseAi = usePermission("use_ai_tools");
  if (isLoading || !data) return <PageLoader />;
  const summary = data.summary;

  return (
    <div>
      <PageHeader
        title="Business Dashboard"
        description="Quick view of today's orders, sales, low-stock alerts, AI insights and recent activity."
        actions={<>{canCreateOrders ? <Link href="/orders/create"><Button>Create order</Button></Link> : null}{canUseAi ? <Link href="/ai/caption"><Button variant="outline">Generate caption</Button></Link> : null}</>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Today orders" value={summary.today_orders} icon={ShoppingCart} />
        <MetricCard title="Today sales" value={formatCurrency(summary.today_sales)} icon={Wallet} />
        <MetricCard title="Monthly sales" value={formatCurrency(summary.monthly_sales)} icon={TrendingUp} />
        <MetricCard title="Low stock" value={summary.low_stock_count} hint="Restock needed" icon={Warehouse} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div><CardTitle>Sales trend</CardTitle><p className="text-sm text-slate-500">Monthly sales and orders overview</p></div>
            <Badge value="active" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sales_chart}>
                <defs><linearGradient id="sales" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0891b2" fill="url(#sales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-brand-600" /><CardTitle>AI insights</CardTitle></div>
          <div className="space-y-3">
            {data.insights.map((insight) => (
              <div key={insight.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2"><p className="font-semibold text-slate-950">{insight.title}</p><Badge value={insight.severity} /></div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{insight.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2"><Receipt className="h-5 w-5 text-brand-600" /><CardTitle>Recent orders</CardTitle></div>
          <div className="space-y-3">
            {data.recent_orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                <div><p className="font-semibold text-slate-900">{order.order_number}</p><p className="text-sm text-slate-500">{order.customer_name_snapshot} - {formatDate(order.created_at)}</p></div>
                <div className="text-right"><p className="font-bold text-slate-950">{formatCurrency(order.total_amount)}</p><Badge value={order.order_status} /></div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2"><Package className="h-5 w-5 text-brand-600" /><CardTitle>Top products</CardTitle></div>
          <div className="space-y-3">
            {data.top_products.map((row) => (
              <div key={String(row.Product)} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div><p className="font-semibold text-slate-900">{String(row.Product)}</p><p className="text-sm text-slate-500">Sold {String(row.Sold)} units</p></div>
                <div className="text-right"><p className="font-bold text-slate-950">{formatCurrency(Number(row.Revenue))}</p><p className="text-xs text-slate-500">Stock {String(row.Stock)}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard title="Pending orders" value={summary.pending_orders} icon={ShoppingCart} />
        <MetricCard title="Delivered orders" value={summary.delivered_orders} icon={Receipt} />
        <MetricCard title="Repeat customers" value={summary.repeat_customers} icon={Users} />
      </div>
    </div>
  );
}
