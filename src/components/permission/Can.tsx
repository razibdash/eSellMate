"use client";

import type { ReactNode } from "react";
import type { PermissionCode } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";
import { useAppSelector } from "@/store/hooks";

export function Can({ permission, children, fallback = null }: { permission?: PermissionCode; children: ReactNode; fallback?: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  return hasPermission(user, permission) ? <>{children}</> : <>{fallback}</>;
}
