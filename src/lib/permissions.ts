import type { PermissionCode, User } from "@/types/auth";

/** Returns true for owner/super-admin or users with a requested permission. */
export function hasPermission(user: User | null | undefined, permission?: PermissionCode) {
  if (!permission) return true;
  if (!user) return false;
  if (user.role === "owner" || user.role === "super_admin") return true;
  return user.permissions.includes(permission);
}

/** Protects a route/page from users without at least one permission. */
export function hasAnyPermission(user: User | null | undefined, permissions: PermissionCode[]) {
  if (!permissions.length) return true;
  return permissions.some((permission) => hasPermission(user, permission));
}
