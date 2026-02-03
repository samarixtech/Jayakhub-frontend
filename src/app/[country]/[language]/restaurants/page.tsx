"use client";

import React, { useEffect, useState } from "react";
import RestaurantHeader from "@/components/restaurants/Header";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { CLCProvider, useCLC } from "@/app/context/CLCContext.tsx";

// Discovery Components
import HeroBanner from "@/components/modules/discovery/HeroBanner";
import CategoryIcons from "@/components/modules/discovery/CategoryIcons";
import FilterBar from "@/components/modules/discovery/FilterBar";
import SectionHeader from "@/components/modules/discovery/SectionHeader";
import DiscoveryRestaurantCard, {
  RestaurantProps,
} from "@/components/modules/discovery/DiscoveryRestaurantCard";
import PromoBanner from "@/components/modules/discovery/PromoBanner";
import ShopCard from "@/components/modules/discovery/ShopCard";

import { useServerAction } from "@/hooks/use-server-action";
import { getAllRestaurantsAction } from "@/app/actions/public/restaurants";

// Mock Data
const SHOPS = [
  {
    id: "s1",
    name: "Fresh Mart Express",
    image: "/images/shops/mart.jpg",
    deliveryTime: "15-20 mins",
  },
  {
    id: "s2",
    name: "HealthFirst Care",
    image: "/images/shops/pharma.jpg",
    deliveryTime: "20-30 mins",
  },
  {
    id: "s3",
    name: "Daily Bakeshop",
    image: "/images/shops/bakery.jpg",
    deliveryTime: "10-15 mins",
  },
  {
    id: "s4",
    name: "Green Leaf Organic",
    image: "/images/shops/veg.jpg",
    deliveryTime: "25-40 mins",
  },
  {
    id: "s5",
    name: "Happy Paws Pet",
    image: "/images/shops/pet.jpg",
    deliveryTime: "30-45 mins",
  },
];

const IndexPageContent: React.FC = () => {
  const params = useParams();
  const { setCLC } = useCLC();
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([]);

  const { execute: fetchRestaurants, isPending } = useServerAction(
    getAllRestaurantsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const list = Array.isArray(data) ? data : data?.data || [];

        const mapped = list.map((item: any) => ({
          id: item.id || "",
          name: item.name || "Unknown",
          image:
            item.bannerImage || item.profileImage || "/images/food/burger.jpg",
          rating: 4.5,
          priceLevel: "$$",
          cuisine: Array.isArray(item.type)
            ? item.type.join(", ")
            : item.type || "General",
          deliveryTime: "30-45 mins",
          deliveryFee: 0,
          discount: undefined,
          isFavorite: false,
        }));

        setRestaurants(mapped);
      },
      onError: (err) => {
        console.error("Failed to fetch restaurants:", err);
      },
    },
  );

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = () => {
      let c = params?.country;
      if (Array.isArray(c)) c = c[0];
      if (!c) c = (getCookie("NEXT_COUNTRY") as string) || "US";

      let l = params?.language;
      if (Array.isArray(l)) l = l[0];
      if (!l) l = (getCookie("NEXT_LOCALE") as string) || "en";

      const cur = (getCookie("NEXT_CURRENCY") as string) || "$";

      setCLC({ country: c.toUpperCase(), currency: cur, language: l });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.country, params?.language]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <RestaurantHeader />

      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-[100px] md:pt-[120px]">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Category Icons */}
        <CategoryIcons />

        {/* 3. Filters */}
        <FilterBar />

        {/* 4. Popular Restaurants (Now Dynamic) */}
        <section className="mb-10">
          <SectionHeader title="Popular Restaurants" />

          {isPending ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {/* Skeleton Loaders (inline for simplicity) */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[320px] h-[300px] bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <DiscoveryRestaurantCard
                    key={restaurant.id}
                    data={restaurant}
                  />
                ))
              ) : (
                <div className="text-gray-500 w-full text-center py-10">
                  No restaurants found.
                </div>
              )}
            </div>
          )}
        </section>

        {/* 5. Promo Banner */}
        <PromoBanner />

        {/* 6. Shops Section */}
        <section className="mb-10">
          <SectionHeader
            title="Shops on JayakHub"
            actionText="View all shops"
          />
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {SHOPS.map((shop) => (
              <ShopCard key={shop.id} data={shop} />
            ))}
          </div>
        </section>

        {/* 7. More for You - Reusing fetched restaurants for now */}
        {/* <section className="mb-10">
          <SectionHeader title="More for You" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.slice(0, 8).map((restaurant) => (
              <DiscoveryRestaurantCard
                key={`more-${restaurant.id}`}
                data={restaurant}
              />
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <CLCProvider>
      <IndexPageContent />
    </CLCProvider>
  );
};

export default IndexPage;
