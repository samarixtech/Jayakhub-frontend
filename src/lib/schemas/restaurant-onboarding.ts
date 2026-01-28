import { z } from "zod";

// Step 1: Owner Info
export const ownerInfoSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export type OwnerInfoInput = z.infer<typeof ownerInfoSchema>;

// Step 2: Restaurant Info
export const restaurantInfoSchema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required"),
  cuisineType: z.string().min(1, "Please select a cuisine type"),
  address: z.string().min(5, "Address is required"),
  logo: z.any().optional(), // In a real app, you might validate file type/size here or handle it separately
  banner: z.any().optional(),
});

export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>;

// Step 3: Schedule
// Helper for a single day's schedule
const dayScheduleSchema = z.object({
  isOpen: z.boolean().default(true),
  openTime: z.string().optional(), // e.g. "09:00"
  closeTime: z.string().optional(), // e.g. "22:00"
});

export const scheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;

// Step 4: License
export const licenseSchema = z.object({
  licenseNumber: z.string().min(3, "License number is required"),
  licenseFile: z
    .any()
    .refine(
      (file) => file instanceof File || file instanceof Blob,
      "License document is required",
    ),
});

export type LicenseInput = z.infer<typeof licenseSchema>;

// Step 4: KYC
export const kycSchema = z.object({
  documentType: z.enum(["national_id", "driving_license", "passport"]),
  documentFile: z
    .any()
    .refine(
      (file) => file instanceof File || file instanceof Blob,
      "Document file is required",
    ),
});

export type KycInput = z.infer<typeof kycSchema>;
