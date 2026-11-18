"use client";

import { useState, type ReactNode } from "react";
import { DashboardProvider } from "./dashboard-context";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="dash-shell">
        <DashboardSidebar
          isMobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
        <div className="dash-main">
          <DashboardTopbar onOpenMobileNav={() => setMobileNavOpen(true)} />
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
