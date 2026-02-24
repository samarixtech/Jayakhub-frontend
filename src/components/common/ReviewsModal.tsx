"use client";

import React, { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { formatDistanceToNow, parse } from "date-fns";

export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string; // e.g., "22/02/2026"
  orderedItems: string[];
}

export interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  totalAverageRating: number;
  totalRatingCount: number;
  reviews: Review[];
}

const parseDateString = (dateStr: string) => {
  try {
    // Assuming format "DD/MM/YYYY" as shown in the API response
    if (dateStr.includes("/")) {
      return parse(dateStr, "dd/MM/yyyy", new Date());
    }
    return new Date(dateStr);
  } catch (e) {
    return new Date();
  }
};

const getRelativeTime = (dateStr: string) => {
  try {
    const d = parseDateString(dateStr);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return dateStr; // fallback to original string if parsing fails
  }
};

export function ReviewsModal({
  isOpen,
  onClose,
  restaurantName,
  totalAverageRating,
  totalRatingCount,
  reviews,
}: ReviewsModalProps) {
  const [activeFilter, setActiveFilter] = useState("Top reviews");

  const filters = ["Top reviews", "Newest", "Highest rating", "Lowest rating"];

  // Calculate star breakdown from provided reviews (or mock if needed)
  const starBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews && reviews.length > 0) {
      reviews.forEach((r) => {
        const rounded = Math.round(r.rating);
        if (rounded >= 1 && rounded <= 5) {
          counts[rounded as keyof typeof counts]++;
        }
      });
    }

    // Convert to percentages
    const max = Math.max(...Object.values(counts), 1); // prevent div by 0
    // To make the UI look good even with few reviews, we can add a tiny bit of math
    // but here we just map directly to the total length for realistic scaling compared to max

    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars as keyof typeof counts],
      percentage: (counts[stars as keyof typeof counts] / max) * 100,
    }));
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    let sorted = [...(reviews || [])];
    switch (activeFilter) {
      case "Newest":
        sorted.sort(
          (a, b) =>
            parseDateString(b.date).getTime() -
            parseDateString(a.date).getTime(),
        );
        break;
      case "Highest rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Lowest rating":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "Top reviews":
      default:
        // Top reviews usually mixes highest rating and recency/helpfulness
        // We'll just sort by rating then date for now
        sorted.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (
            parseDateString(b.date).getTime() -
            parseDateString(a.date).getTime()
          );
        });
        break;
    }
    return sorted;
  }, [reviews, activeFilter]);

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] max-h-[90vh] bg-white rounded-3xl shadow-xl z-50 flex flex-col focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-2 border-b border-gray-100 shrink-0">
            <div>
              <Dialog.Title className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Reviews
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 font-medium whitespace-pre-line mt-1">
                {restaurantName.replace(" ", "\n")}
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 rounded-full hover:bg-gray-100 transition-colors bg-gray-50 flex-shrink-0">
              <X className="w-5 h-5 text-gray-600" />
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto px-6 pb-6 custom-scrollbar grow relative">
            {/* Rating Overview */}
            <div className="flex flex-col sm:flex-row gap-8 py-6">
              {/* Left side large rating */}
              <div className="flex flex-col justify-start shrink-0 min-w-[120px]">
                <div className="text-6xl font-extrabold text-gray-900 tracking-tighter leading-none mb-2">
                  {totalAverageRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(totalAverageRating)
                          ? "fill-[#f97316] text-[#f97316]"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {totalRatingCount === 0
                    ? "No Ratings"
                    : `All Ratings (${totalRatingCount > 500 ? "500+" : totalRatingCount})`}
                </div>
              </div>

              {/* Right side bars */}
              <div className="flex-1 flex flex-col justify-center gap-2.5">
                {starBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8 shrink-0 text-sm font-bold text-gray-700 justify-end">
                      {row.stars}{" "}
                      <Star className="w-3 h-3 fill-[#f97316] text-[#f97316]" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-[#1b4332] rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-8 mt-2 sticky top-0 bg-white/90 backdrop-blur-md py-2 z-10">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeFilter === filter
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Review List */}
            <div className="space-y-8 pb-4">
              {sortedReviews.length > 0 ? (
                sortedReviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-start gap-4 mb-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-lg shrink-0">
                        {review.userName
                          ? review.userName.charAt(0).toUpperCase()
                          : "U"}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-[15px]">
                          {review.userName || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating
                                    ? "fill-[#f97316] text-[#f97316]"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            {getRelativeTime(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {/* Footer: Tags and Helpful */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {review.orderedItems &&
                          review.orderedItems.length > 0 &&
                          review.orderedItems.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 bg-emerald-50/50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-emerald-100/50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ordered {item}</span>
                            </div>
                          ))}
                      </div>

                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-xs font-bold shrink-0 ml-4 group">
                        <ThumbsUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Helpful (0)</span>
                      </button>
                    </div>

                    {/* Divider for all but last */}
                    {idx < sortedReviews.length - 1 && (
                      <div className="h-px w-full bg-gray-100 mt-8" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 font-medium">
                  No reviews found for this restaurant yet.
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
