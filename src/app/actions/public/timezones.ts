"use server";
import { serverApi } from "@/components/services/api";
import { ActionResponse } from "@/lib/utils/response-handler";

export async function getTimezonesAction(): Promise<ActionResponse> {
  try {
    const api = await serverApi();
    const response = await api.get("/timezones");
    return {
      success: true,
      message: "Timezones fetched successfully",
      data: response.data?.data?.timezones || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch timezones",
      data: [],
    };
  }
}
