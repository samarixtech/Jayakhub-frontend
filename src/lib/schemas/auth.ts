import { z } from "zod";

// ========== LOGIN SCHEMA ==========
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ========== REGISTER SCHEMA ==========
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(4, "Name must be at least 4-5 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(/^\+?[0-9]{10,14}$/, "Phone number must be valid (10-14 digits)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character (e.g. @, #, $, %, etc.)",
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ========== FORGOT PASSWORD SCHEMA ==========
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ========== RESET PASSWORD SCHEMA ==========
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ========== OTP SCHEMA ==========
export const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP must be valid"),
});

// ========== TYPE INFERENCES ==========
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
