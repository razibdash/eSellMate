import type { ID } from "./common";

export type AiLanguage = "bn" | "en" | "banglish";
export type AiTone = "friendly" | "premium" | "funny" | "emotional" | "short";

export type AiGeneration = {
  id: ID;
  business_id: ID;
  user_id?: ID;
  type: "caption" | "reply" | "insight" | "summary";
  input_text?: string;
  output_text?: string;
  language?: AiLanguage;
  tokens_used?: number;
  status: "success" | "failed";
  error_message?: string;
  created_at: string;
};

export type AiInsight = {
  id: ID;
  business_id: ID;
  type: "best_seller" | "low_stock" | "slow_moving" | "repeat_customer" | "anomaly" | "sales_summary";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  is_read: boolean;
  created_at: string;
};

export type CaptionPayload = {
  product_name: string;
  product_type?: string;
  price?: number;
  offer?: string;
  tone: AiTone;
  language: AiLanguage;
};

export type ReplyPayload = {
  customer_question: string;
  product_info?: string;
  business_tone?: AiTone;
  language: AiLanguage;
};

export type AiOutput = {
  result: string;
  short_version?: string;
  hashtags?: string[];
};
