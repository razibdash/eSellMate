import type { ID } from "./common";

export type OrderSource = "facebook" | "whatsapp" | "instagram" | "phone" | "website" | "walkin" | "other";
export type OrderStatus = "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";
export type DeliveryStatus = "not_assigned" | "ready" | "sent" | "in_transit" | "delivered" | "failed" | "returned";
export type PaymentMethod = "cash" | "bkash" | "nagad" | "rocket" | "bank" | "card" | "cod" | "other";

export type OrderItem = {
  id: ID;
  order_id?: ID;
  product_id?: ID | null;
  product_name_snapshot: string;
  sku_snapshot?: string;
  unit_price: number;
  quantity: number;
  discount_amount: number;
  line_total: number;
};

export type Payment = {
  id: ID;
  business_id: ID;
  order_id: ID;
  payment_method: PaymentMethod;
  amount: number;
  transaction_id?: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  paid_at?: string;
  note?: string;
};

export type OrderStatusHistory = {
  id: ID;
  order_id: ID;
  changed_by?: ID;
  previous_status?: string;
  new_status: string;
  status_type: "order" | "payment" | "delivery";
  note?: string;
  created_at: string;
};

export type Order = {
  id: ID;
  business_id: ID;
  customer_id?: ID | null;
  created_by?: ID | null;
  assigned_to?: ID | null;
  order_number: string;
  invoice_number?: string;
  order_source: OrderSource;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  subtotal: number;
  discount_amount: number;
  delivery_charge: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  customer_name_snapshot?: string;
  customer_phone_snapshot?: string;
  delivery_address_snapshot?: string;
  note?: string;
  confirmed_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  items: OrderItem[];
  payments?: Payment[];
  histories?: OrderStatusHistory[];
};

export type OrderPayload = {
  customer_id?: ID | null;
  customer_name_snapshot?: string;
  customer_phone_snapshot?: string;
  delivery_address_snapshot?: string;
  order_source: OrderSource;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  discount_amount: number;
  delivery_charge: number;
  paid_amount: number;
  note?: string;
  items: Omit<OrderItem, "id" | "order_id" | "line_total">[];
};

export type AddPaymentPayload = {
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  paid_at?: string;
  note?: string;
};

export type AddPaymentResult = {
  payment: Payment;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  is_paid_full: boolean;
};

export type Invoice = {
  id: ID;
  business_id: ID;
  order_id: ID;
  invoice_number: string;
  pdf_path?: string;
  generated_at: string;
};
