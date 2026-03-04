import { useState, useEffect } from "react";
import { getFinanceDashboardAction } from "@/app/actions/restaurant/finance";

export interface FinanceData {
    restaurantName: string;
    metrics: {
        totalRevenue: string;
        totalRevenueGrowth: string;
        netProfit: string;
        netProfitGrowth: string;
        platformFees: string;
        platformFeesLabel: string;
        avgOrderValue: string;
        avgOrderValueGrowth: string;
        taxCollected: string;
        platformCommission: string;
        paymentProcessing: string;
        deliveryCosts: string;
    };
    revenueTrend: {
        date: string;
        revenue: number;
    }[];
    paymentMethods: {
        method: string;
        amount: string;
        percentage: number;
    }[];
    transactions: {
        items: {
            orderId: string;
            customerName: string;
            type: string;
            date: string;
            method: string;
            netAmount: string;
            fee: string;
            total: string;
        }[];
        totalCount: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export function useFinanceOverview(filter?: string) {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await getFinanceDashboardAction(filter);
                if (res.success && (res as any).data?.data) {
                    setData((res as any).data.data);
                } else {
                    setError("message" in res ? res.message as string : "Failed to load finance data");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [filter]);

    return { data, loading, error };
}
