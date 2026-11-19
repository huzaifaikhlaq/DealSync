import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { CreateFormInput, UpdateFormInput } from "../schemas/form.schema";

export const formRepository = {
  list(userId: string) {
    return prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
  },

  findOwned(userId: string, formId: string) {
    return prisma.form.findFirst({
      where: { id: formId, userId },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
  },

  create(
    userId: string,
    publicId: string,
    input: CreateFormInput,
    defaultOrigin: string,
  ) {
    return prisma.form.create({
      data: {
        userId,
        publicId,
        name: input.name,
        allowedOrigins: input.allowedOrigins?.length
          ? [...new Set(input.allowedOrigins)]
          : [defaultOrigin],
      },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
  },

  async updateOwned(userId: string, formId: string, input: UpdateFormInput) {
    const updated = await prisma.form.updateMany({
      where: { id: formId, userId },
      data: input,
    });

    if (updated.count !== 1) return null;

    return this.findOwned(userId, formId);
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
              select: { status: true },
            },
          },
        },
      },
    });
  },
};
