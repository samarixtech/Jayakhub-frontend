"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getCuisineTypesAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get("/cuisines/types"),
    undefined,
    async (data) => {
      return data;
    },
  );
}
