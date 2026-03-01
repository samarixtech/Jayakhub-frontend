"use client";

import React from "react";
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

// Sections
import { PopularRestaurantsSection } from "./sections/PopularRestaurantsSection";
import { CuisinesSection } from "./sections/CuisinesSection";
import { CuratedSection } from "./sections/CuratedSection";
import { AllRestaurantsSection } from "./sections/AllRestaurantsSection";
import { PreviousOrdersSection } from "./sections/PreviousOrdersSection";

const AllRestaurantsPage: React.FC = () => {
  const { isFilterOpen, setIsFilterOpen } = useDiscoveryUI();
  const { state, actions } = useRestaurantDiscovery();

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Sidebar + Main Content */}
      <div className="flex gap-8 px-3 sm:px-6 mt-6 items-start relative">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[240px] shrink-0 hidden lg:block sticky top-[96px] h-[calc(100vh-96px)] overflow-hidden mr-0 sm:mr-5">
          <div className="h-full overflow-y-auto pr-4 pb-20 scrollbar-hide overscroll-y-contain">
            <DiscoverySidebar
              selectedSort={state.selectedSort}
              onSortChange={actions.setSelectedSort}
              activeFilters={state.activeFilters}
              onFilterToggle={actions.handleFilter}
              selectedPrice={state.selectedPrice}
              onPriceToggle={actions.handlePrice}
              showAllCuisines={state.showAllCuisines}
              onToggleCuisines={() =>
                actions.setShowAllCuisines(!state.showAllCuisines)
              }
              cuisineTypes={state.cuisineTypes}
            />
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          <PopularRestaurantsSection
            isPending={state.isPending}
            restaurants={state.restaurants}
          />

          <CuisinesSection
            isCuisinesLoading={state.isCuisinesLoading}
            cuisineTypes={state.cuisineTypes}
            activeFilters={state.activeFilters}
            onCuisineClick={actions.handleFilter}
          />

          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {state.restaurants.length} restaurants near you
            </h2>
          </div>

          <CuratedSection
            selectedSort={state.selectedSort}
            onSortChange={actions.setSelectedSort}
          />

          <AllRestaurantsSection
            isPending={state.isPending}
            restaurants={state.restaurants}
            viewMode={state.viewMode}
            setViewMode={actions.setViewMode}
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
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <DiscoverySidebar
            selectedSort={state.selectedSort}
            onSortChange={actions.setSelectedSort}
            activeFilters={state.activeFilters}
            onFilterToggle={actions.handleFilter}
            selectedPrice={state.selectedPrice}
            onPriceToggle={actions.handlePrice}
            showAllCuisines={state.showAllCuisines}
            onToggleCuisines={() =>
              actions.setShowAllCuisines(!state.showAllCuisines)
            }
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

export default AllRestaurantsPage;
