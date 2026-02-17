import React from "react";
import { SimilarRestaurant } from "@/types/menu.types";
import { Star, Clock } from "lucide-react";
import { useCLC } from "@/app/context/CLCContext";
import Image from "next/image";

interface SimilarRestaurantCardProps {
  restaurant: SimilarRestaurant;
}

const SimilarRestaurantCard: React.FC<SimilarRestaurantCardProps> = ({
  restaurant,
}) => {
  const { currency } = useCLC();

  return (
    <a
      href={`/restaurants/${restaurant.id}`}
      className="block w-64 flex-shrink-0 bg-[#E8F4F1] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image and Promo Sticker */}
      <div className="relative h-40">
        <Image
          width={250}
          height={250}
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.promoText && (
          <div className="absolute top-2 left-2 bg-[#0B5D4E] text-[#E8F4F1] text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {restaurant.promoText}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {restaurant.name}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
          <div className="flex items-center">
            <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-semibold">
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-xs ml-1">({restaurant.ratingCount}+)</span>
          </div>

          <span className="text-gray-300">|</span>

          <div className="flex items-center">
            <Clock size={14} className="text-green-500 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>

        {/* Cuisine and Fee */}
        <p className="text-xs text-gray-500 mt-1 truncate">
          {restaurant.cuisine.join(" • ")}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {currency} {restaurant.deliveryFee.toLocaleString()} Delivery Fee
        </p>
      </div>
    </a>
  );
};

export default SimilarRestaurantCard;
