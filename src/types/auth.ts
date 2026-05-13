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
  | "manage_storefront"
  | "super_admin";

export type UserRole = "owner" | "manager" | "staff" | "delivery" | "delivery_staff" | "viewer" | "super_admin";

export type User = {
  id: ID;
  name: string;
  email?: string | null;
  phone?: string;
  avatar?: string;
  avatar_url?: string | null;
  role: UserRole;
  permissions: PermissionCode[];
  is_super_admin?: boolean;
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

export type ProfilePayload = {
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
