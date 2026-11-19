
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardShell } from
  "@/components/layout/dashboard/dashboard-shell";

import { getAuthenticatedUser } from
  "@/features/auth/server/auth.session";

import { accountRequestRepository } from
  "@/features/account-requests/account-request.repository";

import "@/components/layout/dashboard/dashboard.css";
import "@/components/ui/modal.css";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  if (user.role === "SUPER_ADMIN") {
    redirect("/admin/requests");
  }

  const request =
    await accountRequestRepository.findMine(user.id);

  if (request?.status !== "APPROVED") {
    redirect("/access");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
