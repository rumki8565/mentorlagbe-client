"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/shared/logo";
import RoleBadge from "@/components/shared/role-badge";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import ThemeToggle from "@/components/shared/theme-toggle";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export default function Navbar() {
  const pathname: string = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const user = session?.user;
  const dashboardHref: string = user ? `/dashboard/${user.role}` : "/sign-in";

  const handleSignOut = async (): Promise<void> => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out");
      return;
    }
    clearToken();
    setMenuOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string): boolean => {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) && !href.includes("#");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link: NavLink) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href={dashboardHref}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                pathname.startsWith("/dashboard")
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pr-3 pl-1 outline-none transition hover:border-indigo-300">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[110px] truncate text-sm font-medium text-slate-800">
                  {user.name}
                </span>
                <RoleBadge role={user.role} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs font-normal text-slate-500">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Update Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-slate-700">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-md p-2 text-slate-700"
            onClick={() => setMenuOpen((open: boolean) => !open)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2">
            {NAV_LINKS.map((link: NavLink) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="border-t border-slate-100 pt-3">
              <div className="mb-3 flex items-center gap-3 px-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-indigo-100 font-semibold text-indigo-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <Link
                href={dashboardHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Update Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <Button asChild variant="outline">
                <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
