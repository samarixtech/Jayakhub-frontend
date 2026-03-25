"use server";
import { serverApi } from "@/components/services/api";

interface CreateOrderPayload {
  paymentMethod: "stripe" | "cod";
  restaurantId: string;
  items: {
    itemId: string;
    itemName: string;
    itemPrice: number;
    quantity: number;
    imageUrl?: string;
    variantGroupIds?: string[];
    variantOptionNames?: string[];
  }[];
  fullAddress: string;
  discount: number;
  totalAmount: number;
  latitude?: number;
  longitude?: number;
  currency: string;
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

export async function getAllOrders(
  page: number = 1,
  limit: number = 10,
  filter?: string,
): Promise<{
  success: boolean;
  data: any;
  meta: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filter) {
      queryParams.append("filter", filter);
    }

    const response: any = await api.get(
      `/all-orders?${queryParams.toString()}`,
    );
    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: null,
      meta: null,
    };
  }
}

export async function submitRatingAction(payload: {
  orderId: string;
  restaurantId: string;
  itemId?: string;
  orderItemId?: string;
  rating: number;
  isRecommended: boolean;
  comment: string;
}) {
  try {
    const api = await serverApi();
    const response = await api.post("/rating", payload);
    return {
      success: true,
      data: response.data,
      message: "Rating submitted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit rating",
    };
  }
}
