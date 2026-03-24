"use client";

import { Star, Reply } from "lucide-react";
import { ReviewItem } from "../../restaurant.types";
import ReviewDetailSheet from "./ReviewDetailSheet";
import ReviewFilterPills from "./ReviewFilterPills";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { useTranslations } from "next-intl";

interface ReviewListProps {
  filteredReviews: ReviewItem[];
  filter: string;
  onFilterChange: (filter: string) => void;
  selectedReview: ReviewItem | null;
  onOrderClick: (review: ReviewItem) => void;
  onCloseDetail: () => void;
  refetch: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReviewList({
  filteredReviews,
  filter,
  onFilterChange,
  selectedReview,
  onOrderClick,
  onCloseDetail,
  refetch,
  currentPage,
  totalPages,
  onPageChange,
}: ReviewListProps) {
  const t = useTranslations("RestaurantDashboard.Reviews.list");
  return (
    <div className="flex flex-col gap-4 mt-8">
      {/* Filter Pills */}
      <ReviewFilterPills filter={filter} onFilterChange={onFilterChange} />

      {/* Review Cards */}
      <div className="flex flex-col gap-4">
        {filteredReviews.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm font-medium">
            {t("noReviews")}
          </div>
        )}
        {filteredReviews.map((review) => {
          const isReplied = review.reply !== null;
          const displayDate = new Date(review.createdAt).toLocaleDateString(
            undefined,
            { month: "short", day: "numeric", year: "numeric" },
          );

          const getInitials = (name: string) => {
            if (!name) return "U";
            const parts = name.split(" ").filter(Boolean);
            if (parts.length >= 2) {
              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
          };

          return (
            <div
              key={review.id}
              onClick={() => onOrderClick(review)}
              className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-[#357252]/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E2F1E8] text-[#1b2d22] flex shrink-0 items-center justify-center font-bold text-[13px] border border-gray-100 uppercase tracking-wide">
                    {getInitials(review.userName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1b2d22]">
                      {review.userName}
                    </span>
                    <span className="text-[11px] font-medium text-[#8ea89a]">
                      {displayDate} • {t("order")} {review.orderId}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 stroke-[#f5a623] ${i < review.rating ? "fill-[#f5a623]" : "fill-transparent"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[13px] text-[#1b2d22] font-medium leading-relaxed">
                {review.comment}
              </p>

              {!isReplied && (
                <div className="flex mt-2">
                  <button
                    className="flex items-center gap-2 text-[#357252] text-[12px] font-bold hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrderClick(review);
                    }}
                  >
                    <Reply className="w-3.5 h-3.5 scale-x-[-1]" />
                    {t("reply")}
                  </button>
                </div>
              )}

              {/* Restaurant Reply Block */}
              {isReplied && review.reply && (
                <div className="mt-3 border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#357252] text-[12px] font-bold">
                      <Reply className="w-3.5 h-3.5 scale-x-[-1]" />
                      {t("restaurantReply")}
                    </div>
                    <span className="text-[11px] font-medium text-[#8ea89a]">
                      {t("recently")}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#8ea89a] leading-relaxed">
                    {review.reply}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ReviewDetailSheet
        review={selectedReview}
        onClose={onCloseDetail}
        refetch={refetch}
      />

      {totalPages > 1 && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <GlobalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={false}
          />
        </div>
      )}
    </div>
  );
}
