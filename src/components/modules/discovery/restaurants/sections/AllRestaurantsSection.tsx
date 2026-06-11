import React from "react";
import SectionHeader from "@/components/modules/discovery/components/SectionHeader";
import DiscoveryRestaurantCard from "@/components/modules/discovery/restaurants/components/DiscoveryRestaurantCard";
import { LayoutGrid, List, Sprout } from "lucide-react";
import { AllRestaurantsSectionProps } from "@/components/modules/discovery/discovery.types";

export const AllRestaurantsSection: React.FC<AllRestaurantsSectionProps> = ({
  isPending,
  restaurants,
  viewMode,
  setViewMode,
  isLoggedIn,
  onAction,
}) => {
  return (
    <section className="mb-20">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="mb-6">
          <SectionHeader title="All Restaurants" onAction={onAction} />
        </div>

        {isPending ? (
          <div className="grid gap-5 grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl animate-pulse h-[240px]"
              />
            ))}
          </div>
        ) : (restaurants || []).length > 0 ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(restaurants || []).map((restaurant) => (
              <DiscoveryRestaurantCard
                key={restaurant.id}
                data={restaurant}
                variant="default"
                fluid={true}
                className="w-full"
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 w-full text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No restaurants found</p>
            <p className="text-sm text-gray-400">
              Try adjusting filters or location
            </p>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Mobile Header with Toggle */}
        <div className="flex items-center justify-between mb-6 pr-4">
          <h2 className="text-xl font-bold text-gray-900">All Restaurants</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="w-5 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isPending ? (
          <div
            className={`grid gap-4 ${
              viewMode === "list" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`bg-gray-200 rounded-2xl animate-pulse ${
                  viewMode === "list" ? "h-[200px]" : "h-[140px]"
                }`}
              />
            ))}
          </div>
        ) : (restaurants || []).length > 0 ? (
          <div
            className={`grid gap-4 ${
              viewMode === "list" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {(restaurants || []).map((restaurant) => (
              <DiscoveryRestaurantCard
                key={restaurant.id}
                data={restaurant}
                variant={viewMode === "grid" ? "compact" : "default"}
                className="w-full"
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 w-full text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No restaurants found</p>
            <p className="text-sm text-gray-400">
              Try adjusting filters or location
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
