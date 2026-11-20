import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  formFindMany: vi.fn(),
  formFindFirst: vi.fn(),
  formUpdateMany: vi.fn(),
  submissionFindMany: vi.fn(),
  submissionCount: vi.fn(),
  submissionFindFirst: vi.fn(),
  submissionUpdateMany: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    form: {
      findMany: mocks.formFindMany,
      findFirst: mocks.formFindFirst,
      updateMany: mocks.formUpdateMany,
    },
    submission: {
      findMany: mocks.submissionFindMany,
      count: mocks.submissionCount,
      findFirst: mocks.submissionFindFirst,
      updateMany: mocks.submissionUpdateMany,
    },
    $transaction: mocks.transaction,
  },
}));

import { formRepository } from "@/features/forms/server/form.repository";
import { leadRepository } from "@/features/leads/server/lead.repository";

describe("owner data repositories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.formFindMany.mockResolvedValue([]);
    mocks.formFindFirst.mockResolvedValue(null);
    mocks.formUpdateMany.mockResolvedValue({ count: 0 });
    mocks.submissionFindMany.mockResolvedValue([]);
    mocks.submissionCount.mockResolvedValue(0);
    mocks.submissionFindFirst.mockResolvedValue(null);
    mocks.submissionUpdateMany.mockResolvedValue({ count: 0 });
    mocks.transaction.mockImplementation(
      async (queries: Array<Promise<unknown>>) => Promise.all(queries),
    );
  });

  it("scopes form reads to the authenticated owner", async () => {
    await formRepository.list("owner-a");
    await formRepository.findOwned("owner-a", "form-a");

    expect(mocks.formFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "owner-a" } }),
    );
    expect(mocks.formFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "form-a", userId: "owner-a" },
      }),
    );
  });

  it("scopes lead reads to forms owned by the authenticated user", async () => {
    await leadRepository.list("owner-a", {
      range: "all",
      page: 1,
      limit: 25,
    });
    await leadRepository.findOwned("owner-a", "lead-a");

    expect(mocks.submissionFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { form: { is: { userId: "owner-a" } } },
      }),
    );
    expect(mocks.submissionFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "lead-a",
          form: { is: { userId: "owner-a" } },
        },
      }),
    );
  });

  it("scopes form and lead updates through owner IDs", async () => {
    await formRepository.updateOwned("owner-a", "form-a", { name: "Updated" });
    await leadRepository.updateOwned("owner-a", "lead-a", { status: "CLOSED" });

    expect(mocks.formUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "form-a", userId: "owner-a" },
      }),
    );
    expect(mocks.submissionUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "lead-a",
          form: { is: { userId: "owner-a" } },
        },
      }),
    );
  });
});
