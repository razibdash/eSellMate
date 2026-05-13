import type { PermissionCode, User } from "@/types/auth";

const rolePermissions: Record<string, PermissionCode[]> = {
  manager: [
    "view_dashboard",
    "manage_products",
    "manage_customers",
    "create_orders",
    "edit_orders",
    "delete_orders",
    "manage_payments",
    "view_reports",
    "manage_staff",
    "use_ai_tools"
  ],
  staff: ["view_dashboard", "manage_customers", "create_orders", "edit_orders", "manage_payments", "use_ai_tools"],
  delivery: ["view_dashboard", "edit_orders"],
  delivery_staff: ["view_dashboard", "edit_orders"],
  viewer: ["view_dashboard", "view_reports"]
};

export function isSuperAdmin(user: User | null | undefined) {
  return user?.role === "super_admin" || Boolean(user?.permissions.includes("super_admin"));
}

/** Returns true for super-admin, owner business permissions, or users with a requested permission. */
export function hasPermission(user: User | null | undefined, permission?: PermissionCode) {
  if (!permission) return true;
  if (!user) return false;
  if (permission === "super_admin") return isSuperAdmin(user);
  if (isSuperAdmin(user) || user.role === "owner") return true;
  return user.permissions.includes(permission) || (rolePermissions[user.role] ?? []).includes(permission);
}

/** Protects a route/page from users without at least one permission. */
export function hasAnyPermission(user: User | null | undefined, permissions: PermissionCode[]) {
  if (!permissions.length) return true;
  return permissions.some((permission) => hasPermission(user, permission));
}
