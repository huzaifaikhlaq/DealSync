import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell";
import { getAuthenticatedUser } from "@/features/auth/server/auth.session";
import "@/components/layout/dashboard/dashboard.css";
import "@/components/ui/modal.css";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=%2Fdashboard");

  return <DashboardShell>{children}</DashboardShell>;
}
