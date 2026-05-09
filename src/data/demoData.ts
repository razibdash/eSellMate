import type { AiGeneration, AiInsight } from "@/types/ai";
import type { User } from "@/types/auth";
import type { Business } from "@/types/business";
import type { Customer } from "@/types/customer";
import type { MessageTemplate } from "@/types/message";
import type { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types/order";
import type { Category, Product } from "@/types/product";
import type { ChartPoint, DashboardSummary, ReportRow } from "@/types/report";
import type { Plan, Subscription, SubscriptionPayment } from "@/types/subscription";
import type { StockMovement } from "@/types/stock";

const now = new Date();
const iso = (daysAgo = 0) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const demoUser: User = {
  id: 1,
  name: "Nadia Rahman",
  email: "owner@shopbotbd.test",
  phone: "+8801711000000",
  role: "owner",
  status: "active",
  permissions: [
    "view_dashboard",
    "manage_products",
    "manage_customers",
    "create_orders",
    "edit_orders",
    "delete_orders",
    "manage_payments",
    "view_reports",
    "manage_staff",
    "manage_settings",
    "use_ai_tools",
    "manage_subscription"
  ]
};

export const demoBusiness: Business = {
  id: 1,
  owner_id: 1,
  name: "Fresh Achar House",
  slug: "fresh-achar-house",
  phone: "+8801711000000",
  email: "hello@freshachar.test",
  address: "Mirpur, Dhaka, Bangladesh",
  facebook_page_url: "https://facebook.com/freshacharhouse",
  whatsapp_number: "8801711000000",
  instagram_url: "https://instagram.com/freshacharhouse",
  currency: "BDT",
  timezone: "Asia/Dhaka",
  invoice_prefix: "FAH",
  invoice_footer: "Thank you for shopping with Fresh Achar House. Please check items during delivery.",
  status: "active"
};

export const demoCategories: Category[] = [
  { id: 1, business_id: 1, name: "Pickle / Achar", slug: "pickle-achar", description: "Homemade Bangladeshi achar", status: "active" },
  { id: 2, business_id: 1, name: "Homemade Snacks", slug: "homemade-snacks", description: "Snacks and treats", status: "active" },
  { id: 3, business_id: 1, name: "Gift Combos", slug: "gift-combos", description: "Bundle products", status: "active" },
  { id: 4, business_id: 1, name: "Seasonal Offers", slug: "seasonal-offers", description: "Limited time products", status: "active" }
];

export const demoProducts: Product[] = [
  { id: 1, business_id: 1, category_id: 1, category_name: "Pickle / Achar", name: "Garlic Pickle", slug: "garlic-pickle", sku: "ACH-GAR-250", description: "Premium homemade garlic pickle with mustard oil.", price: 250, cost_price: 155, discount_price: 225, stock_quantity: 18, low_stock_alert: 12, unit: "jar", status: "active", image: "https://placehold.co/640x480/ecfeff/155e75?text=Garlic+Pickle" },
  { id: 2, business_id: 1, category_id: 1, category_name: "Pickle / Achar", name: "Olive Pickle", slug: "olive-pickle", sku: "ACH-OLV-250", description: "Tangy olive pickle for rice, khichuri and snacks.", price: 280, cost_price: 170, stock_quantity: 7, low_stock_alert: 10, unit: "jar", status: "active", image: "https://placehold.co/640x480/fef3c7/92400e?text=Olive+Pickle" },
  { id: 3, business_id: 1, category_id: 1, category_name: "Pickle / Achar", name: "Mango Pickle", slug: "mango-pickle", sku: "ACH-MAN-250", description: "Classic raw mango achar with balanced spice.", price: 230, cost_price: 140, discount_price: 210, stock_quantity: 35, low_stock_alert: 10, unit: "jar", status: "active", image: "https://placehold.co/640x480/ffedd5/9a3412?text=Mango+Pickle" },
  { id: 4, business_id: 1, category_id: 1, category_name: "Pickle / Achar", name: "Chili Pickle", slug: "chili-pickle", sku: "ACH-CHI-200", description: "Extra spicy chili pickle for spice lovers.", price: 220, cost_price: 135, stock_quantity: 5, low_stock_alert: 8, unit: "jar", status: "active", image: "https://placehold.co/640x480/fee2e2/991b1b?text=Chili+Pickle" },
  { id: 5, business_id: 1, category_id: 1, category_name: "Pickle / Achar", name: "Mixed Pickle", slug: "mixed-pickle", sku: "ACH-MIX-300", description: "Mixed seasonal achar with homemade spices.", price: 320, cost_price: 205, stock_quantity: 22, low_stock_alert: 10, unit: "jar", status: "active", image: "https://placehold.co/640x480/dcfce7/166534?text=Mixed+Pickle" },
  { id: 6, business_id: 1, category_id: 2, category_name: "Homemade Snacks", name: "Chanachur Mix", slug: "chanachur-mix", sku: "SNK-CHA-500", description: "Crispy homemade chanachur mix.", price: 180, cost_price: 115, stock_quantity: 42, low_stock_alert: 15, unit: "pack", status: "active", image: "https://placehold.co/640x480/e0f2fe/0369a1?text=Chanachur" },
  { id: 7, business_id: 1, category_id: 2, category_name: "Homemade Snacks", name: "Nimki Pack", slug: "nimki-pack", sku: "SNK-NIM-300", description: "Crispy nimki for tea-time.", price: 150, cost_price: 90, stock_quantity: 24, low_stock_alert: 15, unit: "pack", status: "active", image: "https://placehold.co/640x480/f5f3ff/5b21b6?text=Nimki" },
  { id: 8, business_id: 1, category_id: 3, category_name: "Gift Combos", name: "Family Achar Combo", slug: "family-achar-combo", sku: "COM-FAM-001", description: "Garlic, mango and olive pickle combo.", price: 720, cost_price: 470, discount_price: 650, stock_quantity: 12, low_stock_alert: 6, unit: "box", status: "active", image: "https://placehold.co/640x480/f0fdfa/0f766e?text=Family+Combo" },
  { id: 9, business_id: 1, category_id: 3, category_name: "Gift Combos", name: "Premium Gift Box", slug: "premium-gift-box", sku: "COM-PRE-001", description: "Premium packaging for gift delivery.", price: 999, cost_price: 690, stock_quantity: 9, low_stock_alert: 5, unit: "box", status: "active", image: "https://placehold.co/640x480/fae8ff/86198f?text=Gift+Box" },
  { id: 10, business_id: 1, category_id: 4, category_name: "Seasonal Offers", name: "Winter Special Achar", slug: "winter-special-achar", sku: "SEA-WIN-001", description: "Seasonal limited batch pickle.", price: 350, cost_price: 215, stock_quantity: 0, low_stock_alert: 5, unit: "jar", status: "draft", image: "https://placehold.co/640x480/e2e8f0/334155?text=Coming+Soon" }
];

const names = [
  "Ayesha Akter", "Rafi Hossain", "Mitu Rahman", "Tanvir Hasan", "Sadia Islam", "Farhana Yasmin", "Rakib Ahmed", "Nusrat Jahan", "Imran Khan", "Jannatul Mawa",
  "Arif Chowdhury", "Sharmin Sultana", "Mehedi Hasan", "Tanzila Akter", "Mahbub Alam", "Tania Rahman", "Nabila Noor", "Sakib Mahmud", "Morshed Ali", "Lamia Chowdhury"
];

export const demoCustomers: Customer[] = names.map((name, index) => ({
  id: index + 1,
  business_id: 1,
  name,
  phone: `88017${String(11000000 + index * 1379).slice(0, 8)}`,
  email: index % 3 === 0 ? `${name.toLowerCase().split(" ")[0]}@example.com` : undefined,
  address: ["Mirpur", "Uttara", "Dhanmondi", "Banani", "Mohammadpur"][index % 5] + ", Dhaka",
  area: ["Mirpur", "Uttara", "Dhanmondi", "Banani", "Mohammadpur"][index % 5],
  city: "Dhaka",
  total_orders: 0,
  total_spent: 0,
  last_order_at: iso(index % 18),
  note: index % 4 === 0 ? "Repeat buyer. Prefers afternoon delivery." : undefined,
  status: index === 11 ? "blocked" : "active"
}));

function makeItem(orderId: number, product: Product, quantity: number): OrderItem {
  const unit = product.discount_price ?? product.price;
  return {
    id: Number(`${orderId}${product.id}`),
    order_id: orderId,
    product_id: product.id,
    product_name_snapshot: product.name,
    sku_snapshot: product.sku,
    unit_price: unit,
    quantity,
    discount_amount: product.discount_price ? product.price - product.discount_price : 0,
    line_total: unit * quantity
  };
}

const statusCycle: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "returned"];
const paymentCycle: PaymentStatus[] = ["unpaid", "partial", "paid", "paid", "paid", "paid", "unpaid", "refunded"];

