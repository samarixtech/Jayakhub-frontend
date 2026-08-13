"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { addToCart } from "@/redux/slices/cartSlice";
import { setSelectedRestaurantMeta } from "@/redux/slices/discoverySlice";
import { useCLC } from "@/context/CLCContext";
import { getCookie } from "cookies-next";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getRestaurantBySlugAction,
  getRestaurantReviewsAction,
} from "@/app/actions/public/restaurants";

import {
  RestaurantDetails,
  APIMnuItem,
} from "@/components/modules/discovery/discovery.types";

export function useRestaurantDetails() {
  const params = useParams();
  const slugParam = params?.slug as string;

  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);
  const selectedRestaurantMeta = useSelector((state: RootState) => state.discovery.selectedRestaurantMeta);

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<APIMnuItem[]>([]);
  const [rawDeals, setRawDeals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const { setCLC, country, currency, language } = useCLC();

  const { execute: fetchRestaurant, isPending } = useServerAction(
    getRestaurantBySlugAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        if (data) {
          setRestaurant(data.restaurant);
          const fetchedDeals = data.deals || [];
          setRawDeals(fetchedDeals);

          const baseCategories = data.categories || [];
          const hasDeals = fetchedDeals.length > 0;
          const finalCategories = hasDeals
            ? ["Deals", ...baseCategories.filter((c: string) => c !== "Deals")]
            : baseCategories.filter((c: string) => c !== "Deals");

          setCategories(finalCategories);
          setMenuItems(data.menu || []);

          if (data.ratingSummary) {
            setReviewsData({
              ...data.ratingSummary,
              totalAverageRating: data.ratingSummary.averageRating,
              totalRatingCount: data.ratingSummary.totalReviews,
            });
          }

          if (finalCategories.length > 0) {
            setActiveTab(finalCategories[0]);
          }
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Failed to fetch restaurant details:", err);
        setIsLoading(false);
      },
    },
  );

  const fetchReviewsWithFilter = async (filter?: string) => {
    if (!slugParam) return;
    setReviewsLoading(true);
    try {
      const res = await getRestaurantReviewsAction(slugParam, filter);
      if (res.success && res.data) {
        setReviewsData({
          ...res.data,
          totalAverageRating: res.data.averageRating ?? res.data.totalAverageRating,
          totalRatingCount: res.data.totalReviews ?? res.data.totalRatingCount,
        });
      }
    } catch (err) {
      console.error("Failed to fetch reviews data:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedRestaurantMeta) {
      try {
        const saved = localStorage.getItem("selectedRestaurantMeta");
        if (saved) {
          dispatch(setSelectedRestaurantMeta(JSON.parse(saved)));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    let c = Array.isArray(params?.country)
      ? params.country[0]
      : params?.country || (getCookie("NEXT_COUNTRY") as string) || "US";
    let l = Array.isArray(params?.language)
      ? params.language[0]
      : params?.language || (getCookie("NEXT_LOCALE") as string) || "en";
    const cur = (getCookie("NEXT_CURRENCY") as string) || "$";

    setCLC({ country: c.toUpperCase(), currency: cur, language: l });

    if (slugParam) {

      fetchRestaurant(slugParam);
      // Removed automatic fetchReviewsWithFilter on mount as reviews are now supplied by fetchRestaurant.
    } else {

      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam, params?.country, params?.language]);

  const handleAddToCart = (item: APIMnuItem) => {
    const discountAmount = item.discount ? parseFloat(item.discount) : 0;
    const isDiscounted = discountAmount > 0;
    const finalPrice = isDiscounted
      ? Math.max(0, item.basePrice - discountAmount)
      : item.basePrice;

    const cartItem: any = {
      id: item.id,
      productId: item.id,
      name: item.name,
      price: finalPrice,
      originalPrice: item.basePrice,
      discount: item.discount,
      imageUrl: item.image || "",
      description: item.description,
      quantity: 1,
      restaurantName: restaurant?.name,
      restaurantId: restaurant?.id,
      restaurantImage: restaurant?.profileImage,
      isDeal: item.isDeal,
      dealItems: item.dealItems,
      dealData: item.dealData,
    };
    dispatch(addToCart(cartItem));
  };

  const handleAddToCartFromModal = (item: any) => {
    const discountAmount = item.discount ? parseFloat(item.discount) : 0;
    const isDiscounted = discountAmount > 0;

    const finalPrice = isDiscounted
      ? Math.max(0, item.price - discountAmount)
      : item.price;

    dispatch(
      addToCart({
        ...item,
        price: finalPrice,
        originalPrice: item.price,
        restaurantName: restaurant?.name,
        restaurantId: restaurant?.id,
        restaurantImage: restaurant?.profileImage,
        isDeal: item.isDeal,
        dealItems: item.dealItems,
        dealData: item.dealData,
      }),
    );
    setSelectedItem(null);
  };

  const menuByCategories = useMemo(() => {
    const grouped: Record<string, APIMnuItem[]> = {};

    if (rawDeals && rawDeals.length > 0) {
      const dealItems: APIMnuItem[] = rawDeals.map((deal: any) => {
        const extractedItems = (deal.items || []).map((di: any) => ({
          id: di.itemId || di.id,
          name: di.item?.name || di.name || "Item",
          image: di.item?.image || di.image || "",
          basePrice: Number(di.item?.basePrice || di.basePrice || 0),
        }));

        const itemImagesList = extractedItems
          .map((i: any) => i.image)
          .filter((img: string) => Boolean(img));

        const apiOrig = Number(deal.originalAmount || 0);
        const apiFinal = Number(deal.finalAmount || 0);
        const apiDiscAmt = Number(deal.discountAmount || 0);

        const itemsOrig = extractedItems.reduce((sum: number, i: any) => sum + i.basePrice, 0);

        const origPrice = apiOrig > 0 ? apiOrig : itemsOrig;

        const discVal = Number(deal.discountValue || 0);
        const discType =
          deal.discountType === "percentage" ? "percentage" : "fixed";

        let discountAmount = apiDiscAmt > 0 ? apiDiscAmt : 0;
        if (discountAmount <= 0) {
          discountAmount =
            discType === "fixed"
              ? discVal
              : origPrice > 0
                ? (origPrice * discVal) / 100
                : 0;
        }

        let finalPrice = apiFinal > 0 ? apiFinal : Math.max(0, origPrice - discountAmount);
        if (finalPrice <= 0 && origPrice > 0 && discountAmount > 0) {
          finalPrice = Math.max(0, origPrice - discountAmount);
        }

        const mainImage = deal.image || itemImagesList[0] || "";

        return {
          id: deal.id,
          restaurantId: deal.restaurantId,
          name: deal.title,
          description:
            deal.description ||
            extractedItems
              .map((i: any) => i.name)
              .join(" + "),
          basePrice: origPrice > 0 ? origPrice : finalPrice,
          discount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
          dietaryType: "NON_VEG",
          image: mainImage,
          variations: [],
          category: "Deals",
          categoryData: "Deals",
          isAvailable: deal.isActive !== false,
          isDeal: true,
          badge: deal.badge,
          dealItems: extractedItems,
          itemImages: itemImagesList,
          dealData: deal,
        };
      });

      grouped["Deals"] = dealItems;
    }

    categories.forEach((cat) => {
      if (cat !== "Deals") {
        grouped[cat] = menuItems.filter(
          (item) => (item as any).categoryData === cat || item.category === cat,
        );
      }
    });

    return grouped;
  }, [categories, menuItems, rawDeals]);

  const allSearchableItems = useMemo(() => {
    const dealsItems = menuByCategories["Deals"] || [];
    return [...dealsItems, ...menuItems];
  }, [menuByCategories, menuItems]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return null;
    return allSearchableItems.filter(
      (i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allSearchableItems, searchTerm]);

  const scrollToCategory = (category: string) => {
    setActiveTab(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const restaurantCart = useMemo(() => {
    if (!restaurant?.id) return [];
    return cart.filter((item) => item.restaurantId === restaurant.id);
  }, [cart, restaurant?.id]);

  const totalCartPrice = restaurantCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const bannerUrl = restaurant?.bannerImage || "/pizza-palace.jpg";

  const profileUrl = restaurant?.profileImage || "/pizza-palace.jpg";

  const apiDeliveryFee = useMemo(() => {
    if (!restaurant) return undefined;
    const fee =
      (restaurant as any).deliveryFee ?? (restaurant as any).deliveryCharge;
    if (typeof fee === "number") return fee;
    if (fee && typeof fee === "object" && "deliveryCharge" in fee)
      return Number(fee.deliveryCharge) || 0;
    return undefined;
  }, [restaurant]);

  const deliveryFee = selectedRestaurantMeta?.deliveryFee ?? apiDeliveryFee;
  const distance = selectedRestaurantMeta?.distance;

  return {
    state: {
      restaurant,
      categories,
      menuItems,
      deals: rawDeals,
      activeTab,
      searchTerm,
      selectedItem,
      isLoading,
      isPending,
      isCartOpen,
      isReviewsModalOpen,
      reviewsData,
      reviewsLoading,
      cart: restaurantCart,
      country,
      currency,
      language,
      menuByCategories,
      filteredItems,
      totalCartPrice,
      bannerUrl,
      profileUrl,
      deliveryFee,
      distance,
    },
    actions: {
      setSearchTerm,
      setSelectedItem,
      setIsCartOpen,
      setIsReviewsModalOpen,
      fetchReviewsWithFilter,
      handleAddToCart,
      scrollToCategory,
      handleAddToCartFromModal,
    },
  };
}
