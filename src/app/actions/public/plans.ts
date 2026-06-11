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

export async function getPublicPlansAction(): Promise<ActionResponse<ApiPlan[]>> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/plans/public"),
    undefined,
    async (data: ApiPlan[]) => data,
  );
}
