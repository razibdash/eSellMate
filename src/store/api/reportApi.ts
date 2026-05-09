import type { ChartPoint, DashboardSummary, ReportRow } from "@/types/report";
import type { AiInsight } from "@/types/ai";
import type { Order } from "@/types/order";
import { baseApi } from "./baseApi";

type DashboardResponse = {
  summary: DashboardSummary;
  sales_chart: ChartPoint[];
  insights: AiInsight[];
  recent_orders: Order[];
  top_products: ReportRow[];
};

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardReport: builder.query<DashboardResponse, void>({ query: () => "/reports/dashboard", providesTags: ["Report"] }),
    getSalesReport: builder.query<{ rows: ChartPoint[]; summary: DashboardSummary }, void>({ query: () => "/reports/sales", providesTags: ["Report"] }),
    getProductReport: builder.query<{ rows: ReportRow[] }, void>({ query: () => "/reports/products", providesTags: ["Report"] }),
    getCustomerReport: builder.query<{ rows: ReportRow[] }, void>({ query: () => "/reports/customers", providesTags: ["Report"] }),
    getPaymentReport: builder.query<{ rows: ReportRow[] }, void>({ query: () => "/reports/payments", providesTags: ["Report"] }),
    getDeliveryReport: builder.query<{ rows: ReportRow[] }, void>({ query: () => "/reports/delivery", providesTags: ["Report"] }),
    getLowStockReport: builder.query<{ rows: ReportRow[] }, void>({ query: () => "/reports/low-stock", providesTags: ["Report", "Stock"] })
  })
});

export const { useGetDashboardReportQuery, useGetSalesReportQuery, useGetProductReportQuery, useGetCustomerReportQuery, useGetPaymentReportQuery, useGetDeliveryReportQuery, useGetLowStockReportQuery } = reportApi;
