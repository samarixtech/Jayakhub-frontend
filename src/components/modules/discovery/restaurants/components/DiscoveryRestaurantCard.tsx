"use client";
import { Star, Clock, Bike, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toggleWishlistAction } from "@/app/actions/customer/wishlist";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useCLC } from "@/context/CLCContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setSelectedRestaurantMeta } from "@/redux/slices/discoverySlice";
import { useTranslations } from "next-intl";

import { CardProps } from "@/components/modules/discovery/discovery.types";

const DiscoveryRestaurantCard = ({
  data,
  variant = "default",
  className = "",
  fluid = false,
  isLoggedIn = false,
  onWishlistToggle,
}: CardProps) => {
  const t = useTranslations("Discovery.restaurantCard");
  const [internalIsWishlist, setInternalIsWishlist] = useState(data.isWishlist);
  const [isWishlistPending, setIsWishlistPending] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currency } = useCLC();
  const isCompact = variant === "compact";

  const handleClick = () => {
    if (data.slug) {
      const meta = {
        id: data.id,
        deliveryFee: data.deliveryFee ?? 0,
        distance: (data as any).distance,
      };
      dispatch(setSelectedRestaurantMeta(meta));
      localStorage.setItem("selectedRestaurantMeta", JSON.stringify(meta));
      router.push(`/restaurants/${data.slug}`);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error(t("wishlistLoginRequired"));
      return;
    }

    try {
      setIsWishlistPending(true);
      const res = await toggleWishlistAction(data.id);
      if (res.success) {
        const newState = !internalIsWishlist;
        setInternalIsWishlist(newState);
        onWishlistToggle?.(data.id, newState);
        toast.success(
          newState ? t("addedToWishlist") : t("removedFromWishlist"),
        );
      } else {
        toast.error(res.message || t("wishlistUpdateFailed"));
      }
    } catch (err) {
      toast.error(t("somethingWentWrong"));
    } finally {
      setIsWishlistPending(false);
    }
  };

  const widthClasses =
    fluid || isCompact ? "w-full min-w-0" : "min-w-[300px] w-[300px]";
  const isClosed = data.isOpen === false;

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer ${widthClasses} ${className}`}
    >
      {/* Image Container */}
      <div
        className={`relative ${
          isCompact ? "h-32 rounded-xl" : "h-47 rounded-2xl"
        } w-full overflow-hidden shadow-sm ${isClosed ? "grayscale" : ""}`}
      >
        <Image
          width={250}
          height={250}
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {isClosed && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide bg-black/70 px-3 py-1.5 rounded-md">
              {t("closed")}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {!isClosed &&
          (data.discount ||
            (data.averageDiscount && data.averageDiscount > 0)) && (
            <Badge className="absolute top-3 left-3 bg-[#EE3F43] hover:bg-[#EE3F43] text-white border-0 font-bold px-2 py-1 text-[10px] sm:text-[11px] uppercase rounded-md shadow-md z-10">
              {data.discount ||
                t("upToOff", { currency, amount: data.averageDiscount ?? 0 })}
            </Badge>
          )}

        {/* Wishlist Toggle */}
        {isLoggedIn && (
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistPending}
            className="absolute top-3 right-3 p-2 rounded-full transition-all bg-black/20 backdrop-blur-sm hover:bg-black/30 shadow-sm z-10"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                internalIsWishlist ? "text-red-500 fill-red-500" : "text-white"
              }`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={`${isCompact ? "pt-2 space-y-0.5" : "pt-3 space-y-1"} ${isClosed ? "opacity-60" : ""}`}
      >
        <div className="flex justify-between items-start">
          <h3
            className={`${
              isCompact ? "text-sm" : "text-lg"
            } font-bold text-gray-900 truncate pr-2`}
          >
            {data.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md self-center whitespace-nowrap">
            <Star className="h-3 w-3 text-green-600 fill-green-600 shrink-0" />
            <span className="text-xs font-bold text-green-700">
              {data.rating > 0 ? Number(data.rating).toFixed(1) : t("new")}
            </span>
            {!!data.totalRatings && data.totalRatings > 0 && (
              <span className="text-[10px] text-green-600 font-medium">
                ({data.totalRatings})
              </span>
            )}
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
            <span>{data.deliveryTime || t("defaultDeliveryTime")}</span>
          </div>
          {!isCompact &&
            (data.deliveryFee === 0 ? (
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Bike className="h-4 w-4" />
                <span>{t("freeDelivery")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Bike className="h-4 w-4 text-gray-400" />
                <span>
                  {currency}
                  {data.deliveryFee} {t("deliverySuffix")}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryRestaurantCard;
