import React from "react";
import Image from "next/image";
import HorizontalScroller from "@/components/HorizontalScroller";
import { useTranslations } from "next-intl";
import { Sparkles, Tag, Plus, UtensilsCrossed } from "lucide-react";
import { FoodCard } from "./FoodCard";
import {
  RestaurantMenuProps,
  APIMnuItem,
} from "@/components/modules/discovery/discovery.types";

interface TopDealCardProps {
  item: APIMnuItem;
  currency: string;
  restaurantIsOpen: boolean;
  onItemClick: (item: APIMnuItem) => void;
  onAddItem: (item: APIMnuItem) => void;
}

const TopDealCard: React.FC<TopDealCardProps> = ({
  item,
  currency,
  restaurantIsOpen,
  onItemClick,
  onAddItem,
}) => {
  const t = useTranslations("Discovery.restaurantMenu");
  const [imgError, setImgError] = React.useState(false);
  const hasValidImage = Boolean(item.image) && !imgError;

  const discountAmount = item.discount ? parseFloat(item.discount) : 0;
  const hasDiscount = discountAmount > 0;
  const discountedPrice = hasDiscount
    ? Math.max(0, item.basePrice - discountAmount)
    : item.basePrice;
  const isDisabled = item.isAvailable === false || !restaurantIsOpen;

  return (
    <div
      onClick={isDisabled ? undefined : () => onItemClick(item)}
      className={`group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-4 shadow-sm transition-all duration-300 flex flex-col justify-between ${
        isDisabled ? "opacity-75 grayscale cursor-default" : "hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {item.badge || t("comboDealBadge")}
        </span>
        {hasDiscount && (
          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md border border-red-100">
            {t("saveAmount", { currency, amount: discountAmount.toFixed(0) })}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border border-gray-100">
          {hasValidImage ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : item.itemImages && item.itemImages.length > 0 ? (
            <div className="w-full h-full grid grid-cols-2 gap-0.5 bg-gray-200">
              {item.itemImages.slice(0, 4).map((imgUrl: string, idx: number) => (
                <div key={idx} className="relative w-full h-full bg-gray-100 overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <UtensilsCrossed className="w-8 h-8 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-base text-gray-900 line-clamp-1">
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
              {item.description}
            </p>

            {/* Included Items list with Images */}
            {item.dealItems && item.dealItems.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {item.dealItems.map((di: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-orange-50/90 border border-orange-100 px-2 py-0.5 rounded-full text-[11px] font-medium text-gray-700 shadow-2xs"
                  >
                    {di.image ? (
                      <span className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 inline-block border border-orange-200">
                        <Image
                          src={di.image}
                          alt={di.name}
                          fill
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <UtensilsCrossed className="w-3 h-3 text-orange-400 shrink-0" />
                    )}
                    <span className="truncate max-w-[110px]">{di.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-xs block">
                  {currency} {item.basePrice.toFixed(2)}
                </span>
              )}
              <span className="text-brand-orange font-extrabold text-lg">
                {currency} {discountedPrice.toFixed(2)}
              </span>
            </div>

            {!isDisabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem(item);
                }}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold text-xs px-3 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {t("addDeal")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  categories,
  activeTab,
  searchTerm,
  filteredItems,
  menuByCategories,
  currency,
  restaurantIsOpen = true,
  deals = [],
  onCategoryClick,
  onAddItem,
  onItemClick,
}) => {
  const t = useTranslations("Discovery.restaurantMenu");
  const hasDeals = deals && deals.length > 0;
  const dealItems = menuByCategories["Deals"] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* TOP DEALS BANNER SECTION */}
      {hasDeals && !searchTerm && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-red-500/10 border border-orange-200/60 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-brand-orange text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                {t("specialDealsTitle")}
                <span className="text-xs bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded-full">
                  {t("activeCount", { count: deals.length })}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                {t("specialDealsSubtitle")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dealItems.map((item) => (
              <TopDealCard
                key={`top-deal-${item.id}`}
                item={item}
                currency={currency}
                restaurantIsOpen={restaurantIsOpen}
                onItemClick={onItemClick}
                onAddItem={onAddItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES STICKY TAB BAR */}
      <div className="sticky top-[80px] z-30 bg-white py-2 mb-6 border-b border-gray-100">
        <HorizontalScroller>
          {(categories || []).map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors duration-200 cursor-pointer ${
                activeTab === cat
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat === "Deals" ? t("dealsTabLabel") : cat}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      {category === "Deals" ? t("dealsTabLabel") : category}
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
