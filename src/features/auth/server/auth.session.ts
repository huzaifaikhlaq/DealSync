
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authRepository } from "./auth.repository";
import type {
  AuthUser,
  SessionToken,
} from "../types/auth.types";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-dealsync_session"
    : "dealsync_session";

export function hashSessionToken(
  token: string,
): string | null {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return null;
  }

  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function generateSessionToken(): SessionToken {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(rawToken);

  if (!tokenHash) {
    throw new Error("Failed to generate session token");
  }

  return {
    rawToken,
    tokenHash,
    expiresAt: new Date(
      Date.now() + SESSION_DURATION_MS,
    ),
  };
}

export function setSessionCookie(
  response: NextResponse,
  session: SessionToken,
): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: session.rawToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });
}

export function clearSessionCookie(
  response: NextResponse,
): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function validateSession(
  token: string | undefined,
): Promise<AuthUser | null> {
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  if (!tokenHash) return null;

  const session = await authRepository.findSessionByHash(
    tokenHash,
  );

  if (
    !session ||
    session.revokedAt !== null ||
    session.expiresAt <= new Date() ||
    !session.user.isActive
  ) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}

export async function getAuthenticatedUser():
  Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME,
  )?.value;

  return validateSession(token);
}
