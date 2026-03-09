"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getAllRestaurantsAction(params?: {
  lat?: number;
  lng?: number;
  query?: string;
  type?: string;
  rating?: string;
  priceTier?: string;
}): Promise<ActionResponse> {
  const { lat, lng, query, type, rating, priceTier } = params || {};

  const searchParams = new URLSearchParams();
  if (lat !== undefined) searchParams.append("lat", lat.toString());
  if (lng !== undefined) searchParams.append("lng", lng.toString());
  if (query) searchParams.append("search", query);
  if (type) searchParams.append("type", type);
  if (rating) searchParams.append("rating", rating);
  if (priceTier) searchParams.append("priceTier", priceTier);

  const queryString = searchParams.toString();
  const url = queryString ? `/allResturant?${queryString}` : "/allResturant";

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

export async function getRestaurantReviewsAction(
  slug: string,
  filter?: string,
): Promise<ActionResponse> {
  const api = await serverApi();
  const queryParams = filter ? `?filter=${filter}` : "";
  return responseHandler(
    async () => api.get(`/restaurant/reviews/${slug}${queryParams}`),
    undefined,
    async (data) => {
      return data;
    },
  );
}
