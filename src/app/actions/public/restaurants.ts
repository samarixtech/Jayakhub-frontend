"use server";
import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function getAllRestaurantsAction(): Promise<ActionResponse> {
  return responseHandler(
    async () => api.get("/allResturant"),
    "Restaurants fetched successfully",
    async (data) => {
      return data;
    },
  );
}
