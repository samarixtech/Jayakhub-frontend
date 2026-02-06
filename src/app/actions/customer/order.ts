"use server";

import api from "@/components/services/api";

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
}

export async function createOrderAction(payload: CreateOrderPayload) {
  try {
    const response = await api.post("/create-checkout-session", payload);
    console.log(payload);
    return response.data;
  } catch (error: any) {
    console.error("Create order error:", error);
    return {
      success: false,
      message: error.message || "Failed to create order",
    };
  }
}

export async function getCurrentOrder() {
  try {
    const response = await api.get("/current-order");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get current order error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch current order",
    };
  }
}

export async function getAllOrders() {
  try {
    const response = await api.get("/all-orders");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get all orders error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
    };
  }
}
