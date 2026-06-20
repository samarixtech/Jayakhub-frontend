"use server";

import { serverApi } from "@/components/services/api";

export async function getFinanceDashboardAction(
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10,
    paymentMethod?: string,
) {
    try {
        const api = await serverApi();
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());
        if (paymentMethod) queryParams.append("paymentMethod", paymentMethod);
        const qs = queryParams.toString();
        const url = qs ? `/finance-dashboard?${qs}` : "/finance-dashboard";
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

export async function getFinanceOrdersAction(
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10,
    paymentMethod?: string,
) {
    try {
        const api = await serverApi();
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());
        if (paymentMethod) queryParams.append("paymentMethod", paymentMethod);
        const qs = queryParams.toString();
        const url = qs ? `/finance-orders?${qs}` : "/finance-orders";
        const response = await api.get(url);
        return {
            success: true as const,
            data: response.data,
        };
    } catch (error: any) {
        console.error("Fetch finance orders error:", error);
        return {
            success: false as const,
            data: null,
            message: error.response?.data?.message || "Failed to fetch finance orders",
        };
    }
}
