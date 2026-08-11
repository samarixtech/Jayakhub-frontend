"use server";
import { cookies } from "next/headers";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getPublicDealsAction(params?: {
  page?: number;
  limit?: number;
}): Promise<ActionResponse> {
  const { page, limit } = params || {};

  const searchParams = new URLSearchParams();
  if (page !== undefined) searchParams.append("page", page.toString());
  if (limit !== undefined) searchParams.append("limit", limit.toString());

  const countryCode = (await cookies()).get("USER_COUNTRY")?.value;
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
