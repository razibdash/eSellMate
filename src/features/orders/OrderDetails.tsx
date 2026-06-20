"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { deliveryStatuses, orderStatuses, paymentStatuses } from "@/lib/constants";
import { buildWhatsAppUrl, renderMessageTemplate } from "@/lib/whatsapp";
import { usePermission } from "@/hooks/usePermission";
import { useGetBusinessQuery } from "@/store/api/businessApi";
import { useAddPaymentMutation, useCancelOrderMutation, useGetOrderQuery, useUpdateDeliveryStatusMutation, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation } from "@/store/api/orderApi";
import type { OrderItem, PaymentMethod } from "@/types/order";
import { SmsLogHistory } from "./SmsLogHistory";

export function OrderDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrderQuery(id);
  const { data: business } = useGetBusinessQuery();
  const canEditOrders = usePermission("edit_orders");
  const canDeleteOrders = usePermission("delete_orders");
  const canManagePayments = usePermission("manage_payments");
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [updateDeliveryStatus] = useUpdateDeliveryStatusMutation();
  const [addPayment] = useAddPaymentMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [payment, setPayment] = useState({ amount: "", payment_method: "cash" as PaymentMethod, transaction_id: "" });

  async function cancel() {
    if (!window.confirm("Cancel this order?")) return;
    await cancelOrder(id).unwrap();
    router.push("/orders");
  }

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payment.amount) return;
    await addPayment({
      id,
      body: {
        amount: Number(payment.amount),
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id || undefined,
      },
    }).unwrap();
    setPayment({ amount: "", payment_method: "cash", transaction_id: "" });
  }

  if (isLoading || !order) return <PageLoader />;

  const msg = renderMessageTemplate(
    "Hello {customer_name}, your order {invoice_no} has been confirmed. Total amount: {total_amount}. Thank you for shopping with {business_name}.",
    { customer_name: order.customer_name_snapshot, invoice_no: order.invoice_number, total_amount: formatCurrency(order.total_amount), business_name: business?.name },
  );

  return (
    <div>
      <PageHeader
        title={order.order_number}
        description={`${order.customer_name_snapshot} - ${formatDateTime(order.created_at)}`}
        actions={(
          <>
            <Link href={`/invoices/${order.id}`}><Button variant="outline">Invoice preview</Button></Link>
            <a target="_blank" href={buildWhatsAppUrl(order.customer_phone_snapshot || "", msg)}><Button>WhatsApp share</Button></a>
            {canDeleteOrders ? <Button variant="danger" onClick={cancel}>Cancel order</Button> : null}
          </>
        )}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <DataTable<OrderItem & Record<string, unknown>>
            data={order.items as (OrderItem & Record<string, unknown>)[]}
            columns={[
              { key: "product_name_snapshot", header: "Product" },
              { key: "sku_snapshot", header: "SKU" },
              { key: "unit_price", header: "Price", render: (row) => formatCurrency(row.unit_price) },
              { key: "quantity", header: "Qty" },
              { key: "line_total", header: "Line total", render: (row) => formatCurrency(row.line_total) },
            ]}
          />
        </Card>
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Order" value={<Badge value={order.order_status} />} />
            <Info label="Payment" value={<Badge value={order.payment_status} />} />
            <Info label="Delivery" value={<Badge value={order.delivery_status} />} />
            <Info label="Source" value={<Badge value={order.order_source} />} />
          </div>
          <div className="space-y-3">
            {canEditOrders ? <StatusSelect label="Update order" value={order.order_status} options={orderStatuses} onChange={(status) => updateOrderStatus({ id, status: status as never })} /> : null}
            {canManagePayments ? <StatusSelect label="Update payment" value={order.payment_status} options={paymentStatuses} onChange={(status) => updatePaymentStatus({ id, status: status as never })} /> : null}
            {canEditOrders ? <StatusSelect label="Update delivery" value={order.delivery_status} options={deliveryStatuses} onChange={(status) => updateDeliveryStatus({ id, status: status as never })} /> : null}
          </div>
          {canManagePayments ? (
            <form className="space-y-3 rounded-2xl bg-slate-50 p-3" onSubmit={submitPayment}>
              <p className="text-sm font-bold text-slate-900">Add payment</p>
              <Input type="number" min="0" step="0.01" placeholder="Amount" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
              <Select value={payment.payment_method} onChange={(e) => setPayment({ ...payment, payment_method: e.target.value as PaymentMethod })}>
                {["cash", "bkash", "nagad", "rocket", "bank", "card", "cod", "other"].map((method) => <option key={method} value={method}>{method}</option>)}
              </Select>
              <Input placeholder="Transaction ID" value={payment.transaction_id} onChange={(e) => setPayment({ ...payment, transaction_id: e.target.value })} />
              <Button className="w-full">Save payment</Button>
            </form>
          ) : null}
          <Summary label="Subtotal" value={formatCurrency(order.subtotal)} />
          <Summary label="Discount" value={formatCurrency(order.discount_amount)} />
          <Summary label="Delivery" value={formatCurrency(order.delivery_charge)} />
          <Summary label="Total" value={formatCurrency(order.total_amount)} strong />
          <Summary label="Paid" value={formatCurrency(order.paid_amount)} />
          <Summary label="Due" value={formatCurrency(order.due_amount)} />
        </Card>
      </div>
      <div className="mt-5">
        <SmsLogHistory orderId={id} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-2xl bg-slate-50 p-3"><p className="mb-2 text-xs font-semibold uppercase text-slate-400">{label}</p>{value}</div>; }
function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>{label}</span><span className={strong ? "text-lg font-black" : "font-bold"}>{value}</span></div>; }
function StatusSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <div><label className="text-sm font-semibold text-slate-700">{label}</label><Select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</Select></div>; }
