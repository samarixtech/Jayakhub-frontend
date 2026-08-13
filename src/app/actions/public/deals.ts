"use server";
import { cookies } from "next/headers";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getPublicDealsAction(params?: {
  page?: number;
  limit?: number;
  lat?: number | string;
  lng?: number | string;
}): Promise<ActionResponse> {
  const { page, limit, lat, lng } = params || {};

  const searchParams = new URLSearchParams();
  if (page !== undefined) searchParams.append("page", page.toString());
  if (limit !== undefined) searchParams.append("limit", limit.toString());

  const cookieStore = await cookies();

  const finalLat =
    lat !== undefined && lat !== null && lat !== ""
      ? lat.toString()
      : cookieStore.get("USER_LAT")?.value || cookieStore.get("LATITUDE")?.value;

  const finalLng =
    lng !== undefined && lng !== null && lng !== ""
      ? lng.toString()
      : cookieStore.get("USER_LNG")?.value || cookieStore.get("LONGITUDE")?.value;

  if (finalLat) searchParams.append("lat", finalLat);
  if (finalLng) searchParams.append("lng", finalLng);

  const countryCode = cookieStore.get("USER_COUNTRY")?.value;
  if (countryCode) searchParams.append("countryCode", countryCode);

  const queryString = searchParams.toString();
  const url = queryString ? `/deals/public?${queryString}` : "/deals/public";

  const api = await serverApi();
  return responseHandler(
    async () => api.get(url),
    undefined,
    async (data) => data,
  );
}
