import type { ID } from "./common";

export type Plan = {
  id: ID;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly?: number;
  order_limit?: number | null;
  product_limit?: number | null;
  staff_limit?: number | null;
  ai_limit?: number | null;
  features: string[];
  status: "active" | "inactive";
};

export type Subscription = {
  id: ID;
  business_id: ID;
  plan_id: ID;
  plan?: Plan;
  status: "trial" | "active" | "past_due" | "cancelled" | "expired";
  starts_at?: string;
  ends_at?: string;
  trial_ends_at?: string;
  billing_cycle: "monthly" | "yearly";
};

export type SubscriptionPayment = {
  id: ID;
  business_id: ID;
  subscription_id: ID;
  amount: number;
  payment_method?: string;
  transaction_id?: string;
  status: "pending" | "paid" | "failed";
  paid_at?: string;
  note?: string;
};
