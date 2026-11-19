import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/http/api-error";

import { authRepository } from "./auth.repository";
import { generateSessionToken, hashSessionToken } from "./auth.session";
import {
  getDummyPasswordHash,
  hashPassword,
  verifyPassword,
} from "./auth.password";

import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

import type { AuthResult, AuthUser } from "../types/auth.types";

function toPublicUser(user: AuthUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const passwordHash = await hashPassword(input.password);
    const session = generateSessionToken();

    try {
      const user = await authRepository.createUserWithSession({
        name: input.name,
        email: input.email,
        passwordHash,
        session,
      });

      return {
        user,
        session,
      };
    } catch (error) {
      // Unique constraint on User.email.
      // This also handles concurrent registration attempts.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ApiError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "An account with this email already exists",
        );
      }

      throw error;
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await authRepository.findUserByEmail(input.email);

    const passwordHash = user?.passwordHash ?? (await getDummyPasswordHash());

    const passwordValid = await verifyPassword(passwordHash, input.password);

    if (!user || !user.isActive || !passwordValid) {
      throw new ApiError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }

    const session = generateSessionToken();

    await authRepository.createSession(user.id, session);

    return {
      user: toPublicUser(user),
      session,
    };
  },

  async logout(token: string | undefined): Promise<void> {
    if (!token) return;

    const tokenHash = hashSessionToken(token);
    if (!tokenHash) return;

    await authRepository.revokeSession(tokenHash);
  },
};
