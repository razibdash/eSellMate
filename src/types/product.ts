import type { ID, Status } from "./common";

export type Category = {
  id: ID;
  business_id: ID;
  parent_id?: ID | null;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
};

export type Product = {
  id: ID;
  business_id: ID;
  category_id?: ID | null;
  category_name?: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  cost_price?: number;
  discount_price?: number;
  stock_quantity: number;
  low_stock_alert: number;
  unit: string;
  image?: string;
  is_published?: boolean;
  is_featured?: boolean;
  average_rating?: number;
  review_count?: number;
  status: Extract<Status, "active" | "inactive" | "draft">;
};

export type ProductPayload = Omit<Product, "id" | "business_id" | "category_name">;
export type CategoryPayload = Omit<Category, "id" | "business_id">;
