"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { DashboardUser } from "@/components/dashboard/types";
import { authClient } from "@/lib/auth-client";
import { AppRole, isAppRole } from "@/lib/roles";

const ROLE_PATH: RegExp = /^\/dashboard\/(student|tutor|admin)(\/|$)/;

const getRedirectTarget = (
  pathname: string,
  role: AppRole | null,
): string | null => {
  if (!role) {
    return "/sign-in";
  }
  if (pathname === "/dashboard") {
    return `/dashboard/${role}`;
  }
  const match: RegExpExecArray | null = ROLE_PATH.exec(pathname);
  if (match && match[1] !== role) {
    return `/dashboard/${role}`;
  }
  return null;
};

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname: string = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role: AppRole | null = user
    ? isAppRole(user.role)
      ? user.role
      : "student"
    : null;

  // While the session is still loading we never redirect. This keeps a logged-in
  // user on their page after a reload instead of sending them to the login page.
  const target: string | null = isPending
    ? null
    : getRedirectTarget(pathname, role);

  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [target, router]);

  if (isPending || target || !user || !role) {
    return <DashboardSkeleton />;
  }

  const dashboardUser: DashboardUser = {
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role,
    plan: typeof user.plan === "string" ? user.plan : "free",
  };

  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>;
}
