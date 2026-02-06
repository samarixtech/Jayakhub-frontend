"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getAllRestaurantsAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get("/allResturant"),
    "Restaurants fetched successfully",
    async (data) => {
      return data;
    },
  );
}

export async function getRestaurantBySlugAction(
  slug: string,
): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get(`/detail-with-menu/${slug}`),
    "Restaurant fetched successfully",
    async (data) => {
      console.log(data);

      return data;
    },
  );
}
