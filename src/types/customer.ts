import type { ID } from "./common";

export type CustomerAddress = {
  id: ID;
  customer_id: ID;
  label?: string;
  name?: string;
  phone?: string;
  address: string;
  area?: string;
  city?: string;
  postal_code?: string;
  is_default: boolean;
};

export type Customer = {
  id: ID;
  business_id: ID;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  last_order_at?: string;
  note?: string;
  status: "active" | "blocked";
  addresses?: CustomerAddress[];
};

export type CustomerPayload = Omit<Customer, "id" | "business_id" | "total_orders" | "total_spent" | "last_order_at" | "addresses">;
