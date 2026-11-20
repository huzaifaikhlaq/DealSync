"use client";

import Link from "next/link";
import { Menu, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { useDashboardSearchControls } from "./dashboard-context";
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs";

const pageLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/forms": "Forms",
  "/dashboard/leads": "Leads",
};

type DashboardTopbarProps = {
  onOpenMobileNav: () => void;
  user: Pick<AuthUser, "name" | "email">;
};

export function DashboardTopbar({
  onOpenMobileNav,
  user,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useDashboardSearchControls();
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  const searchPlaceholder =
    pathname === "/dashboard/forms"
      ? "Search your forms..."
      : pathname === "/dashboard/leads"
        ? "Search leads by name or email..."
        : "Search recent leads...";

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
      <DashboardBreadcrumbs currentPage={pageLabels[pathname] ?? "Overview"} />
      <label className="global-search">
        <Search size={19} aria-hidden="true" />
        <input
          aria-label="Search this page"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>
      <div className="top-actions">
        <Link className="new-button" href="/dashboard/forms?create=1">
          <Plus size={18} />
          <span>New</span>
        </Link>
        <div className="avatar lilac top-avatar" aria-label={user.name}>
          {initials}
        </div>
      </div>
    </header>
  );
}
