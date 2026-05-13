"use client";

import { Building2, CreditCard, Users, Zap } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import { useApproveSubscriptionPaymentMutation, useGetSuperAdminBusinessesQuery, useGetSuperAdminDashboardQuery, useGetSuperAdminLogsQuery, useGetSuperAdminPlansQuery, useGetSuperAdminSubscriptionPaymentsQuery, useGetSuperAdminSubscriptionsQuery, useGetSuperAdminUsersQuery, useRejectSubscriptionPaymentMutation } from "@/store/api/superAdminApi";

export function SuperAdminDashboardView(){ const {data}=useGetSuperAdminDashboardQuery(); return <><PageHeader title="Super Admin Dashboard" description="Platform-level business, user, revenue and AI usage monitoring." /><div className="grid gap-4 md:grid-cols-4"><MetricCard title="Businesses" value={data?.businesses||0} icon={Building2}/><MetricCard title="Users" value={data?.users||0} icon={Users}/><MetricCard title="Revenue" value={formatCurrency(data?.revenue||0)} icon={CreditCard}/><MetricCard title="AI usage" value={data?.ai_usage||0} icon={Zap}/></div></> }
function Simple({title,description,hook}:{title:string;description:string;hook:()=>{data?:Record<string,unknown>[]}}){ const {data=[]}=hook(); const cols=data[0]?Object.keys(data[0]).map((key)=>({key,header:key})):[]; return <><PageHeader title={title} description={description}/><DataTable<Record<string,unknown>> data={data} columns={cols}/></> }
export const SuperAdminBusinessesView=()=> <Simple title="Business list" description="Manage all businesses, plan and system usage." hook={useGetSuperAdminBusinessesQuery as never}/>;
export const SuperAdminUsersView=()=> <Simple title="User list" description="Platform user monitoring." hook={useGetSuperAdminUsersQuery as never}/>;
export const SuperAdminPlansView=()=> <Simple title="Plan management" description="Free, Basic, Pro, Business and Agency plan settings." hook={useGetSuperAdminPlansQuery as never}/>;
export function SuperAdminSubscriptionsView(){
  const {data: subscriptions=[]}=useGetSuperAdminSubscriptionsQuery();
  const {data: payments=[]}=useGetSuperAdminSubscriptionPaymentsQuery();
  const [approve]=useApproveSubscriptionPaymentMutation();
  const [reject]=useRejectSubscriptionPaymentMutation();
  const pendingBank = payments.filter((payment) => payment.payment_method === "bank" && payment.status === "pending");

  return (
    <>
      <PageHeader title="Subscription management" description="Monitor subscriptions and approve manual bank payments."/>
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-black text-slate-950">Pending bank payments</h3>
        <DataTable<Record<string,unknown>>
          data={pendingBank}
          columns={[
            {key:"merchant_invoice_number",header:"Invoice"},
            {key:"amount",header:"Amount",render:(row)=>formatCurrency(Number(row.amount||0))},
            {key:"transaction_id",header:"Reference"},
            {key:"bank_name",header:"Bank"},
            {key:"actions",header:"Actions",render:(row)=>(
              <div className="flex gap-3">
                <button className="font-semibold text-emerald-700" onClick={()=>approve(row.id as string | number)}>Approve</button>
                <button className="font-semibold text-rose-600" onClick={()=>reject({id: row.id as string | number, note: "Rejected by admin"})}>Reject</button>
              </div>
            )},
          ]}
        />
      </div>
      <Simple title="All subscriptions" description="Active, trial, past due and expired subscriptions." hook={() => ({data: subscriptions})}/>
    </>
  );
}
export const SuperAdminLogsView=()=> <Simple title="System logs" description="Audit logs for sensitive actions." hook={useGetSuperAdminLogsQuery as never}/>;
