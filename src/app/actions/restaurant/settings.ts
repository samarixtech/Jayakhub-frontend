"use server";

import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { ActionResponse } from "@/lib/utils/response-handler";

// ==================== GET ACCOUNT SETTINGS ====================
export async function getAccountSettingsAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.get("/account-settings"),
    "Account settings fetched successfully",
  );
}
