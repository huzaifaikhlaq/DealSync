import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { requireApprovedOwner } from "@/lib/security/authorize";
import { assertSameOrigin } from "@/lib/security/origin";
import { readJson } from "@/lib/http/read-json";
import { errorResponse, successResponse } from "@/lib/http/response";

import { listLeadsSchema, updateLeadSchema } from "../schemas/lead.schema";

import { leadService } from "./lead.service.ts";

export const leadController = {
  async list(request: NextRequest) {
    try {
      const user = await requireApprovedOwner();

      const query = request.nextUrl.searchParams;

      const input = listLeadsSchema.parse({
        formId: query.get("formId") || undefined,
        status: query.get("status") || undefined,
        q: query.get("q") || undefined,
        page: query.get("page") || undefined,
        limit: query.get("limit") || undefined,
      });

      const result = await leadService.list(user.id, input);

      return successResponse(result);
    } catch (error) {
      return errorResponse(error);
    }
  },

  async update(request: NextRequest, leadId: string) {
    try {
      assertSameOrigin(request);
      z.uuid().parse(leadId);

      const user = await requireApprovedOwner();

      const input = updateLeadSchema.parse(await readJson(request));

      const updated = await leadService.update(user.id, leadId, input);

      return successResponse(updated);
    } catch (error) {
      return errorResponse(error);
    }
  },
};
