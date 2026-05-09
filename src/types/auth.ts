import type { ID } from "./common";

export type PermissionCode =
  | "view_dashboard"
  | "manage_products"
  | "manage_customers"
  | "create_orders"
  | "edit_orders"
  | "delete_orders"
  | "manage_payments"
  | "view_reports"
  | "manage_staff"
  | "manage_settings"
  | "use_ai_tools"
  | "manage_subscription"
  | "super_admin";

export type UserRole = "owner" | "manager" | "staff" | "delivery" | "viewer" | "super_admin";

export type User = {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions: PermissionCode[];
  status: "active" | "inactive";
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  business_name: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
