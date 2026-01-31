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
  restaurantPhone: z.string().min(10, "Phone number is required"),
  restaurantEmail: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),

  cuisineTypes: z.array(z.string()).min(1, "Select at least one cuisine type"),

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

export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>;

// Step 3: Brand Assets
export const brandAssetsSchema = z.object({
  logo: z.any().optional(),
  banner: z.any().optional(),
});

export type BrandAssetsInput = z.infer<typeof brandAssetsSchema>;

// Step 3: Schedule
const dayScheduleSchema = z.object({
  isOpen: z.boolean().default(true),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
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
  // licenseNumber removed as per request
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

// Step 6: Bank Details
export const bankDetailsSchema = z.object({
  accountTitle: z.string().min(3, "Account Title is required"),
  bankName: z.string().min(1, "Select a bank"),
  accountType: z.string().min(1, "Select account type"),
  iban: z.string().min(23, "IBAN must be at least 23 characters"),
});

export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;

// Step 7: Final Registration API Payload for /onboarding/register
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
});

export type RestaurantRegistrationInput = z.infer<
  typeof restaurantRegistrationSchema
>;