export const demoOrders: Order[] = Array.from({ length: 50 }).map((_, index) => {
  const id = index + 1;
  const customer = demoCustomers[index % demoCustomers.length];
  const firstProduct = demoProducts[index % 9];
  const secondProduct = demoProducts[(index + 3) % 9];
  const items = [makeItem(id, firstProduct, (index % 3) + 1), ...(index % 4 === 0 ? [makeItem(id, secondProduct, 1)] : [])];
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const discount = index % 5 === 0 ? 30 : 0;
  const delivery = index % 6 === 0 ? 0 : 70;
  const total = subtotal - discount + delivery;
  const order_status = statusCycle[index % statusCycle.length];
  const payment_status = paymentCycle[index % paymentCycle.length];
  const paid = payment_status === "paid" ? total : payment_status === "partial" ? Math.round(total / 2) : 0;
  return {
    id,
    business_id: 1,
    customer_id: customer.id,
    created_by: 1,
    assigned_to: index % 3 === 0 ? 4 : undefined,
    order_number: `ORD-2026-${String(id).padStart(5, "0")}`,
    invoice_number: `FAH-2026-${String(id).padStart(5, "0")}`,
    order_source: ["facebook", "whatsapp", "instagram", "phone", "website"][index % 5] as Order["order_source"],
    order_status,
    payment_status,
    delivery_status: order_status === "delivered" ? "delivered" : order_status === "cancelled" ? "failed" : order_status === "shipped" ? "in_transit" : "ready",
    subtotal,
    discount_amount: discount,
    delivery_charge: delivery,
    total_amount: total,
    paid_amount: paid,
    due_amount: Math.max(total - paid, 0),
    customer_name_snapshot: customer.name,
    customer_phone_snapshot: customer.phone,
    delivery_address_snapshot: customer.address,
    note: index % 7 === 0 ? "Customer asked for quick delivery." : undefined,
    confirmed_at: ["confirmed", "processing", "packed", "shipped", "delivered"].includes(order_status) ? iso(index % 25) : undefined,
    delivered_at: order_status === "delivered" ? iso(index % 7) : undefined,
    cancelled_at: order_status === "cancelled" ? iso(index % 8) : undefined,
    created_at: iso(index % 30),
    items,
    payments: paid > 0 ? [{ id, business_id: 1, order_id: id, payment_method: index % 2 === 0 ? "bkash" : "cod", amount: paid, payment_status: "paid", paid_at: iso(index % 30), note: "Demo payment" }] : [],
    histories: [
      { id: Number(`${id}1`), order_id: id, changed_by: 1, new_status: "pending", status_type: "order", created_at: iso(index % 30) },
      { id: Number(`${id}2`), order_id: id, changed_by: 1, previous_status: "pending", new_status: order_status, status_type: "order", created_at: iso(index % 20) }
    ]
  };
});

