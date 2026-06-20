"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getPayoutStatsAction(
  startDate?: string,
  endDate?: string,
): Promise<ActionResponse> {
  const api = await serverApi();
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return responseHandler(
    async () => api.get(`/payout/stats${queryString}`),
    undefined,
    async (data) => data,
  );
}

export async function getPayoutsAction(
  page: number = 1,
  limit: number = 10,
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<ActionResponse> {
  const api = await serverApi();
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== "all") params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return responseHandler(
    async () => api.get(`/payout/history?${params.toString()}`),
    undefined,
    async (data) => data,
  );
}

export async function requestPayoutAction(requestedAmount: number): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.post("/payout/request", { requestedAmount }),
    "Payout request submitted successfully",
    async (data) => data,
  );
}
