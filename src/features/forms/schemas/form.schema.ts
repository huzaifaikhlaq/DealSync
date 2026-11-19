import { z } from "zod";

const originSchema = z
  .url()
  .refine((value) => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  }, "Only HTTP and HTTPS URLs are allowed")
  .transform((value) => new URL(value).origin);

export const createFormSchema = z.strictObject({
  name: z.string().trim().min(2).max(120),
  allowedOrigins: z.array(originSchema).max(10).optional(),
});

export const updateFormSchema = z
  .strictObject({
    name: z.string().trim().min(2).max(120).optional(),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
    allowedOrigins: z.array(originSchema).max(10).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type CreateFormInput = z.infer<typeof createFormSchema>;

export type UpdateFormInput = z.infer<typeof updateFormSchema>;
