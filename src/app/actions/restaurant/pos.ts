"use server";
import { serverApi } from "@/components/services/api";

export async function getPosItems(category?: string): Promise<{
    success: boolean;
    data: any;
    message?: string;
}> {
    try {
        const api = await serverApi();
        const url = category && category !== "all"
            ? `/pos-item?category=${encodeURIComponent(category)}`
            : "/pos-item";

        const response = await api.get(url);

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch POS items",
            data: null,
        };
    }
}
