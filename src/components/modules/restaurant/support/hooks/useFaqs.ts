"use client";

import { useState, useEffect, useCallback } from "react";
import { getFaqsAction } from "@/app/actions/restaurant/support";
import { usePagination } from "@/hooks/usePagination";

export interface FAQ {
  id: string;
  heading: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { page, limit, totalPages, totalCount, handlePageChange, updatePaginationMeta } =
    usePagination({ initialLimit: 5 });

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getFaqsAction(page, limit);
      if (res.success && res.data) {
        const apiData = res.data as any;
        setFaqs(apiData.data || []);
        if (res.meta) {
          updatePaginationMeta(res.meta);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, updatePaginationMeta]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return {
    faqs,
    isLoading,
    currentPage: page,
    totalPages,
    totalCount,
    onPageChange: handlePageChange,
  };
}
