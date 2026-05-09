"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useGetBusinessQuery } from "@/store/api/businessApi";
import { useGenerateInvoiceMutation, useGetOrderQuery } from "@/store/api/orderApi";
import type { OrderItem } from "@/types/order";

export function InvoiceView({ id }: { id: string }) {
  const { data: order, isLoading } = useGetOrderQuery(id);
  const { data: business } = useGetBusinessQuery();
  const [generateInvoice] = useGenerateInvoiceMutation();
  if (isLoading || !order) return <PageLoader />;
  return <div><PageHeader title="Invoice preview" description="Printable invoice layout with business, customer, order and payment data." actions={<><Button variant="outline" onClick={()=>window.print()}>Print</Button><Button onClick={()=>generateInvoice(id)}>Generate PDF record</Button></>} /><Card className="mx-auto max-w-4xl bg-white p-8 print:shadow-none"><div className="flex justify-between gap-8"><div><h2 className="text-3xl font-black text-slate-950">{business?.name}</h2><p className="mt-2 text-sm text-slate-500">{business?.address}</p><p className="text-sm text-slate-500">{business?.phone}</p></div><div className="text-right"><p className="text-sm text-slate-500">Invoice</p><p className="text-2xl font-black">{order.invoice_number}</p><p className="mt-2 text-sm text-slate-500">{formatDate(order.created_at)}</p></div></div><div className="mt-8 rounded-3xl bg-slate-50 p-5"><p className="font-bold">Bill To</p><p className="mt-1 text-sm text-slate-600">{order.customer_name_snapshot}</p><p className="text-sm text-slate-600">{order.customer_phone_snapshot}</p><p className="text-sm text-slate-600">{order.delivery_address_snapshot}</p></div><div className="mt-8"><DataTable<OrderItem & Record<string, unknown>> data={order.items as (OrderItem & Record<string, unknown>)[]} columns={[{key:"product_name_snapshot",header:"Item"},{key:"unit_price",header:"Price",render:(row)=>formatCurrency(row.unit_price)},{key:"quantity",header:"Qty"},{key:"line_total",header:"Total",render:(row)=>formatCurrency(row.line_total)}]} /></div><div className="ml-auto mt-8 max-w-sm space-y-2"><Row label="Subtotal" value={formatCurrency(order.subtotal)}/><Row label="Discount" value={formatCurrency(order.discount_amount)}/><Row label="Delivery" value={formatCurrency(order.delivery_charge)}/><Row label="Total" value={formatCurrency(order.total_amount)} strong/><Row label="Paid" value={formatCurrency(order.paid_amount)}/><Row label="Due" value={formatCurrency(order.due_amount)}/></div><p className="mt-10 text-center text-sm text-slate-500">{business?.invoice_footer}</p></Card></div>;
}
function Row({label,value,strong}:{label:string;value:string;strong?:boolean}){return <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-slate-500">{label}</span><span className={strong?"text-xl font-black":"font-bold"}>{value}</span></div>}
