"use client";

import { CircleHelp, Sparkles, X } from "lucide-react";
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
        <button className="dash-nav-item" type="button" aria-disabled="true">
          <CircleHelp size={19} />
          <span>Help &amp; Support</span>
        </button>
        <div className="system-status">
          <i />
          <span>Systems Operational</span>
          <strong>99.98%</strong>
        </div>
        <div className="sidebar-profile">
          <div className="avatar avatar-photo">MV</div>
          <span>
            <strong>Marcus Vance</strong>
            <small>Company Admin</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
