import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] }; // Simple array of strings for now, or detailed object

export function validateSchema<T>(
  schema: z.Schema<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  if (!result.success) {
    const zodError = result.error;
    if (!zodError || !zodError.errors) {
      console.error(
        "Validation failed with unexpected error structure:",
        zodError,
      );
      return {
        success: false,
        errors: ["Validation failed with unexpected error"],
      };
    }
    const errors = zodError.errors.map((err) => err.message);
    return { success: false, errors };
  }
}
