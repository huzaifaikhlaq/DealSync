import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  submission: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({ prisma: database }));

import { leadRepository } from "@/features/leads/server/lead.repository";

describe("leadRepository.export", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    database.submission.findMany.mockResolvedValue([]);
  });

  it("scopes exports to the session owner and applies selected filters", async () => {
    const userId = "e919c70c-9c5e-403a-8532-b93f4d4c95cc";
    const before = Date.now();

    await leadRepository.export(userId, {
      formId: "2fe5f0a0-fd99-41ce-bfc8-491ea1dfd145",
      status: "CONTACTED",
      range: "7d",
      q: "Ada",
    });

    const where = database.submission.findMany.mock.calls[0]?.[0].where;
    const after = Date.now();

    expect(where.form).toEqual({ is: { userId } });
    expect(where.formId).toBe("2fe5f0a0-fd99-41ce-bfc8-491ea1dfd145");
    expect(where.status).toBe("CONTACTED");
    expect(where.OR).toEqual([
      { data: { path: ["name"], string_contains: "Ada" } },
      { data: { path: ["email"], string_contains: "Ada" } },
    ]);
    expect(where.createdAt.lte.getTime()).toBeGreaterThanOrEqual(before);
    expect(where.createdAt.lte.getTime()).toBeLessThanOrEqual(after);
    expect(where.createdAt.gte.getTime()).toBe(
      where.createdAt.lte.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
  });
});
