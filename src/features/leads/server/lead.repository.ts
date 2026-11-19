import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import type {
  ListLeadsInput,
  UpdateLeadInput,
} from "../schemas/lead.schema.js";

export const leadRepository = {
  async list(userId: string, input: ListLeadsInput) {
    const where: Prisma.SubmissionWhereInput = {
      form: {
        userId,
      },

      ...(input.formId ? { formId: input.formId } : {}),

      ...(input.status ? { status: input.status } : {}),

      ...(input.q
        ? {
            OR: [
              {
                data: {
                  path: ["name"],
                  string_contains: input.q,
                },
              },
              {
                data: {
                  path: ["email"],
                  string_contains: input.q,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.submission.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: {
          form: {
            select: {
              id: true,
              name: true,
              publicId: true,
            },
          },
        },
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

  async updateOwned(userId: string, leadId: string, data: UpdateLeadInput) {
    const changed = await prisma.submission.updateMany({
      where: {
        id: leadId,
        form: { userId },
      },
      data,
    });

    if (changed.count !== 1) return null;

    return prisma.submission.findFirst({
      where: {
        id: leadId,
        form: { userId },
      },
      include: {
        form: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
};
