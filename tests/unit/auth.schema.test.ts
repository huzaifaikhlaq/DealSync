import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas/auth.schema";

describe("auth schemas", () => {
  it("normalizes email addresses and safe redirect destinations", () => {
    const parsed = loginSchema.parse({
      email: "  ADA@Example.com ",
      password: "correct horse battery staple",
      redirectTo: "//attacker.example",
    });

    expect(parsed.email).toBe("ada@example.com");
    expect(parsed.redirectTo).toBe("/dashboard");
  });

  it("rejects short registration passwords", () => {
    const parsed = registerSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "short",
      confirmPassword: "short",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.path[0] === "password")).toBe(
        true,
      );
    }
  });

  it("rejects mismatched registration passwords", () => {
    const parsed = registerSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "a very long password",
      confirmPassword: "a different password",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(
        parsed.error.issues.some(
          (issue) => issue.path[0] === "confirmPassword",
        ),
      ).toBe(true);
    }
  });
});
