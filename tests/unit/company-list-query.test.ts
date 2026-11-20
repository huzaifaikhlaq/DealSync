import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userFindMany: vi.fn(),
  userFindFirst: vi.fn(),
  userCount: vi.fn(),
  queryRaw: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findMany: mocks.userFindMany,
      findFirst: mocks.userFindFirst,
      count: mocks.userCount,
    },
    $queryRaw: mocks.queryRaw,
    $transaction: mocks.transaction,
  },
}));

import {
  companyAdminDetailsSchema,
  companyAdminListSchema,
} from "@/features/companies/schemas/company-admin.schema";
import { adminCompanyRepository } from "@/features/companies/server/admin-company.repository";

describe("admin company list query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.userFindFirst.mockResolvedValue(null);
    mocks.userFindMany.mockResolvedValue([
      {
        id: "owner-a",
        name: "Acme",
        email: "owner@acme.test",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        accessRequest: { status: "PENDING", websiteUrl: "https://acme.test" },
        _count: { forms: 2 },
      },
    ]);
    mocks.userCount.mockResolvedValue(41);
    mocks.queryRaw.mockResolvedValue([{ userId: "owner-a", count: 12 }]);
    mocks.transaction.mockImplementation(
      async (queries: Array<Promise<unknown>>) => Promise.all(queries),
    );
  });

  it("filters and paginates in the database while restricting rows to owners", async () => {
    const input = companyAdminListSchema.parse({
      q: "Acme",
      status: "PENDING",
      page: "3",
      limit: "10",
    });

    const result = await adminCompanyRepository.listCompanies(input);

    expect(mocks.userFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { role: "OWNER" },
            { accessRequest: { is: { status: "PENDING" } } },
            {
              OR: expect.arrayContaining([
                { name: { contains: "Acme", mode: "insensitive" } },
                { email: { contains: "Acme", mode: "insensitive" } },
              ]),
            },
          ],
        },
        skip: 20,
        take: 10,
      }),
    );
    expect(mocks.userCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([{ role: "OWNER" }]),
        }),
      }),
    );
    expect(result).toMatchObject({
      total: 41,
      items: [{ id: "owner-a", totalForms: 2, totalLeads: 12 }],
    });
  });

  it("limits the no-request filter to owners with no access request", async () => {
    const input = companyAdminListSchema.parse({
      status: "NOT_REQUESTED",
    });

    await adminCompanyRepository.listCompanies(input);

    expect(mocks.userFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ role: "OWNER" }, { accessRequest: { is: null } }],
        },
      }),
    );
  });

  it("only resolves detail records for OWNER accounts", async () => {
    const detailsInput = companyAdminDetailsSchema.parse({});

    const result = await adminCompanyRepository.getCompanyDetails(
      "user-id",
      detailsInput,
    );

    expect(mocks.userFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id", role: "OWNER" },
      }),
    );
    expect(result).toBeNull();
  });
});
