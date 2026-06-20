import type { ID } from "./common";
import type { Product } from "./product";

export type FlashSale = {
  id: ID;
  business_id: ID;
  product_id: ID;
  product?: Product;
  discount_percent: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export type FlashSalePayload = Omit<FlashSale, "id" | "business_id" | "product">;
