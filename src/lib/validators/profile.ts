import { z } from "zod";

// ==================== UPDATE PROFILE SCHEMA ====================
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().optional(),
  phone: z.string().min(10, "Phone number must be valid"),
  avatar: z.any().optional(), // File handling is tricky in Zod, usually validated at action level or just passed through
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==================== CHANGE PASSWORD SCHEMA ====================
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ==================== ADD CARD SCHEMA ====================
export const addCardSchema = z.object({
  cardholderName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardType: z.string().min(1, "Card type is required"),
  isDefault: z.boolean().default(false),
});

export type AddCardInput = z.infer<typeof addCardSchema>;
