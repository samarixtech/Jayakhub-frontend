"use client";
import { Heart, Star, Clock, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";

export interface RestaurantProps {
  id: string;
  slug: string;
  name: string;
  image: string;
  rating: number;
  priceLevel: string;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  discount?: string;
  isFavorite?: boolean;
}

const DiscoveryRestaurantCard = ({ data }: { data: RestaurantProps }) => {
  const router = useRouter();
  const params = useParams();
  const country = params?.country;
  const language = params?.language;

  const handleClick = () => {
    if (country && language && data.slug) {
      router.push(`/${country}/${language}/restaurants/${data.slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group min-w-[320px] w-[320px] cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm">
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${data.image}`}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {data.discount && (
          <Badge className="absolute top-3 left-3 bg-[#346853] hover:bg-[#346853] text-white border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
            {data.discount}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="pt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 truncate pr-2">
            {data.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md self-center">
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
            <span className="text-xs font-bold text-green-700">
              {data.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 gap-1.5">
          <span>{data.priceLevel}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="truncate max-w-[200px]">{data.cuisine}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-0.5 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{data.deliveryTime}</span>
          </div>
          {data.deliveryFee === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <Bike className="h-4 w-4" />
              <span>Free Delivery</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bike className="h-4 w-4 text-gray-400" />
              <span>${data.deliveryFee} Delivery</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryRestaurantCard;
