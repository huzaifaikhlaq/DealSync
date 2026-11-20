import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import type {
  CompanyAdminDetailsInput,
  CompanyAdminListInput,
} from "../schemas/company-admin.schema";

type SubmissionCountRow = { userId: string; count: number };

export const adminCompanyRepository = {
  async getOverview() {
    const [
      totalCompanies,
      totalForms,
      totalLeads,
      requestGroups,
      recentCompanies,
      recentRequests,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.form.count({ where: { user: { is: { role: "OWNER" } } } }),
      prisma.submission.count({
        where: { form: { is: { user: { is: { role: "OWNER" } } } } },
      }),
      prisma.accessRequest.groupBy({
        by: ["status"],
        where: { user: { is: { role: "OWNER" } } },
        _count: { _all: true },
      }),
      prisma.user.findMany({
        where: { role: "OWNER" },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          accessRequest: {
            select: { status: true, websiteUrl: true },
          },
        },
      }),
      prisma.accessRequest.findMany({
        where: {
          status: "PENDING",
          user: { is: { role: "OWNER" } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 5,
        select: {
          id: true,
          websiteUrl: true,
          message: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return {
      totalCompanies,
      totalForms,
      totalLeads,
      requestGroups: requestGroups.map((row) => ({
        status: row.status,
        count: row._count._all,
      })),
      recentCompanies,
      recentRequests,
    };
  },

  async listCompanies(input: CompanyAdminListInput) {
    const conditions: Prisma.UserWhereInput[] = [{ role: "OWNER" }];

    if (input.status === "NOT_REQUESTED") {
      conditions.push({ accessRequest: { is: null } });
    } else if (input.status) {
      conditions.push({
        accessRequest: { is: { status: input.status } },
      });
    }

    if (input.q) {
      conditions.push({
        OR: [
          { name: { contains: input.q, mode: "insensitive" } },
          { email: { contains: input.q, mode: "insensitive" } },
          {
            accessRequest: {
              is: {
                websiteUrl: { contains: input.q, mode: "insensitive" },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.UserWhereInput = { AND: conditions };
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          accessRequest: {
            select: { status: true, websiteUrl: true },
          },
          _count: { select: { forms: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const userIds = users.map((user) => user.id);
    const leadCountRows =
      userIds.length > 0
        ? await prisma.$queryRaw<SubmissionCountRow[]>(Prisma.sql`
            SELECT f."userId" AS "userId", COUNT(s."id")::int AS "count"
            FROM "Form" AS f
            LEFT JOIN "Submission" AS s ON s."formId" = f."id"
            WHERE f."userId"::text IN (${Prisma.join(userIds)})
            GROUP BY f."userId"
          `)
        : [];
    const leadsByUserId = new Map(
      leadCountRows.map((row) => [row.userId, row.count]),
    );

    return {
      items: users.map((user) => ({
        ...user,
        totalForms: user._count.forms,
        totalLeads: leadsByUserId.get(user.id) ?? 0,
      })),
      total,
    };
  },

  async getCompanyDetails(userId: string, input: CompanyAdminDetailsInput) {
    const owner = await prisma.user.findFirst({
      where: { id: userId, role: "OWNER" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        accessRequest: {
          select: {
            status: true,
            websiteUrl: true,
            message: true,
            reviewNote: true,
            createdAt: true,
            reviewedAt: true,
          },
        },
      },
    });

    if (!owner) return null;

    const formWhere: Prisma.FormWhereInput = {
      userId,
      ...(input.formStatus ? { status: input.formStatus } : {}),
    };
    const leadWhere: Prisma.SubmissionWhereInput = {
      form: { is: { userId } },
      ...(input.leadStatus ? { status: input.leadStatus } : {}),
      ...(input.q
        ? {
            OR: [
              { data: { path: ["name"], string_contains: input.q } },
              { data: { path: ["email"], string_contains: input.q } },
            ],
          }
        : {}),
    };

    const [
      formGroups,
      leadGroups,
      forms,
      formTotal,
      submissions,
      leadTotal,
    ] = await Promise.all([
      prisma.form.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.submission.groupBy({
        by: ["status"],
        where: { form: { is: { userId } } },
        _count: { _all: true },
      }),
      prisma.form.findMany({
        where: formWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (input.formPage - 1) * input.formLimit,
        take: input.formLimit,
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          _count: { select: { submissions: true } },
        },
      }),
      prisma.form.count({ where: formWhere }),
      prisma.submission.findMany({
        where: leadWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (input.leadPage - 1) * input.leadLimit,
        take: input.leadLimit,
        select: {
          id: true,
          data: true,
          status: true,
          createdAt: true,
          form: { select: { name: true } },
        },
      }),
      prisma.submission.count({ where: leadWhere }),
    ]);

    return {
      owner,
      formGroups: formGroups.map((row) => ({
        status: row.status,
        count: row._count._all,
      })),
      leadGroups: leadGroups.map((row) => ({
        status: row.status,
        count: row._count._all,
      })),
      forms,
      formTotal,
      submissions,
      leadTotal,
      formPage: input.formPage,
      formLimit: input.formLimit,
      leadPage: input.leadPage,
      leadLimit: input.leadLimit,
    };
  },
};
