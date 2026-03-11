"use server";

import { serverApi } from "@/components/services/api";

export async function getReportsAction() {
  try {
    const api = await serverApi();
    const response = await api.get("/reports");
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
