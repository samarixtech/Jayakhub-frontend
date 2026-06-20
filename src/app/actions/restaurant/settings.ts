"use server";

import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { ActionResponse } from "@/lib/utils/response-handler";
import { revalidatePath } from "next/cache";

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
export async function getBanksAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.get("/banks"),
    "Banks fetched successfully",
  );
}
