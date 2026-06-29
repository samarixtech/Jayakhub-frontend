import { useState, useEffect, useRef } from "react";
import { getFinanceDashboardAction } from "@/app/actions/restaurant/finance";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import { format } from "date-fns";

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
    netEarnings: string;
    breakdown: {
        totalCommission: string;
        totalDeliveryFees: string;
        totalWithdrawals: string;
        requestedWithdrawals: string;
        taxBreakdown: { total: string };
    };
    payouts: {
        id: string;
        amount: string;
        status: "approved" | "rejected" | "pending";
        requestType: string;
        stripeTransferId: string | null;
        processedAt: string;
        createdAt: string;
    }[];
}

export function useFinanceOverview() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { startDate, endDate } = useDateFilter();

    const prevDatesRef = useRef<{ startDate: Date | undefined; endDate: Date | undefined }>({
        startDate: undefined,
        endDate: undefined,
    });

    useEffect(() => {
        const datesChanged =
            prevDatesRef.current.startDate !== startDate ||
            prevDatesRef.current.endDate !== endDate;
        prevDatesRef.current = { startDate, endDate };

        async function fetchData() {
            try {
                setLoading(true);
                const res = await getFinanceDashboardAction(
                    startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                    endDate ? format(endDate, "yyyy-MM-dd") : undefined,
                );
                if (res.success && (res as any).data?.data) {
                    setData((res as any).data.data);
                } else {
                    setError("message" in res ? res.message as string : "Failed to load finance data");
                }
            } catch (err: any) {
                setError(err.message || "");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    return { data, loading, error };
}
