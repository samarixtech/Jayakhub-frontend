import React from "react";
import Image from "next/image";
import { Clock, Star, MapPin, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  RestaurantHeroProps,
  // RestaurantDetails,
} from "@/components/modules/discovery/discovery.types";
import { useCLC } from "@/context/CLCContext";

export const RestaurantHero: React.FC<RestaurantHeroProps> = ({
  restaurant,
  bannerUrl,
  profileUrl,
  reviewsData,
  onOpenReviews,
  deliveryFee,
  distance,
}) => {
  const { currency } = useCLC();
  return (
    <div className="w-full relative md:rounded-2xl overflow-hidden">
      <div className="h-[200px] md:h-[350px] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
        <Image
          width={250}
          height={250}
          src={bannerUrl}
          alt={restaurant?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* RESTAURANT INFO SECTION */}
      <div className="max-w-7xl mx-auto relative z-20 -mt-12 md:-mt-24 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-md border-4 border-white shrink-0 -mt-14 md:mt-0 bg-white relative z-30">
            <Image
              width={250}
              height={250}
              src={profileUrl}
              alt={restaurant?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left w-full mt-1 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 md:mb-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight px-2 md:px-0">
                  {restaurant?.name}
                </h1>
                {deliveryFee === 0 && (
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none w-fit mx-auto md:mx-0 text-[10px] md:text-xs">
                    FREE DELIVERY
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-5">
              {(restaurant?.type || []).join(" • ")}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-6 text-xs md:text-sm text-gray-600">
              <div
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity group bg-gray-50 px-3 py-1.5 rounded-full md:bg-transparent md:p-0 md:rounded-none"
                onClick={onOpenReviews}
              >
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-900 text-sm md:text-base">
                  {reviewsData?.totalAverageRating > 0
                    ? Number(reviewsData.totalAverageRating).toFixed(1)
                    : "New"}
                </span>
                <span className="text-gray-500 font-medium ml-1">
                  {reviewsData?.totalRatingCount > 0
                    ? `(${reviewsData.totalRatingCount})`
                    : ""}{" "}
                  <span className="hidden md:inline px-1 text-gray-300">•</span>{" "}
                  <span className="text-[#346853] font-bold group-hover:underline hidden md:inline">
                    See reviews ›
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full md:bg-transparent md:p-0 md:rounded-none">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <span className="font-medium text-gray-700">20-30 min</span>
              </div>
              {distance != null && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full md:bg-transparent md:p-0 md:rounded-none">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">{distance} km</span>
                </div>
              )}
              {deliveryFee != null ? (
                deliveryFee === 0 ? (
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full md:bg-transparent md:p-0 md:rounded-none text-emerald-600 font-bold">
                    <Bike className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Free Delivery</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full md:bg-transparent md:p-0 md:rounded-none">
                    <Bike className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">{currency}{deliveryFee} Delivery</span>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
