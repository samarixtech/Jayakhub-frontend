"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getCuisineTypesAction(): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/cuisines/types"),
    undefined,
    async (data) => {
      return data;
    },
  );
}
