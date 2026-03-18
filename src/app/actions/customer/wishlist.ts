"use server";

import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

/**
 * Toggles a restaurant in the customer's wishlist.
 * POST /wishlist-toggle
 * Payload: { restaurantId: string }
 */
export async function toggleWishlistAction(
  restaurantId: string,
): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.post("/wishlist-toggle", { restaurantId });
    },
    "Wishlist updated successfully",
    async (data) => {
      return data;
    },
  );
}

/**
 * Fetches the customer's wishlist.
 * GET /wishlist-me
 */
export async function getWishlistAction(): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.get("/wishlist-me");
  }, "Wishlist fetched successfully");
}
