import "server-only";

import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { getAuthenticatedUser } from "@/features/auth/server/auth.session";

export async function requireUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new ApiError(401, "UNAUTHENTICATED", "Please sign in");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN") {
    throw new ApiError(403, "FORBIDDEN", "Admin access required");
  }

  return user;
}

export async function requireApprovedOwner() {
  const user = await requireUser();

  if (user.role !== "OWNER") {
    throw new ApiError(403, "FORBIDDEN", "Owner access required");
  }

  const request = await prisma.accessRequest.findUnique({
    where: { userId: user.id },
    select: { status: true },
  });

  if (request?.status !== "APPROVED") {
    throw new ApiError(
      403,
      "ACCOUNT_NOT_APPROVED",
      "Your account must be approved before using forms",
    );
  }

  return user;
}
