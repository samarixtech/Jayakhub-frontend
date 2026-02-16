"use server";

import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { ActionResponse } from "@/lib/utils/response-handler";
import { revalidatePath } from "next/cache";

// ==================== GET ACCOUNT SETTINGS ====================
export async function getAccountSettingsAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.get("/account-settings"),
    "Account settings fetched successfully",
  );
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
