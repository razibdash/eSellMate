import type { ID, Status } from "./common";
import type { Storefront } from "./storefront";

export type Business = {
  id: ID;
  owner_id: ID;
  name: string;
  slug: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebook_page_url?: string;
  whatsapp_number?: string;
  instagram_url?: string;
  currency: string;
  timezone: string;
  invoice_prefix: string;
  invoice_footer?: string;
  status: Status;
  storefront?: Storefront;
};

export type BusinessSettings = Pick<
  Business,
  "name" | "logo" | "phone" | "email" | "address" | "facebook_page_url" | "whatsapp_number" | "instagram_url" | "currency" | "timezone" | "invoice_prefix" | "invoice_footer"
>;
