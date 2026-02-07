"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getAllRestaurantsAction(params?: {
  lat?: number;
  lng?: number;
}): Promise<ActionResponse> {
  const { lat, lng } = params || {};
  let url = "/allResturant";
  if (lat !== undefined && lng !== undefined) {
    url = `/allResturant?lat=${lat}&lng=${lng}`;
  }
  // console.log("🍽️ Fetching restaurants with URL:", url );
  return responseHandler(
    async () => api.get(url),
    "Restaurants fetched successfully",
    async (data) => {
      console.log("🍽️ Restaurants response:", data);
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
