
import { z } from "zod";

export const createAccountRequestSchema = z.strictObject({
  websiteUrl: z
    .url()
    .max(500)
    .refine(
      (value) => {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      },
      "Website URL must use HTTP or HTTPS",
    ),

  message: z.string().trim().max(1000).optional(),
});

export const reviewAccountRequestSchema = z.strictObject({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(1000).optional(),
});

export type CreateAccountRequestInput = z.infer<
  typeof createAccountRequestSchema
>;

export type ReviewAccountRequestInput = z.infer<
  typeof reviewAccountRequestSchema
>;
