"use server";

import api from "@/components/services/api";
import { getProfile } from "../customer/userprofile";
import { validateSchema } from "@/lib/validator";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import {
  ownerInfoSchema,
  restaurantInfoSchema,
  scheduleSchema,
  kycSchema,
  OwnerInfoInput,
  RestaurantInfoInput,
  ScheduleInput,
  KycInput,
} from "@/lib/schemas/restaurant-onboarding";
import { cookies } from "next/headers";

// ==================== STEP 2 PREFETCH RESTAURANT DETAILS ====================
export async function getMyRestaurantAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get("/my-restaurant"),
    "Restaurant details fetched",
    async (data) => {
      if (data?.id) {
        (await cookies()).set("restaurantId", data.id);
      }
      return data;
    },
  );
}
// Helper to mock successful API response
const mockSuccess = (data: any = {}) => ({
  meta: { status: 200, message: "Saved successfully" },
  data: data,
});

export async function saveOwnerInfoAction(
  data: OwnerInfoInput,
): Promise<ActionResponse> {
  const validation = validateSchema(ownerInfoSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  // Split name into first and last name as expected by the API
  const [firstName, ...lastNameParts] = data.ownerName.trim().split(" ");
  const lastName = lastNameParts.join(" ");

  const apiPayload = new FormData();
  apiPayload.append("name", firstName || "");
  apiPayload.append("lastName", lastName || "");
  apiPayload.append("phone", data.ownerPhone);

  return responseHandler(
    async () => api.put("/update-profile", apiPayload),
    "Owner info saved successfully",
  );
}

// ==================== STEP 2: RESTAURANT INFO ====================
export async function saveRestaurantInfoAction(
  formData: FormData,
): Promise<ActionResponse> {
  // 1. Construct new FormData for the API to match expected keys
  const apiPayload = new FormData();

  // Map fields
  const name = formData.get("restaurantName") as string;
  if (name) apiPayload.append("name", name);

  const phone = formData.get("restaurantPhone") as string;
  if (phone) apiPayload.append("phone", phone);

  const email = formData.get("restaurantEmail") as string;
  if (email) apiPayload.append("email", email);

  const websiteUrl = formData.get("websiteUrl") as string;
  if (websiteUrl) apiPayload.append("websiteUrl", websiteUrl);

  const description = formData.get("description") as string;
  if (description) apiPayload.append("description", description);

  const address = formData.get("address") as string;
  if (address) apiPayload.append("address", address);

  // Map Coordinates
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  if (lat) apiPayload.append("latitude", lat);
  if (lng) apiPayload.append("longitude", lng);

  // Map Images
  const logo = formData.get("logo");
  if (logo) apiPayload.append("profile", logo);

  const banner = formData.get("banner");
  if (banner) apiPayload.append("banner", banner);

  // Add Status
  apiPayload.append("status", "pending");

  // Fetch and Owner Name
  try {
    const profileRes = await getProfile();
    if (profileRes.success && profileRes.data) {
      const { name, lastName } = profileRes.data;
      const ownerName = [name, lastName].filter(Boolean).join(" ");
      if (ownerName) apiPayload.append("ownerName", ownerName);
      else apiPayload.append("ownerName", "Owner");
    } else {
      apiPayload.append("ownerName", "Owner");
    }
    console.log(profileRes);
    console.log(apiPayload);
  } catch (error) {
    console.log(error);

    apiPayload.append("ownerName", "Owner");
  }

  // Map Cuisine Types (Array) - Using 'type' key repeated
  const cuisineTypesJson = formData.get("cuisineTypes") as string;
  if (cuisineTypesJson) {
    try {
      const types = JSON.parse(cuisineTypesJson);
      if (Array.isArray(types)) {
        types.forEach((type: string) => {
          apiPayload.append("type", type);
        });
      }
    } catch (e) {
      console.error("Failed to parse cuisine types", e);
    }
  }

  // We also validte input locally before sending, to save a request if invalid.
  // Re-construct obj for Zod
  const validationObj: any = {
    restaurantName: name || "",
    restaurantPhone: phone || "",
    restaurantEmail: email || "",
    websiteUrl: websiteUrl || "",
    description: description || "",
    address: address || "",
    cuisineTypes: cuisineTypesJson ? JSON.parse(cuisineTypesJson) : [],
    location:
      lat && lng
        ? { lat: parseFloat(lat as string), lng: parseFloat(lng as string) }
        : undefined,
  };

  const validation = validateSchema(restaurantInfoSchema, validationObj);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => api.post("/createRestaurant", apiPayload),
    "Restaurant created successfully",
  );
}

// ==================== STEP 3: SCHEDULE ====================
export async function saveScheduleAction(
  data: ScheduleInput,
): Promise<ActionResponse> {
  const validation = validateSchema(scheduleSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  // 1. Get Restaurant ID from Cookies
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value || "";

  if (!restaurantId) {
    console.error("Restaurant ID not found in cookies.");
    return {
      success: false,
      message:
        "Restaurant ID missing. Please refresh or go back to Restaurant Info step.",
    };
  }

  // 2. Transform Data
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const schedules = days.map((day) => {
    const dayData = (data as any)[day];
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    // Ensure payload matches instructions
    return {
      dayOfWeek: dayCapitalized,
      openTime: dayData.openTime || "09:00",
      closeTime: dayData.closeTime || "22:00",
      isClosed: !dayData.isOpen, // UI says 'isOpen', payload might want 'isClosed'
    };
  });

  const payload = {
    restaurantId: restaurantId, // This might be empty if we couldn't find it
    schedules: schedules,
  };

  console.log(
    "DEBUG: saveScheduleAction Payload:",
    JSON.stringify(payload, null, 2),
  );

  return responseHandler(
    async () => api.post("/schedule/create", payload),
    "Schedule saved successfully",
  );
}

// ==================== STEP 4: KYC ====================
export async function completeOnboardingAction(
  formData: FormData,
): Promise<ActionResponse> {
  // Just a mock for final submission, or unused if we rely on uploadRestaurantKycAction
  return responseHandler(async () => {
    // MOCK API CALL
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockSuccess();
  }, "Onboarding completed successfully");
}

// ==================== SHARED: UPLOAD KYC/LICENSE ====================
export async function uploadRestaurantKycAction(
  formData: FormData,
): Promise<ActionResponse> {
  const apiPayload = new FormData();

  // Reconstruct manually to ensure clean state
  // We expect keys like 'food_license' or 'government_id'
  for (const [key, value] of Array.from(formData.entries())) {
    apiPayload.append(key, value);
  }

  return responseHandler(
    async () => api.post("/kyc", apiPayload),
    "Document uploaded successfully",
  );
}
