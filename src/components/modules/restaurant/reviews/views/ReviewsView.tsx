"use client";

import { Calendar } from "lucide-react";
import ReviewsStats from "../components/ReviewsStats";
import ReviewsCharts from "../components/ReviewsCharts";
import ReviewList from "../components/ReviewList";
import ReviewDetailSheet from "../components/ReviewDetailSheet";
import { ReviewItem } from "../../restaurant.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useReviews } from "../hooks/useReviews";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function ReviewsView() {
  const t = useTranslations("RestaurantDashboard.Reviews");
  const {
    data,
    stats,
    filteredReviews,
    fetchAnalytics,
    isPending,
    filter,
    setFilter,
    selectedReview,
    handleOrderClick,
    closeDetailSheet,
    page,
    totalPages,
    handlePageChange,
  } = useReviews();

  return (
    <div className="w-full max-w-[1024px] mx-auto space-y-6 px-4 md:px-0">
      {/* Top Filter */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700 h-9"
        >
          <span className="text-xs font-bold">{t("header.last30Days")}</span>
          <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
        </Button>
      </div>

      {isPending || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[140px] rounded-[16px] w-full" />
            ))}
          </div>
          <Skeleton className="h-[300px] rounded-[16px] w-full" />
        </div>
      ) : (
        <>
          {/* Metrics Cards Row */}
          <ReviewsStats summary={stats} />

          {/* Charts Row */}
          <ReviewsCharts summary={stats} />

          {/* Reviews List Section (includes filter pills and details sheet) */}
          <ReviewList
            filteredReviews={filteredReviews}
            filter={filter}
            onFilterChange={setFilter}
            selectedReview={selectedReview}
            onOrderClick={handleOrderClick}
            onCloseDetail={closeDetailSheet}
            refetch={fetchAnalytics}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
