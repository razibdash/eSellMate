// @ts-nocheck
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { CaptionPayload, ReplyPayload } from "@/types/ai";
import type { BusinessSettings } from "@/types/business";
import type { CustomerPayload } from "@/types/customer";
import type { OrderPayload } from "@/types/order";
import type { CategoryPayload, ProductPayload } from "@/types/product";
import { includesSearch, slugify } from "@/lib/utils";
import {
  buildCustomerReport,
  buildDashboardSummary,
  buildDeliveryReport,
  buildPaymentReport,
  buildProductReport,
  buildSalesChart,
  demoAiGenerations,
  demoAiInsights,
  demoBusiness,
  demoCategories,
  demoCustomers,
  demoMessageTemplates,
  demoNotifications,
  demoOrders,
  demoPlans,
  demoProducts,
  demoStaff,
  demoStockMovements,
  demoSubscription,
  demoSubscriptionPayments,
  demoUser
} from "./demoData";

let business = { ...demoBusiness };
let categories = [...demoCategories];
let products = [...demoProducts];
let customers = [...demoCustomers];
let orders = [...demoOrders];
let aiGenerations = [...demoAiGenerations];
let aiInsights = [...demoAiInsights];
let staff = [...demoStaff];
let subscription = { ...demoSubscription };
let messageTemplates = [...demoMessageTemplates];
let notifications = [...demoNotifications];

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readArgs(args: string | FetchArgs) {
  if (typeof args === "string") return { url: args, method: "GET", params: undefined, body: undefined };
  return {
    url: args.url,
    method: (args.method || "GET").toUpperCase(),
    params: args.params as Record<string, string | number | undefined> | undefined,
    body: args.body
  };
}

function ok<T>(data: T) {
  return { data };
}

function fail(message: string, status = 404) {
  return { error: { status, data: { message } } as FetchBaseQueryError };
}

function nextId(items: Array<{ id: string | number }>) {
  return items.length ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1;
}

function calculateOrder(payload: OrderPayload, id?: number) {
  const items = payload.items.map((item, index) => ({
    ...item,
    id: Number(`${id ?? nextId(orders)}${index + 1}`),
    order_id: id ?? nextId(orders),
    line_total: (item.unit_price * item.quantity) - (item.discount_amount || 0)
  }));
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const total_amount = subtotal - payload.discount_amount + payload.delivery_charge;
  const paid_amount = payload.paid_amount;
  const due_amount = Math.max(total_amount - paid_amount, 0);
  const payment_status = paid_amount <= 0 ? "unpaid" : paid_amount < total_amount ? "partial" : "paid";
  return { items, subtotal, total_amount, paid_amount, due_amount, payment_status };
}

/**
 * Demo-data RTK Query baseQuery.
 * It mirrors the planned Laravel REST API, so switching to real API only needs env changes.
 */
