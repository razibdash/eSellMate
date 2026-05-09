import type { ID } from "./common";

export type StockMovementType = "opening" | "order_sale" | "order_cancel" | "return" | "restock" | "adjustment" | "damage";

export type StockMovement = {
  id: ID;
  business_id: ID;
  product_id: ID;
  product_name?: string;
  movement_type: StockMovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_type?: string;
  reference_id?: ID;
  note?: string;
  created_at: string;
};
