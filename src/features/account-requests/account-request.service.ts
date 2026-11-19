import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/http/api-error";

import { accountRequestRepository } from "./account-request.repository";

import type {
  CreateAccountRequestInput,
  ReviewAccountRequestInput,
} from "./account-request.schema";

export const accountRequestService = {
  getMine(userId: string) {
    return accountRequestRepository.findMine(userId);
  },

  async create(userId: string, input: CreateAccountRequestInput) {
    const existing = await accountRequestRepository.findMine(userId);

    if (existing) {
      throw new ApiError(
        409,
        "REQUEST_ALREADY_EXISTS",
        "Your account already has an access request",
      );
    }

    try {
      return await accountRequestRepository.create(userId, input);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ApiError(
          409,
          "REQUEST_ALREADY_EXISTS",
          "Your account already has an access request",
        );
      }

      throw error;
    }
  },

  listPending() {
    return accountRequestRepository.listPending();
  },

  async review(
    requestId: string,
    adminId: string,
    input: ReviewAccountRequestInput,
  ) {
    const reviewed = await accountRequestRepository.review(
      requestId,
      adminId,
      input,
    );

    if (!reviewed) {
      throw new ApiError(
        409,
        "REQUEST_NOT_PENDING",
        "Request does not exist or has already been reviewed",
      );
    }

    return reviewed;
  },
};
