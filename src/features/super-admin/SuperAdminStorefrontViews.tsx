"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import {
  useGetSuperAdminDashboardQuery,
  useGetSuperAdminOrdersQuery,
  useGetSuperAdminPaymentsQuery,
  useGetSuperAdminProductsQuery,
  useGetSuperAdminReportsQuery,
  useGetSuperAdminStorefrontsQuery,
} from "@/store/api/superAdminApi";

export function SuperAdminStorefrontsView() {
  const { data = [] } = useGetSuperAdminStorefrontsQuery();

  return (
    <>
      <PageHeader title="Storefronts" description="Monitor every public tenant storefront from one place." />
      <DataTable<Record<string, unknown>>
        data={data}
        columns={[
          { key: "store_name", header: "Store" },
          { key: "subdomain", header: "Subdomain" },
          {
            key: "delivery_charge",
            header: "Delivery",
            render: (row) => formatCurrency(Number(row.delivery_charge || 0)),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge value={String(row.status || "unknown")} />,
          },
        ]}
      />
    </>
  );
}

export function SuperAdminOrdersView() {
  const { data = [] } = useGetSuperAdminOrdersQuery();
  return (
    <>
      <PageHeader title="Global Orders" description="Cross-tenant order visibility for support and compliance." />
      <DataTable<Record<string, unknown>>
        data={data}
        columns={[
          { key: "order_number", header: "Order" },
          { key: "order_source", header: "Source" },
          { key: "customer_name_snapshot", header: "Customer" },
          {
            key: "total_amount",
            header: "Total",
            render: (row) => formatCurrency(Number(row.total_amount || 0)),
          },
          {
            key: "order_status",
            header: "Order status",
            render: (row) => <Badge value={String(row.order_status || "")} />,
          },
        ]}
      />
    </>
  );
}

export function SuperAdminPaymentsView() {
  const { data = [] } = useGetSuperAdminPaymentsQuery();
  return (
    <>
      <PageHeader title="Global Payments" description="Track online and offline payment activity for every seller." />
      <DataTable<Record<string, unknown>>
        data={data}
        columns={[
          { key: "payment_method", header: "Method" },
          {
            key: "amount",
            header: "Amount",
            render: (row) => formatCurrency(Number(row.amount || 0)),
          },
          { key: "transaction_id", header: "Transaction" },
          {
            key: "payment_status",
            header: "Status",
            render: (row) => <Badge value={String(row.payment_status || "")} />,
          },
        ]}
      />
    </>
  );
}

export function SuperAdminProductsView() {
  const { data = [] } = useGetSuperAdminProductsQuery();
  return (
    <>
      <PageHeader title="Global Products" description="Review catalog visibility and stock across storefronts." />
      <DataTable<Record<string, unknown>>
        data={data}
        columns={[
          { key: "name", header: "Name" },
          { key: "sku", header: "SKU" },
          {
            key: "price",
            header: "Price",
            render: (row) => formatCurrency(Number(row.price || 0)),
          },
          {
            key: "stock_quantity",
            header: "Stock",
            render: (row) => String(row.stock_quantity || 0),
          },
        ]}
      />
    </>
  );
}

export function SuperAdminReportsView() {
  const { data } = useGetSuperAdminReportsQuery();
  const { data: dashboard } = useGetSuperAdminDashboardQuery();

  return (
    <>
      <PageHeader title="System Reports" description="High-level tenant, payment, and storefront performance summary." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Businesses</p><p className="mt-2 text-3xl font-black">{dashboard?.businesses || 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Storefronts</p><p className="mt-2 text-3xl font-black">{Number(data?.storefronts || 0)}</p></Card>
        <Card><p className="text-sm text-slate-500">Total sales</p><p className="mt-2 text-3xl font-black">{formatCurrency(Number(data?.total_sales || 0))}</p></Card>
        <Card><p className="text-sm text-slate-500">Website orders</p><p className="mt-2 text-3xl font-black">{Number(data?.website_orders || 0)}</p></Card>
      </div>
    </>
  );
}