// Update customer cached metrics after orders are created.
demoCustomers.forEach((customer) => {
  const orders = demoOrders.filter((order) => order.customer_id === customer.id && order.order_status !== "cancelled");
  customer.total_orders = orders.length;
  customer.total_spent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  customer.last_order_at = orders[0]?.created_at ?? customer.last_order_at;
});

export const demoStockMovements: StockMovement[] = demoProducts.flatMap((product, index) => [
  { id: Number(`${product.id}01`), business_id: 1, product_id: product.id, product_name: product.name, movement_type: "opening", quantity: 50, previous_stock: 0, new_stock: 50, note: "Opening stock", created_at: iso(30 + index) },
  { id: Number(`${product.id}02`), business_id: 1, product_id: product.id, product_name: product.name, movement_type: "order_sale", quantity: -Math.max(1, index + 2), previous_stock: 50, new_stock: product.stock_quantity, reference_type: "order", reference_id: index + 1, note: "Stock deducted from order", created_at: iso(index + 1) }
]);

export const demoMessageTemplates: MessageTemplate[] = [
  { id: 1, business_id: null, title: "Order Confirmation", type: "order_confirmation", language: "en", body: "Hello {customer_name}, your order {invoice_no} has been confirmed. Total amount: {total_amount}. Thank you for shopping with {business_name}.", variables: ["customer_name", "invoice_no", "total_amount", "business_name"], status: "active" },
  { id: 2, business_id: null, title: "Bangla Order Confirmation", type: "order_confirmation", language: "bn", body: "প্রিয় {customer_name}, আপনার অর্ডার {invoice_no} কনফার্ম করা হয়েছে। মোট বিল: {total_amount}. ধন্যবাদ।", variables: ["customer_name", "invoice_no", "total_amount"], status: "active" },
  { id: 3, business_id: 1, title: "Payment Reminder", type: "payment_reminder", language: "banglish", body: "Hi {customer_name}, apnar order {invoice_no} er due amount {due_amount}. Payment korle delivery process fast hobe.", variables: ["customer_name", "invoice_no", "due_amount"], status: "active" },
  { id: 4, business_id: 1, title: "Delivery Update", type: "delivery_update", language: "en", body: "Your order {invoice_no} is now {delivery_status}. Thank you, {business_name}.", variables: ["invoice_no", "delivery_status", "business_name"], status: "active" }
];

