import React from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/modules/discovery/components/SectionHeader";
import DiscoveryRestaurantCard from "@/components/modules/discovery/restaurants/components/DiscoveryRestaurantCard";
import {
  PopularRestaurantsSectionProps,
} from "@/components/modules/discovery/discovery.types";

export const PopularRestaurantsSection: React.FC<
  PopularRestaurantsSectionProps
> = ({ isPending, restaurants, isLoggedIn, onAction }) => {
  const t = useTranslations("Discovery.popularSection");
  return (
    <section className="mb-8">
      <SectionHeader title={t("title")} onAction={onAction} />
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
          {(restaurants || []).length > 0 ? (
            (restaurants || [])
              .slice(0, 5)
              .map((restaurant) => (
                <DiscoveryRestaurantCard
                  key={restaurant.id}
                  data={restaurant}
                  isLoggedIn={isLoggedIn}
                />
              ))
          ) : (
            <div className="text-gray-500 w-full text-center py-10">
              {t("noResults")}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
