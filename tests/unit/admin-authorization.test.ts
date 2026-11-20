import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuthenticatedUser } = vi.hoisted(() => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock("@/features/auth/server/auth.session", () => ({
  getAuthenticatedUser,
}));
vi.mock("@/lib/db/prisma", () => ({ prisma: {} }));

import { requireAdmin } from "@/lib/security/authorize";

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no authenticated session", async () => {
    getAuthenticatedUser.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toMatchObject({
      statusCode: 401,
      code: "UNAUTHENTICATED",
    });
  });

  it("returns 403 when the signed-in user is an owner", async () => {
    getAuthenticatedUser.mockResolvedValue({
      id: "owner-id",
      name: "Owner",
      email: "owner@example.com",
      role: "OWNER",
    });

    await expect(requireAdmin()).rejects.toMatchObject({
      statusCode: 403,
      code: "FORBIDDEN",
    });
  });

  it("allows a signed-in superadmin", async () => {
    const admin = {
      id: "admin-id",
      name: "Admin",
      email: "admin@example.com",
      role: "SUPER_ADMIN",
    };
    getAuthenticatedUser.mockResolvedValue(admin);

    await expect(requireAdmin()).resolves.toEqual(admin);
  });
});
