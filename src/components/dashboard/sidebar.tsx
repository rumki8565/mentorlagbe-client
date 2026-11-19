"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleBadge from "@/components/shared/role-badge";
import { useSignOut } from "@/lib/use-sign-out";
import { NavItem } from "@/components/dashboard/nav-config";
import { DashboardUser } from "@/components/dashboard/types";

interface SidebarProps {
  user: DashboardUser;
  items: NavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export default function Sidebar({
  user,
  items,
  collapsed,
  mobileOpen,
  onClose,
}: SidebarProps) {
  const pathname: string = usePathname();
  const signOut = useSignOut();

  const isActive = (item: NavItem): boolean => {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  };

  // Labels hide only on desktop when collapsed; the mobile drawer always shows them
  const labelClass: string = collapsed ? "lg:hidden" : "";
  const linkBase: string =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-indigo-600"
          >
            {collapsed ? (
              <>
                <span className="hidden lg:inline">M</span>
                <span className="lg:hidden">
                  Mentor<span className="text-slate-900">Lagbe</span>
                </span>
              </>
            ) : (
              <>
                Mentor<span className="text-slate-900">Lagbe</span>
              </>
            )}
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile summary */}
        <div className="shrink-0 border-b border-slate-200 p-4">
          <div
            className={`flex items-center gap-3 ${collapsed ? "lg:justify-center" : ""}`}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`min-w-0 ${labelClass}`}>
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className={`mt-3 flex items-center gap-2 ${labelClass}`}>
            <RoleBadge role={user.role} />
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                user.plan === "pro"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item: NavItem) => {
            const Icon = item.icon;
            const active: boolean = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={onClose}
                className={`${linkBase} ${collapsed ? "lg:justify-center" : ""} ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={labelClass}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="shrink-0 space-y-1 border-t border-slate-200 p-3">
          <Link
            href="/"
            title="Back to Home"
            className={`${linkBase} text-slate-600 hover:bg-slate-100 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <Home className="h-5 w-5 shrink-0" />
            <span className={labelClass}>Back to Home</span>
          </Link>
          <button
            type="button"
            title="Sign Out"
            onClick={signOut}
            className={`${linkBase} w-full text-red-600 hover:bg-red-50 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={labelClass}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
