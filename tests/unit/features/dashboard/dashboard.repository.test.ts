import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  form: {
    groupBy: vi.fn(),
    findMany: vi.fn(),
  },
  submission: {
    groupBy: vi.fn(),
    findMany: vi.fn(),
  },
  $queryRaw: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({ prisma: database }));

import { dashboardRepository } from "@/features/dashboard/server/dashboard.repository";

describe("dashboardRepository.getOverview", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("aggregates scoped records and fills empty trend buckets", async () => {
    const userId = "59c169b8-c2b4-4fb4-901b-4886d25e0f18";
    const startAt = new Date("2026-11-01T12:00:00.000Z");
    const through = new Date("2026-11-03T12:00:00.000Z");
    const formOneDate = new Date("2026-10-01T00:00:00.000Z");
    const formTwoDate = new Date("2026-10-02T00:00:00.000Z");
    const submittedAt = new Date("2026-11-02T09:30:00.000Z");

    database.form.groupBy.mockResolvedValue([
      { status: "ACTIVE", _count: { _all: 1 } },
      { status: "DRAFT", _count: { _all: 1 } },
    ]);
    database.submission.groupBy
      .mockResolvedValueOnce([
        { status: "NEW", _count: { _all: 1 } },
        { status: "CONTACTED", _count: { _all: 1 } },
        { status: "CLOSED", _count: { _all: 1 } },
      ])
      .mockResolvedValueOnce([
        { formId: "form-a", _count: { _all: 2 } },
        { formId: "form-b", _count: { _all: 1 } },
      ]);
    database.submission.findMany.mockResolvedValue([
      {
        id: "lead-a",
        data: {
          full_name: "Ada Lovelace",
          contact: { emailAddress: "ada@example.com" },
        },
        status: "NEW",
        createdAt: submittedAt,
        form: { name: "Contact form" },
      },
    ]);
    database.form.findMany.mockResolvedValue([
      {
        id: "form-a",
        name: "Contact form",
        status: "ACTIVE",
        createdAt: formOneDate,
      },
      {
        id: "form-b",
        name: "Feedback form",
        status: "DRAFT",
        createdAt: formTwoDate,
      },
    ]);
    database.$queryRaw.mockResolvedValue([
      { bucket: new Date("2026-11-02T00:00:00.000Z"), count: 1 },
    ]);

    const overview = await dashboardRepository.getOverview(
      userId,
      startAt,
      through,
      "daily",
    );

    expect(overview.metrics).toEqual({
      totalForms: 2,
      activeForms: 1,
      totalLeads: 3,
      newLeads: 1,
      contactedLeads: 1,
      closedLeads: 1,
    });
    expect(
      overview.forms.map(({ id, submissionCount }) => [id, submissionCount]),
    ).toEqual([
      ["form-a", 2],
      ["form-b", 1],
    ]);
    expect(overview.recentLeads[0]).toMatchObject({
      id: "lead-a",
      name: "Ada Lovelace",
      email: "ada@example.com",
      formName: "Contact form",
      status: "NEW",
    });
    expect(overview.trend).toEqual([
      { bucket: "2026-11-01T00:00:00.000Z", count: 0 },
      { bucket: "2026-11-02T00:00:00.000Z", count: 1 },
      { bucket: "2026-11-03T00:00:00.000Z", count: 0 },
    ]);

    expect(database.form.groupBy.mock.calls[0]?.[0].where).toEqual({ userId });
    expect(database.form.findMany.mock.calls[0]?.[0].where).toEqual({ userId });
    for (const call of database.submission.groupBy.mock.calls) {
      expect(call[0].where).toEqual({
        form: { is: { userId } },
        createdAt: { gte: startAt, lte: through },
      });
    }
    expect(database.submission.findMany.mock.calls[0]?.[0].where).toEqual({
      form: { is: { userId } },
      createdAt: { gte: startAt, lte: through },
    });
    expect(database.$queryRaw.mock.calls[0]?.[0].values).toContain("day");
    expect(database.$queryRaw.mock.calls[0]?.[0].values).toContain(userId);
  });
});
