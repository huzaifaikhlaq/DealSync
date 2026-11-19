
import "server-only";

import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";

type AuthAction = "login" | "register";
type RateLimitScope = "ip" | "email";

const LIMITS = {
  login: {
    ip: 50,
    email: 10,
  },
  register: {
    ip: 20,
    email: 5,
  },
} as const;

// Fixed window: 15 minutes.
const WINDOW_MINUTES = 15;

function getRateLimitSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters",
    );
  }

  return secret;
}

function hashRateLimitKey(value: string): string {
  return createHmac("sha256", getRateLimitSecret())
    .update(value)
    .digest("hex");
}

function getClientIp(request: NextRequest): string {
  const value =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for") ??
    "unknown";

  return value.split(",")[0].trim().slice(0, 128);
}

export async function enforceAuthRateLimit(
  request: NextRequest,
  action: AuthAction,
  scope: RateLimitScope,
  email?: string,
): Promise<void> {
  const identifier =
    scope === "ip"
      ? getClientIp(request)
      : email?.trim().toLowerCase();

  if (!identifier) {
    throw new Error("Rate limit identifier is required");
  }

  const key = hashRateLimitKey(
    `${action}:${scope}:${identifier}`,
  );

  const result = await prisma.$queryRaw<
    Array<{ hits: number }>
  >`
    INSERT INTO "AuthRateLimit"
      ("key", "hits", "windowStart")
    VALUES
      (${key}, 1, NOW())
    ON CONFLICT ("key")
    DO UPDATE SET
      "hits" = CASE
        WHEN "AuthRateLimit"."windowStart"
          <= NOW() - INTERVAL '15 minutes'
        THEN 1
        ELSE "AuthRateLimit"."hits" + 1
      END,
      "windowStart" = CASE
        WHEN "AuthRateLimit"."windowStart"
          <= NOW() - INTERVAL '15 minutes'
        THEN NOW()
        ELSE "AuthRateLimit"."windowStart"
      END
    RETURNING "hits"
  `;

  const maximum = LIMITS[action][scope];
  const hits = result[0]?.hits ?? maximum + 1;

  if (hits > maximum) {
    throw new ApiError(
      429,
      "TOO_MANY_REQUESTS",
      `Too many requests. Try again after ${WINDOW_MINUTES} minutes.`,
    );
  }
}
