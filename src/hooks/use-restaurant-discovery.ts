import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
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
import { RestaurantProps } from "@/components/modules/discovery/DiscoveryRestaurantCard";

export function useRestaurantDiscovery() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { setCLC } = useCLC();

  // Core Data States
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [cuisineTypes, setCuisineTypes] = useState<any[]>([]);
  const [isCuisinesLoading, setIsCuisinesLoading] = useState(true);
  const [previousOrders, setPreviousOrders] = useState<RestaurantProps[]>([]);
  const [isPreviousOrdersLoading, setIsPreviousOrdersLoading] = useState(true);

  // User & Order States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>(null);

  // Filter & View States
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handlers
  const handleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handlePrice = (price: string) => {
    setSelectedPrice((prev) => (prev === price ? null : price));
  };

  // 1. Fetch CLC config
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

  // 2. Fetch Static Cuisines Array
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

  // 3. Authenticate User Session & Fetch Rate-able Orders
  useEffect(() => {
    const fetchProfileAndOrder = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setIsLoggedIn(true);
        setUser(response.data);

        // Fetch current order to check for rating popup
        try {
          const orderRes = await getCurrentOrder(null);
          if (orderRes.success && orderRes.data) {
            const rawData = orderRes.data as any;
            const orderData = rawData.data ? rawData.data : rawData;

            const isDelivered =
              orderData.orderStatus?.toLowerCase() === "delivered";
            const noFeedback = String(orderData.hasFeedback) === "false";

            if (isDelivered && noFeedback) {
              setCurrentOrderInfo({
                rawOrder: orderData,
                orderNumber: `#${orderData.orderId?.substring(0, 8) || "Order"}`,
                restaurantName: orderData.restaurantId,
                items: (orderData.items || []).map((item: any) => ({
                  id: item.orderItemId,
                  name: item.name,
                  price: parseFloat(item.price),
                  quantity: item.quantity,
                  image: item.image
                    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "")}/${item.image.replace(/^\/+/, "")}`
                    : null,
                })),
                delivery: {
                  driverName: "Your Rider",
                  vehicle: "Delivery",
                  time: orderData.orderTime || "Just now",
                  driverImage:
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200",
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
          cuisine: Array.isArray(item.type)
            ? item.type.join(", ")
            : item.type || "General",
          deliveryTime: item.deliveryTime || "30-45 mins",
          deliveryFee: 0,
          discount: undefined,
          isFavorite: false,
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
    if (isLoggedIn) {
      fetchPreviousOrders({});
    } else {
      setIsPreviousOrdersLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // 5. Advanced Geographic Orchestrator Fetching
  useEffect(() => {
    let mounted = true;

    const fetchOptimistically = async () => {
      setIsPending(true);

      const mapData = (data: any) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        return list.map((item: any) => ({
          id: item.id || "",
          slug: item.slug || item.id || "",
          name: item.name || "Unknown",
          image: item.profileImage || item.bannerImage,
          rating: item.averageRating || 0,
          totalRatings: item.totalRatings || 0,
          priceLevel: "$$",
          cuisine: Array.isArray(item.type)
            ? item.type.join(", ")
            : item.type || "General",
          deliveryTime: item.deliveryTime || "30-45 mins",
          deliveryFee: 0,
          discount: undefined,
          isFavorite: false,
        }));
      };

      try {
        let queryParams: {
          lat?: number;
          lng?: number;
          query?: string;
          type?: string;
          rating?: string;
          priceTier?: string;
        } | null = null;

        let urlLat = searchParams.get("lat");
        let urlLng = searchParams.get("lng");
        let urlQuery = searchParams.get("query");
        let urlType = searchParams.get("type");
        let urlRating = searchParams.get("rating");
        let urlPriceTier = searchParams.get("priceTier");

        // Prepare the base request with current filters
        const getFilterParams = () => {
          const p: any = {};
          if (urlQuery) p.query = urlQuery;
          if (activeFilters.length > 0) p.type = activeFilters.join(",");
          if (selectedSort === "highest") p.rating = "high";
          if (selectedPrice) {
            if (selectedPrice === "$") p.priceTier = "low";
            else if (selectedPrice === "$$") p.priceTier = "mid";
            else if (selectedPrice === "$$$") p.priceTier = "high";
          }
          return p;
        };

        const currentFilters = getFilterParams();
        const allRestaurantsReq = getAllRestaurantsAction(currentFilters);

        if (urlLat && urlLng) {
          queryParams = {
            lat: parseFloat(urlLat),
            lng: parseFloat(urlLng),
            ...currentFilters,
          };
        }

        if (!queryParams) {
          try {
            const cachedLoc = localStorage.getItem("userLocation");
            if (cachedLoc) {
              const parsed = JSON.parse(cachedLoc);
              if (Date.now() - parsed.timestamp < 300000) {
                queryParams = { lat: parsed.lat, lng: parsed.lng };
              }
            }
          } catch (e) {
            console.warn("Failed to parse cached location:", e);
          }
        }

        if (!queryParams && navigator.geolocation) {
          try {
            const pos = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: false,
                  maximumAge: 300000,
                  timeout: 10000,
                });
              },
            );
            queryParams = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            try {
              localStorage.setItem(
                "userLocation",
                JSON.stringify({ ...queryParams, timestamp: Date.now() }),
              );
            } catch (e) {
              console.warn("Could not cache location:", e);
            }
          } catch (err) {
            console.warn("Geolocation failed or denied:", err);
          }
        }

        if (queryParams && urlQuery) {
          queryParams.query = urlQuery;
        }

        if (queryParams && mounted) {
          if (
            urlLat !== String(queryParams.lat) ||
            urlLng !== String(queryParams.lng)
          ) {
            const params = new URLSearchParams();
            if (queryParams.lat) params.set("lat", String(queryParams.lat));
            if (queryParams.lng) params.set("lng", String(queryParams.lng));
            if (urlQuery) params.set("query", urlQuery);
            if (queryParams.type) params.set("type", queryParams.type);
            if (queryParams.rating) params.set("rating", queryParams.rating);
            if (queryParams.priceTier)
              params.set("priceTier", queryParams.priceTier);

            window.history.replaceState(null, "", `?${params.toString()}`);
          }

          const resNearby = await getAllRestaurantsAction(queryParams);
          const mappedNearby = mapData(resNearby?.data);

          if (mappedNearby.length > 0) {
            setRestaurants(mappedNearby);
          } else {
            const resAll = await allRestaurantsReq;
            setRestaurants(mapData(resAll?.data));
          }
        } else if (mounted) {
          const resAll = await allRestaurantsReq;
          setRestaurants(mapData(resAll?.data));
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        if (mounted) {
          setRestaurants([]);
        }
      } finally {
        if (mounted) {
          setIsPending(false);
        }
      }
    };

    fetchOptimistically();

    return () => {
      mounted = false;
    };
  }, [searchParams, activeFilters, selectedPrice, selectedSort]);

  return {
    state: {
      restaurants,
      isPending,
      cuisineTypes,
      isCuisinesLoading,
      previousOrders,
      isPreviousOrdersLoading,
      isLoggedIn,
      user,
      isRatingModalOpen,
      currentOrderInfo,
      selectedSort,
      activeFilters,
      selectedPrice,
      showAllCuisines,
      viewMode,
    },
    actions: {
      setIsRatingModalOpen,
      setSelectedSort,
      handleFilter,
      handlePrice,
      setShowAllCuisines,
      setViewMode,
    },
  };
}
