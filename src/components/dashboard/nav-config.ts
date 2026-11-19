import {
  BookOpenCheck,
  ClipboardList,
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  LucideIcon,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { AppRole } from "@/lib/roles";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const PROFILE_ITEM: NavItem = {
  label: "Update Profile",
  href: "/dashboard/profile",
  icon: UserCog,
  exact: true,
};

export const DASHBOARD_NAV: Record<AppRole, NavItem[]> = {
  student: [
    {
      label: "Overview",
      href: "/dashboard/student",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: ClipboardList,
    },
    PROFILE_ITEM,
  ],
  tutor: [
    {
      label: "Overview",
      href: "/dashboard/tutor",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Post a Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: FilePlus2,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpenCheck,
    },
    { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
    PROFILE_ITEM,
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Tuition Approval",
      href: "/dashboard/admin/tuitions",
      icon: ShieldCheck,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    PROFILE_ITEM,
  ],
};
