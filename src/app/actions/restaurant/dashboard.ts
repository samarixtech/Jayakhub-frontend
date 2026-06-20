"use server";

import { serverApi } from "@/components/services/api";

export async function getDashboardAnalyticsAction(
    startDate?: string,
    endDate?: string,
) {
    try {
        const api = await serverApi();
        const queryParams = new URLSearchParams();
        if (startDate) {
            queryParams.append("startDate", startDate);
        }
        if (endDate) {
            queryParams.append("endDate", endDate);
        }
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const response = await api.get(`/dashboard-analytics${queryString}`);
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
