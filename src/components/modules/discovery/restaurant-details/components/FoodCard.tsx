import React, { useState } from "react";
import Image from "next/image";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  FoodCardProps,
} from "@/components/modules/discovery/discovery.types";

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onAddItem,
  onClick,
  currency,
  restaurantIsOpen = true,
}) => {
  const t = useTranslations("Discovery.foodCard");
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(item.image) && !imgError;

  const itemUnavailable = item.isAvailable === false;
  const isDisabled = itemUnavailable || !restaurantIsOpen;
  const discountAmount = item.discount ? parseFloat(item.discount) : 0;
  const hasDiscount = discountAmount > 0;
  const discountedPrice = hasDiscount
    ? Math.max(0, item.basePrice - discountAmount)
    : item.basePrice;

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={`group border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex min-h-[8.5rem] h-auto ${
        isDisabled
          ? "cursor-default opacity-80 grayscale"
          : "cursor-pointer bg-white hover:shadow-md"
      }`}
    >
      {/* Image Area */}
      <div className="relative w-28 sm:w-32 shrink-0 bg-gray-100 flex items-center justify-center self-stretch overflow-hidden">
        {hasValidImage ? (
          <Image
            fill
            src={item.image}
            alt={item.name}
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : item.itemImages && item.itemImages.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-0.5 bg-gray-200">
            {item.itemImages.slice(0, 4).map((imgUrl: string, idx: number) => (
              <div key={idx} className="relative w-full h-full bg-gray-100 overflow-hidden">
                <Image
                  fill
                  src={imgUrl}
                  alt={item.name}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <UtensilsCrossed className="w-9 h-9 text-gray-300" />
        )}

        {hasDiscount && !isDisabled && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10">
            {currency} {discountAmount.toFixed(0)} {t("off")}
          </div>
        )}
        {!isDisabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddItem(item);
            }}
            className="absolute bottom-2 right-2 bg-primary hover:bg-[#e85a2a] text-white rounded-lg p-1.5 shadow-sm transition-colors z-10 cursor-pointer"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between grow relative min-w-0">
        <div>
          <h4
            className={`font-bold text-sm md:text-base mb-0.5 line-clamp-1 ${
              isDisabled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {item.name}
          </h4>
          <p
            className={`text-xs line-clamp-2 leading-relaxed ${
              isDisabled ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {item.description}
          </p>

          {item.dealItems && item.dealItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              {item.dealItems.map((di: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-gray-700"
                >
                  {di.image && (
                    <span className="relative w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 inline-block">
                      <Image fill src={di.image} alt={di.name} className="object-cover" />
                    </span>
                  )}
                  <span className="truncate max-w-[90px]">{di.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-1">
          {isDisabled ? (
            <span className="bg-red-50 text-red-500 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {itemUnavailable ? t("unavailable") : t("restaurantClosed")}
            </span>
          ) : (
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-gray-400 line-through text-[10px] md:text-xs">
                  {currency} {item.basePrice.toFixed(2)}
                </span>
              )}
              <p className="text-primary font-bold text-sm md:text-base leading-tight">
                {currency} {discountedPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
