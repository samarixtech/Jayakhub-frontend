"use server";
import { cookies } from "next/headers";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export type ApiPlan = {
  id: string;
  name: string;
  description?: string | null;
  billingCycle: string;
  monthlyPrice: number;
  currency?: string;
  status: string;
  type?: string;
  planType?: string;
  freeTrialDays?: number | null;
  features?: string[];
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
};

export type RestaurantPlan = {
  id: string;
  name: string;
  description: string;
  billingCycle: string;
  monthlyPrice: number;
  status: string;
  type: string;
  features: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export async function getPublicPlansAction(): Promise<ActionResponse<ApiPlan[]>> {
  const countryCode = (await cookies()).get("USER_COUNTRY")?.value;
  const url = countryCode
    ? `/plans/public?countryCode=${countryCode}`
    : "/plans/public";

  const api = await serverApi();
  return responseHandler(
    async () => api.get(url),
    undefined,
    async (data: ApiPlan[]) => data,
  );
}

export async function getRestaurantPlansAction(): Promise<ActionResponse<RestaurantPlan[]>> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/plans/public?type=restaurant"),
    undefined,
    async (data: RestaurantPlan[]) => data,
  );
}

export async function checkoutPlanAction(
  planId: string,
): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.post("/plan-subscriptions/checkout", { planId }),
    "Plan subscribed successfully",
  );
}
