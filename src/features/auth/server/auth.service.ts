import { ApiError } from "@/lib/http/api-error";
import type { AuthUser } from "../types/auth.types";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { hashPassword, verifyPassword } from "./auth.password";
import * as repository from "./auth.repository";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function registerAccount(
  input: Pick<RegisterInput, "name" | "email" | "password">,
): Promise<AuthUser> {
  const existingUser = await repository.findUserByEmail(input.email);
  if (existingUser) {
    throw new ApiError(409, "account_exists", "An account already uses this email.");
  }

  const passwordHash = await hashPassword(input.password);

  try {
    return await repository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ApiError(
        409,
        "account_exists",
        "An account already uses this email.",
      );
    }
    throw error;
  }
}

export async function loginAccount(
  input: Pick<LoginInput, "email" | "password">,
): Promise<AuthUser> {
  const user = await repository.findUserByEmail(input.email);
  const passwordIsValid = user
    ? await verifyPassword(input.password, user.passwordHash)
    : false;

  if (!user || !passwordIsValid) {
    throw new ApiError(401, "invalid_credentials", "Email or password is incorrect.");
  }

  return { id: user.id, name: user.name, email: user.email };
}
