"use server";

import { serverApi } from "@/components/services/api";

export async function addCartItemsAction(items: any[]) {
    try {
        const api = await serverApi();
        const response = await api.post("/cart-add", items) as any;
        return { success: true, data: response.data?.data || [] };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.meta?.message || error.response?.data?.message || "Failed to add items to cart",
            data: null,
        };
    }
}

export async function getCartListAction() {
    try {
        const api = await serverApi();
        const response = await api.get("/cart-list") as any;
        return { success: true, data: response.data?.data || [] };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.meta?.message || error.response?.data?.message || "Failed to fetch cart items",
            data: [],
        };
    }
}
