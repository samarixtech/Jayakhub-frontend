import { z } from "zod";

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: string[] }; // Simple array of strings for now, or detailed object

export function validateSchema<T>(schema: z.Schema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((err) => err.message);
  return { success: false, errors };
}
