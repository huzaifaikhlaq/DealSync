import "server-only";

import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";

export async function enforceSubmissionRateLimit(
  request: NextRequest,
  formId: string,
) {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short");
  }

  // These headers must only be trusted behind a reverse proxy
  // that overwrites client-supplied forwarding headers.
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for") ??
    "unknown";

  const ip = forwarded.split(",")[0].trim().slice(0, 128);

  const key = createHmac("sha256", secret)
    .update(`submission:${formId}:${ip}`)
    .digest("hex");

  const result = await prisma.$queryRaw<Array<{ hits: number }>>`
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

  if ((result[0]?.hits ?? 31) > 30) {
    throw new ApiError(
      429,
      "SUBMISSION_RATE_LIMIT",
      "Too many submissions. Please try again later.",
    );
  }
}
