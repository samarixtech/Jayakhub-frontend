"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { addToCart } from "@/redux/slices/cartSlice";
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

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<APIMnuItem[]>([]);
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
          setCategories(data.categories || []);
          setMenuItems(data.menu || []);
          
          if (data.ratingSummary) {
            setReviewsData({
              ...data.ratingSummary,
              totalAverageRating: data.ratingSummary.averageRating,
              totalRatingCount: data.ratingSummary.totalReviews,
            });
          }

          if (data.categories && data.categories.length > 0) {
            setActiveTab(data.categories[0]);
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
    let c = Array.isArray(params?.country)
      ? params.country[0]
      : params?.country || (getCookie("NEXT_COUNTRY") as string) || "US";
    let l = Array.isArray(params?.language)
      ? params.language[0]
      : params?.language || (getCookie("NEXT_LOCALE") as string) || "en";
    const cur = (getCookie("NEXT_CURRENCY") as string) || "$";

    setCLC({ country: c.toUpperCase(), currency: cur, language: l });

    if (slugParam) {
      console.log("Fetching restaurant with slug:", slugParam);
      fetchRestaurant(slugParam);
      // Removed automatic fetchReviewsWithFilter on mount as reviews are now supplied by fetchRestaurant.
    } else {
      console.log("No slug param found");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam, params?.country, params?.language]);

  const handleAddToCart = (item: APIMnuItem) => {
    const cartItem: any = {
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.basePrice,
      imageUrl: item.image
        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "")}/${item.image.replace(/^\/+/, "").replace(/\\/g, "/")}`
        : "",
      description: item.description,
      quantity: 1,
      restaurantName: restaurant?.name,
      restaurantId: restaurant?.id,
      restaurantImage: restaurant?.profileImage,
    };
    dispatch(addToCart(cartItem));
  };

  const handleAddToCartFromModal = (item: any) => {
    dispatch(
      addToCart({
        ...item,
        restaurantName: restaurant?.name,
        restaurantId: restaurant?.id,
        restaurantImage: restaurant?.profileImage,
      }),
    );
    setSelectedItem(null);
  };

  const menuByCategories = useMemo(() => {
    const grouped: Record<string, APIMnuItem[]> = {};
    categories.forEach((cat) => {
      grouped[cat] = menuItems.filter((item) => (item as any).categoryData === cat || item.category === cat);
    });
    return grouped;
  }, [categories, menuItems]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return null;
    return menuItems.filter(
      (i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [menuItems, searchTerm]);

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

  const bannerUrl = restaurant?.bannerImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${restaurant.bannerImage.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  const profileUrl = restaurant?.profileImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${restaurant.profileImage.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  return {
    state: {
      restaurant,
      categories,
      menuItems,
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
