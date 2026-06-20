import type { ID } from "./common";

export type SmsType = "confirmation" | "delivery";
export type SmsStatus = "pending" | "sent" | "failed";

export type SmsLog = {
  id: ID;
  business_id: ID;
  order_id: ID;
  phone: string;
  message: string;
  type: SmsType;
  status: SmsStatus;
  attempts: number;
  provider_response?: string | null;
  sent_at?: string | null;
  created_at: string;
};
