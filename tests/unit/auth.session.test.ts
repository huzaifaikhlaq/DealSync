import { describe, expect, it } from "vitest";
import {
  createSessionCredentials,
  hashSessionToken,
  SESSION_TTL_SECONDS,
} from "@/features/auth/server/auth.session";

describe("auth sessions", () => {
  it("creates an unguessable token and stores only its digest", () => {
    const session = createSessionCredentials(new Date("2026-11-18T00:00:00Z"));

    expect(session.token).toHaveLength(43);
    expect(session.tokenHash).toBe(hashSessionToken(session.token));
    expect(session.tokenHash).not.toContain(session.token);
    expect(session.tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("expires sessions after the configured lifetime", () => {
    const now = new Date("2026-11-18T00:00:00Z");
    const session = createSessionCredentials(now);

    expect(session.expiresAt.getTime() - now.getTime()).toBe(
      SESSION_TTL_SECONDS * 1000,
    );
  });

  it("hashes different tokens to different database keys", () => {
    expect(hashSessionToken("first-token")).not.toBe(
      hashSessionToken("second-token"),
    );
  });
});
