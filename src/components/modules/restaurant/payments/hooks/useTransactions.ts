import { useState, useEffect, useRef } from "react";
import { getFinanceOrdersAction } from "@/app/actions/restaurant/finance";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import { format } from "date-fns";

export interface TransactionItem {
    orderId: string;
    customerName: string;
    date: string;
    status: string;
    method: string;
    total: string;
    deliveryFee: string;
    commission: string;
    netAmount: string;
}

export interface TransactionsData {
    items: TransactionItem[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useTransactions() {
    const [data, setData] = useState<TransactionsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("");
    const { startDate, endDate } = useDateFilter();

    const prevFiltersRef = useRef<{
        startDate: Date | undefined;
        endDate: Date | undefined;
        paymentMethod: string;
    }>({ startDate: undefined, endDate: undefined, paymentMethod: "" });

    useEffect(() => {
        const prev = prevFiltersRef.current;
        const filtersChanged =
            prev.startDate !== startDate ||
            prev.endDate !== endDate ||
            prev.paymentMethod !== paymentMethod;
        prevFiltersRef.current = { startDate, endDate, paymentMethod };

        const fetchPage = filtersChanged ? 1 : page;
        if (filtersChanged && page !== 1) {
            setPage(1);
        }

        async function fetchData() {
            try {
                setLoading(true);
                const res = await getFinanceOrdersAction(
                    startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                    endDate ? format(endDate, "yyyy-MM-dd") : undefined,
                    fetchPage,
                    10,
                    paymentMethod || undefined,
                );
                if (res.success && (res as any).data?.data) {
                    setData((res as any).data.data);
                } else {
                    setError("message" in res ? res.message as string : "Failed to load transactions");
                }
            } catch (err: any) {
                setError(err.message || "");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, page, paymentMethod]);

    return {
        data,
        loading,
        error,
        page,
        paymentMethod,
        handlePageChange: (p: number) => setPage(p),
        handlePaymentMethodChange: (m: string) => setPaymentMethod(m),
    };
}
