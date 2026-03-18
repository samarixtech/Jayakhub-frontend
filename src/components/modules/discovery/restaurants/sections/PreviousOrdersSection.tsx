import React from "react";
import SectionHeader from "@/components/modules/discovery/components/SectionHeader";
import DiscoveryRestaurantCard from "@/components/modules/discovery/restaurants/components/DiscoveryRestaurantCard";
import {
  RestaurantProps,
  PreviousOrdersSectionProps,
} from "@/components/modules/discovery/discovery.types";

export const PreviousOrdersSection: React.FC<PreviousOrdersSectionProps> = ({
  isLoggedIn,
  isPreviousOrdersLoading,
  previousOrders,
  viewMode,
}) => {
  if (
    !isLoggedIn ||
    (!isPreviousOrdersLoading && previousOrders.length === 0)
  ) {
    return null;
  }

  return (
    <section className="mb-20">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="mb-6">
          <SectionHeader title="Order Again" />
        </div>

        {isPreviousOrdersLoading ? (
          <div className="grid gap-5 grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl animate-pulse h-[240px]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {previousOrders.map((restaurant) => (
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
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6 pr-4">
          <h2 className="text-xl font-bold text-gray-900">Order Again</h2>
        </div>

        {isPreviousOrdersLoading ? (
          <div
            className={`grid gap-4 ${
              viewMode === "list" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`bg-gray-200 rounded-2xl animate-pulse ${
                  viewMode === "list" ? "h-[200px]" : "h-[140px]"
                }`}
              />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === "list" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {previousOrders.map((restaurant) => (
              <DiscoveryRestaurantCard
                key={restaurant.id}
                data={restaurant}
                variant={viewMode === "grid" ? "compact" : "default"}
                className="w-full"
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
