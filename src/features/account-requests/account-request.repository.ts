
import "server-only";

import { prisma } from "@/lib/db/prisma";
import type {
  CreateAccountRequestInput,
  ReviewAccountRequestInput,
} from "./account-request.schema";

export const accountRequestRepository = {
  findMine(userId: string) {
    return prisma.accessRequest.findUnique({
      where: { userId },
    });
  },

  create(userId: string, input: CreateAccountRequestInput) {
    return prisma.accessRequest.create({
      data: {
        userId,
        websiteUrl: input.websiteUrl,
        message: input.message,
      },
    });
  },

  listPending() {
    return prisma.accessRequest.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
  },

  async review(
    requestId: string,
    adminId: string,
    input: ReviewAccountRequestInput,
  ) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.accessRequest.updateMany({
        where: {
          id: requestId,
          status: "PENDING",
        },
        data: {
          status: input.decision,
          reviewNote: input.note,
          reviewedById: adminId,
          reviewedAt: new Date(),
        },
      });

      if (updated.count !== 1) {
        return null;
      }

      return tx.accessRequest.findUnique({
        where: { id: requestId },
      });
    });
  },
};
