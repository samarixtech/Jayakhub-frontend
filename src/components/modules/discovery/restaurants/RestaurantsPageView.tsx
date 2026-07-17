"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HeroBanner from "@/components/modules/discovery/restaurants/components/HeroBanner";
import DiscoverySidebar from "@/components/modules/discovery/restaurants/components/DiscoverySidebar";
import { RatingModal } from "@/components/common/RatingModal";
import { useDiscoveryUI } from "@/context/DiscoveryUIContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRestaurantDiscovery } from "@/hooks/use-restaurant-discovery";
import { PopularRestaurantsSection } from "./sections/PopularRestaurantsSection";
import { CuisinesSection } from "./sections/CuisinesSection";
import { AllRestaurantsSection } from "./sections/AllRestaurantsSection";
import { PreviousOrdersSection } from "./sections/PreviousOrdersSection";
import { PromotionsModal, Campaign } from "./components/PromotionsModal";
import { getWebappCampaignsAction } from "@/app/actions/public/marketing";

const AllRestaurantsPage: React.FC = () => {
  const t = useTranslations("Discovery");
  const router = useRouter();
  const { isFilterOpen, setIsFilterOpen } = useDiscoveryUI();
  const { state, actions } = useRestaurantDiscovery();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isPromotionsModalOpen, setIsPromotionsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await getWebappCampaignsAction();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const hasSeen = sessionStorage.getItem("dismissed_promotions");
          if (!hasSeen) {
            setCampaigns(res.data);
            setIsPromotionsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch promotions campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const handlePromotionsModalChange = (open: boolean) => {
    setIsPromotionsModalOpen(open);
    if (!open) {
      sessionStorage.setItem("dismissed_promotions", "true");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* HERO BANNER */}
      <HeroBanner />

      {/* SIDEBAR + MAIN CONTENT */}
      <div className="flex gap-8 px-3 sm:px-6 mt-6 items-start relative">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[240px] shrink-0 hidden lg:block sticky top-[96px] h-[calc(100vh-96px)] overflow-hidden mr-0 sm:mr-5">
          <div className="h-full overflow-y-auto pr-4 pb-20 scrollbar-hide overscroll-y-contain">
            <DiscoverySidebar
              selectedSort={state.selectedSort}
              onSortChange={actions.setSelectedSort}
              activeFilters={state.activeFilters}
              onFilterToggle={actions.handleFilter}
              selectedRating={state.selectedRating}
              onRatingChange={actions.handleRating}
              discounted={state.discounted}
              onDiscountedToggle={() => actions.setDiscounted(!state.discounted)}
              isWishlist={state.isWishlist}
              onWishlistToggle={() => actions.setIsWishlist(!state.isWishlist)}
              showAllCuisines={state.showAllCuisines}
              onToggleCuisines={() =>
                actions.setShowAllCuisines(!state.showAllCuisines)
              }
              onResetFilters={actions.resetFilters}
              cuisineTypes={state.cuisineTypes}
            />
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          <PopularRestaurantsSection
            isPending={state.isPending}
            restaurants={state.restaurants}
            isLoggedIn={state.isLoggedIn}
            onAction={() => router.push("/all-restaurants")}
          />

          <CuisinesSection
            isCuisinesLoading={state.isCuisinesLoading}
            cuisineTypes={state.cuisineTypes}
            activeFilters={state.activeFilters}
            onCuisineClick={actions.handleFilter}
          />

          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {t("restaurantsPage.nearbyCount", { count: state.restaurants.length })}
            </h2>
          </div>

          <AllRestaurantsSection
            isPending={state.isPending}
            restaurants={state.restaurants}
            viewMode={state.viewMode}
            setViewMode={actions.setViewMode}
            isLoggedIn={state.isLoggedIn}
            onAction={() => router.push("/all-restaurants")}
          />

          <PreviousOrdersSection
            isLoggedIn={state.isLoggedIn}
            isPreviousOrdersLoading={state.isPreviousOrdersLoading}
            previousOrders={state.previousOrders}
            viewMode={state.viewMode}
          />
        </div>
      </div>

      {/* ===== MOBILE FILTER SHEET (BOTTOM) ===== */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto rounded-t-2xl px-6 pt-6"
        >
          <SheetHeader className="mb-6 text-left">
            <SheetTitle>{t("filterSheet.title")}</SheetTitle>
          </SheetHeader>
          <DiscoverySidebar
            selectedSort={state.selectedSort}
            onSortChange={actions.setSelectedSort}
            activeFilters={state.activeFilters}
            onFilterToggle={actions.handleFilter}
            selectedRating={state.selectedRating}
            onRatingChange={actions.handleRating}
            discounted={state.discounted}
            onDiscountedToggle={() => actions.setDiscounted(!state.discounted)}
            isWishlist={state.isWishlist}
            onWishlistToggle={() => actions.setIsWishlist(!state.isWishlist)}
            showAllCuisines={state.showAllCuisines}
            onToggleCuisines={() =>
              actions.setShowAllCuisines(!state.showAllCuisines)
            }
            onResetFilters={actions.resetFilters}
            cuisineTypes={state.cuisineTypes}
          />
        </SheetContent>
      </Sheet>

      {/* RATING MODAL POPUP */}
      {state.currentOrderInfo && (
        <RatingModal
          open={state.isRatingModalOpen}
          onOpenChange={actions.setIsRatingModalOpen}
          orderInfo={state.currentOrderInfo}
        />
      )}

      {/* PROMOTIONS MODAL POPUP */}
      <PromotionsModal
        open={isPromotionsModalOpen}
        onOpenChange={handlePromotionsModalChange}
        campaigns={campaigns}
      />
    </div>
  );
};

export default AllRestaurantsPage;
