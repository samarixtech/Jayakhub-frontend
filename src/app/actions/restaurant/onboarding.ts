"use server";

import { validateSchema } from "@/lib/validators/validator";
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
} from "@/lib/validators/restaurant-onboarding";

// Helper to mock successful API response
const mockSuccess = (data: any = {}) => ({
  meta: { status: 200, message: "Saved successfully" },
  data: data,
});

// ==================== STEP 1: OWNER INFO ====================
export async function saveOwnerInfoAction(data: OwnerInfoInput): Promise<ActionResponse> {
  const validation = validateSchema(ownerInfoSchema, data);
  if (!validation.success) {
    return { success: false, message: "Validation failed", errors: validation.errors };
  }

  return responseHandler(
    async () => {
        // MOCK API CALL
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSuccess(data);
    },
    "Owner info saved successfully"
  );
}

// ==================== STEP 2: RESTAURANT INFO ====================
export async function saveRestaurantInfoAction(formData: FormData): Promise<ActionResponse> {
    const payload: Record<string, any> = {};
    formData.forEach((value, key) => {
        payload[key] = value;
    });

    // Validate using Zod (omit files for pure schema validation if needed, or handle differently)
    // Here we just map FormData to our input object roughly
    const input: RestaurantInfoInput = {
        restaurantName: payload.restaurantName as string,
        cuisineType: payload.cuisineType as string,
        address: payload.address as string,
        // Files are handled separately usually, but for mock we just ignore or pass through
    };

    const validation = validateSchema(restaurantInfoSchema, input);
    if (!validation.success) {
         return { success: false, message: "Validation failed", errors: validation.errors };
    }

  return responseHandler(
    async () => {
        // MOCK API CALL
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSuccess();
    },
    "Restaurant info saved successfully"
  );
}

// ==================== STEP 3: SCHEDULE ====================
export async function saveScheduleAction(data: ScheduleInput): Promise<ActionResponse> {
  const validation = validateSchema(scheduleSchema, data);
  if (!validation.success) {
    return { success: false, message: "Validation failed", errors: validation.errors };
  }

  return responseHandler(
    async () => {
         // MOCK API CALL
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSuccess();
    },
    "Schedule saved successfully"
  );
}

// ==================== STEP 4: KYC ====================
export async function completeOnboardingAction(formData: FormData): Promise<ActionResponse> {
    // Just a mock for final submission
     return responseHandler(
    async () => {
         // MOCK API CALL
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockSuccess();
    },
    "Onboarding completed successfully"
  );
}
