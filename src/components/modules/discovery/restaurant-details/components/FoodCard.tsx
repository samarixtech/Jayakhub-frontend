import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  FoodCardProps,

} from "@/components/modules/discovery/discovery.types";

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onAddItem,
  onClick,
  currency,
}) => {
  const imageUrl = item.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  const isUnavailable = item.isAvailable === false;
  const discountAmount = item.discount ? parseFloat(item.discount) : 0;
  const hasDiscount = discountAmount > 0;
  const discountedPrice = hasDiscount
    ? Math.max(0, item.basePrice - discountAmount)
    : item.basePrice;

  return (
    <div
      onClick={isUnavailable ? undefined : onClick}
      className={`group border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex h-32 ${
        isUnavailable
          ? "cursor-default opacity-80"
          : "cursor-pointer bg-white hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div className="relative w-32 h-32 shrink-0">
        <Image
          width={250}
          height={250}
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {hasDiscount && !isUnavailable && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10">
            {currency} {discountAmount.toFixed(0)} OFF
          </div>
        )}
        {!isUnavailable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddItem(item);
            }}
            className="absolute bottom-2 right-2 bg-[#346853] hover:bg-[#2c5846] text-white rounded-lg p-1.5 shadow-sm transition-colors"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between grow relative">
        <div>
          <h4
            className={`font-bold text-sm md:text-base mb-1 line-clamp-1 ${
              isUnavailable ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {item.name}
          </h4>
          <p
            className={`text-xs md:text-sm line-clamp-2 leading-relaxed ${
              isUnavailable ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          {isUnavailable ? (
            <span className="bg-red-50 text-red-500 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Unavailable
            </span>
          ) : (
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-gray-400 line-through text-[10px] md:text-xs">
                  {currency} {item.basePrice.toFixed(2)}
                </span>
              )}
              <p className="text-[#346853] font-bold text-sm md:text-base">
                {currency} {discountedPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
