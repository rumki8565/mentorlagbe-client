"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { DASHBOARD_NAV, NavItem } from "@/components/dashboard/nav-config";
import { DashboardUser } from "@/components/dashboard/types";

interface DashboardShellProps {
  user: DashboardUser;
  children: ReactNode;
}

export default function DashboardShell({
  user,
  children,
}: DashboardShellProps) {
  const pathname: string = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const items: NavItem[] = DASHBOARD_NAV[user.role];
  const current: NavItem | undefined = items.find((item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        items={items}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={user}
          title={current?.label ?? "Dashboard"}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value: boolean) => !value)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
