import React from "react";
import SectionHeader from "@/components/modules/discovery/SectionHeader";
import DiscoveryRestaurantCard, {
  RestaurantProps,
} from "@/components/modules/discovery/DiscoveryRestaurantCard";

interface PopularRestaurantsSectionProps {
  isPending: boolean;
  restaurants: RestaurantProps[];
}

export const PopularRestaurantsSection: React.FC<
  PopularRestaurantsSectionProps
> = ({ isPending, restaurants }) => {
  return (
    <section className="mb-8">
      <SectionHeader title="Popular Restaurants" />
      {isPending ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[240px] h-[180px] bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {restaurants.length > 0 ? (
            restaurants
              .slice(0, 5)
              .map((restaurant) => (
                <DiscoveryRestaurantCard
                  key={restaurant.id}
                  data={restaurant}
                />
              ))
          ) : (
            <div className="text-gray-500 w-full text-center py-10">
              No restaurants found.
            </div>
          )}
        </div>
      )}
    </section>
  );
};
