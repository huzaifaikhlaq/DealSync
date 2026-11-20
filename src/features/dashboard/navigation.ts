import {
  Building2,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types/auth.types";

export type DashboardNavigationItem = {
  label: string;
  href: string | null;
  icon: LucideIcon;
  available: boolean;
};

export const ownerDashboardNavigation: DashboardNavigationItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, available: true },
  { label: "Forms", href: "/dashboard/forms", icon: ClipboardList, available: true },
  { label: "Leads", href: "/dashboard/leads", icon: Users, available: true },
];

export const adminDashboardNavigation: DashboardNavigationItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, available: true },
  { label: "Companies", href: "/admin/companies", icon: Building2, available: true },
  { label: "Company Requests", href: "/admin/requests", icon: FileCheck2, available: true },
];

export function getDashboardNavigation(role: UserRole) {
  return role === "SUPER_ADMIN"
    ? adminDashboardNavigation
    : ownerDashboardNavigation;
}
