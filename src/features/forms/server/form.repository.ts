import "server-only";

import { prisma } from "@/lib/db/prisma";

import type { CreateFormInput, UpdateFormInput } from "../schemas/form.schema";

const formInclude = {
  _count: {
    select: {
      submissions: true,
    },
  },
} as const;

export const formRepository = {
  list(userId: string) {
    return prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: formInclude,
    });
  },

  findOwned(userId: string, formId: string) {
    return prisma.form.findFirst({
      where: {
        id: formId,
        userId,
      },
      include: formInclude,
    });
  },

  create(
    userId: string,
    publicId: string,
    input: CreateFormInput,
    defaultOrigin: string,
  ) {
    const allowedOrigins = input.allowedOrigins?.length
      ? input.allowedOrigins
      : [defaultOrigin];

    return prisma.form.create({
      data: {
        userId,
        publicId,
        name: input.name,
        status: "DRAFT",
        allowedOrigins: [...new Set(allowedOrigins)],
      },
      include: formInclude,
    });
  },

  async updateOwned(userId: string, formId: string, input: UpdateFormInput) {
    const result = await prisma.form.updateMany({
      where: {
        id: formId,
        userId,
      },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),

        ...(input.status !== undefined ? { status: input.status } : {}),

        ...(input.allowedOrigins !== undefined
          ? {
              allowedOrigins: [...new Set(input.allowedOrigins)],
            }
          : {}),
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return formRepository.findOwned(userId, formId);
  },

  findActiveByPublicId(publicId: string) {
    return prisma.form.findUnique({
      where: { publicId },
      select: {
        id: true,
        status: true,
        allowedOrigins: true,
        user: {
          select: {
            isActive: true,
            accessRequest: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });
  },
};
