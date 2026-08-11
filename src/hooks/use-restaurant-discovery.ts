import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams, useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { useCLC } from "@/context/CLCContext";
import { getProfile } from "@/app/actions/customer/userprofile";
import { getCurrentOrder } from "@/app/actions/customer/order";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getAllRestaurantsAction,
  getPreviousOrderRestaurantsAction,
} from "@/app/actions/public/restaurants";
import { getCuisineTypesAction } from "@/app/actions/public/cuisines";
import { getPublicDealsAction } from "@/app/actions/public/deals";
import {
  RestaurantProps,
  PublicDeal,
} from "@/components/modules/discovery/discovery.types";

export function useRestaurantDiscovery() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setCLC } = useCLC();

  // Core Data States
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [cuisineTypes, setCuisineTypes] = useState<any[]>([]);
  const [isCuisinesLoading, setIsCuisinesLoading] = useState(true);
  const [deals, setDeals] = useState<PublicDeal[]>([]);
  const [isDealsLoading, setIsDealsLoading] = useState(true);
  const [previousOrders, setPreviousOrders] = useState<RestaurantProps[]>([]);
  const [isPreviousOrdersLoading, setIsPreviousOrdersLoading] = useState(true);

  // User & Order States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>(null);

  // UI-only state (not in URL)
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination states for infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // ── Filter values derived from URL (single source of truth) ──
  const selectedSort = searchParams.get("sort") || "recommended";
  const activeFilters = searchParams.get("cuisineType")?.split(",").filter(Boolean) ?? [];
  const selectedRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
  const discounted = searchParams.get("discounted") === "true";
  const isWishlist = searchParams.get("isWishlist") === "true";

  // Build filter params from URL
  const buildFilterParams = useCallback(() => {
    const p: any = {};
    const urlQuery = searchParams.get("query");
    const urlSort = searchParams.get("sort");
    const urlCuisines = searchParams.get("cuisineType")?.split(",").filter(Boolean);
    const urlMinRating = searchParams.get("minRating");
    const urlDiscounted = searchParams.get("discounted");
    const urlIsWishlist = searchParams.get("isWishlist");

    if (urlQuery) p.query = urlQuery;
    if (urlCuisines?.length) p.cuisineType = urlCuisines;
    if (urlMinRating) p.minRating = Number(urlMinRating);
    if (urlDiscounted === "true") p.discounted = true;
    if (urlIsWishlist === "true") p.isWishlist = true;
    if (urlSort === "fastestDelivery") p.fastestDelivery = true;
    else if (urlSort === "nearestRestaurant") p.nearestRestaurant = true;
    else if (urlSort === "lowestPrice") p.lowestPrice = true;
    else if (urlSort === "highestPrice") p.highestPrice = true;
    return p;
  }, [searchParams]);

  const mapData = useCallback((data: any): RestaurantProps[] => {
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    return list.map((item: any) => ({
      id: item.id || "",
      slug: item.slug || item.id || "",
      name: item.name || "Unknown",
      image: item.profileImage || item.bannerImage,
      rating: item.averageRating || 0,
      totalRatings: item.totalRatings || 0,
      priceLevel: "$$",
      cuisine: Array.isArray(item.type) ? item.type.join(", ") : item.type || "General",
      deliveryTime: item.deliveryTime || "30-45 mins",
      deliveryFee:
        typeof item.deliveryFee === "object"
          ? item.deliveryFee?.deliveryCharge || 0
          : item.deliveryFee || 0,
      discount: undefined,
      isFavorite: false,
      isWishlist: !!item.isWishlist,
      averageDiscount: item.averageDiscount || 0,
      isOpen: item.isOpen ?? true,
    }));
  }, []);

  const extractMeta = useCallback(
    (res: any, itemCount: number = 0, defaultLimit: number = 10) => {
      const meta =
        res?.meta ||
        res?.data?.meta ||
        (res?.data && !Array.isArray(res.data) ? res.data.meta : null) ||
        res;

      const pageNum = Number(meta?.page || 1);
      const limitNum = Number(meta?.limit || defaultLimit);
      const totalCount =
        meta?.totalCount !== undefined && meta?.totalCount !== null
          ? Number(meta.totalCount)
          : null;
      const totalPages =
        meta?.totalPages !== undefined && meta?.totalPages !== null
          ? Number(meta.totalPages)
          : totalCount !== null
            ? Math.ceil(totalCount / limitNum)
            : null;

      let hasMorePages = false;
      if (totalPages !== null && !isNaN(totalPages)) {
        hasMorePages = pageNum < totalPages;
      } else {
        hasMorePages = itemCount >= limitNum;
      }

      return { page: pageNum, limit: limitNum, totalPages, hasMorePages };
    },
    [],
  );

  // ── URL param updater ──
  // Reads from window.location.search (not searchParams) so lat/lng synced
  // via window.history.replaceState() aren't lost when filters change.
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const base =
        typeof window !== "undefined" ? window.location.search : searchParams.toString();
      const p = new URLSearchParams(base);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") p.delete(key);
        else p.set(key, value);
      });
      router.replace(`${pathname}?${p.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // ── Filter handlers ──
  const setSelectedSort = (sort: string) => {
    updateParams({ sort: sort === "recommended" ? null : sort });
  };

  const handleFilter = (id: string) => {
    const updated = activeFilters.includes(id)
      ? activeFilters.filter((f) => f !== id)
      : [...activeFilters, id];
    updateParams({ cuisineType: updated.length > 0 ? updated.join(",") : null });
  };

  const handleRating = (rating: number) => {
    updateParams({ minRating: selectedRating === rating ? null : String(rating) });
  };

  const setDiscounted = (value: boolean) => {
    updateParams({ discounted: value ? "true" : null });
  };

  const setIsWishlist = (value: boolean) => {
    updateParams({ isWishlist: value ? "true" : null });
  };

  const resetFilters = () => {
    const p = new URLSearchParams(searchParams.toString());
    ["sort", "cuisineType", "minRating", "discounted", "isWishlist", "query"].forEach((k) =>
      p.delete(k),
    );
    router.replace(`${pathname}?${p.toString()}`);
  };

  // 1. Fetch CLC config
  useEffect(() => {
    let c = params?.country;
    if (Array.isArray(c)) c = c[0];
    if (!c) c = (getCookie("NEXT_COUNTRY") as string) || "US";

    let l = params?.language;
    if (Array.isArray(l)) l = l[0];
    if (!l) l = (getCookie("NEXT_LOCALE") as string) || "en";

    const cur = (getCookie("NEXT_CURRENCY") as string) || "$";
    setCLC({ country: c.toUpperCase(), currency: cur, language: l });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.country, params?.language]);

  // 2. Fetch Static Cuisines Array
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const res = await getCuisineTypesAction();
        if (res?.data) setCuisineTypes(res.data);
      } catch (error) {
        console.error("Failed to fetch cuisines:", error);
      } finally {
        setIsCuisinesLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  // 2b. Fetch Public Deals (shown above the Cuisines section)
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await getPublicDealsAction({ limit: 10 });
        if (res?.success && Array.isArray(res.data)) setDeals(res.data);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setIsDealsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // 3. Authenticate User Session & Fetch Rate-able Orders
  useEffect(() => {
    const fetchProfileAndOrder = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setIsLoggedIn(true);
        setUser(response.data);
        try {
          const orderRes = await getCurrentOrder(null);
          if (orderRes.success && orderRes.data) {
            const rawData = orderRes.data as any;
            const orderData = rawData.data ? rawData.data : rawData;
            const isDelivered = orderData.orderStatus?.toLowerCase() === "delivered";
            const noFeedback = String(orderData.hasFeedback) === "false";
            if (isDelivered && noFeedback) {
              setCurrentOrderInfo({
                rawOrder: orderData,
                orderNumber: `#${orderData.orderId?.substring(0, 8) || "Order"}`,
                restaurantName: orderData.restaurantName || "",
                items: (orderData.items || []).map((item: any) => ({
                  id: item.orderItemId,
                  originalId: null,
                  orderItemId: item.orderItemId || null,
                  name: item.name,
                  price: parseFloat(item.price),
                  quantity: item.quantity,
                  image: item.image || null,
                })),
                delivery: {
                  driverName: orderData.rider?.name || "Your Rider",
                  vehicle: orderData.rider?.vehicleType || "Delivery",
                  time: orderData.orderTime || "Just now",
                  driverImage: orderData.rider?.image || "",
                },
              });
              setIsRatingModalOpen(true);
            }
          }
        } catch (err) {
          console.error("Failed to fetch order for ratings:", err);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    fetchProfileAndOrder();
  }, []);

  // 4. Fetch Previous Order History if Logged In
  const { execute: fetchPreviousOrders } = useServerAction(
    getPreviousOrderRestaurantsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        const mapped = list.map((item: any) => ({
          id: item.id || "",
          slug: item.slug || item.id || "",
          name: item.name || "Unknown",
          image: item.profileImage || item.bannerImage,
          rating: item.averageRating || 0,
          totalRatings: item.totalRatings || 0,
          priceLevel: "$$",
          cuisine: Array.isArray(item.type) ? item.type.join(", ") : item.type || "General",
          deliveryTime: item.deliveryTime || "30-45 mins",
          deliveryFee:
            typeof item.deliveryFee === "object"
              ? item.deliveryFee?.deliveryCharge || 0
              : item.deliveryFee || 0,
          discount: undefined,
          isFavorite: false,
          isWishlist: !!item.isWishlist,
          averageDiscount: item.averageDiscount || 0,
          isOpen: item.isOpen ?? true,
        }));
        setPreviousOrders(mapped);
        setIsPreviousOrdersLoading(false);
      },
      onError: (err) => {
        console.error("Failed to fetch previous orders:", err);
        setIsPreviousOrdersLoading(false);
      },
    },
  );

  useEffect(() => {
    if (isLoggedIn) fetchPreviousOrders({});
    else setIsPreviousOrdersLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // 5. Fetch Restaurants — searchParams is the single trigger
  useEffect(() => {
    let mounted = true;

    const fetchOptimistically = async () => {
      setIsPending(true);
      setPage(1);
      setHasMore(true);

      try {
        const urlLat = searchParams.get("lat");
        const urlLng = searchParams.get("lng");
        const filterParams = buildFilterParams();

        let locationParams: { lat: number; lng: number } | null = null;

        if (urlLat && urlLng) {
          locationParams = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
        }

        if (!locationParams) {
          try {
            const cachedLoc = localStorage.getItem("userLocation");
            if (cachedLoc) {
              const parsed = JSON.parse(cachedLoc);
              if (Date.now() - parsed.timestamp < 300000) {
                locationParams = { lat: parsed.lat, lng: parsed.lng };
              }
            }
          } catch (e) {
            console.warn("Failed to parse cached location:", e);
          }
        }

        if (!locationParams && navigator.geolocation) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                maximumAge: 300000,
                timeout: 10000,
              });
            });
            locationParams = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            try {
              localStorage.setItem(
                "userLocation",
                JSON.stringify({ ...locationParams, timestamp: Date.now() }),
              );
            } catch (e) {
              console.warn("Could not cache location:", e);
            }
          } catch (err) {
            console.warn("Geolocation failed or denied:", err);
          }
        }

        // Sync lat/lng to URL if discovered via geolocation
        if (locationParams && mounted && (!urlLat || !urlLng)) {
          const p = new URLSearchParams(searchParams.toString());
          p.set("lat", String(locationParams.lat));
          p.set("lng", String(locationParams.lng));
          window.history.replaceState(null, "", `${pathname}?${p.toString()}`);
        }

        const queryParams = locationParams
          ? { ...locationParams, ...filterParams, page: 1, limit: 10 }
          : { ...filterParams, page: 1, limit: 10 };

        if (mounted) {
          const res = await getAllRestaurantsAction(queryParams);
          const mapped = mapData(res?.data);
          setRestaurants(mapped);
          const { hasMorePages } = extractMeta(res, mapped.length, 10);
          setHasMore(hasMorePages && mapped.length > 0);
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        if (mounted) setRestaurants([]);
      } finally {
        if (mounted) setIsPending(false);
      }
    };

    fetchOptimistically();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // string comparison — reliable even if object ref is reused

  // 6. Infinite Scroll Load More Action
  const loadMore = useCallback(async () => {
    if (isPending || isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    try {
      const urlLat = searchParams.get("lat");
      const urlLng = searchParams.get("lng");
      let locationParams: { lat: number; lng: number } | null = null;
      if (urlLat && urlLng) {
        locationParams = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
      } else {
        try {
          const cachedLoc = localStorage.getItem("userLocation");
          if (cachedLoc) {
            const parsed = JSON.parse(cachedLoc);
            locationParams = { lat: parsed.lat, lng: parsed.lng };
          }
        } catch {}
      }

      const filterParams = buildFilterParams();
      const queryParams = locationParams
        ? { ...locationParams, ...filterParams, page: nextPage, limit: 10 }
        : { ...filterParams, page: nextPage, limit: 10 };

      const res = await getAllRestaurantsAction(queryParams);
      const newItems = mapData(res?.data);
      const { hasMorePages } = extractMeta(res, newItems.length, 10);

      setRestaurants((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const uniqueNew = newItems.filter((r) => !existingIds.has(r.id));
        return [...prev, ...uniqueNew];
      });

      setPage(nextPage);
      setHasMore(hasMorePages && newItems.length > 0);
    } catch (error) {
      console.error("Failed to load more restaurants:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isPending, isFetchingMore, hasMore, page, searchParams, buildFilterParams, mapData]);

  return {
    state: {
      restaurants,
      isPending,
      cuisineTypes,
      isCuisinesLoading,
      deals,
      isDealsLoading,
      previousOrders,
      isPreviousOrdersLoading,
      isLoggedIn,
      user,
      isRatingModalOpen,
      currentOrderInfo,
      selectedSort,
      activeFilters,
      selectedRating,
      discounted,
      isWishlist,
      showAllCuisines,
      viewMode,
      hasMore,
      isFetchingMore,
    },
    actions: {
      setIsRatingModalOpen,
      setSelectedSort,
      handleFilter,
      handleRating,
      setDiscounted,
      setIsWishlist,
      setShowAllCuisines,
      setViewMode,
      resetFilters,
      loadMore,
    },
  };
}
