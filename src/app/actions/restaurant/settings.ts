"use server";

import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { serverApi } from "@/components/services/api";

// ==================== GET ACCOUNT SETTINGS ====================
export async function getAccountSettingsAction(): Promise<ActionResponse> {
  const res = await executeRestaurantAction(
    (api) => api.get("/account-settings"),
    "Account settings fetched successfully",
  );
  return res;
}

// ==================== UPDATE RESTAURANT PROFILE ====================
export async function updateRestaurantProfileAction(
  formData: FormData,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) =>
      api.put("/update-Account-Profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    "Restaurant Profile Updated Successfully",
    "/restaurant/settings/profile",
  );
}

// ==================== UPDATE RESTAURANT SCHEDULE ====================
export async function updateRestaurantScheduleAction(
  schedules: any[],
): Promise<ActionResponse> {
  const { cookies } = await import("next/headers");
  const restaurantId = (await cookies()).get("restaurantId")?.value;

  if (!restaurantId) {
    return {
      success: false,
      message: "Restaurant ID not found",
    };
  }

  const payload = {
    restaurantId,
    schedules,
  };

  return executeRestaurantAction(
    (api) => api.put("/schedule/update", payload),
    "Schedule Updated Successfully",
    "/restaurant/settings/hours",
  );
}

// ==================== SET NEW PASSWORD (GOOGLE LOGIN) ====================
export async function setNewPasswordAction(
  password: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.post("/set-new-password", { password }),
    "Password set successfully",
  );
}
// ==================== UPDATE RESTAURANT LOCATION ====================
export async function updateLocationAction(data: {
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.put("/settings/update-request", data),
    "Restaurant Info Updated Successfully",
  );
}

// ==================== UPDATE BANK DETAILS ====================
export async function updateBankDetailsAction(data: {
  bankName: string;
  accountHolderName: string;
  iban: string;
}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.put("/settings/update-request", data),
    "Bank details update request submitted successfully",
  );
}

// ==================== UPDATE KYC DOCUMENTS ====================
export async function updateKycAction(
  formData: FormData,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) =>
      api.put("/settings/update-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    "Document upload request submitted successfully",
  );
}

// ==================== GET BANKS LIST ====================
// Uses serverApi directly — /banks is not restaurant-specific,
// so executeRestaurantAction (which requires restaurantId cookie) would fail during onboarding.
export async function getBanksAction(): Promise<ActionResponse<string[]>> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/banks");
    },
    "Banks fetched successfully",
    async (data: any) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.banks)) return data.banks;
      return [];
    },
  );
}
