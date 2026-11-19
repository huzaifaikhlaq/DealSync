import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { ApiError } from "@/lib/http/api-error";
import { readJson } from "@/lib/http/read-json";

import { errorResponse, successResponse } from "@/lib/http/response";

import { assertSameOrigin } from "@/lib/security/origin";

import { requireAdmin, requireUser } from "@/lib/security/authorize";

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

      const request = await accountRequestService.getMine(user.id);

      return successResponse(request);
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

      const requests = await accountRequestService.listPending();

      return successResponse(requests);
    } catch (error) {
      return errorResponse(error);
    }
  },

  async review(request: NextRequest, requestId: string) {
    try {
      assertSameOrigin(request);

      const admin = await requireAdmin();

      z.uuid().parse(requestId);

      const input = reviewAccountRequestSchema.parse(await readJson(request));

      const result = await accountRequestService.review(
        requestId,
        admin.id,
        input,
      );

      return successResponse(result);
    } catch (error) {
      return errorResponse(error);
    }
  },
};
