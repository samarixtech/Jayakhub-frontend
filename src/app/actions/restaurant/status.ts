"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

import { cookies } from "next/headers";

export async function getRestaurantStatusAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/my-restaurant");
    },
    "Restaurant status fetched successfully",
    async (data: any) => {
      const cookieStore = await cookies();
      if (data?.id) {
        cookieStore.set("restaurantId", data.id, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      // Fallback: Google login skips OTP verification, so planKeywords never
      // gets set there. Derive it from the restaurant's active plan instead.
      if (!cookieStore.get("planKeywords")?.value) {
        const keywords = data?.activePlan?.keywords;
        if (Array.isArray(keywords) && keywords.length > 0) {
          cookieStore.set("planKeywords", JSON.stringify(keywords), {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      }

      // /my-restaurant is the authoritative source for plan status, so
      // always refresh these — unlike planKeywords above, they're plain
      // booleans that should never go stale behind an "only if missing" check.
      const isExpired = data?.isExpired ?? data?.activePlan?.isExpired ?? false;
      const isCancelled = data?.isCancel ?? data?.activePlan?.isCancel ?? false;
      cookieStore.set("isExpired", isExpired ? "true" : "false", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("isCancelled", isCancelled ? "true" : "false", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return data;
    },
  );
}
