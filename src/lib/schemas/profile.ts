import { z } from "zod";

// ==================== UPDATE PROFILE SCHEMA ====================
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().optional(),
  phone: z.string().min(10, "Phone number must be valid"),
  avatar: z.any().optional(),
});

// ==================== CHANGE PASSWORD SCHEMA ====================
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ========== TYPE INFERENCES ==========
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
