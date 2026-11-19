import "server-only";

import { randomBytes } from "node:crypto";
import { ApiError } from "@/lib/http/api-error";

import { accountRequestRepository } from "@/features/account-requests/account-request.repository";

import { formRepository } from "./form.repository";

import type { CreateFormInput, UpdateFormInput } from "../schemas/form.schema";

function generatePublicId(): string {
  return `frm_${randomBytes(18).toString("base64url")}`;
}

export const formService = {
  list(userId: string) {
    return formRepository.list(userId);
  },

  async get(userId: string, formId: string) {
    const form = await formRepository.findOwned(userId, formId);

    if (!form) {
      throw new ApiError(404, "FORM_NOT_FOUND", "Form not found");
    }

    return form;
  },

  async create(userId: string, input: CreateFormInput) {
    const approval = await accountRequestRepository.findMine(userId);

    if (!approval || approval.status !== "APPROVED") {
      throw new ApiError(
        403,
        "ACCOUNT_NOT_APPROVED",
        "Your account is not approved",
      );
    }

    const defaultOrigin = new URL(approval.websiteUrl).origin;

    return formRepository.create(
      userId,
      generatePublicId(),
      input,
      defaultOrigin,
    );
  },

  async update(userId: string, formId: string, input: UpdateFormInput) {
    const form = await formRepository.updateOwned(userId, formId, input);

    if (!form) {
      throw new ApiError(404, "FORM_NOT_FOUND", "Form not found");
    }

    return form;
  },
};
