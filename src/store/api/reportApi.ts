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

type LaravelDashboardResponse = {
  today_orders: number;
  today_sales: number;
  pending_orders: number;
  delivered_orders: number;
  unpaid_amount: number;
  low_stock_products: number;
  recent_orders: Order[];
  top_products: Array<{
    product_name_snapshot: string;
    quantity_sold: number;
    sales_amount?: number;
    stock_quantity?: number;
  }>;
  daily_sales: Array<{ date: string; orders: number; sales: number }>;
};

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardReport: builder.query<DashboardResponse, void>({
      query: () => "/reports/dashboard",
      transformResponse: (response: LaravelDashboardResponse) => ({
        summary: {
          today_orders: response.today_orders ?? 0,
          today_sales: response.today_sales ?? 0,
          monthly_sales:
            response.daily_sales?.reduce(
              (sum, row) => sum + Number(row.sales ?? 0),
              0,
            ) ?? 0,
          pending_orders: response.pending_orders ?? 0,
          delivered_orders: response.delivered_orders ?? 0,
          low_stock_count: response.low_stock_products ?? 0,
          unpaid_amount: response.unpaid_amount ?? 0,
          repeat_customers: 0,
        },
        sales_chart: (response.daily_sales ?? []).map((row) => ({
          label: row.date,
          value: Number(row.sales ?? 0),
          orders: Number(row.orders ?? 0),
        })),
        insights: [],
        recent_orders: response.recent_orders ?? [],
        top_products: (response.top_products ?? []).map((row) => ({
          Product: row.product_name_snapshot,
          Sold: Number(row.quantity_sold ?? 0),
          Revenue: Number(row.sales_amount ?? 0),
          Stock: Number(row.stock_quantity ?? 0),
        })),
      }),
      providesTags: ["Report"],
    }),
    getSalesReport: builder.query<
      { rows: ChartPoint[]; summary: DashboardSummary },
      void
    >({
      query: () => "/reports/sales",
      transformResponse: (response: {
        summary: Record<string, number>;
        series: Array<{ date: string; orders: number; sales: number }>;
      }) => ({
        summary: {
          today_orders: response.summary.orders ?? 0,
          today_sales: response.summary.sales ?? 0,
          monthly_sales: response.summary.sales ?? 0,
          pending_orders: 0,
          delivered_orders: 0,
          low_stock_count: 0,
          unpaid_amount: response.summary.due ?? 0,
          repeat_customers: 0,
        },
        rows: (response.series ?? []).map((row) => ({
          label: row.date,
          value: Number(row.sales ?? 0),
          orders: Number(row.orders ?? 0),
        })),
      }),
      providesTags: ["Report"],
    }),
    getProductReport: builder.query<{ rows: ReportRow[] }, void>({
      query: () => "/reports/products",
      transformResponse: (rows: ReportRow[]) => ({ rows }),
      providesTags: ["Report"],
    }),
    getCustomerReport: builder.query<{ rows: ReportRow[] }, void>({
      query: () => "/reports/customers",
      transformResponse: (rows: ReportRow[]) => ({ rows }),
      providesTags: ["Report"],
    }),
    getPaymentReport: builder.query<{ rows: ReportRow[] }, void>({
      query: () => "/reports/payments",
      transformResponse: (rows: ReportRow[]) => ({ rows }),
      providesTags: ["Report"],
    }),
    getDeliveryReport: builder.query<{ rows: ReportRow[] }, void>({
      query: () => "/reports/delivery",
      transformResponse: (rows: ReportRow[]) => ({ rows }),
      providesTags: ["Report"],
    }),
    getLowStockReport: builder.query<{ rows: ReportRow[] }, void>({
      query: () => "/reports/low-stock",
      transformResponse: (rows: ReportRow[]) => ({ rows }),
      providesTags: ["Report", "Stock"],
    }),
  }),
});

export const {
  useGetDashboardReportQuery,
  useGetSalesReportQuery,
  useGetProductReportQuery,
  useGetCustomerReportQuery,
  useGetPaymentReportQuery,
  useGetDeliveryReportQuery,
  useGetLowStockReportQuery,
} = reportApi;
