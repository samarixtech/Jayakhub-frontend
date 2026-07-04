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
  console.log('🚀 ~ getAccountSettingsAction ~ res:', res.data?.schedules)
  return res;
}

// ==================== UPDATE RESTAURANT PROFILE ====================

interface ProfileUpdatePayload {
  name: string;
  description: string;
  websiteUrl: string;
  type: string[];
  profileImageBase64?: string;
  profileImageName?: string;
  profileImageType?: string;
  bannerImageBase64?: string;
  bannerImageName?: string;
  bannerImageType?: string;
}

export async function updateRestaurantProfileAction(
  payload: ProfileUpdatePayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    async (api) => {
      const { default: NodeFormData } = await import("form-data");
      const sendData = new NodeFormData();

      sendData.append("name", payload.name);
      sendData.append("description", payload.description);
      sendData.append("websiteUrl", payload.websiteUrl);
      payload.type.forEach((cuisine) => sendData.append("type", cuisine));

      if (payload.profileImageBase64) {
        const buffer = Buffer.from(payload.profileImageBase64, "base64");
        sendData.append("profile", buffer, {
          filename: payload.profileImageName || "profile.jpg",
          contentType: payload.profileImageType || "image/jpeg",
          knownLength: buffer.length,
        });
      }

      if (payload.bannerImageBase64) {
        const buffer = Buffer.from(payload.bannerImageBase64, "base64");
        sendData.append("banner", buffer, {
          filename: payload.bannerImageName || "banner.jpg",
          contentType: payload.bannerImageType || "image/jpeg",
          knownLength: buffer.length,
        });
      }

      return api.put("/update-Account-Profile", sendData, {
        headers: sendData.getHeaders(),
      });
    },
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

// ==================== UPDATE ONLINE STATUS ====================
export async function updateOnlineStatusAction(
  isOnline: boolean,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.put("/update-Account-Profile", { isOnline }),
    "Status updated successfully",
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
    "Bank Details Updated Successfully",
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
