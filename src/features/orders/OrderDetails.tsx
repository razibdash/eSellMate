"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { deliveryStatuses, orderStatuses, paymentStatuses } from "@/lib/constants";
import { buildWhatsAppUrl, renderMessageTemplate } from "@/lib/whatsapp";
import { useGetBusinessQuery } from "@/store/api/businessApi";
import { useGetOrderQuery, useUpdateDeliveryStatusMutation, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation } from "@/store/api/orderApi";
import type { OrderItem } from "@/types/order";

export function OrderDetails({ id }: { id: string }) {
  const { data: order, isLoading } = useGetOrderQuery(id);
  const { data: business } = useGetBusinessQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [updateDeliveryStatus] = useUpdateDeliveryStatusMutation();
  if (isLoading || !order) return <PageLoader />;
  const msg = renderMessageTemplate("Hello {customer_name}, your order {invoice_no} has been confirmed. Total amount: {total_amount}. Thank you for shopping with {business_name}.", { customer_name: order.customer_name_snapshot, invoice_no: order.invoice_number, total_amount: formatCurrency(order.total_amount), business_name: business?.name });
  return <div><PageHeader title={order.order_number} description={`${order.customer_name_snapshot} · ${formatDateTime(order.created_at)}`} actions={<><Link href={`/invoices/${order.id}`}><Button variant="outline">Invoice preview</Button></Link><a target="_blank" href={buildWhatsAppUrl(order.customer_phone_snapshot || "", msg)}><Button>WhatsApp share</Button></a></>} /><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card><DataTable<OrderItem & Record<string, unknown>> data={order.items as (OrderItem & Record<string, unknown>)[]} columns={[{key:"product_name_snapshot",header:"Product"},{key:"sku_snapshot",header:"SKU"},{key:"unit_price",header:"Price",render:(row)=>formatCurrency(row.unit_price)},{key:"quantity",header:"Qty"},{key:"line_total",header:"Line total",render:(row)=>formatCurrency(row.line_total)}]} /></Card><Card className="space-y-4"><div className="grid grid-cols-2 gap-3"><Info label="Order" value={<Badge value={order.order_status} />} /><Info label="Payment" value={<Badge value={order.payment_status} />} /><Info label="Delivery" value={<Badge value={order.delivery_status} />} /><Info label="Source" value={<Badge value={order.order_source} />} /></div><div className="space-y-3"><StatusSelect label="Update order" value={order.order_status} options={orderStatuses} onChange={(status)=>updateOrderStatus({id,status:status as never})}/><StatusSelect label="Update payment" value={order.payment_status} options={paymentStatuses} onChange={(status)=>updatePaymentStatus({id,status:status as never})}/><StatusSelect label="Update delivery" value={order.delivery_status} options={deliveryStatuses} onChange={(status)=>updateDeliveryStatus({id,status:status as never})}/></div><Summary label="Subtotal" value={formatCurrency(order.subtotal)}/><Summary label="Discount" value={formatCurrency(order.discount_amount)}/><Summary label="Delivery" value={formatCurrency(order.delivery_charge)}/><Summary label="Total" value={formatCurrency(order.total_amount)} strong/><Summary label="Paid" value={formatCurrency(order.paid_amount)}/><Summary label="Due" value={formatCurrency(order.due_amount)}/></Card></div></div>;
}
function Info({label,value}:{label:string;value:React.ReactNode}){return <div className="rounded-2xl bg-slate-50 p-3"><p className="mb-2 text-xs font-semibold uppercase text-slate-400">{label}</p>{value}</div>}
function Summary({label,value,strong}:{label:string;value:string;strong?:boolean}){return <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>{label}</span><span className={strong?"text-lg font-black":"font-bold"}>{value}</span></div>}
function StatusSelect({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(value:string)=>void}){return <div><label className="text-sm font-semibold text-slate-700">{label}</label><Select value={value} onChange={(e)=>onChange(e.target.value)}>{options.map((o)=><option key={o} value={o}>{o}</option>)}</Select></div>}
