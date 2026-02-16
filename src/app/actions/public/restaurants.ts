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
  return responseHandler(
    async () => api.get(url),
    undefined,
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
    undefined,
    async (data) => {
      return data;
    },
  );
}
