"use server";
import { serverApi } from "@/components/services/api";
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
  const api = await serverApi();
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
  const api = await serverApi();
  return responseHandler(
    async () => api.get(`/detail-with-menu/${slug}`),
    undefined,
    async (data) => {
      return data;
    },
  );
}

export async function getPreviousOrderRestaurantsAction(): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/my-order-resturant"),
    undefined,
    async (data) => {
      return data;
    },
  );
}
