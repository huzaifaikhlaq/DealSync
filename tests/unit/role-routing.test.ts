import { describe, expect, it } from "vitest";

import {
  getLoginRedirectPath,
  getRoleLandingPath,
  safeDashboardPath,
} from "@/lib/security/safe-redirect";
import { getDashboardNavigation } from "@/features/dashboard/navigation";

describe("role-aware routing", () => {
  it("sends a superadmin to the admin dashboard after login", () => {
    expect(getLoginRedirectPath("SUPER_ADMIN", "/dashboard/forms")).toBe(
      "/admin",
    );
  });

  it("keeps owner redirects inside the owner dashboard", () => {
    expect(getLoginRedirectPath("OWNER", "/dashboard/leads")).toBe(
      "/dashboard/leads",
    );
    expect(getLoginRedirectPath("OWNER", "/admin")).toBe("/dashboard");
  });

  it("returns the correct landing page after session restoration", () => {
    expect(getRoleLandingPath("SUPER_ADMIN", false)).toBe("/admin");
    expect(getRoleLandingPath("OWNER", true)).toBe("/dashboard");
    expect(getRoleLandingPath("OWNER", false)).toBe("/access");
  });

  it("rejects unsafe or non-owner redirect paths", () => {
    expect(safeDashboardPath("https://example.com")).toBe("/dashboard");
    expect(safeDashboardPath("/admin/companies")).toBe("/dashboard");
    expect(safeDashboardPath("/dashboard/forms")).toBe("/dashboard/forms");
  });

  it("shows only the links configured for each role", () => {
    expect(
      getDashboardNavigation("SUPER_ADMIN").map((item) => item.label),
    ).toEqual(["Overview", "Companies", "Company Requests"]);
    expect(getDashboardNavigation("OWNER").map((item) => item.label)).toEqual([
      "Overview",
      "Forms",
      "Leads",
    ]);
  });
});
