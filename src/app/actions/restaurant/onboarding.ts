"use server";

import { serverApi } from "@/components/services/api";
import { ActionResponse } from "@/lib/utils/response-handler";

export async function registerRestaurantOnboardingAction(
  formData: FormData,
): Promise<ActionResponse> {
  try {
    // Log form data keys for debugging
    console.log(
      "Server Action Received FormData keys:",
      Array.from(formData.keys()),
    );

    const api = await serverApi();
    const response = await api.post("/onboarding/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Application Submitted Successfully!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Onboarding Error:", error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to submit application",
      errors: error?.response?.data?.errors || [],
    };
  }
}
