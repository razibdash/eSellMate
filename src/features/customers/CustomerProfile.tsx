"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { usePermission } from "@/hooks/usePermission";
import { useDeleteCustomerMutation, useGetCustomerOrdersQuery, useGetCustomerQuery } from "@/store/api/customerApi";
import type { Order } from "@/types/order";

export function CustomerProfile({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useGetCustomerQuery(id);
  const { data: orders = [] } = useGetCustomerOrdersQuery(id);
  const canManageCustomers = usePermission("manage_customers");
  const [deleteCustomer] = useDeleteCustomerMutation();

  async function remove() {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomer(id).unwrap();
    router.push("/customers");
  }

  if (isLoading || !data) return <PageLoader />;

  return (
    <>
      <PageHeader
        title={data.name}
        description={`${data.phone} - ${data.address || "No address"}`}
        actions={canManageCustomers ? (
          <>
            <Link href={`/customers/${id}/edit`}><Button>Edit customer</Button></Link>
            <Button variant="danger" onClick={remove}>Delete</Button>
          </>
        ) : null}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Total orders</p><p className="mt-2 text-3xl font-black">{data.total_orders}</p></Card>
        <Card><p className="text-sm text-slate-500">Total spent</p><p className="mt-2 text-3xl font-black">{formatCurrency(data.total_spent)}</p></Card>
        <Card><p className="text-sm text-slate-500">Status</p><div className="mt-3"><Badge value={data.status} /></div></Card>
      </div>
      <DataTable<Order & Record<string, unknown>>
        data={orders as (Order & Record<string, unknown>)[]}
        columns={[
          { key: "order_number", header: "Order", render: (row) => <Link className="font-semibold text-brand-700" href={`/orders/${row.id}`}>{row.order_number}</Link> },
          { key: "created_at", header: "Date", render: (row) => formatDate(row.created_at) },
          { key: "total_amount", header: "Total", render: (row) => formatCurrency(row.total_amount) },
          { key: "order_status", header: "Status", render: (row) => <Badge value={row.order_status} /> },
        ]}
      />
    </>
  );
}
