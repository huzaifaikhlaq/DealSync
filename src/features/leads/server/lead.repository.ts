import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import type { ListLeadsInput, UpdateLeadInput } from "../schemas/lead.schema";
import { getLeadRangeStart } from "./lead-range";

type LeadFilters = Pick<ListLeadsInput, "formId" | "status" | "range" | "q">;

function buildSubmissionWhere(
  userId: string,
  input: LeadFilters,
  now = new Date(),
): Prisma.SubmissionWhereInput {
  const startAt = getLeadRangeStart(input.range, now);

  return {
    form: { is: { userId } },
    ...(input.formId ? { formId: input.formId } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(startAt ? { createdAt: { gte: startAt, lte: now } } : {}),
    ...(input.q
      ? {
          OR: [
            { data: { path: ["name"], string_contains: input.q } },
            { data: { path: ["email"], string_contains: input.q } },
          ],
        }
      : {}),
  };
}

const leadInclude = {
  form: {
    select: {
      id: true,
      name: true,
      publicId: true,
    },
  },
} as const;

export const leadRepository = {
  async list(userId: string, input: ListLeadsInput) {
    const where = buildSubmissionWhere(userId, input);

    const [items, total] = await prisma.$transaction([
      prisma.submission.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: leadInclude,
      }),
      prisma.submission.count({ where }),
    ]);

    return {
      items,
      total,
      page: input.page,
      limit: input.limit,
      totalPages: Math.ceil(total / input.limit),
    };
  },

  export(userId: string, input: LeadFilters) {
    return prisma.submission.findMany({
      where: buildSubmissionWhere(userId, input),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: leadInclude,
    });
  },

  findOwned(userId: string, leadId: string) {
    return prisma.submission.findFirst({
      where: {
        id: leadId,
        form: { is: { userId } },
      },
      include: leadInclude,
    });
  },

  async updateOwned(userId: string, leadId: string, data: UpdateLeadInput) {
    const changed = await prisma.submission.updateMany({
      where: {
        id: leadId,
        form: { is: { userId } },
      },
      data,
    });

    if (changed.count !== 1) return null;
    return leadRepository.findOwned(userId, leadId);
  },
};
