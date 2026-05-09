"use client";

import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { formatDateTime } from "@/lib/formatters";
import { useGetLowStockQuery, useGetStockMovementsQuery } from "@/store/api/stockApi";
import type { Product } from "@/types/product";
import type { StockMovement } from "@/types/stock";

export function StockMovementsView() {
  const { data = [] } = useGetStockMovementsQuery();
  return <><PageHeader title="Stock movements" description="Opening stock, order sale, order cancel, return, adjustment, restock and damage history." /><DataTable<StockMovement & Record<string, unknown>> data={data as (StockMovement & Record<string, unknown>)[]} columns={[{ key: "product_name", header: "Product" }, { key: "movement_type", header: "Type", render: (row) => <Badge value={row.movement_type} /> }, { key: "quantity", header: "Qty" }, { key: "previous_stock", header: "Previous" }, { key: "new_stock", header: "New" }, { key: "created_at", header: "Date", render: (row) => formatDateTime(row.created_at) }]} /></>;
}

export function LowStockView() {
  const { data = [] } = useGetLowStockQuery();
  return <><PageHeader title="Low-stock products" description="Products where current stock is lower than or equal to alert quantity." /><DataTable<Product & Record<string, unknown>> data={data as (Product & Record<string, unknown>)[]} columns={[{ key: "name", header: "Product" }, { key: "sku", header: "SKU" }, { key: "stock_quantity", header: "Stock" }, { key: "low_stock_alert", header: "Alert at" }, { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> }]} /></>;
}
