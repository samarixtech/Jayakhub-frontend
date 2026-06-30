"use server";

import { serverApi } from "@/components/services/api";
import { ActionResponse } from "@/lib/utils/response-handler";

export async function registerRestaurantOnboardingAction(
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const nativeForm = new FormData();

    for (const [key, value] of formData.entries()) {
      if (
        value &&
        typeof value === "object" &&
        "arrayBuffer" in value &&
        "type" in value &&
        "name" in value
      ) {
        const file = value as any;
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const blob = new Blob([buffer], { type: file.type });
          nativeForm.append(key, blob, file.name);
        }
      } else {
        nativeForm.append(key, value);
      }
    }

    const api = await serverApi();
    const response = await api.post("/onboarding/register", nativeForm);

    return {
      success: true,
      message: response?.data.meta?.message || "Application Submitted Successfully!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Onboarding Error:", error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.meta?.message || error?.response?.data?.message || "Failed to submit application",
      errors: error?.response?.data?.errors || [],
    };
  }
}
