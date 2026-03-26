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
        const payload = (result as any).data;
        // Depending on api config, it might be nested
        const actualData = payload.data ? payload.data : payload;
        const actualMeta = payload.meta ? payload.meta : ((result as any).meta);
        
        setData(actualData);
        
        if (actualMeta && actualMeta.totalPages !== undefined) {
          updatePaginationMeta({
            page: Number(actualMeta.page || page),
            limit: Number(actualMeta.limit || limit),
            totalCount: Number(actualMeta.totalCount || 0),
            totalPages: Number(actualMeta.totalPages),
          });
        } else if (actualData.orders && actualData.orders.totalPages !== undefined) {
          updatePaginationMeta({
            page: Number(actualData.orders.page || page),
            limit: Number(actualData.orders.limit || limit),
            totalCount: Number(actualData.orders.totalCount || 0),
            totalPages: Number(actualData.orders.totalPages),
          });
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
