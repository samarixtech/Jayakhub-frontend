"use server";

import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function executeRestaurantAction(
  apiCall: (api: any, restaurantId: string) => Promise<any>,
  successMessage: string,
  revalidatePathUrl?: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return {
      success: false,
      message: "Restaurant ID not found",
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return apiCall(api, restaurantId);
    },
    successMessage,
    async (data) => {
      if (revalidatePathUrl) {
        revalidatePath(revalidatePathUrl);
      }
      console.log("bulk imports", data || "undefined");

      return data;
    },
  );
}
