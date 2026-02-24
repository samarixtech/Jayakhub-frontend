"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";

// ==================== GET REVIEWS ANALYTICS ACTION ====================
export async function getReviewsAnalyticsAction(
  filters?: any,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return responseHandler(
    async () =>
      api.get("/rating/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      }),
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
