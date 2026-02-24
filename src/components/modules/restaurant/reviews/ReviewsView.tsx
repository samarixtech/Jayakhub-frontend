"use client";
import { Calendar } from "lucide-react";

import ReviewsStats from "./ReviewsStats";
import ReviewsCharts from "./ReviewsCharts";
import ReviewList from "./ReviewList";
import { useServerAction } from "@/hooks/use-server-action";
import { getReviewsAnalyticsAction } from "@/app/actions/restaurant/reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ReviewsView() {
  const [data, setData] = useState<any>(null);

  const { execute: fetchAnalytics, isPending } = useServerAction(
    getReviewsAnalyticsAction,
    {
      onSuccess: (resData: any) => {
        // Handle wrapper if present
        const unwrapped = resData?.data ? resData.data : resData;
        setData(unwrapped);
      },
      suppressSuccessToast: true,
    },
  );

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full max-w-[1024px] mx-auto space-y-6 px-4 md:px-0">
      {/* Top Filter */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" />
          Last 30 Days
        </button>
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
          <ReviewsStats summary={data.summary} />

          {/* Charts Row */}
          <ReviewsCharts summary={data.summary} />

          {/* Reviews List Section (includes filter pills and details sheet) */}
          <ReviewList reviews={data.reviews} refetch={fetchAnalytics} />
        </>
      )}
    </div>
  );
}
