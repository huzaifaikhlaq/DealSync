import "server-only";

import argon2 from "argon2";

const ARGON_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

let dummyHashPromise: Promise<string> | undefined;

export function getDummyPasswordHash(): Promise<string> {
  dummyHashPromise ??= hashPassword("dealsync-nonexistent-user-dummy-password");

  return dummyHashPromise;
}
