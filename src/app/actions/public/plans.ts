"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export type ApiPlan = {
  id: string;
  name: string;
  billingCycle: string;
  monthlyPrice: string;
  planType: string;
  status: string;
  freeTrialDays: number | null;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type RestaurantPlan = {
  id: string;
  name: string;
  description: string;
  billingCycle: string;
  monthlyPrice: string;
  status: string;
  type: string;
  features: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export async function getPublicPlansAction(): Promise<ActionResponse<ApiPlan[]>> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/plans/public"),
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
