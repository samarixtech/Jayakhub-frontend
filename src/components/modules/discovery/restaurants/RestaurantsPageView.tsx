"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { CLCProvider, useCLC } from "@/app/context/CLCContext";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import {
  Star,
  Zap,
  Leaf,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  X,
  Award,
  Sprout,
} from "lucide-react";

// Discovery Components
import HeroBanner from "@/components/modules/discovery/HeroBanner";
import SectionHeader from "@/components/modules/discovery/SectionHeader";
import DiscoveryRestaurantCard, {
  RestaurantProps,
} from "@/components/modules/discovery/DiscoveryRestaurantCard";
import DiscoverySidebar from "@/components/modules/discovery/DiscoverySidebar";

import { useServerAction } from "@/hooks/use-server-action";
import { getAllRestaurantsAction } from "@/app/actions/public/restaurants";
import { getCuisineTypesAction } from "@/app/actions/public/cuisines";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDiscoveryUI } from "@/app/context/DiscoveryUIContext";

// ==================== CURATED CATEGORIES ====================
const CURATED_CATEGORIES = [
  { id: "top_rated", label: "Top Rated", icon: Star },
  { id: "fastest", label: "Fastest Delivery", icon: Zap },
  { id: "healthy", label: "Healthy", icon: Leaf },
  { id: "new", label: "New Arrivals", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "best_sellers", label: "Best Sellers", icon: Award },
  { id: "vegan", label: "Vegan Options", icon: Sprout },
];

// ==================== MAIN COMPONENT ====================
const AllRestaurantsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { setCLC } = useCLC();
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<any[]>([]);
  const [isCuisinesLoading, setIsCuisinesLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const res = await getCuisineTypesAction();
        if (res?.data) {
          setCuisineTypes(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch cuisines:", error);
      } finally {
        setIsCuisinesLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  // Sidebar state
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const { isFilterOpen, setIsFilterOpen } = useDiscoveryUI();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setIsLoggedIn(true);
        setUser(response.data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  const { execute: fetchRestaurants, isPending } = useServerAction(
    getAllRestaurantsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const list = Array.isArray(data) ? data : data?.data || [];

        const mapped = list.map((item: any) => ({
          id: item.id || "",
          slug: item.slug || item.id || "",
          name: item.name || "Unknown",
          image: item.profileImage || item.bannerImage,
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

  // Fetch restaurants based on URL params or Silent Auto-Locate
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      // 1. Explicit params -> fetch explicit
      fetchRestaurants({ lat: parseFloat(lat), lng: parseFloat(lng) });
    } else {
      // 2. No params -> fetch all (fallback)
      fetchRestaurants({});

      // 3. Silent Auto-Locate (Fetch nearby without changing URL)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchRestaurants({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.warn("Silent auto-locate failed:", err);
          },
        );
      }
    }
  }, [searchParams]);

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

  const handleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handlePrice = (price: string) => {
    setSelectedPrice((prev) => (prev === price ? null : price));
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* Hero Banner - Full Width */}
      <HeroBanner />

      {/* Sidebar + Main Content */}
      <div className="flex gap-8 px-3 sm:px-6 mt-6 items-start relative">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[240px] shrink-0 hidden lg:block sticky top-[96px] h-[calc(100vh-96px)] overflow-hidden mr-0 sm:mr-5">
          <div className="h-full overflow-y-auto pr-4 pb-20 scrollbar-hide overscroll-y-contain">
            <DiscoverySidebar
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              activeFilters={activeFilters}
              onFilterToggle={handleFilter}
              selectedPrice={selectedPrice}
              onPriceToggle={handlePrice}
              showAllCuisines={showAllCuisines}
              onToggleCuisines={() => setShowAllCuisines(!showAllCuisines)}
            />
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          {/* Popular Restaurants */}
          <section className="mb-8">
            <SectionHeader title="Popular Restaurants" />
            {isPending ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="min-w-[240px] h-[180px] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                {restaurants.length > 0 ? (
                  restaurants
                    .slice(0, 5)
                    .map((restaurant) => (
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

          {/* Cuisines Icons Row */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cuisines</h3>
            <div className="flex gap-12 md:gap-6 overflow-x-auto pb-2 pl-3 sm:pl-0 scrollbar-hide">
              {isCuisinesLoading
                ? // Skeleton Loading for Cuisines
                  Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 min-w-[70px] animate-pulse"
                    >
                      <div className="w-24 h-24 rounded-full bg-gray-200" />
                      <div className="w-12 h-3 rounded bg-gray-200" />
                    </div>
                  ))
                : cuisineTypes.map((cat: any, index: number) => (
                    <button
                      key={index}
                      className="flex flex-col items-center gap-2 min-w-[70px] group"
                    >
                      <div className="w-23 h-23 rounded-full overflow-hidden border border-gray-100 shadow-sm group-hover:border-emerald-500 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-[#346853] transition-colors whitespace-nowrap">
                        {cat.name}
                      </span>
                    </button>
                  ))}
            </div>
          </section>

          {/* Restaurant Count */}
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {restaurants.length} restaurants near you
            </h2>
          </div>

          {/* Curated for you */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Curated for you
            </h3>
            <div className="flex gap-12 md:gap-6 overflow-x-auto pb-2 pl-4.5 sm:pl-0 scrollbar-hide">
              {CURATED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className="flex flex-col items-center gap-2 min-w-[100px] group"
                >
                  <div className="w-34 h-31 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-[#E8F5F0] transition-colors">
                    <cat.icon className="w-6 h-6 text-gray-500 group-hover:text-[#346853] transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-[#346853] transition-colors whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* All Restaurants */}
          <section className="mb-8">
            <SectionHeader title="All Restaurants" />
            {isPending ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="min-w-[240px] h-[180px] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                {restaurants.length > 0 ? (
                  restaurants
                    .slice(0, 5)
                    .map((restaurant) => (
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
        </div>
      </div>

      {/* ===== BOTTOM NAVIGATION ===== */}
      {/* ===== MOBILE FILTER SHEET (BOTTOM) ===== */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto rounded-t-2xl px-6 pt-6"
        >
          <SheetHeader className="mb-6 text-left">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <DiscoverySidebar
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            activeFilters={activeFilters}
            onFilterToggle={handleFilter}
            selectedPrice={selectedPrice}
            onPriceToggle={handlePrice}
            showAllCuisines={showAllCuisines}
            onToggleCuisines={() => setShowAllCuisines(!showAllCuisines)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

const RestaurantsPageView: React.FC = () => {
  return (
    <CLCProvider>
      <AllRestaurantsPage />
    </CLCProvider>
  );
};

export default RestaurantsPageView;
