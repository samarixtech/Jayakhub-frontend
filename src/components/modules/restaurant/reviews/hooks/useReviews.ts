"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { usePagination } from "@/hooks/usePagination";
import { getReviewsAnalyticsAction } from "@/app/actions/restaurant/reviews";
import { ReviewItem } from "../../restaurant.types";

export const useReviews = () => {
  const [data, setData] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [filter, setFilter] = useState("All");

  const {
    page,
    limit,
    totalPages,
    totalCount,
    handlePageChange,
    updatePaginationMeta,
  } = usePagination({ initialLimit: 10 });

  const { execute: fetchAnalytics, isPending } = useServerAction(
    getReviewsAnalyticsAction,
    {
      onSuccess: (resData: any, meta?: any) => {
        const unwrapped = resData?.data ? resData.data : resData;
        setData(unwrapped);

        if (meta) {
          updatePaginationMeta(meta);
        } else if (unwrapped?.meta) {
          updatePaginationMeta(unwrapped.meta);
        }
      },
      suppressSuccessToast: true,
    },
  );

  const loadReviews = useCallback(() => {
    fetchAnalytics({ page, limit, filter });
  }, [fetchAnalytics, page, limit, filter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  }, [filter, handlePageChange]);

  const stats = useMemo(() => data?.summary || null, [data]);

  const handleOrderClick = (review: ReviewItem) => {
    setSelectedReview(review);
  };

  const closeDetailSheet = () => {
    setSelectedReview(null);
  };

  return {
    data,
    stats,
    reviews: data?.reviews || [],
    filteredReviews: data?.reviews || [],
    fetchAnalytics: loadReviews,
    isPending,
    filter,
    setFilter,
    selectedReview,
    handleOrderClick,
    closeDetailSheet,
    page,
    totalPages,
    handlePageChange,
  };
};
