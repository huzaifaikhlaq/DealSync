import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { extractContactDetails } from "@/features/leads/utils/contact-data";

import type {
  DashboardForm,
  DashboardGranularity,
  DashboardOverviewData,
  DashboardTrendPoint,
} from "../types/dashboard";

type TrendRow = { bucket: Date; count: number };

function startOfBucket(date: Date, granularity: DashboardGranularity): Date {
  const bucket = new Date(date);
  bucket.setUTCHours(0, 0, 0, 0);

  if (granularity === "weekly") {
    const daysFromMonday = (bucket.getUTCDay() + 6) % 7;
    bucket.setUTCDate(bucket.getUTCDate() - daysFromMonday);
  } else if (granularity === "monthly") {
    bucket.setUTCDate(1);
  }

  return bucket;
}

function nextBucket(date: Date, granularity: DashboardGranularity): Date {
  const next = new Date(date);
  if (granularity === "daily") next.setUTCDate(next.getUTCDate() + 1);
  else if (granularity === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  else next.setUTCMonth(next.getUTCMonth() + 1);
  return next;
}

function fillTrendBuckets(
  rows: TrendRow[],
  startAt: Date,
  through: Date,
  granularity: DashboardGranularity,
): DashboardTrendPoint[] {
  const counts = new Map(
    rows.map((row) => [
      startOfBucket(row.bucket, granularity).getTime(),
      Number(row.count),
    ]),
  );
  const points: DashboardTrendPoint[] = [];
  const lastBucket = startOfBucket(through, granularity);

  for (
    let cursor = startOfBucket(startAt, granularity), count = 0;
    cursor <= lastBucket && count < 100;
    cursor = nextBucket(cursor, granularity), count += 1
  ) {
    points.push({
      bucket: cursor.toISOString(),
      count: counts.get(cursor.getTime()) ?? 0,
    });
  }

  return points;
}

export const dashboardRepository = {
  async getOverview(
    userId: string,
    startAt: Date,
    through: Date,
    granularity: DashboardGranularity,
  ): Promise<DashboardOverviewData> {
    const submissionWhere: Prisma.SubmissionWhereInput = {
      form: { is: { userId } },
      createdAt: { gte: startAt, lte: through },
    };
    const truncField =
      granularity === "daily"
        ? "day"
        : granularity === "weekly"
          ? "week"
          : "month";

    const [
      formCounts,
      statusGroups,
      formSubmissionGroups,
      recentSubmissions,
      forms,
      trendRows,
    ] = await Promise.all([
      prisma.form.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.submission.groupBy({
        by: ["status"],
        where: submissionWhere,
        _count: { _all: true },
      }),
      prisma.submission.groupBy({
        by: ["formId"],
        where: submissionWhere,
        _count: { _all: true },
      }),
      prisma.submission.findMany({
        where: submissionWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 5,
        select: {
          id: true,
          data: true,
          status: true,
          createdAt: true,
          form: { select: { name: true } },
        },
      }),
      prisma.form.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.$queryRaw<TrendRow[]>(Prisma.sql`
        SELECT date_trunc(${truncField}::text, s."createdAt") AS "bucket",
               COUNT(*)::int AS "count"
        FROM "Submission" AS s
        INNER JOIN "Form" AS f ON f."id" = s."formId"
        WHERE f."userId" = ${userId}::uuid
          AND s."createdAt" >= ${startAt}
          AND s."createdAt" <= ${through}
        GROUP BY 1
        ORDER BY 1
      `),
    ]);

    const metrics = {
      totalForms: formCounts.reduce((total, row) => total + row._count._all, 0),
      activeForms:
        formCounts.find((row) => row.status === "ACTIVE")?._count._all ?? 0,
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      closedLeads: 0,
    };

    for (const row of statusGroups) {
      const count = row._count._all;
      metrics.totalLeads += count;
      if (row.status === "NEW") metrics.newLeads = count;
      if (row.status === "CONTACTED") metrics.contactedLeads = count;
      if (row.status === "CLOSED") metrics.closedLeads = count;
    }

    const formCountsById = new Map(
      formSubmissionGroups.map((row) => [row.formId, row._count._all]),
    );
    const dashboardForms: DashboardForm[] = forms
      .map((form) => ({
        id: form.id,
        name: form.name,
        status: form.status,
        submissionCount: formCountsById.get(form.id) ?? 0,
        createdAt: form.createdAt.toISOString(),
      }))
      .sort(
        (a, b) =>
          b.submissionCount - a.submissionCount ||
          b.createdAt.localeCompare(a.createdAt),
      );

    return {
      metrics,
      statuses: {
        NEW: metrics.newLeads,
        CONTACTED: metrics.contactedLeads,
        CLOSED: metrics.closedLeads,
      },
      forms: dashboardForms,
      recentLeads: recentSubmissions.map((submission) => ({
        id: submission.id,
        ...extractContactDetails(submission.data),
        formName: submission.form.name,
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),
      })),
      trend: fillTrendBuckets(trendRows, startAt, through, granularity),
    };
  },
};
