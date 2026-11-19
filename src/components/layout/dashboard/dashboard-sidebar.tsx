"use client";

import { CircleHelp, Sparkles, X } from "lucide-react";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { DashboardNavigation } from "./dashboard-navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

type DashboardSidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

export function DashboardSidebar({
  isMobileOpen,
  onClose,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`dash-sidebar ${isMobileOpen ? "dash-sidebar-open" : ""}`}
    >
      <div className="dash-brand">
        <span className="brand-glyph">
          <Sparkles size={19} />
        </span>
        <span>
          Deal<span>Sync</span>
        </span>
        <button
          className="sidebar-close"
          type="button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>
      <WorkspaceSwitcher />
      <DashboardNavigation onNavigate={onClose} />
      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <div className="avatar avatar-photo">MV</div>
          <span>
            <strong>Marcus Vance</strong>
            <small>Company Admin</small>
          </span>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