export const demoAiInsights: AiInsight[] = [
  { id: 1, business_id: 1, type: "best_seller", title: "Garlic Pickle is trending", message: "Garlic Pickle is your best-selling product this week. Stock may finish soon if the current sales trend continues.", severity: "info", is_read: false, created_at: iso(1) },
  { id: 2, business_id: 1, type: "low_stock", title: "Olive Pickle needs restock", message: "Olive Pickle is below the low-stock alert quantity. Restock before launching a new campaign.", severity: "warning", is_read: false, created_at: iso(2) },
  { id: 3, business_id: 1, type: "anomaly", title: "Cancellation rate increased", message: "Cancelled orders are slightly higher than usual from Facebook source. Check delivery follow-up messages.", severity: "critical", is_read: false, created_at: iso(3) }
];

export const demoAiGenerations: AiGeneration[] = [
  { id: 1, business_id: 1, user_id: 1, type: "caption", input_text: "Garlic Pickle", output_text: "ঝাল-টক-স্বাদের ঘরোয়া Garlic Pickle এখন Fresh Achar House-এ। অর্ডার করতে inbox করুন। #Achar #Homemade", language: "bn", tokens_used: 81, status: "success", created_at: iso(1) },
  { id: 2, business_id: 1, user_id: 1, type: "reply", input_text: "Price koto?", output_text: "ধন্যবাদ! এই পণ্যের দাম ৳250. আপনার location জানালে delivery charge সহ total জানিয়ে দিতে পারবো।", language: "bn", tokens_used: 52, status: "success", created_at: iso(2) }
];

export const demoPlans: Plan[] = [
  { id: 1, name: "Free", slug: "free", price_monthly: 0, order_limit: 50, product_limit: 20, staff_limit: 1, ai_limit: 0, features: ["50 orders/month", "20 products", "Basic invoice", "Basic support"], status: "active" },
  { id: 2, name: "Basic", slug: "basic", price_monthly: 499, price_yearly: 4990, order_limit: 300, product_limit: 100, staff_limit: 2, ai_limit: 20, features: ["Order management", "Products and customers", "Invoice", "Standard support"], status: "active" },
  { id: 3, name: "Pro", slug: "pro", price_monthly: 999, price_yearly: 9990, order_limit: 1500, product_limit: 500, staff_limit: 5, ai_limit: 200, features: ["Stock management", "Reports", "AI caption/reply", "Priority support"], status: "active" },
  { id: 4, name: "Business", slug: "business", price_monthly: 1999, price_yearly: 19990, order_limit: null, product_limit: null, staff_limit: 15, ai_limit: 1000, features: ["Unlimited orders", "Advanced report", "AI insights", "Staff permissions"], status: "active" }
];

export const demoSubscription: Subscription = {
  id: 1,
  business_id: 1,
  plan_id: 3,
  plan: demoPlans[2],
  status: "active",
  starts_at: iso(20),
  ends_at: iso(-10),
  trial_ends_at: iso(10),
  billing_cycle: "monthly"
};

