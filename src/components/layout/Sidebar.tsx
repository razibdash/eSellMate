"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { dashboardNavigation, superAdminNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { hasPermission, isSuperAdmin } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.auth.user);
  const canAccessSuperAdmin = isSuperAdmin(user);

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")} onClick={() => dispatch(setSidebarOpen(false))} />
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/70 bg-white/90 px-4 py-4 shadow-soft backdrop-blur-xl transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between gap-3 px-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-glow">SB</div>
            <div>
              <p className="font-bold text-slate-950">{siteConfig.name}</p>
              <p className="text-xs text-slate-500">Smart seller dashboard</p>
            </div>
          </Link>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-7 flex-1 space-y-6 overflow-y-auto pr-1">
          {dashboardNavigation.map((group) => {
            const visibleItems = group.items.filter((item) => hasPermission(user, item.permission));
            if (!visibleItems.length) return null;

            return (
              <div key={group.title}>
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{group.title}</p>
                <div className="mt-2 space-y-1">
                  {visibleItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => dispatch(setSidebarOpen(false))}
                        className={cn("flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-slate-950 text-white shadow-glow" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950")}
                      >
                        <span className="flex items-center gap-3"><Icon className="h-5 w-5" />{item.title}</span>
                        {item.badge ? <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800">{item.badge}</span> : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {canAccessSuperAdmin ? (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Super Admin</p>
              <div className="mt-2 space-y-1">
                {superAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-brand-100 text-brand-900" : "text-slate-600 hover:bg-slate-100")}>
                      <Icon className="h-5 w-5" />{item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </nav>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-brand-600 to-slate-950 p-4 text-white">
          <p className="text-sm font-bold">Pro plan active</p>
          <p className="mt-1 text-xs text-white/75">AI caption, reports and stock alerts are ready.</p>
        </div>
      </aside>
    </>
  );
}
