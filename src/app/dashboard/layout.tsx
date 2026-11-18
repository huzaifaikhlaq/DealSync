import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell";
import "@/components/layout/dashboard/dashboard.css";
import "@/components/ui/modal.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
