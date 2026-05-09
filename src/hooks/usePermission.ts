"use client";

import type { PermissionCode } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";
import { useAppSelector } from "@/store/hooks";

export function usePermission(permission?: PermissionCode) {
  const user = useAppSelector((state) => state.auth.user);
  return hasPermission(user, permission);
}
