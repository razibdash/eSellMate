"use client";

import { Building2, CreditCard, Users, Zap } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import { useGetSuperAdminBusinessesQuery, useGetSuperAdminDashboardQuery, useGetSuperAdminLogsQuery, useGetSuperAdminPlansQuery, useGetSuperAdminSubscriptionsQuery, useGetSuperAdminUsersQuery } from "@/store/api/superAdminApi";

export function SuperAdminDashboardView(){ const {data}=useGetSuperAdminDashboardQuery(); return <><PageHeader title="Super Admin Dashboard" description="Platform-level business, user, revenue and AI usage monitoring." /><div className="grid gap-4 md:grid-cols-4"><MetricCard title="Businesses" value={data?.businesses||0} icon={Building2}/><MetricCard title="Users" value={data?.users||0} icon={Users}/><MetricCard title="Revenue" value={formatCurrency(data?.revenue||0)} icon={CreditCard}/><MetricCard title="AI usage" value={data?.ai_usage||0} icon={Zap}/></div></> }
function Simple({title,description,hook}:{title:string;description:string;hook:()=>{data?:Record<string,unknown>[]}}){ const {data=[]}=hook(); const cols=data[0]?Object.keys(data[0]).map((key)=>({key,header:key})):[]; return <><PageHeader title={title} description={description}/><DataTable<Record<string,unknown>> data={data} columns={cols}/></> }
export const SuperAdminBusinessesView=()=> <Simple title="Business list" description="Manage all businesses, plan and system usage." hook={useGetSuperAdminBusinessesQuery as never}/>;
export const SuperAdminUsersView=()=> <Simple title="User list" description="Platform user monitoring." hook={useGetSuperAdminUsersQuery as never}/>;
export const SuperAdminPlansView=()=> <Simple title="Plan management" description="Free, Basic, Pro, Business and Agency plan settings." hook={useGetSuperAdminPlansQuery as never}/>;
export const SuperAdminSubscriptionsView=()=> <Simple title="Subscription management" description="Monitor active, trial, past due and expired subscriptions." hook={useGetSuperAdminSubscriptionsQuery as never}/>;
export const SuperAdminLogsView=()=> <Simple title="System logs" description="Audit logs for sensitive actions." hook={useGetSuperAdminLogsQuery as never}/>;
