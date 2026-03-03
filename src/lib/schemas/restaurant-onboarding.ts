import { z } from "zod";

// ========== OWNER INFO SCHEMA ==========
export const ownerInfoSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
});

// ========== RESTAURANT INFO SCHEMA ==========
export const restaurantInfoSchema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required"),
  restaurantPhone: z.string().min(10, "Phone number is required"),
  restaurantEmail: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),

  cuisineTypes: z.array(z.string()).min(1, "Select at least one cuisine type"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(5, "Address is required"),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  logo: z.any().optional(),
  banner: z.any().optional(),
});

// ========== BRAND ASSETS SCHEMA ==========
export const brandAssetsSchema = z.object({
  logo: z.any().optional(),
  banner: z.any().optional(),
});

// ========== DAY SCHEDULE SCHEMA ==========
const dayScheduleSchema = z.object({
  isOpen: z.boolean().default(true),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

// ========== SCHEDULE SCHEMA ==========
export const scheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

// ========== LICENSE SCHEMA ==========
export const licenseSchema = z.object({
  // licenseNumber removed as per request
  licenseFile: z
    .any()
    .refine(
      (file) => file instanceof File || file instanceof Blob,
      "License document is required",
    ),
});

// ========== KYC SCHEMA ==========
export const kycSchema = z.object({
  documentType: z.enum(["national_id", "driving_license", "passport"]),
  documentFile: z
    .any()
    .refine(
      (file) => file instanceof File || file instanceof Blob,
      "Document file is required",
    ),
});

// ========== BANK DETAILS SCHEMA ==========
export const bankDetailsSchema = z.object({
  accountTitle: z.string().min(3, "Account Title is required"),
  bankName: z.string().min(1, "Select a bank"),
  accountType: z.string().min(1, "Select account type"),
  iban: z.string().min(23, "IBAN must be at least 23 characters"),
});

// ========== FINAL REGISTRATION API PAYLOAD FOR /ONBOARDING/REGISTER ==========
export const restaurantRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.string(),
  schedules: z.string(), // Sending as JSON string to avoid backend parsing error
  kycDocuments: z.string(), // Sending as JSON string
  Ownerphone: z.string(),
  ownerName: z.string(),
  accountHolderName: z.string(),
  accountType: z.string(), // Using this field for account type as per payload example
  bankName: z.string(),
  iban: z.string(),
  profileImage: z.string().optional(),
  bannerImage: z.string().optional(),
});

// TYPE INFERECES
export type OwnerInfoInput = z.infer<typeof ownerInfoSchema>;
export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>;
export type BrandAssetsInput = z.infer<typeof brandAssetsSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type LicenseInput = z.infer<typeof licenseSchema>;
export type KycInput = z.infer<typeof kycSchema>;
export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;
export type RestaurantRegistrationInput = z.infer<
  typeof restaurantRegistrationSchema
>;
