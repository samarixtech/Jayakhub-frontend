"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getAllRestaurantsAction(params?: {
  lat?: number;
  lng?: number;
  query?: string;
  cuisineType?: string[];
  minRating?: number;
  discounted?: boolean;
  fastestDelivery?: boolean;
  nearestRestaurant?: boolean;
  lowestPrice?: boolean;
  highestPrice?: boolean;
  isWishlist?: boolean;
}): Promise<ActionResponse> {
  const {
    lat,
    lng,
    query,
    cuisineType,
    minRating,
    discounted,
    fastestDelivery,
    nearestRestaurant,
    lowestPrice,
    highestPrice,
    isWishlist,
  } = params || {};

  const searchParams = new URLSearchParams();
  if (lat !== undefined) searchParams.append("lat", lat.toString());
  if (lng !== undefined) searchParams.append("lng", lng.toString());
  if (query) searchParams.append("search", query);
  if (cuisineType && cuisineType.length > 0)
    cuisineType.forEach((c) => searchParams.append("cuisineType", c));
  if (minRating !== undefined) searchParams.append("minRating", minRating.toString());
  if (discounted) searchParams.append("discounted", "true");
  if (fastestDelivery) searchParams.append("fastestDelivery", "true");
  if (nearestRestaurant) searchParams.append("nearestRestaurant", "true");
  if (lowestPrice) searchParams.append("lowestPrice", "true");
  if (highestPrice) searchParams.append("highestPrice", "true");
  if (isWishlist) searchParams.append("isWishlist", "true");

  const queryString = searchParams.toString();
  const url = queryString ? `/allResturant?${queryString}` : "/allResturant";

  const api = await serverApi();
  return responseHandler(
    async () => api.get(url),
    undefined,
    async (data) => data,
  );
}

export async function getRestaurantBySlugAction(
  slug: string,
): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get(`/detail-with-menu/${slug}`),
    undefined,
    async (data) => data,
  );
}

export async function getPreviousOrderRestaurantsAction(): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/my-order-resturant"),
    undefined,
    async (data) => data,
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
    async (data) => data,
  );
}
