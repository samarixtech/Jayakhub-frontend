"use server";

import { serverApi } from "@/components/services/api";

export async function getRestaurantOrdersAction() {
  try {
    const api = await serverApi();
    const response = await api.get("/restaurant-orders");
    return {
      success: true as const,
      data: response.data,
    };
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
  } catch (error: any) {
    console.error("Update order status error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order status",
    };
  }
}
