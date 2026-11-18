import { z } from "zod";
import { safeRedirect } from "@/lib/security/safe-redirect";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z
      .email({ error: "Enter a valid email address." })
      .max(254, { error: "Email addresses must be 254 characters or fewer." }),
  );

const passwordSchema = z
  .string()
  .min(12, { error: "Use at least 12 characters." })
  .max(128, { error: "Use 128 characters or fewer." });

const redirectSchema = z
  .string()
  .optional()
  .transform((value) => safeRedirect(value));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Enter your password." }).max(128),
  redirectTo: redirectSchema,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Enter your name." })
      .max(100, { error: "Names must be 100 characters or fewer." }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { error: "Confirm your password." }),
    redirectTo: redirectSchema,
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type LoginInput = z.output<typeof loginSchema>;
export type RegisterInput = z.output<typeof registerSchema>;
