"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";

// ==================== GET REVIEWS ANALYTICS ACTION ====================
export async function getReviewsAnalyticsAction({
  page = 1,
  limit = 10,
  filter = "All",
  months,
}: {
  page?: number;
  limit?: number;
  filter?: string;
  months?: string;
} = {}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter,
      });
      if (months && months !== "all") {
        queryParams.append("months", months);
      }
      return api.get(`/rating/analytics?${queryParams.toString()}`);
    },
    "Rating analytics fetched successfully",
    async (responseData: any) => {
      return responseData;
    },
  );
}

// ==================== REPLY TO REVIEW ACTION ====================
export async function replyToReviewAction(data: {
  reviewId: string;
  replyText: string;
}): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return responseHandler(
    async () =>
      api.post(
        `/rating/${data.reviewId}/reply`,
        { reply: data.replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    "Reply added successfully",
  );
}
