export type DashboardSummary = {
  today_orders: number;
  today_sales: number;
  monthly_sales: number;
  pending_orders: number;
  delivered_orders: number;
  low_stock_count: number;
  unpaid_amount: number;
  repeat_customers: number;
};

export type ChartPoint = {
  label: string;
  value: number;
  orders?: number;
};

export type ReportRow = Record<string, string | number>;
