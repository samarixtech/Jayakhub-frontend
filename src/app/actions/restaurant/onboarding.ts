"use server";

import api from "@/components/services/api";
import {
  restaurantRegistrationSchema,
  RestaurantRegistrationInput,
} from "@/lib/schemas/restaurant-onboarding";
import { validateSchema } from "@/lib/validator";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function registerRestaurantOnboardingAction(
  data: RestaurantRegistrationInput,
): Promise<ActionResponse> {
  console.log("Server Action Received Data:", JSON.stringify(data, null, 2));
  const validation = validateSchema(restaurantRegistrationSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => api.post("/onboarding/register", data),
    "Application Submitted Successfully!",
  );
}
