import { z } from "zod";

const fieldNameSchema = z
  .string()
  .regex(/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/, "Invalid field name")
  .refine(
    (value) => !value.startsWith("__") || value === "__dealsync_hp",
    "Reserved field name",
  );

const fieldValueSchema = z.union([
  z.string().max(4000),
  z.number().finite(),
  z.boolean(),
]);

export const submissionSchema = z
  .record(fieldNameSchema, fieldValueSchema)
  .refine((data) => {
    const count = Object.keys(data).length;
    return count >= 1 && count <= 25;
  }, "Submit between 1 and 25 fields");

export type SubmissionInput = z.infer<typeof submissionSchema>;
