import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function validateSchema<T>(
  schema: z.Schema<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // result.success is false at this point
  const zodError = result.error;
  if (!zodError || !zodError.issues) {
    console.error(
      "Validation failed with unexpected error structure:",
      zodError,
    );
    return {
      success: false,
      errors: ["Validation failed with unexpected error"],
    };
  }
  const errors = zodError.issues.map((err: z.ZodIssue) => err.message);
  return { success: false, errors };
}
