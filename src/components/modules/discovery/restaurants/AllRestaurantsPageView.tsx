"use client";
import React from "react";
import { useTranslations } from "next-intl";
import DiscoverySidebar from "@/components/modules/discovery/restaurants/components/DiscoverySidebar";
import { GlobalSearch } from "@/components/modules/discovery/components/GlobalSearch";
import { RatingModal } from "@/components/common/RatingModal";
import { useDiscoveryUI } from "@/context/DiscoveryUIContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRestaurantDiscovery } from "@/hooks/use-restaurant-discovery";
import { AllRestaurantsSection } from "./sections/AllRestaurantsSection";

const AllRestaurantsPageView: React.FC = () => {
  const t = useTranslations("Discovery.filterSheet");
  const { isFilterOpen, setIsFilterOpen } = useDiscoveryUI();
  const { state, actions } = useRestaurantDiscovery();

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* MINIMAL SEARCH BAR CONTAINER */}
      <div className="w-full bg-white border-b border-gray-100 py-6 px-4 sm:px-6 relative z-30">
        <div className="max-w-[540px] mx-auto">
          <GlobalSearch />
        </div>
      </div>

      {/* SIDEBAR + MAIN CONTENT */}
      <div className="flex gap-8 px-3 sm:px-6 mt-8 items-start relative">
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

          <AllRestaurantsSection
            isPending={state.isPending}
            restaurants={state.restaurants}
            viewMode={state.viewMode}
            setViewMode={actions.setViewMode}
            isLoggedIn={state.isLoggedIn}
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
            <SheetTitle>{t("title")}</SheetTitle>
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
    </div>
  );
};

export default AllRestaurantsPageView;
