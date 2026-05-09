"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency } from "@/lib/formatters";
import { useGetCustomerReportQuery, useGetDeliveryReportQuery, useGetLowStockReportQuery, useGetPaymentReportQuery, useGetProductReportQuery, useGetSalesReportQuery } from "@/store/api/reportApi";
import type { ChartPoint, ReportRow } from "@/types/report";

export function SalesReportView() {
  const { data } = useGetSalesReportQuery();
  return <><PageHeader title="Sales report" description="Daily and monthly sales report with order count and revenue chart." /><Card className="mb-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.rows || []}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/><XAxis dataKey="label"/><YAxis/><Tooltip/><Bar dataKey="value" fill="#0891b2" radius={[12,12,0,0]}/></BarChart></ResponsiveContainer></Card><DataTable<ChartPoint & Record<string, unknown>> data={(data?.rows || []) as (ChartPoint & Record<string, unknown>)[]} columns={[{key:"label",header:"Month"},{key:"orders",header:"Orders"},{key:"value",header:"Sales",render:(row)=>formatCurrency(row.value)}]} /></>;
}

function GenericReport({ title, description, hook }: { title: string; description: string; hook: () => { data?: { rows: ReportRow[] } } }) {
  const { data } = hook();
  const rows = data?.rows || [];
  const columns = rows[0] ? Object.keys(rows[0]).map((key) => ({ key, header: key, render: key.toLowerCase().includes("revenue") || key.toLowerCase().includes("spent") || key.toLowerCase().includes("amount") ? (row: ReportRow) => formatCurrency(Number(row[key])) : undefined })) : [];
  return <><PageHeader title={title} description={description} /><DataTable<ReportRow> data={rows} columns={columns} /></>;
}

export const ProductReportView = () => <GenericReport title="Product report" description="Product-wise sales, stock and revenue report." hook={useGetProductReportQuery as never} />;
export const CustomerReportView = () => <GenericReport title="Customer report" description="Customer orders, total spent and status report." hook={useGetCustomerReportQuery as never} />;
export const PaymentReportView = () => <GenericReport title="Payment report" description="Cash, bKash, Nagad, card, bank and COD payment report." hook={useGetPaymentReportQuery as never} />;
export const DeliveryReportView = () => <GenericReport title="Delivery report" description="Delivery status and average delivery time report." hook={useGetDeliveryReportQuery as never} />;
export const LowStockReportView = () => <GenericReport title="Low-stock report" description="Products below low-stock alert quantity." hook={useGetLowStockReportQuery as never} />;
