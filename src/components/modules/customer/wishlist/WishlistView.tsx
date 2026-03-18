"use client";

import React, { useEffect, useState } from "react";
import { getWishlistAction } from "@/app/actions/customer/wishlist";
import DiscoveryRestaurantCard from "@/components/modules/discovery/restaurants/components/DiscoveryRestaurantCard";
import { RestaurantProps } from "@/components/modules/discovery/discovery.types";
import { Loader2, Heart } from "lucide-react";
import SectionHeader from "@/components/modules/discovery/components/SectionHeader";
import EmptyState from "@/components/common/EmptyState";

const WishlistView: React.FC = () => {
  const [wishlist, setWishlist] = useState<RestaurantProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const res = await getWishlistAction();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => ({
          id: item.restaurant.id,
          slug: item.restaurant.slug,
          name: item.restaurant.name,
          image: item.restaurant.profileImage || item.restaurant.bannerImage,
          rating: item.restaurant.averageRating || 0,
          totalRatings: item.restaurant.totalRatings || 0,
          priceLevel: "$$",
          cuisine: Array.isArray(item.restaurant.type)
            ? item.restaurant.type.join(", ")
            : "General",
          deliveryTime: item.restaurant.deliveryTime || "30-45 mins",
          deliveryFee: item.restaurant.deliveryFee || 0,
          isWishlist: true,
        }));
        setWishlist(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (restaurantId: string, newState: boolean) => {
    if (!newState) {
      setWishlist((prev) => prev.filter((r) => r.id !== restaurantId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">My Wishlist</h1>
        <p className="text-gray-500 mt-2">
          Your favorite restaurants in one place
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#346853] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your wishlist...</p>
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((restaurant) => (
            <DiscoveryRestaurantCard
              key={restaurant.id}
              data={restaurant}
              isLoggedIn={true}
              fluid={true}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title={"Your wishlist is empty"}
          message={
            "Save your favorite restaurants to find them easily next time."
          }
        />
      )}
    </div>
  );
};

export default WishlistView;
