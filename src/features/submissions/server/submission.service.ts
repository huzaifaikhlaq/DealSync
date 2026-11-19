import "server-only";

import { ApiError } from "@/lib/http/api-error";

import { formRepository } from "@/features/forms/server/form.repository";

import { submissionRepository } from "./submission.repository";

import type { SubmissionInput } from "../schemas/submission.schema";

export const submissionService = {
  async resolvePublicForm(publicId: string) {
    const form = await formRepository.findActiveByPublicId(publicId);

    if (
      !form ||
      form.status !== "ACTIVE" ||
      !form.user.isActive ||
      form.user.accessRequest?.status !== "APPROVED"
    ) {
      throw new ApiError(404, "FORM_UNAVAILABLE", "Form is not available");
    }

    return form;
  },

  create(formId: string, data: SubmissionInput) {
    return submissionRepository.create(formId, data);
  },
};
