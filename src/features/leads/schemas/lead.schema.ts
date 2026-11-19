import { z } from "zod";

export const listLeadsSchema = z.strictObject({
  formId: z.uuid().optional(),

  status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),

  q: z.string().trim().max(100).optional(),

  range: z.enum(["7d", "30d", "90d", "all"]).default("all"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(25),
});

export const updateLeadSchema = z
  .strictObject({
    status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),

    notes: z.string().trim().max(4000).nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

export type ListLeadsInput = z.infer<typeof listLeadsSchema>;

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
