import { prisma } from "@/lib/db/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
    },
  });
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: input,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createSessionRecord(input: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) {
  return prisma.session.create({ data: input });
}

export async function findSessionByTokenHash(tokenHash: string) {
  return prisma.session.findUnique({
    where: { tokenHash },
    select: {
      tokenHash: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteSessionByTokenHash(tokenHash: string) {
  await prisma.session.deleteMany({ where: { tokenHash } });
}

export async function deleteExpiredSessions(now = new Date()) {
  await prisma.session.deleteMany({ where: { expiresAt: { lte: now } } });
}
