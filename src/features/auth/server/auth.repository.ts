import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { SessionToken } from "../types/auth.types";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  session: SessionToken;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...publicUserSelect,
        passwordHash: true,
        isActive: true,
      },
    });
  },

  async createUserWithSession(input: CreateUserInput) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash,
          role: "OWNER",
        },
        select: publicUserSelect,
      });

      await tx.authSession.create({
        data: {
          userId: user.id,
          tokenHash: input.session.tokenHash,
          expiresAt: input.session.expiresAt,
        },
      });

      return user;
    });
  },

  async createSession(userId: string, session: SessionToken) {
    return prisma.authSession.create({
      data: {
        userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
      },
    });
  },

  async findSessionByHash(tokenHash: string) {
    return prisma.authSession.findUnique({
      where: { tokenHash },
      select: {
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            ...publicUserSelect,
            isActive: true,
          },
        },
      },
    });
  },

  async revokeSession(tokenHash: string) {
    return prisma.authSession.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  async deleteExpiredSessions(now = new Date()) {
    return prisma.authSession.deleteMany({
      where: { expiresAt: { lte: now } },
    });
  },
};
