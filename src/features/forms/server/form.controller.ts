import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { requireApprovedOwner } from "@/lib/security/authorize";
import { assertSameOrigin } from "@/lib/security/origin";
import { readJson } from "@/lib/http/read-json";
import { errorResponse, successResponse } from "@/lib/http/response";

import { createFormSchema, updateFormSchema } from "../schemas/form.schema";

import { formService } from "./form.service";

export const formController = {
  async list() {
    try {
      const user = await requireApprovedOwner();
      return successResponse(await formService.list(user.id));
    } catch (error) {
      return errorResponse(error);
    }
  },

  async create(request: NextRequest) {
    try {
      assertSameOrigin(request);

      const user = await requireApprovedOwner();

      const input = createFormSchema.parse(await readJson(request));

      const form = await formService.create(user.id, input);

      return successResponse(form, 201);
    } catch (error) {
      return errorResponse(error);
    }
  },

  async get(formId: string) {
    try {
      z.uuid().parse(formId);

      const user = await requireApprovedOwner();

      return successResponse(await formService.get(user.id, formId));
    } catch (error) {
      return errorResponse(error);
    }
  },

  async update(request: NextRequest, formId: string) {
    try {
      assertSameOrigin(request);
      z.uuid().parse(formId);

      const user = await requireApprovedOwner();

      const input = updateFormSchema.parse(await readJson(request));

      return successResponse(await formService.update(user.id, formId, input));
    } catch (error) {
      return errorResponse(error);
    }
  },
};
