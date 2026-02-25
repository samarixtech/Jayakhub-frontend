"use server";

import { serverApi } from "@/components/services/api";

export async function getDashboardAnalyticsAction() {
    try {
        const api = await serverApi();
        const response = await api.get("/dashboard-analytics");
        return {
            success: true as const,
            data: response.data,
        };
    } catch (error: any) {
        console.error("Fetch dashboard analytics error:", error);
        return {
            success: false as const,
            data: null,
            message: error.response?.data?.message || "Failed to fetch dashboard analytics",
        };
    }
}
