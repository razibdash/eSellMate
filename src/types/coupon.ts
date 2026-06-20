import type { ID } from "./common";

export type CouponType = "fixed" | "percent";

export type Coupon = {
  id: ID;
  business_id: ID;
  code: string;
  type: CouponType;
  value: number;
  min_order?: number | null;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  is_active: boolean;
};

export type CouponPayload = Omit<Coupon, "id" | "business_id" | "used_count">;

export type ApplyCouponPayload = {
  code: string;
  order_total: number;
};

export type ApplyCouponResult = {
  code: string;
  type: CouponType;
  value: number;
  discount_amount: number;
  final_total: number;
};
