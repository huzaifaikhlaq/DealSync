import { z } from "zod";

export const companyAccessStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "NOT_REQUESTED",
]);

export const companyAdminListSchema = z.strictObject({
  q: z.string().trim().max(100).optional(),
  status: companyAccessStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const companyAdminDetailsSchema = z.strictObject({
  formStatus: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  formPage: z.coerce.number().int().min(1).default(1),
  formLimit: z.coerce.number().int().min(1).max(50).default(10),
  leadStatus: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),
  leadPage: z.coerce.number().int().min(1).default(1),
  leadLimit: z.coerce.number().int().min(1).max(50).default(25),
  q: z.string().trim().max(100).optional(),
});

export type CompanyAdminListInput = z.infer<typeof companyAdminListSchema>;
export type CompanyAdminDetailsInput = z.infer<
  typeof companyAdminDetailsSchema
>;
