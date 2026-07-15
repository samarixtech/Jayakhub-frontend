"use server";

import { serverApi } from "@/components/services/api";

export async function addCartItemsAction(payload: any) {
  try {
    const api = await serverApi();
    const response = (await api.post("/cart-add", payload)) as any;
    const data = response.data?.data ?? response.data ?? {};

    return { success: true, data };
  } catch (error: any) {
    const message =
      error?.response?.data?.meta?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add items to cart";
    console.error("addCartItemsAction error:", message, error?.response?.data);
    return { success: false, message, data: null };
  }
}

export async function getCartListAction() {
  try {
    const api = await serverApi();
    const response = (await api.get("/cart-list")) as any;
    return { success: true, data: response.data?.data || [] };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.meta?.message ||
        error.response?.data?.message ||
        "Failed to fetch cart items",
      data: [],
    };
  }
}

export async function updateCartStatusAction(id: string, status: string) {
  try {
    const api = await serverApi();
    const response = (await api.patch(`/cart-status/${id}`, { status })) as any;
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.meta?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update cart status";
    console.error(
      "updateCartStatusAction error:",
      message,
      error?.response?.data,
    );
    return { success: false, message, data: null };
  }
}
