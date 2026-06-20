"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usePagination";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import {
  getPayoutStatsAction,
  getPayoutsAction,
  requestPayoutAction,
} from "@/app/actions/restaurant/payouts";

export interface PayoutStats {
  availableBalance: number;
  totalWithdrawn: number;
  pendingPayouts: number;
  totalEarnings: number;
}

export interface Payout {
  id: string;
  amount: number;
  method?: string;
  status: string;
  requestedAt: string;
  processedAt?: string | null;
}

export interface RequestPayoutPayload {
  amount: number;
}

export const usePayouts = () => {
  const { page, limit, totalPages, totalCount, handlePageChange, updatePaginationMeta } =
    usePagination({ initialLimit: 10 });

  const { startDate, endDate } = useDateFilter();
  const prevDatesRef = useRef<{ startDate: Date | undefined; endDate: Date | undefined }>({
    startDate: undefined,
    endDate: undefined,
  });

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    availableBalance: 0,
    totalWithdrawn: 0,
    pendingPayouts: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayouts = useCallback(async (fetchPage = page) => {
    const formattedStart = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
    const formattedEnd = endDate ? format(endDate, "yyyy-MM-dd") : undefined;
    try {
      setLoading(true);
      const [statsRes, historyRes] = await Promise.all([
        getPayoutStatsAction(formattedStart, formattedEnd),
        getPayoutsAction(fetchPage, limit, undefined, formattedStart, formattedEnd),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data as PayoutStats);
      }

      if (historyRes.success && historyRes.data) {
        setPayouts(historyRes.data as Payout[]);
        if (historyRes.meta) {
          updatePaginationMeta(historyRes.meta);
        }
      }
    } catch (err) {
      console.error("Failed to load payouts", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, updatePaginationMeta]);

  useEffect(() => {
    const datesChanged =
      prevDatesRef.current.startDate !== startDate ||
      prevDatesRef.current.endDate !== endDate;
    prevDatesRef.current = { startDate, endDate };

    if (datesChanged) {
      handlePageChange(1);
      fetchPayouts(1);
    } else {
      fetchPayouts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, page]);

  const handlePayoutRequest = async (payload: RequestPayoutPayload) => {
    try {
      setIsSubmitting(true);
      const res = await requestPayoutAction(payload.amount);
      if (res.success) {
        toast.success(res.message || "Payout request submitted");
        setIsRequestModalOpen(false);
        await fetchPayouts(page);
      } else {
        toast.error(res.message || "Failed to submit payout request");
      }
    } catch (err) {
      console.error("Failed to request payout", err);
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    stats,
    payouts,
    loading,
    isSubmitting,
    currentPage: page,
    totalPages,
    totalCount,
    setCurrentPage: handlePageChange,
    isRequestModalOpen,
    setIsRequestModalOpen,
    handlePayoutRequest,
    refetch: fetchPayouts,
  };
};
