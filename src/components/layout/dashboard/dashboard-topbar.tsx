"use client";

import Link from "next/link";
import { Menu, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { useDashboardSearchControls } from "./dashboard-context";
import {
  DashboardBreadcrumbs,
  type BreadcrumbItem,
} from "./dashboard-breadcrumbs";

type DashboardTopbarProps = {
  onOpenMobileNav: () => void;
  user: Pick<AuthUser, "name" | "email" | "role">;
};

export function DashboardTopbar({
  onOpenMobileNav,
  user,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useDashboardSearchControls();
  const isAdmin = user.role === "SUPER_ADMIN";
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  const companyDetails =
    pathname.startsWith("/admin/companies/") &&
    pathname !== "/admin/companies";
  const showSearch =
    pathname === "/dashboard" ||
    pathname === "/dashboard/forms" ||
    pathname === "/dashboard/leads" ||
    pathname === "/admin/companies" ||
    companyDetails;
  const searchPlaceholder = isAdmin
    ? companyDetails
      ? "Search this company's leads..."
      : "Search companies..."
    : pathname === "/dashboard/forms"
      ? "Search your forms..."
      : pathname === "/dashboard/leads"
        ? "Search leads by name or email..."
        : "Search recent leads...";
  const breadcrumbs: BreadcrumbItem[] = isAdmin
    ? pathname === "/admin/companies"
      ? [{ label: "Admin", href: "/admin" }, { label: "Companies" }]
      : companyDetails
        ? [
            { label: "Admin", href: "/admin" },
            { label: "Companies", href: "/admin/companies" },
            { label: "Company details" },
          ]
        : pathname === "/admin/requests"
          ? [{ label: "Admin", href: "/admin" }, { label: "Company Requests" }]
          : [{ label: "Admin overview" }]
    : [
        {
          label:
            pathname === "/dashboard/forms"
              ? "Forms"
              : pathname === "/dashboard/leads"
                ? "Leads"
                : "Overview",
        },
      ];

  useEffect(() => {
    setSearchQuery("");
  }, [pathname, setSearchQuery]);

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
      <DashboardBreadcrumbs items={breadcrumbs} />
      {showSearch && (
        <label className="global-search">
          <Search size={19} aria-hidden="true" />
          <input
            aria-label="Search this page"
            maxLength={100}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      )}
      <div className="top-actions">
        {!isAdmin && (
          <Link className="new-button" href="/dashboard/forms?create=1">
            <Plus size={18} />
            <span>New</span>
          </Link>
        )}
        <div className="avatar lilac top-avatar" aria-label={user.name}>
          {initials}
        </div>
      </div>
    </header>
  );
}
