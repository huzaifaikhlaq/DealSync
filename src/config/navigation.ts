import {
  Activity,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavigationItem = {
  label: string;
  href: string | null;
  icon: LucideIcon;
  available: boolean;
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, available: true },
  { label: "Forms", href: "/dashboard/forms", icon: ClipboardList, available: true },
  { label: "Leads", href: "/dashboard/leads", icon: Users, available: true },
  { label: "Analytics", href: null, icon: Activity, available: false },
  { label: "Team", href: null, icon: BriefcaseBusiness, available: false },
  { label: "Settings", href: null, icon: Settings, available: false },
];
