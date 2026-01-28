"use client";

import React, { useEffect } from "react";
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

// Mock Data
const POPULAR_RESTAURANTS: RestaurantProps[] = [
  {
    id: "1",
    name: "The Burger Joint",
    image: "/images/food/burger.jpg", // Placeholder
    rating: 4.5,
    priceLevel: "$",
    cuisine: "Burgers, American",
    deliveryTime: "20-30 mins",
    deliveryFee: 0,
    discount: "50% OFF",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Pizza Paradise",
    image: "/images/food/pizza.jpg",
    rating: 4.2,
    priceLevel: "$$",
    cuisine: "Italian, Pizza",
    deliveryTime: "15-25 mins",
    deliveryFee: 0.99,
    discount: "Buy 1 Get 1",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Sushi Zen Express",
    image: "/images/food/sushi.jpg",
    rating: 4.8,
    priceLevel: "$$$",
    cuisine: "Japanese",
    deliveryTime: "30-45 mins",
    deliveryFee: 2.49,
    isFavorite: true,
  },
  {
    id: "4",
    name: "Green Salad Co.",
    image: "/images/food/salad.jpg",
    rating: 4.6,
    priceLevel: "$",
    cuisine: "Healthy, Salad",
    deliveryTime: "15-20 mins",
    deliveryFee: 0,
    isFavorite: true,
  },
];

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

const MORE_RESTAURANTS: RestaurantProps[] = [
  {
    id: "5",
    name: "Taco Town",
    image: "/images/food/tacos.jpg",
    rating: 4.3,
    priceLevel: "$",
    cuisine: "Mexican, Street Food",
    deliveryTime: "15-20 mins",
    deliveryFee: 1.2,
    discount: "HOT DEAL",
  },
  {
    id: "6",
    name: "Donut Dream",
    image: "/images/food/donuts.jpg",
    rating: 4.9,
    priceLevel: "$",
    cuisine: "Sweets, Bakery",
    deliveryTime: "10-15 mins",
    deliveryFee: 0,
    discount: "30% OFF",
  },
  {
    id: "7",
    name: "Dim Sum House",
    image: "/images/food/dimsum.jpg",
    rating: 4.7,
    priceLevel: "$$",
    cuisine: "Chinese",
    deliveryTime: "35-45 mins",
    deliveryFee: 1.49,
    discount: "Free Gift",
  },
  {
    id: "8",
    name: "Pasta Palace",
    image: "/images/food/pasta.jpg",
    rating: 4.4,
    priceLevel: "$$",
    cuisine: "Italian, Pasta",
    deliveryTime: "25-30 mins",
    deliveryFee: 2.49,
  },
];

const IndexPageContent: React.FC = () => {
  const params = useParams();
  const { setCLC } = useCLC();

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

        {/* 4. Popular Restaurants */}
        <section className="mb-10">
          <SectionHeader title="Popular Restaurants" />
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {POPULAR_RESTAURANTS.map((restaurant) => (
              <DiscoveryRestaurantCard key={restaurant.id} data={restaurant} />
            ))}
          </div>
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

        {/* 7. More for You */}
        <section className="mb-10">
          <SectionHeader title="More for You" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MORE_RESTAURANTS.map((restaurant) => (
              <DiscoveryRestaurantCard key={restaurant.id} data={restaurant} />
            ))}
          </div>
        </section>
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
