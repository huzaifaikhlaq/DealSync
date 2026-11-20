"use client";

import { Sparkles, X } from "lucide-react";
import { LogoutButton } from "@/features/auth/components/logout-button";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { DashboardNavigation } from "./dashboard-navigation";

type DashboardSidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
  user: Pick<AuthUser, "name" | "email">;
};

export function DashboardSidebar({
  isMobileOpen,
  onClose,
  user,
}: DashboardSidebarProps) {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

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
      <DashboardNavigation onNavigate={onClose} />
      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <div className="avatar lilac">{initials}</div>
          <span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
