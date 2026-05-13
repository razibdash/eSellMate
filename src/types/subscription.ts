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
  features?: string[];
  features_json?: Record<string, unknown> | string[];
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
  provider_payment_id?: string;
  checkout_url?: string;
  merchant_invoice_number?: string;
  billing_cycle?: "monthly" | "yearly";
  status: "pending" | "paid" | "failed";
  paid_at?: string;
  note?: string;
};

export type CheckoutPayload = {
  plan_id: ID;
  billing_cycle: "monthly" | "yearly";
  payment_method: "bkash" | "nagad" | "bank";
  transaction_id?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_deposit_date?: string;
  note?: string;
};

export type CheckoutResponse = {
  payment: SubscriptionPayment;
  redirect_url?: string;
  bank?: Record<string, string | null>;
};
