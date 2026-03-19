"use server";
import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { ActionResponse } from "@/lib/utils/response-handler";

// ==================== GET REVIEWS ANALYTICS ACTION ====================
export async function getReviewsAnalyticsAction({
  page = 1,
  limit = 10,
  filter = "All",
}: {
  page?: number;
  limit?: number;
  filter?: string;
} = {}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter,
      });
      return api.get(`/rating/analytics?${queryParams.toString()}`);
    },
    "Rating analytics fetched successfully",
  );
}

// ==================== REPLY TO REVIEW ACTION ====================
export async function replyToReviewAction(data: {
  reviewId: string;
  replyText: string;
}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) =>
      api.post(`/rating/${data.reviewId}/reply`, { reply: data.replyText }),
    "Reply added successfully",
  );
}
