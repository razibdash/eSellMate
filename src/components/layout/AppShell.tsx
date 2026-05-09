"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/store/hooks";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const hasStoredAuth = typeof window !== "undefined" && localStorage.getItem("shopbot_auth");
    if (!isAuthenticated && !hasStoredAuth) router.replace("/login");
  }, [isAuthenticated, router]);

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
