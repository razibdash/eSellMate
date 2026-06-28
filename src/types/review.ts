import type { ID } from "./common";

export type Review = {
  id: ID;
  business_id: ID;
  order_id: ID;
  customer_id: ID;
  product_id: ID;
  rating: number;
  comment?: string | null;
  is_approved: boolean;
  created_at: string;
  customer?: { id: ID; name: string } | null;
  product?: { id: ID; name: string } | null;
};

export type ReviewListResponse = {
  data: Review[];
  current_page?: number;
  per_page?: number;
  total?: number;
};

export type SubmitReviewPayload = {
  order_reference: string;
  product_id: ID;
  rating: number;
  comment?: string;
};

export type ApproveReviewPayload = {
  id: ID;
  is_approved: boolean;
};
