import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({ prisma: {} }));

import { summarizeAdminOverview } from "@/features/companies/server/admin-company.service";

describe("summarizeAdminOverview", () => {
  it("combines real owner, request, form, and submission counts", () => {
    expect(
      summarizeAdminOverview({
        totalCompanies: 14,
        totalForms: 39,
        totalLeads: 271,
        requestGroups: [
          { status: "PENDING", count: 4 },
          { status: "APPROVED", count: 7 },
          { status: "REJECTED", count: 2 },
        ],
      }),
    ).toEqual({
      totalCompanies: 14,
      approvedCompanies: 7,
      pendingRequests: 4,
      rejectedRequests: 2,
      totalForms: 39,
      totalLeads: 271,
    });
  });

  it("uses zero for request states without records", () => {
    expect(
      summarizeAdminOverview({
        totalCompanies: 1,
        totalForms: 0,
        totalLeads: 0,
        requestGroups: [],
      }),
    ).toEqual({
      totalCompanies: 1,
      approvedCompanies: 0,
      pendingRequests: 0,
      rejectedRequests: 0,
      totalForms: 0,
      totalLeads: 0,
    });
  });
});
