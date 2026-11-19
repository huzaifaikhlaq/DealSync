import "server-only";

import type { NextRequest } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { readJson } from "@/lib/http/read-json";
import { errorResponse, successResponse } from "@/lib/http/response";
import { assertSameOrigin } from "@/lib/security/origin";
import { requireUser, requireAdmin } from "@/lib/security/authorize";

import {
  createAccountRequestSchema,
  reviewAccountRequestSchema,
} from "./account-request.schema";

import { accountRequestService } from "./account-request.service";

export const accountRequestController = {
  async mine() {
    try {
      const user = await requireUser();

      if (user.role !== "OWNER") {
        throw new ApiError(403, "FORBIDDEN", "Owner access required");
      }

      return successResponse(await accountRequestService.getMine(user.id));
    } catch (error) {
      return errorResponse(error);
    }
  },

  async create(request: NextRequest) {
    try {
      assertSameOrigin(request);

      const user = await requireUser();

      if (user.role !== "OWNER") {
        throw new ApiError(403, "FORBIDDEN", "Owner access required");
      }

      const input = createAccountRequestSchema.parse(await readJson(request));

      const created = await accountRequestService.create(user.id, input);

      return successResponse(created, 201);
    } catch (error) {
      return errorResponse(error);
    }
  },

  async listPending() {
    try {
      await requireAdmin();

      return successResponse(await accountRequestService.listPending());
    } catch (error) {
      return errorResponse(error);
    }
  },

  async review(request: NextRequest, requestId: string) {
    try {
      assertSameOrigin(request);

      const admin = await requireAdmin();

      // Validate route parameters before querying PostgreSQL.
      const { z } = await import("zod");
      z.uuid().parse(requestId);

      const input = reviewAccountRequestSchema.parse(await readJson(request));

      const reviewed = await accountRequestService.review(
        requestId,
        admin.id,
        input,
      );

      return successResponse(reviewed);
    } catch (error) {
      return errorResponse(error);
    }
  },
};
