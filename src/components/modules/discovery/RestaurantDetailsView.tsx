"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { addToCart } from "@/redux/slices/cartSlice";

import HorizontalScroller from "@/components/HorizontalScroller";
import ProductModal from "@/components/ProductModal";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import RestaurantSkeleton from "@/components/skeletons/RestaurantSkeleton";

import { Plus, Clock, Star, MapPin } from "lucide-react";
import { useCLC } from "@/app/context/CLCContext";
import { getCookie } from "cookies-next";
import { useServerAction } from "@/hooks/use-server-action";
import { getRestaurantBySlugAction } from "@/app/actions/public/restaurants";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface RestaurantDetails {
  id: string;
  slug: string;
  name: string;
  type: string[];
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  profileImage: string;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
}

interface APIMnuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  basePrice: number;
  dietaryType: string;
  image: string;
  variations: any[];
  category: string;
  isAvailable: boolean;
}

interface FoodCardProps {
  item: APIMnuItem;
  onAddItem: (item: APIMnuItem) => void;
  onClick: () => void;
  currency: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onAddItem,
  onClick,
  currency,
}) => {
  const imageUrl = item.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex h-32"
    >
      {/* Image */}
      <div className="relative w-32 h-32 shrink-0">
        <Image
          width={250}
          height={250}
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(item);
          }}
          className="absolute bottom-2 right-2 bg-[#346853] hover:bg-[#2c5846] text-white rounded-lg p-1.5 shadow-sm transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between grow relative">
        <div>
          <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-1">
            {item.name}
          </h4>
          <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-900 font-bold text-sm md:text-base">
            {currency} {item.basePrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function RestaurantDetailsView() {
  const router = useRouter();
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
    } else {
      console.log("No slug param found");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam, params?.country, params?.language]);

  const handleAddToCart = (item: APIMnuItem) => {
    // Map to cart item - simplifying for this demo
    const cartItem: any = {
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.basePrice,
      imageUrl: item.image
        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.image.replace(/\\/g, "/")}`
        : "",
      description: item.description,
      quantity: 1,
      restaurantName: restaurant?.name,
      restaurantId: restaurant?.id,
    };
    dispatch(addToCart(cartItem));
  };

  const menuByCategories = useMemo(() => {
    const grouped: Record<string, APIMnuItem[]> = {};
    categories.forEach((cat) => {
      grouped[cat] = menuItems.filter((item) => item.category === cat);
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

  const bannerUrl = restaurant?.bannerImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${restaurant.bannerImage.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  const profileUrl = restaurant?.profileImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${restaurant.profileImage.replace(/\\/g, "/")}`
    : "/pizza-palace.jpg";

  const totalCartPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (isLoading) {
    return <RestaurantSkeleton />;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="w-full relative">
        <div className="h-[250px] md:h-[350px] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
          <Image
            width={250}
            height={250}
            src={bannerUrl}
            alt={restaurant?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-24 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-md border-2 border-white shrink-0">
              <Image
                width={250}
                height={250}
                src={profileUrl}
                alt={restaurant?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {restaurant?.name}
                </h1>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 w-fit mx-auto md:mx-0">
                  FREE DELIVERY
                </Badge>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {restaurant?.type?.join(" • ")}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">4.5</span>
                  <span className="text-gray-400">(500+ reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>20-30 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>1.2 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-[80px] z-30 bg-white py-2 mb-6 border-b border-gray-100">
          <HorizontalScroller>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`py-2 px-4 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors duration-200 ${
                  activeTab === cat
                    ? "border-[#346853] text-[#346853]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </HorizontalScroller>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">
            {searchTerm ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Search Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems?.map((item: any) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      onAddItem={handleAddToCart}
                      onClick={() => setSelectedItem(item)}
                      currency={currency}
                    />
                  ))}
                </div>
              </div>
            ) : (
              categories.map(
                (category) =>
                  menuByCategories[category]?.length > 0 && (
                    <div
                      key={category}
                      id={`category-${category}`}
                      className="scroll-mt-40"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuByCategories[category].map((item) => (
                          <FoodCard
                            key={item.id}
                            item={item}
                            onAddItem={handleAddToCart}
                            onClick={() => setSelectedItem(item)}
                            currency={currency}
                          />
                        ))}
                      </div>
                    </div>
                  ),
              )
            )}
          </div>
        </div>
      </div>

      <FloatingCart
        itemCount={cart.length}
        totalPrice={totalCartPrice}
        restaurantName={restaurant?.name || ""}
        onClick={() => setIsCartOpen(true)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {selectedItem && (
        <ProductModal
          item={{
            ...selectedItem,
            productId: selectedItem.id,
            imageUrl: selectedItem.image
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${selectedItem.image.replace(/\\/g, "/")}`
              : "",
            price: selectedItem.basePrice,
          }}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item) => {
            dispatch(addToCart(item));
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
