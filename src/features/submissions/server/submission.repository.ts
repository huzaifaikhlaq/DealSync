import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { SubmissionInput } from "../schemas/submission.schema.ts";

export const submissionRepository = {
  create(formId: string, data: SubmissionInput) {
    return prisma.submission.create({
      data: {
        formId,
        data,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
  },
};
