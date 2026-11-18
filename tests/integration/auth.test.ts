import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  loginAccount,
  registerAccount,
} from "@/features/auth/server/auth.service";

const createdEmails: string[] = [];

afterAll(async () => {
  if (createdEmails.length > 0) {
    await prisma.user.deleteMany({
      where: { email: { in: createdEmails } },
    });
  }
  await prisma.$disconnect();
});

describe("authentication service with PostgreSQL", () => {
  it("registers an account and verifies its password on login", async () => {
    const email =
      "auth-integration-" + crypto.randomUUID() + "@example.test";
    createdEmails.push(email);

    const user = await registerAccount({
      name: "Integration User",
      email,
      password: "correct horse battery staple",
    });
    const loggedInUser = await loginAccount({
      email,
      password: "correct horse battery staple",
    });

    expect(user).toEqual(loggedInUser);
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("does not reveal whether an unknown account exists", async () => {
    const email =
      "missing-account-" + crypto.randomUUID() + "@example.test";

    await expect(
      loginAccount({ email, password: "incorrect password" }),
    ).rejects.toMatchObject({
      status: 401,
      code: "invalid_credentials",
    });
  });
});
