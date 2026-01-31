"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getRestaurantStatusAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get("/my-restaurant"),
    "Restaurant status fetched successfully",
  );
}
