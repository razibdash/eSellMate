import type { ID } from "./common";

export type MessageTemplate = {
  id: ID;
  business_id?: ID | null;
  title: string;
  type: "order_confirmation" | "payment_reminder" | "delivery_update" | "custom";
  language: "bn" | "en" | "banglish";
  body: string;
  variables: string[];
  status: "active" | "inactive";
};
