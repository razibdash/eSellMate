import type { ID } from "./common";
import type { Business } from "./business";
import type { Category, Product } from "./product";

export type StorefrontSectionSettings = {
  show_announcement_bar?: boolean;
  show_header?: boolean;
  show_hero?: boolean;
  show_filters?: boolean;
  show_categories_strip?: boolean;
  show_featured_products?: boolean;
  show_product_grid?: boolean;
  show_footer?: boolean;
};

export type StorefrontContentSettings = {
  announcement_text?: string;
  nav_label?: string;
  hero_badge?: string;
  hero_title?: string;
  hero_description?: string;
  hero_primary_cta_label?: string;
  hero_secondary_cta_label?: string;
  hero_stat_label?: string;
  featured_section_eyebrow?: string;
  featured_section_title?: string;
  featured_section_description?: string;
  products_section_eyebrow?: string;
  products_section_title?: string;
  products_section_description?: string;
  filters_section_title?: string;
  filters_section_description?: string;
  footer_title?: string;
  footer_description?: string;
  footer_note?: string;
};

export type StorefrontSettingsJson = {
  sections?: StorefrontSectionSettings;
  content?: StorefrontContentSettings;
};

export type Storefront = {
  id: ID;
  business_id: ID;
  subdomain: string;
  store_name: string;
  store_description?: string | null;
  logo_path?: string | null;
  banner_path?: string | null;
  theme_color: string;
  delivery_charge: number;
  contact_number?: string | null;
  social_links?: Record<string, string | null> | null;
  settings_json?: StorefrontSettingsJson | null;
  status: "active" | "inactive" | "suspended";
};

export type StorefrontProduct = Product & {
  category?: Category | null;
  images?: Array<{
    id: ID;
    image_path: string;
    is_primary: boolean;
    sort_order?: number;
  }>;
  is_published?: boolean;
  is_featured?: boolean;
};

export type StorefrontOverview = {
  storefront: Storefront;
  business: Pick<Business, "id" | "name" | "slug" | "phone" | "email" | "address">;
  categories: Category[];
  featured_products: StorefrontProduct[];
};

export type CartItem = {
  product_id: ID;
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  stock_quantity: number;
};

export type PublicCheckoutPayload = {
  customer: {
    name: string;
    phone: string;
    delivery_address: string;
    delivery_note?: string;
  };
  payment_method: "bkash" | "cod";
  delivery_charge?: number;
  items: Array<{
    product_id: ID;
    quantity: number;
  }>;
};

export type PublicCheckoutResponse = {
  order: {
    id: ID;
    public_reference: string;
    order_number: string;
    invoice_number: string;
    total_amount: number;
    payment_status: string;
    order_status: string;
  };
  payment: {
    id: ID;
    payment_method: string;
    payment_status: string;
    checkout_url?: string | null;
  };
  redirect_url?: string | null;
  payment_status_url?: string | null;
};

export type StorefrontSettingsPayload = Partial<
  Pick<
    Storefront,
    | "subdomain"
    | "store_name"
    | "store_description"
    | "theme_color"
    | "delivery_charge"
    | "contact_number"
    | "social_links"
    | "settings_json"
    | "status"
  >
> & {
  featured_product_ids?: ID[];
  hidden_product_ids?: ID[];
};
