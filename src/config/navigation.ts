import type { ElementType } from "react";
import {
  BarChart3,
  Bot,
  Boxes,
  Building2,
  CreditCard,
  FileText,
  Gauge,
  LayoutDashboard,
  MessageCircle,
  Package,
  UserCircle,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  Warehouse
} from "lucide-react";
import type { PermissionCode } from "@/types/auth";

export type NavItem = {
  title: string;
  href: string;
  icon: ElementType;
  permission?: PermissionCode;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const dashboardNavigation: NavGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
      { title: "Orders", href: "/orders", icon: ShoppingCart, permission: "create_orders" },
      { title: "Products", href: "/products", icon: Package, permission: "manage_products" },
      { title: "Customers", href: "/customers", icon: Users, permission: "manage_customers" }
    ]
  },
  {
    title: "Operations",
    items: [
      { title: "Categories", href: "/categories", icon: Boxes, permission: "manage_products" },
      { title: "Stock Movement", href: "/stock/movements", icon: Warehouse, permission: "manage_products" },
      { title: "Low Stock", href: "/stock/low-stock", icon: Gauge, permission: "manage_products" },
      { title: "Invoices", href: "/invoices/1", icon: Receipt, permission: "edit_orders" }
    ]
  },
  {
    title: "Growth",
    items: [
      { title: "Sales Report", href: "/reports/sales", icon: BarChart3, permission: "view_reports" },
      { title: "Product Report", href: "/reports/products", icon: FileText, permission: "view_reports" },
      { title: "AI Caption", href: "/ai/caption", icon: Sparkles, permission: "use_ai_tools", badge: "AI" },
      { title: "AI Reply", href: "/ai/reply", icon: Bot, permission: "use_ai_tools" },
      { title: "AI Insights", href: "/ai/insights", icon: Bot, permission: "use_ai_tools" }
    ]
  },
  {
    title: "Settings",
    items: [
      { title: "Profile", href: "/profile", icon: UserCircle },
      { title: "Business", href: "/settings/business", icon: Building2, permission: "manage_settings" },
      { title: "Storefront", href: "/settings/storefront", icon: ShoppingCart, permission: "manage_settings" },
      { title: "WhatsApp", href: "/settings/whatsapp", icon: MessageCircle, permission: "manage_settings" },
      { title: "Staff", href: "/settings/staff", icon: Users, permission: "manage_staff" },
      { title: "Roles", href: "/settings/roles-permissions", icon: ShieldCheck, permission: "manage_staff" },
      { title: "Subscription", href: "/settings/subscription", icon: CreditCard, permission: "manage_subscription" },
      { title: "All Settings", href: "/settings/invoice", icon: Settings, permission: "manage_settings" }
    ]
  }
];

export const superAdminNavigation: NavItem[] = [
  { title: "Super Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard, permission: "super_admin" },
  { title: "Businesses", href: "/super-admin/businesses", icon: Building2, permission: "super_admin" },
  { title: "Storefronts", href: "/super-admin/storefronts", icon: ShoppingCart, permission: "super_admin" },
  { title: "Orders", href: "/super-admin/orders", icon: Receipt, permission: "super_admin" },
  { title: "Payments", href: "/super-admin/payments", icon: CreditCard, permission: "super_admin" },
  { title: "Products", href: "/super-admin/products", icon: Package, permission: "super_admin" },
  { title: "Reports", href: "/super-admin/reports", icon: BarChart3, permission: "super_admin" },
  { title: "Users", href: "/super-admin/users", icon: Users, permission: "super_admin" },
  { title: "Plans", href: "/super-admin/plans", icon: CreditCard, permission: "super_admin" },
  { title: "Subscriptions", href: "/super-admin/subscriptions", icon: Receipt, permission: "super_admin" },
  { title: "System Logs", href: "/super-admin/logs", icon: FileText, permission: "super_admin" }
];
