"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useGetBusinessQuery, useUpdateBusinessMutation } from "@/store/api/businessApi";
import { useChangeSubscriptionMutation, useGetMessageTemplatesQuery, useGetPlansQuery, useGetStaffQuery, useGetSubscriptionInvoicesQuery, useGetSubscriptionQuery } from "@/store/api/settingsApi";
import type { MessageTemplate } from "@/types/message";
import type { User } from "@/types/auth";
import type { SubscriptionPayment } from "@/types/subscription";

export function BusinessSettingsView() {
  const { data } = useGetBusinessQuery();
  const [updateBusiness] = useUpdateBusinessMutation();
  const [form, setForm] = useState(data);
  if (!data) return null;
  const current = form || data;
  return <><PageHeader title="Business settings" description="Business profile used in dashboard, invoices and settings." /><Card><form className="grid gap-4 lg:grid-cols-2" onSubmit={(e)=>{e.preventDefault();updateBusiness(current)}}><Input value={current.name} onChange={(e)=>setForm({...current,name:e.target.value})}/><Input value={current.phone||""} onChange={(e)=>setForm({...current,phone:e.target.value})}/><Input value={current.email||""} onChange={(e)=>setForm({...current,email:e.target.value})}/><Input value={current.whatsapp_number||""} onChange={(e)=>setForm({...current,whatsapp_number:e.target.value})}/><Input value={current.facebook_page_url||""} onChange={(e)=>setForm({...current,facebook_page_url:e.target.value})}/><Input value={current.instagram_url||""} onChange={(e)=>setForm({...current,instagram_url:e.target.value})}/><Textarea className="lg:col-span-2" value={current.address||""} onChange={(e)=>setForm({...current,address:e.target.value})}/><Button>Save settings</Button></form></Card></>;
}

export function InvoiceSettingsView() {
  const { data } = useGetBusinessQuery(); const [updateBusiness] = useUpdateBusinessMutation(); const [prefix,setPrefix]=useState(data?.invoice_prefix||"SB"); const [footer,setFooter]=useState(data?.invoice_footer||"");
  return <><PageHeader title="Invoice settings" description="Set invoice prefix and footer text. Example: SHOPCODE-YYYY-000001." /><Card><form className="space-y-4" onSubmit={(e)=>{e.preventDefault();updateBusiness({invoice_prefix:prefix,invoice_footer:footer})}}><Input value={prefix} onChange={(e)=>setPrefix(e.target.value)} /><Textarea value={footer} onChange={(e)=>setFooter(e.target.value)} /><Button>Save invoice settings</Button></form></Card></>;
}

export function WhatsAppSettingsView() { const { data=[] } = useGetMessageTemplatesQuery(); return <><PageHeader title="WhatsApp templates" description="Default and custom templates with variables for confirmation, payment reminder and delivery update." /><DataTable<MessageTemplate & Record<string, unknown>> data={data as (MessageTemplate & Record<string, unknown>)[]} columns={[{key:"title",header:"Title"},{key:"type",header:"Type",render:(row)=><Badge value={row.type}/>},{key:"language",header:"Language"},{key:"body",header:"Body"},{key:"status",header:"Status",render:(row)=><Badge value={row.status}/>}]} /></>; }
export function StaffSettingsView() { const { data=[] } = useGetStaffQuery(); return <><PageHeader title="Staff settings" description="Owner, manager, staff, delivery staff and viewer role-ready staff list." /><DataTable<User & Record<string, unknown>> data={data as (User & Record<string, unknown>)[]} columns={[{key:"name",header:"Name"},{key:"email",header:"Email"},{key:"phone",header:"Phone"},{key:"role",header:"Role",render:(row)=><Badge value={row.role}/>},{key:"status",header:"Status",render:(row)=><Badge value={row.status}/>}]} /></>; }
export function RolesPermissionsView() { const rows=["view_dashboard","manage_products","manage_customers","create_orders","edit_orders","delete_orders","manage_payments","view_reports","manage_staff","manage_settings","use_ai_tools","manage_subscription"].map((p,i)=>({id:i+1,permission:p,owner:"Yes",manager:i<9?"Yes":"No",staff:[0,2,3,4].includes(i)?"Yes":"No",delivery:i===0||i===4?"Yes":"No"})); return <><PageHeader title="Roles & permissions" description="Permission matrix ready for Laravel policies and middleware." /><DataTable<Record<string, unknown>> data={rows} columns={[{key:"permission",header:"Permission"},{key:"owner",header:"Owner"},{key:"manager",header:"Manager"},{key:"staff",header:"Staff"},{key:"delivery",header:"Delivery"}]} /></>; }
export function SubscriptionSettingsView() { const {data:plans=[]}=useGetPlansQuery(); const {data:sub}=useGetSubscriptionQuery(); const [changePlan]=useChangeSubscriptionMutation(); return <><PageHeader title="Subscription" description="Plan structure with order, product, staff and AI limits." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plans.map((plan)=><Card key={plan.id} className={sub?.plan_id===plan.id?"border-brand-300 bg-brand-50":""}><h3 className="text-xl font-black">{plan.name}</h3><p className="mt-3 text-3xl font-black">{formatCurrency(plan.price_monthly)}</p><div className="mt-4 space-y-2 text-sm text-slate-500">{plan.features.map((f)=><p key={f}>• {f}</p>)}</div><Button className="mt-5 w-full" variant={sub?.plan_id===plan.id?"secondary":"outline"} onClick={()=>changePlan({plan_id:plan.id})}>{sub?.plan_id===plan.id?"Current":"Choose"}</Button></Card>)}</div></>; }
export function BillingHistoryView(){ const {data=[]}=useGetSubscriptionInvoicesQuery(); return <><PageHeader title="Billing history" description="Subscription payment records and invoice history." /><DataTable<SubscriptionPayment & Record<string, unknown>> data={data as (SubscriptionPayment & Record<string, unknown>)[]} columns={[{key:"amount",header:"Amount",render:(row)=>formatCurrency(row.amount)},{key:"payment_method",header:"Method"},{key:"transaction_id",header:"Transaction"},{key:"status",header:"Status",render:(row)=><Badge value={row.status}/>},{key:"paid_at",header:"Paid at",render:(row)=>formatDate(row.paid_at)}]} /></>;}
