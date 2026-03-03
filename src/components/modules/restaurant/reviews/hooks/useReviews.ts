"use client";

import { useState, useEffect, useMemo } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { getReviewsAnalyticsAction } from "@/app/actions/restaurant/reviews";
import { ReviewItem } from "../../restaurant.types";

export const useReviews = () => {
  const [data, setData] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [filter, setFilter] = useState("All");

  const { execute: fetchAnalytics, isPending } = useServerAction(
    getReviewsAnalyticsAction,
    {
      onSuccess: (resData: any) => {
        const unwrapped = resData?.data ? resData.data : resData;
        setData(unwrapped);
      },
      suppressSuccessToast: true,
    },
  );

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const filteredReviews = useMemo(() => {
    const reviews: ReviewItem[] = data?.reviews || [];
    return reviews.filter((review) => {
      if (filter === "Unreplied") return review.reply === null;
      if (filter === "5 Stars") return review.rating === 5;
      if (filter === "Critical")
        return review.rating >= 1 && review.rating <= 3;
      return true; // "All"
    });
  }, [data?.reviews, filter]);

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
    filteredReviews,
    fetchAnalytics,
    isPending,
    filter,
    setFilter,
    selectedReview,
    handleOrderClick,
    closeDetailSheet,
  };
};
