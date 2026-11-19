"use client";

import { Bell, CircleHelp, Menu, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  useDashboardAction,
  useDashboardSearchControls,
} from "./dashboard-context";
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs";

const pageLabels: Record<string, string> = {
  "/dashboard": "Workspace",
  "/dashboard/forms": "Workspace",
  "/dashboard/leads": "Workspace",
};

type DashboardTopbarProps = { onOpenMobileNav: () => void };

export function DashboardTopbar({ onOpenMobileNav }: DashboardTopbarProps) {
  const [notice, setNotice] = useState("");
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useDashboardSearchControls();
  const handleNew = useDashboardAction();

  return (
    <header className="dash-topbar">
      <button
        className="mobile-menu"
        type="button"
        aria-label="Open menu"
        onClick={onOpenMobileNav}
      >
        <Menu size={20} />
      </button>
      <DashboardBreadcrumbs currentPage={pageLabels[pathname] ?? "Workspace"} />
      <label className="global-search">
        <Search size={19} />
        <input
          aria-label="Search this page"
          placeholder="Search leads, forms, companies..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="top-actions">
        <button className="new-button" type="button" onClick={handleNew}>
          <Plus size={18} />
          <span>New</span>
        </button>
        <button
          className="icon-button notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => setNotice("You’re all caught up")}
        >
          <Bell size={19} />
          <i />
        </button>
        <div className="avatar avatar-photo top-avatar">MV</div>
      </div>
      {notice && (
        <div className="dash-toast" role="status">
          {notice}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </header>
  );
}
