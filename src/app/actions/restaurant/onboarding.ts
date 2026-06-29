"use server";

import FormDataNode from "form-data";
import { serverApi } from "@/components/services/api";
import { ActionResponse } from "@/lib/utils/response-handler";

export async function registerRestaurantOnboardingAction(
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const nativeForm = new FormDataNode();

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        nativeForm.append(key, buffer, {
          filename: value.name,
          contentType: value.type,
        });
      } else {
        nativeForm.append(key, value);
      }
    }

    const api = await serverApi();
    const response = await api.post("/onboarding/register", nativeForm, {
      headers: nativeForm.getHeaders(),
    });

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
