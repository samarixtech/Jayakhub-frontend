import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  FoodCardProps,
  APIMnuItem,
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

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex h-32"
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(item);
          }}
          className="absolute bottom-2 right-2 bg-[#346853] hover:bg-[#2c5846] text-white rounded-lg p-1.5 shadow-sm transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between grow relative">
        <div>
          <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-1">
            {item.name}
          </h4>
          <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-900 font-bold text-sm md:text-base">
            {currency} {item.basePrice}
          </p>
        </div>
      </div>
    </div>
  );
};
