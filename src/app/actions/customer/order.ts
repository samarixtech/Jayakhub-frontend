"use server";

import { serverApi } from "@/components/services/api";

interface CreateOrderPayload {
  paymentMethod: "stripe" | "cod";
  restaurantId: string;
  items: {
    itemName: string;
    itemPrice: number;
    quantity: number;
    imageUrl?: string;
  }[];
  fullAddress: string;
  discount: number;
  totalAmount: number;
  latitude?: number;
  longitude?: number;
}

export async function createOrderAction(payload: CreateOrderPayload) {
  try {
    const api = await serverApi();
    const response = await api.post("/create-checkout-session", payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create order",
    };
  }
}

export async function getCurrentOrder(orderIdFromUrl: any) {
  try {
    const api = await serverApi();
    const response = await api.get("/current-order");
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch current order",
    };
  }
}

export async function getAllOrders(): Promise<{
  success: boolean;
  data: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get("/all-orders");
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: null,
    };
  }
}
