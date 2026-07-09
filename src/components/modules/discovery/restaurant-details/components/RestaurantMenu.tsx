import React from "react";
import HorizontalScroller from "@/components/HorizontalScroller";
import { useTranslations } from "next-intl";
import { FoodCard } from "./FoodCard";
import {
  RestaurantMenuProps,
  APIMnuItem,
} from "@/components/modules/discovery/discovery.types";

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  categories,
  activeTab,
  searchTerm,
  filteredItems,
  menuByCategories,
  currency,
  restaurantIsOpen = true,
  onCategoryClick,
  onAddItem,
  onItemClick,
}) => {
  const t = useTranslations("Discovery.restaurantMenu");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="sticky top-[80px] z-30 bg-white py-2 mb-6 border-b border-gray-100">
        <HorizontalScroller>
          {(categories || []).map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors duration-200 ${
                activeTab === cat
                  ? "border-[#346853] text-[#346853]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </HorizontalScroller>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-10">
          {searchTerm ? (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t("searchResults")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(filteredItems || []).map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onAddItem={onAddItem}
                    onClick={() => onItemClick(item)}
                    currency={currency}
                    restaurantIsOpen={restaurantIsOpen}
                  />
                ))}
              </div>
            </div>
          ) : (
            (categories || []).map(
              (category) =>
                menuByCategories[category]?.length > 0 && (
                  <div
                    key={category}
                    id={`category-${category}`}
                    className="scroll-mt-40"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(menuByCategories[category] || []).map((item) => (
                        <FoodCard
                          key={item.id}
                          item={item}
                          onAddItem={onAddItem}
                          onClick={() => onItemClick(item)}
                          currency={currency}
                          restaurantIsOpen={restaurantIsOpen}
                        />
                      ))}
                    </div>
                  </div>
                ),
            )
          )}
        </div>
      </div>
    </div>
  );
};
