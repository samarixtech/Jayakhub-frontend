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
      if (data?.id) {
        const cookieStore = await cookies();
        cookieStore.set("restaurantId", data.id, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
      return data;
    },
  );
}
