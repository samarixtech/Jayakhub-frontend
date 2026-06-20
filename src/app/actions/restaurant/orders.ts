"use server";
import { serverApi } from "@/components/services/api";

export async function getRestaurantOrdersAction(
  page: number = 1,
  limit: number = 10,
  status?: string,
  startDate?: string,
  endDate?: string,
  search?: string,
) {
  try {
    const api = await serverApi();
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append("status", status);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    if (search) {
      queryParams.append("search", search);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get(
      `/restaurant-orders?${queryParams.toString()}`,
    );
    return {
      success: true as const,
      data: response.data,
      meta: response.data.meta || null,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Fetch restaurant orders error:", error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
}
export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const api = await serverApi();
    const response = await api.patch("/update-status", { orderId, status });
    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Update order status error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order status",
    };
  }
}
