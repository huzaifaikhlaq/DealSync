import { z } from "zod";

const fieldName = z
  .string()
  .regex(/^[A-Za-z][A-Za-z0-9_-]{0,63}$/, "Invalid field name");

const fieldValue = z.union([
  z.string().max(4000),
  z.number().finite(),
  z.boolean(),
]);

export const submissionSchema = z
  .record(fieldName, fieldValue)
  .refine((data) => {
    const count = Object.keys(data).length;
    return count >= 1 && count <= 25;
  }, "Submit between 1 and 25 fields");

export type SubmissionInput = z.infer<typeof submissionSchema>;
