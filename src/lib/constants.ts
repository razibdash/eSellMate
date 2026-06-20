import type { DeliveryStatus, OrderSource, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ShopBot BD";

export const orderStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "returned"];
export const paymentStatuses: PaymentStatus[] = ["unpaid", "partial", "paid", "refunded"];
export const deliveryStatuses: DeliveryStatus[] = ["not_assigned", "ready", "sent", "in_transit", "delivered", "failed", "returned"];
export const orderSources: OrderSource[] = ["facebook", "whatsapp", "instagram", "phone", "website", "walkin", "other"];
export const paymentMethods: PaymentMethod[] = ["cash", "bkash", "nagad", "rocket", "bank", "card", "cod", "other"];

export const statusColorMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-700 ring-slate-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-rose-50 text-rose-700 ring-rose-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  packed: "bg-purple-50 text-purple-700 ring-purple-200",
  shipped: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  returned: "bg-orange-50 text-orange-700 ring-orange-200",
  unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  refunded: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  critical: "bg-rose-50 text-rose-700 ring-rose-200"
};
