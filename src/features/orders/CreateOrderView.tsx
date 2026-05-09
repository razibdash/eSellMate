"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import { orderSources } from "@/lib/constants";
import { useGetCustomersQuery } from "@/store/api/customerApi";
import { useCreateOrderMutation } from "@/store/api/orderApi";
import { useGetProductsQuery } from "@/store/api/productApi";
import type { OrderPayload } from "@/types/order";

type DraftItem = { product_id: number; quantity: number; discount_amount: number };

export function CreateOrderView() {
  const router = useRouter();
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: products = [] } = useGetProductsQuery();
  const [createOrder, state] = useCreateOrderMutation();
  const [customerId, setCustomerId] = useState<number | undefined>(customers[0]?.id as number);
  const [source, setSource] = useState<OrderPayload["order_source"]>("facebook");
  const [items, setItems] = useState<DraftItem[]>([{ product_id: 1, quantity: 1, discount_amount: 0 }]);
  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [note, setNote] = useState("");

  const selectedCustomer = customers.find((c) => Number(c.id) === Number(customerId));
  const orderItems = items.map((item) => {
    const product = products.find((p) => Number(p.id) === Number(item.product_id));
    const unit = product?.discount_price || product?.price || 0;
    return { product_id: item.product_id, product_name_snapshot: product?.name || "Product", sku_snapshot: product?.sku, unit_price: unit, quantity: item.quantity, discount_amount: item.discount_amount };
  });
  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity - item.discount_amount, 0), [orderItems]);
  const total = subtotal - discount + deliveryCharge;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: OrderPayload = { customer_id: customerId, customer_name_snapshot: selectedCustomer?.name, customer_phone_snapshot: selectedCustomer?.phone, delivery_address_snapshot: selectedCustomer?.address, order_source: source, order_status: "pending", payment_status: "unpaid", delivery_status: "not_assigned", discount_amount: discount, delivery_charge: deliveryCharge, paid_amount: paid, note, items: orderItems };
    const order = await createOrder(payload).unwrap();
    router.push(`/orders/${order.id}`);
  }

  return <div><PageHeader title="Create order" description="Fast order creation with automatic total, delivery charge, discount and paid amount calculation." /><form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><Select value={customerId} onChange={(e)=>setCustomerId(Number(e.target.value))}>{customers.map((c)=><option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}</Select><Select value={source} onChange={(e)=>setSource(e.target.value as OrderPayload["order_source"])}>{orderSources.map((s)=><option key={s} value={s}>{s}</option>)}</Select></div><div className="space-y-3">{items.map((item, index)=><div key={index} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-[1fr_100px_110px_44px]"><Select value={item.product_id} onChange={(e)=>setItems(items.map((row,i)=>i===index?{...row,product_id:Number(e.target.value)}:row))}>{products.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</Select><Input type="number" min={1} value={item.quantity} onChange={(e)=>setItems(items.map((row,i)=>i===index?{...row,quantity:Number(e.target.value)}:row))}/><Input type="number" value={item.discount_amount} onChange={(e)=>setItems(items.map((row,i)=>i===index?{...row,discount_amount:Number(e.target.value)}:row))}/><button type="button" className="rounded-2xl bg-white p-2 text-rose-600" onClick={()=>setItems(items.filter((_,i)=>i!==index))}><Trash2 className="h-5 w-5" /></button></div>)}</div><Button type="button" variant="outline" onClick={()=>setItems([...items,{product_id:Number(products[0]?.id)||1,quantity:1,discount_amount:0}])}><Plus className="h-4 w-4" />Add item</Button><Textarea placeholder="Internal note" value={note} onChange={(e)=>setNote(e.target.value)} /></Card><Card className="h-fit space-y-4"><p className="text-lg font-bold text-slate-950">Order Summary</p><Summary label="Subtotal" value={formatCurrency(subtotal)} /><div><label className="text-sm font-semibold">Order discount</label><Input type="number" value={discount} onChange={(e)=>setDiscount(Number(e.target.value))}/></div><div><label className="text-sm font-semibold">Delivery charge</label><Input type="number" value={deliveryCharge} onChange={(e)=>setDeliveryCharge(Number(e.target.value))}/></div><div><label className="text-sm font-semibold">Paid amount</label><Input type="number" value={paid} onChange={(e)=>setPaid(Number(e.target.value))}/></div><Summary label="Total" value={formatCurrency(total)} strong /><Summary label="Due" value={formatCurrency(Math.max(total-paid,0))} /><Button className="w-full" disabled={state.isLoading}>{state.isLoading?"Saving...":"Save order"}</Button></Card></form></div>;
}
function Summary({label,value,strong}:{label:string;value:string;strong?:boolean}){return <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="text-sm text-slate-500">{label}</span><span className={strong?"text-xl font-black text-slate-950":"font-bold text-slate-800"}>{value}</span></div>}
