import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { SessionToken } from "../types/auth.types";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  session: SessionToken;
};

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
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
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
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
      where: {
        tokenHash,
      },
      select: {
        id: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    });
  },

  async revokeSession(tokenHash: string) {
    return prisma.authSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  async deleteExpiredSessions(now = new Date()) {
    return prisma.authSession.deleteMany({
      where: {
        expiresAt: {
          lte: now,
        },
      },
    });
  },
};
