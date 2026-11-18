"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { dashboardNavigation } from "@/features/dashboard/navigation";

export function DashboardNavigation({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [message, setMessage] = useState("");

  return (
    <>
      <nav className="dash-nav" aria-label="Main navigation">
        {dashboardNavigation.map(({ label, href, icon: Icon, available }) => {
          const isCurrent = href === pathname;
          const className = `dash-nav-item ${isCurrent ? "selected" : ""}`;

          return href && available ? (
            <Link
              key={label}
              href={href}
              className={className}
              aria-current={isCurrent ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon size={19} strokeWidth={2.2} />
              <span>{label}</span>
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              className={className}
              aria-disabled="true"
              title={`${label} is coming soon`}
              onClick={() => setMessage(`${label} is coming soon`)}
            >
              <Icon size={19} strokeWidth={2.2} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      {message && (
        <p className="nav-notice" role="status">
          {message}
        </p>
      )}
    </>
  );
}