export const demoSubscriptionPayments: SubscriptionPayment[] = [
  { id: 1, business_id: 1, subscription_id: 1, amount: 999, payment_method: "bKash", transaction_id: "BKS-DEMO-001", status: "paid", paid_at: iso(20), note: "Monthly subscription" },
  { id: 2, business_id: 1, subscription_id: 1, amount: 999, payment_method: "Manual", transaction_id: "MAN-DEMO-002", status: "pending", note: "Upcoming payment" }
];

export const demoStaff: User[] = [
  demoUser,
  { id: 2, name: "Rasel Ahmed", email: "manager@shopbotbd.test", phone: "8801711000001", role: "manager", status: "active", permissions: ["view_dashboard", "manage_products", "manage_customers", "create_orders", "edit_orders", "manage_payments", "view_reports", "use_ai_tools"] },
  { id: 3, name: "Mim Akter", email: "staff@shopbotbd.test", phone: "8801711000002", role: "staff", status: "active", permissions: ["view_dashboard", "manage_customers", "create_orders", "edit_orders"] },
  { id: 4, name: "Joy Delivery", email: "delivery@shopbotbd.test", phone: "8801711000003", role: "delivery", status: "active", permissions: ["view_dashboard", "edit_orders"] }
];

export const demoNotifications = [
  { id: 1, type: "low_stock", title: "Olive Pickle low stock", message: "Only 7 jars left. Restock soon.", is_read: false, created_at: iso(1) },
  { id: 2, type: "order", title: "New WhatsApp order", message: "A new order was created from WhatsApp.", is_read: false, created_at: iso(0) },
  { id: 3, type: "payment", title: "Payment received", message: "bKash payment was marked as paid.", is_read: true, created_at: iso(2) }
];

export function buildDashboardSummary(): DashboardSummary {
  const today = demoOrders.filter((order) => new Date(order.created_at).toDateString() === new Date().toDateString());
  return {
    today_orders: today.length || 8,
    today_sales: today.reduce((sum, order) => sum + order.total_amount, 0) || 12640,
    monthly_sales: demoOrders.reduce((sum, order) => sum + order.total_amount, 0),
    pending_orders: demoOrders.filter((order) => order.order_status === "pending").length,
    delivered_orders: demoOrders.filter((order) => order.order_status === "delivered").length,
    low_stock_count: demoProducts.filter((product) => product.stock_quantity <= product.low_stock_alert).length,
    unpaid_amount: demoOrders.reduce((sum, order) => sum + order.due_amount, 0),
    repeat_customers: demoCustomers.filter((customer) => customer.total_orders > 1).length
  };
}

export function buildSalesChart(): ChartPoint[] {
  return Array.from({ length: 12 }).map((_, index) => ({
    label: new Date(now.getFullYear(), now.getMonth() - 11 + index, 1).toLocaleDateString("en", { month: "short" }),
    value: 18000 + index * 3700 + (index % 3) * 2100,
    orders: 18 + index * 4
  }));
}

export function buildProductReport(): ReportRow[] {
  return demoProducts.slice(0, 8).map((product, index) => ({
    Product: product.name,
    Category: product.category_name ?? "—",
    Sold: 60 - index * 4,
    Revenue: (60 - index * 4) * (product.discount_price ?? product.price),
    Stock: product.stock_quantity
  }));
}

export function buildCustomerReport(): ReportRow[] {
  return demoCustomers.slice(0, 12).map((customer) => ({
    Customer: customer.name,
    Phone: customer.phone,
    Orders: customer.total_orders,
    Spent: customer.total_spent,
    Status: customer.status
  }));
}

export function buildPaymentReport(): ReportRow[] {
  return ["cash", "bkash", "nagad", "cod", "bank"].map((method, index) => ({
    Method: method,
    Orders: 18 - index * 2,
    Amount: 32000 - index * 3700,
    SuccessRate: `${96 - index * 3}%`
  }));
}

export function buildDeliveryReport(): ReportRow[] {
  return ["ready", "sent", "in_transit", "delivered", "failed", "returned"].map((status, index) => ({
    Status: status,
    Orders: 20 - index * 2,
    AverageTime: `${1 + index} days`
  }));
}
