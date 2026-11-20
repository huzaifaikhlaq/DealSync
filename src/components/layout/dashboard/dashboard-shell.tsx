"use client";

import { useState, type ReactNode } from "react";
import { DashboardProvider } from "./dashboard-context";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import type { AuthUser } from "@/features/auth/types/auth.types";

export function DashboardShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Pick<AuthUser, "name" | "email" | "role">;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="dash-shell">
        <DashboardSidebar
          isMobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          user={user}
        />
        <div className="dash-main">
          <DashboardTopbar
            onOpenMobileNav={() => setMobileNavOpen(true)}
            user={user}
          />
          <main className="dash-content">{children}</main>
        </div>
        {mobileNavOpen && (
          <button
            className="sidebar-scrim"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </div>
    </DashboardProvider>
  );
}
