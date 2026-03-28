"use server";
import { serverApi } from "@/components/services/api";

export async function getReportsAction({
  filter = "all",
  page = 1,
  limit = 10,
}: {
  filter?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const api = await serverApi();
    const queryParams = new URLSearchParams({
      filter,
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/reports?${queryParams.toString()}`);
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Fetch reports error:", error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to fetch reports",
    };
  }
}
