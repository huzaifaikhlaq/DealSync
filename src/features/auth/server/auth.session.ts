import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "dealsync_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionCredentials(now = new Date()) {
  const token = randomBytes(32).toString("base64url");

  return {
    token,
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
  };
}

function cookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

export async function createAuthSession(userId: string): Promise<void> {
  const credentials = createSessionCredentials();
  const repository = await import("./auth.repository");

  await repository.createSessionRecord({
    tokenHash: credentials.tokenHash,
    userId,
    expiresAt: credentials.expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    credentials.token,
    cookieOptions(credentials.expiresAt),
  );
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token || token.length > 128) return null;

  const repository = await import("./auth.repository");
  const tokenHash = hashSessionToken(token);
  const session = await repository.findSessionByTokenHash(tokenHash);

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await repository.deleteSessionByTokenHash(tokenHash);
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session.user;
}

export async function deleteAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token && token.length <= 128) {
    const repository = await import("./auth.repository");
    await repository.deleteSessionByTokenHash(hashSessionToken(token));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