export const demoBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args) => {
  await delay();
  const { url, method, params, body } = readArgs(args);
  const cleanUrl = url.split("?")[0];
  const segments = cleanUrl.replace(/^\//, "").split("/").filter(Boolean);

  try {
    // Auth
    if (cleanUrl === "/auth/login" && method === "POST") return ok({ user: demoUser, token: "demo-token-shopbot-bd" });
    if (cleanUrl === "/auth/register" && method === "POST") return ok({ user: demoUser, token: "demo-token-shopbot-bd" });
    if (cleanUrl === "/auth/me") return ok(demoUser);
    if (cleanUrl === "/auth/logout" && method === "POST") return ok({ success: true });
    if (cleanUrl.includes("forgot-password") || cleanUrl.includes("reset-password")) return ok({ success: true, message: "Demo password flow completed." });

    // Business
    if (cleanUrl === "/business" && method === "GET") return ok(business);
    if (cleanUrl === "/business" && method === "PUT") {
      business = { ...business, ...(body as BusinessSettings) };
      return ok(business);
    }
    if (cleanUrl === "/business/settings") return ok(business);
    if (cleanUrl === "/business/logo") return ok({ logo: business.logo ?? "https://placehold.co/200x200?text=ShopBot" });

    // Categories
    if (cleanUrl === "/categories" && method === "GET") return ok(categories);
    if (cleanUrl === "/categories" && method === "POST") {
      const payload = body as CategoryPayload;
      const item = { ...payload, id: nextId(categories), business_id: 1, slug: payload.slug || slugify(payload.name), status: payload.status || "active" };
      categories.unshift(item);
      return ok(item);
    }
    if (segments[0] === "categories" && segments[1]) {
      const id = Number(segments[1]);
      const index = categories.findIndex((category) => Number(category.id) === id);
      if (index < 0) return fail("Category not found");
      if (method === "PUT") {
        categories[index] = { ...categories[index], ...(body as CategoryPayload) };
        return ok(categories[index]);
      }
      if (method === "DELETE") {
        const deleted = categories.splice(index, 1)[0];
        return ok(deleted);
      }
    }

    // Products
    if (cleanUrl === "/products" && method === "GET") {
      const search = String(params?.search ?? "");
      const filtered = products.filter((product) => {
        const matchesStatus = params?.status ? product.status === params.status : true;
        const matchesCategory = params?.category_id ? Number(product.category_id) === Number(params.category_id) : true;
        return matchesStatus && matchesCategory && includesSearch([product.name, product.sku, product.category_name], search);
      });
      return ok(filtered);
    }
    if (cleanUrl === "/products/low-stock") {
      return ok(products.filter((product) => product.stock_quantity <= product.low_stock_alert));
    }
    if (cleanUrl === "/products" && method === "POST") {
      const payload = body as ProductPayload;
      const category = categories.find((item) => Number(item.id) === Number(payload.category_id));
      const item = { ...payload, id: nextId(products), business_id: 1, category_name: category?.name, slug: payload.slug || slugify(payload.name) };
      products.unshift(item);
      return ok(item);
    }
    if (segments[0] === "products" && segments[1]) {
      const id = Number(segments[1]);
      const index = products.findIndex((product) => Number(product.id) === id);
      if (index < 0) return fail("Product not found");
      if (method === "GET") return ok(products[index]);
      if (method === "PUT") {
        const payload = body as ProductPayload;
        const category = categories.find((item) => Number(item.id) === Number(payload.category_id));
        products[index] = { ...products[index], ...payload, category_name: category?.name };
        return ok(products[index]);
      }
      if (method === "DELETE") {
        const deleted = products.splice(index, 1)[0];
        return ok(deleted);
      }
      if (segments[2] === "image") return ok({ image: products[index].image });
    }

    // Customers
    if (cleanUrl === "/customers" && method === "GET") {
      const search = String(params?.search ?? "");
      return ok(customers.filter((customer) => includesSearch([customer.name, customer.phone, customer.email, customer.area, customer.city], search)));
    }
    if (cleanUrl === "/customers" && method === "POST") {
      const payload = body as CustomerPayload;
      const item = { ...payload, id: nextId(customers), business_id: 1, total_orders: 0, total_spent: 0 };
      customers.unshift(item);
      return ok(item);
    }
    if (segments[0] === "customers" && segments[1]) {
      const id = Number(segments[1]);
      const index = customers.findIndex((customer) => Number(customer.id) === id);
      if (index < 0) return fail("Customer not found");
      if (segments[2] === "orders") return ok(orders.filter((order) => Number(order.customer_id) === id));
      if (method === "GET") return ok(customers[index]);
      if (method === "PUT") {
        customers[index] = { ...customers[index], ...(body as CustomerPayload) };
        return ok(customers[index]);
      }
      if (method === "DELETE") {
        const deleted = customers.splice(index, 1)[0];
        return ok(deleted);
      }
    }

    // Orders
    if (cleanUrl === "/orders" && method === "GET") {
      const search = String(params?.search ?? "");
      const filtered = orders.filter((order) => {
        const status = params?.status ? order.order_status === params.status : true;
        const source = params?.source ? order.order_source === params.source : true;
        return status && source && includesSearch([order.order_number, order.invoice_number, order.customer_name_snapshot, order.customer_phone_snapshot], search);
      });
      return ok(filtered);
    }
    if (cleanUrl === "/orders" && method === "POST") {
      const payload = body as OrderPayload;
      const id = nextId(orders);
      const calc = calculateOrder(payload, id);
      const customer = customers.find((item) => Number(item.id) === Number(payload.customer_id));
      const order = {
        id,
        business_id: 1,
        created_by: 1,
        order_number: `ORD-2026-${String(id).padStart(5, "0")}`,
        invoice_number: `FAH-2026-${String(id).padStart(5, "0")}`,
        created_at: new Date().toISOString(),
        ...payload,
        ...calc,
        customer_name_snapshot: payload.customer_name_snapshot || customer?.name,
        customer_phone_snapshot: payload.customer_phone_snapshot || customer?.phone,
        delivery_address_snapshot: payload.delivery_address_snapshot || customer?.address,
        histories: [{ id: Number(`${id}1`), order_id: id, changed_by: 1, new_status: payload.order_status, status_type: "order", created_at: new Date().toISOString() }]
      };
      orders.unshift(order);
      return ok(order);
    }
    if (segments[0] === "orders" && segments[1]) {
      const id = Number(segments[1]);
      const index = orders.findIndex((order) => Number(order.id) === id);
      if (index < 0) return fail("Order not found");
      if (segments[2] === "invoice" && segments[3] === "generate") return ok({ id, business_id: 1, order_id: id, invoice_number: orders[index].invoice_number, generated_at: new Date().toISOString() });
      if (segments[2] === "invoice") return ok({ id, business_id: 1, order_id: id, invoice_number: orders[index].invoice_number, generated_at: orders[index].created_at });
      if (segments[2] === "payments" && method === "POST") {
        const payment = { id: Date.now(), business_id: 1, order_id: id, ...(body as object) };
        orders[index].payments = [...(orders[index].payments || []), payment as never];
        return ok(payment);
      }
      if (segments[2] === "status" && method === "PUT") {
        orders[index] = { ...orders[index], order_status: (body as { status: never }).status };
        return ok(orders[index]);
      }
      if (segments[2] === "payment-status" && method === "PUT") {
        orders[index] = { ...orders[index], payment_status: (body as { status: never }).status };
        return ok(orders[index]);
      }
      if (segments[2] === "delivery-status" && method === "PUT") {
        orders[index] = { ...orders[index], delivery_status: (body as { status: never }).status };
        return ok(orders[index]);
      }
      if (method === "GET") return ok(orders[index]);
      if (method === "PUT") {
        const payload = body as OrderPayload;
        const calc = calculateOrder(payload, id);
        orders[index] = { ...orders[index], ...payload, ...calc };
        return ok(orders[index]);
      }
      if (method === "DELETE") {
        orders[index] = { ...orders[index], order_status: "cancelled" };
        return ok(orders[index]);
      }
    }

    // Reports
    if (cleanUrl === "/reports/dashboard") return ok({ summary: buildDashboardSummary(), sales_chart: buildSalesChart(), insights: aiInsights, recent_orders: orders.slice(0, 8), top_products: buildProductReport().slice(0, 6) });
    if (cleanUrl === "/reports/sales") return ok({ rows: buildSalesChart(), summary: buildDashboardSummary() });
    if (cleanUrl === "/reports/products") return ok({ rows: buildProductReport() });
    if (cleanUrl === "/reports/customers") return ok({ rows: buildCustomerReport() });
    if (cleanUrl === "/reports/payments") return ok({ rows: buildPaymentReport() });
    if (cleanUrl === "/reports/delivery") return ok({ rows: buildDeliveryReport() });
    if (cleanUrl === "/reports/low-stock") return ok({ rows: products.filter((product) => product.stock_quantity <= product.low_stock_alert) });

    // AI
    if (cleanUrl === "/ai/caption" && method === "POST") {
      const payload = body as CaptionPayload;
      const result = payload.language === "en"
        ? `${payload.product_name} is now available at Fresh Achar House. Fresh taste, clean packaging and quick delivery. Order now!`
        : `${payload.product_name} এখন Fresh Achar House-এ পাওয়া যাচ্ছে। ঘরোয়া স্বাদ, সুন্দর প্যাকেজিং, দ্রুত ডেলিভারি। অর্ডার করতে inbox করুন।`;
      const gen = { id: nextId(aiGenerations), business_id: 1, user_id: 1, type: "caption" as const, input_text: payload.product_name, output_text: result, language: payload.language, tokens_used: 80, status: "success" as const, created_at: new Date().toISOString() };
      aiGenerations.unshift(gen);
      return ok({ result, short_version: result.slice(0, 95), hashtags: ["#ShopBotBD", "#FreshAchar", "#Homemade"] });
    }
    if (cleanUrl === "/ai/reply" && method === "POST") {
      const payload = body as ReplyPayload;
      const result = payload.language === "en"
        ? "Thanks for your message! Please share your location so we can confirm the delivery charge and total amount."
        : "ধন্যবাদ! আপনার location জানালে delivery charge সহ total amount জানিয়ে দিতে পারবো।";
      const gen = { id: nextId(aiGenerations), business_id: 1, user_id: 1, type: "reply" as const, input_text: payload.customer_question, output_text: result, language: payload.language, tokens_used: 52, status: "success" as const, created_at: new Date().toISOString() };
      aiGenerations.unshift(gen);
      return ok({ result, short_version: result });
    }
    if (cleanUrl === "/ai/insights") return ok(aiInsights);
    if (cleanUrl === "/ai/insights/generate" && method === "POST") return ok(aiInsights);
    if (cleanUrl === "/ai/history") return ok(aiGenerations);

    // Staff and settings
    if (cleanUrl === "/staff" && method === "GET") return ok(staff);
    if (cleanUrl === "/staff" && method === "POST") {
      const item = { ...(body as object), id: nextId(staff), status: "active" };
      staff.push(item as never);
      return ok(item);
    }
    if (segments[0] === "staff" && segments[1]) {
      const id = Number(segments[1]);
      const index = staff.findIndex((item) => Number(item.id) === id);
      if (index < 0) return fail("Staff not found");
      if (method === "PUT") {
        staff[index] = { ...staff[index], ...(body as object) };
        return ok(staff[index]);
      }
      if (method === "DELETE") {
        const deleted = staff.splice(index, 1)[0];
        return ok(deleted);
      }
      return ok(staff[index]);
    }
    if (cleanUrl === "/message-templates") return ok(messageTemplates);
    if (cleanUrl === "/message-templates" && method === "POST") {
      const item = { ...(body as object), id: nextId(messageTemplates), business_id: 1, status: "active" };
      messageTemplates.push(item as never);
      return ok(item);
    }

    // Subscriptions
    if (cleanUrl === "/plans") return ok(demoPlans);
    if (cleanUrl === "/subscription") return ok(subscription);
    if (cleanUrl === "/subscription/change" && method === "POST") {
      const plan = demoPlans.find((item) => Number(item.id) === Number((body as { plan_id: number }).plan_id)) ?? demoPlans[0];
      subscription = { ...subscription, plan_id: plan.id, plan };
      return ok(subscription);
    }
    if (cleanUrl === "/subscription/payment") return ok({ success: true });
    if (cleanUrl === "/subscription/invoices") return ok(demoSubscriptionPayments);

    // Notifications and super admin
    if (cleanUrl === "/notifications") return ok(notifications);
    if (cleanUrl === "/super-admin/dashboard") return ok({ businesses: 124, users: 312, revenue: 184500, ai_usage: 2300 });
    if (cleanUrl === "/super-admin/businesses") return ok([{ ...business, plan: "Pro", orders: orders.length, users: staff.length }]);
    if (cleanUrl === "/super-admin/users") return ok(staff);
    if (cleanUrl === "/super-admin/plans") return ok(demoPlans);
    if (cleanUrl === "/super-admin/subscriptions") return ok([{ ...subscription, business: business.name }]);
    if (cleanUrl === "/super-admin/logs") return ok([
      { id: 1, action: "created", module: "orders", entity_type: "Order", entity_id: "1", created_at: new Date().toISOString() },
      { id: 2, action: "updated", module: "products", entity_type: "Product", entity_id: "2", created_at: new Date().toISOString() }
    ]);

    // Stock
    if (cleanUrl === "/stock/movements") return ok(demoStockMovements);
    if (cleanUrl === "/stock/low-stock") return ok(products.filter((product) => product.stock_quantity <= product.low_stock_alert));

    return fail(`Mock endpoint not implemented: ${method} ${cleanUrl}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown mock API error", 500);
  }
};
