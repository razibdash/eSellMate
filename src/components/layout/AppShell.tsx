"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/store/hooks";
import { useGetSubscriptionQuery } from "@/store/api/settingsApi";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBillingPath =
    pathname.startsWith("/subscription") ||
    pathname.startsWith("/settings/subscription") ||
    pathname.startsWith("/settings/billing") ||
    pathname.startsWith("/super-admin");
  const { data: subscription } = useGetSubscriptionQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    const hasStoredAuth = typeof window !== "undefined" && localStorage.getItem("shopbot_auth");
    if (!isAuthenticated && !hasStoredAuth) router.replace("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!subscription || isBillingPath) return;
    const trialExpired =
      subscription.status === "trial" &&
      subscription.trial_ends_at &&
      new Date(subscription.trial_ends_at).getTime() < Date.now();
    const ended =
      subscription.ends_at &&
      new Date(subscription.ends_at).getTime() < Date.now();
    if (!["trial", "active"].includes(subscription.status) || trialExpired || ended) {
      router.replace("/subscription/checkout");
    }
  }, [isBillingPath, router, subscription]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
