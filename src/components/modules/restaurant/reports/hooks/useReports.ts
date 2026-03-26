"use client";
import { useEffect, useState, useCallback } from "react";
import { getReportsAction } from "@/app/actions/restaurant/reports";
import { usePagination } from "@/hooks/usePagination";

export const useReports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("1");

  const {
    page,
    limit,
    totalPages,
    totalCount,
    handlePageChange,
    updatePaginationMeta,
  } = usePagination({ initialLimit: 10 });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReportsAction({ filter, page, limit });
      if (result.success) {
        const responseData = (result as any).data;
        setData(responseData.data);
        if (responseData.meta) {
          updatePaginationMeta(responseData.meta);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, page, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  }, [filter]);

  return {
    data,
    loading,
    filter,
    setFilter,
    page,
    totalPages,
    handlePageChange,
  };
};
