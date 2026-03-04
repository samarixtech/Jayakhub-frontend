"use server";

import { serverApi } from "@/components/services/api";

export async function getFinanceDashboardAction(filter?: string) {
    try {
        const api = await serverApi();
        const url = filter ? `/finance-dashboard?filter=${filter}` : "/finance-dashboard";
        const response = await api.get(url);
        return {
            success: true as const,
            data: response.data,
        };
    } catch (error: any) {
        console.error("Fetch finance dashboard error:", error);
        return {
            success: false as const,
            data: null,
            message: error.response?.data?.message || "Failed to fetch finance dashboard",
        };
    }
}
