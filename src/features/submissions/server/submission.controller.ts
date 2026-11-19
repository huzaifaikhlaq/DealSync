import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ApiError } from "@/lib/http/api-error";
import { readJson } from "@/lib/http/read-json";
import { errorResponse, successResponse } from "@/lib/http/response";

import { submissionSchema } from "../schemas/submission.schema";

import { submissionService } from "./submission.service";
import { enforceSubmissionRateLimit } from "./submission.rate-limit";

function applyCors(
  response: NextResponse,
  origin: string | null,
  allowedOrigins: string[],
) {
  response.headers.set("Vary", "Origin");

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return response;
}

function verifyOrigin(origin: string | null, allowedOrigins: string[]) {
  // Requests without Origin may be legitimate server-side calls.
  // Browser requests must come from an allowed origin.
  if (origin && !allowedOrigins.includes(origin)) {
    throw new ApiError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "This website is not allowed to submit to the form",
    );
  }
}

export const submissionController = {
  async preflight(request: NextRequest, publicId: string) {
    try {
      const form = await submissionService.resolvePublicForm(publicId);

      const origin = request.headers.get("origin");
      verifyOrigin(origin, form.allowedOrigins);

      if (!origin) {
        throw new ApiError(403, "ORIGIN_REQUIRED", "Origin header is required");
      }

      return applyCors(
        new NextResponse(null, { status: 204 }),
        origin,
        form.allowedOrigins,
      );
    } catch (error) {
      return errorResponse(error);
    }
  },

  async submit(request: NextRequest, publicId: string) {
    let origin: string | null = null;
    let allowedOrigins: string[] = [];

    try {
      const form = await submissionService.resolvePublicForm(publicId);

      origin = request.headers.get("origin");
      allowedOrigins = form.allowedOrigins;

      verifyOrigin(origin, allowedOrigins);

      await enforceSubmissionRateLimit(request, form.id);

      const data = submissionSchema.parse(await readJson(request));

      // Optional honeypot field for basic automated spam.
      if (
        typeof data.__dealsync_hp === "string" &&
        data.__dealsync_hp.length > 0
      ) {
        return applyCors(
          successResponse({ accepted: true }, 202),
          origin,
          allowedOrigins,
        );
      }

      const { __dealsync_hp: _unused, ...cleanData } = data;

      if (Object.keys(cleanData).length === 0) {
        throw new ApiError(
          422,
          "EMPTY_SUBMISSION",
          "Submission contains no usable fields",
        );
      }

      const submission = await submissionService.create(form.id, cleanData);

      return applyCors(
        successResponse(
          {
            id: submission.id,
            createdAt: submission.createdAt,
          },
          201,
        ),
        origin,
        allowedOrigins,
      );
    } catch (error) {
      return applyCors(errorResponse(error), origin, allowedOrigins);
    }
  },
};
