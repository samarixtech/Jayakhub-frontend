"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2, Tag, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllDeals } from "@/hooks/use-all-deals";
import { DealCard } from "@/components/modules/discovery/restaurants/sections/DealsSection";
import { setSelectedRestaurantMeta } from "@/redux/slices/discoverySlice";
import { AppDispatch } from "@/redux/store/store";
import { PublicDeal } from "@/components/modules/discovery/discovery.types";

export default function AllDealsPageView() {
  const t = useTranslations("Discovery.dealsSection");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { deals, isLoading, isFetchingMore, hasMore, loadMore } =
    useAllDeals(12);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isFetchingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetchingMore, isLoading, loadMore]);

  const handleDealClick = (deal: PublicDeal) => {
    const slug = deal.restaurantSlug || deal.restaurant?.slug;
    if (!slug) return;

    let fee = 0;
    if (typeof deal.deliveryFee === "number") {
      fee = deal.deliveryFee;
    } else if (
      deal.deliveryFee &&
      typeof deal.deliveryFee === "object" &&
      "deliveryCharge" in deal.deliveryFee
    ) {
      fee = Number(deal.deliveryFee.deliveryCharge) || 0;
    }

    const meta = {
      id: deal.restaurantId || deal.restaurant?.id || "",
      deliveryFee: fee,
      distance: undefined,
    };

    dispatch(setSelectedRestaurantMeta(meta));
    localStorage.setItem("selectedRestaurantMeta", JSON.stringify(meta));
    router.push(`/restaurants/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 shrink-0 border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 rtl:rotate-180" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Tag className="h-7 w-7 text-brand-orange" />
            {t("allDealsTitle")}
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Explore exclusive restaurant discounts, combos, and daily specials
          </p>
        </div>
      </div>

      {/* INITIAL LOADING SKELETON */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[220px] bg-gray-200/70 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : deals.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center p-6">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {t("noDealsFound")}
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Check back later or explore popular restaurants in your area for delicious offers.
          </p>
          <Button
            className="mt-6 bg-brand-orange text-white font-bold rounded-full px-6"
            onClick={() => router.push("/")}
          >
            Explore Restaurants
          </Button>
        </div>
      ) : (
        /* DEALS GRID */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                className="w-full shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => handleDealClick(deal)}
              />
            ))}
          </div>

          {/* INFINITE SCROLL LOADER / SENTINEL */}
          <div ref={sentinelRef} className="py-10 flex justify-center items-center">
            {isFetchingMore && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 text-sm font-semibold text-gray-700">
                <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                Loading more deals...
              </div>
            )}

            {!hasMore && deals.length > 0 && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                {t("noMoreDeals")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
