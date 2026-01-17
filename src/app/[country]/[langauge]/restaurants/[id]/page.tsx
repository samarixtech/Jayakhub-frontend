"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { addToCart } from "@/redux/slices/cartSlice";

import { MenuItem, CartItem, SimilarRestaurant } from "@/types/menu";
import MenuItemCard from "@/components/MenuItemCard";
import CartSidebar from "@/components/CartSidebar";
import HorizontalScroller from "@/components/HorizontalScroller";
import ProductModal from "@/components/ProductModal";
import SimilarRestaurantsSection from "@/components/SimilarRestaurant";
import Header from "../../../../../components/restaurants/Header";

import { Search, Plus, Clock, ShoppingBag } from "lucide-react";
import { useCLC } from "@/app/context/CLCContext.tsx";
import { getCookie } from "cookies-next";

const mockSimilarRestaurants: SimilarRestaurant[] = [
  {
    id: "H1",
    name: "Hardee's - Centaurus",
    rating: 4.8,
    ratingCount: 3000,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Fast Food", "Burgers"],
    imageUrl:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
    promoText: "20% off Rs. 199",
  },
  {
    id: "Q1",
    name: "Quattro Uno",
    rating: 4.5,
    ratingCount: 1100,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Pizza", "Italian", "Desserts"],
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format",
    promoText: "Free Delivery",
  },
  {
    id: "Q2",
    name: "Quattro Uno",
    rating: 4.5,
    ratingCount: 1100,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Pizza", "Italian", "Desserts"],
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format",
    promoText: "Free Delivery",
  },
  {
    id: "Q3",
    name: "Quattro Uno",
    rating: 4.5,
    ratingCount: 1100,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Pizza", "Italian", "Desserts"],
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format",
    promoText: "Free Delivery",
  },
  {
    id: "Q4",
    name: "Quattro Uno",
    rating: 4.5,
    ratingCount: 1100,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Pizza", "Italian", "Desserts"],
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format",
    promoText: "Free Delivery",
  },
  {
    id: "Q5",
    name: "Quattro Uno",
    rating: 4.5,
    ratingCount: 1100,
    deliveryTime: "45 min",
    deliveryFee: 189,
    cuisine: ["Pizza", "Italian", "Desserts"],
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format",
    promoText: "Free Delivery",
  },
];

// --- Tabs ---
const topMenuTabs = [
  "Popular (5)",
  "Signature Subs",
  "Cricket Deals",
  "Value Meals",
  "Wraps",
];

interface DynamicParams {
  slug: string;
  country: string;
  langauge: string;
  id: string;
  currency: any;
  [key: string]: string;
}
interface FoodCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
  onClick: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onAddItem, onClick }) => {
  const { currency } = useCLC();

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#E8F4F1] border border-[#FFF9EE] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm flex"
    >
      {/* Image */}
      <div className="relative w-28 h-28 overflow-hidden rounded-l-xl shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(item);
          }}
          className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-[#E8F4F1] rounded-full p-2 shadow-lg flex items-center justify-center transition-colors duration-200"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between grow">
        <h4 className="font-semibold text-gray-900 text-sm truncate">
          {item.name}
        </h4>
        <p className="text-gray-500 text-xs mt-1 line-clamp-3">
          {item.description}
        </p>
        <p className="text-green-600 font-bold mt-2 text-sm">
          {`${currency} ${item.price}`}
        </p>
      </div>
    </div>
  );
};

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [activeTab, setActiveTab] = useState("Popular (5)");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { setCLC, country, currency, language } = useCLC();
  const params = useParams();

  useEffect(() => {
    let c = Array.isArray(params?.country)
      ? params.country[0]
      : params?.country || (getCookie("NEXT_COUNTRY") as string) || "US";
    let l = Array.isArray(params?.language)
      ? params.language[0]
      : params?.language || (getCookie("NEXT_LOCALE") as string) || "en";
    const cur = (getCookie("NEXT_CURRENCY") as string) || "$";

    setCLC({ country: c.toUpperCase(), currency: cur, language: l });
  }, [params?.country, params?.language]);

  // --- Mock Menu Items ---
  const menuSections = [
    {
      title: "Popular (5)",
      items: [
        {
          id: "1",
          name: "Chicken Teriyaki Sub",
          description: "Juicy chicken with teriyaki glaze and fresh veggies.",
          price: 520,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
        {
          id: "2",
          name: "Veggie Delight",
          description: "Crisp veggies and sauces on a soft sub roll.",
          price: 430,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
        {
          id: "3",
          name: "Veggie Delight",
          description: "Crisp veggies and sauces on a soft sub roll.",
          price: 430,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
        {
          id: "4",
          name: "Veggie Delight",
          description: "Crisp veggies and sauces on a soft sub roll.",
          price: 430,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
        {
          id: "5",
          name: "Veggie Delight",
          description: "Crisp veggies and sauces on a soft sub roll.",
          price: 430,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
        {
          id: "6",
          name: "Veggie Delight",
          description: "Crisp veggies and sauces on a soft sub roll.",
          price: 430,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format",
        },
      ],
    },
  ];

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartItem = { ...item, quantity: 1, productId: item.id };
    dispatch(addToCart(cartItem));
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
    router.push("/checkout");
  };

  // --- Filter Items ---
  const filteredMenu = useMemo(() => {
    const cleanTab = activeTab.split("(")[0].trim();
    const section = menuSections.find((s) => s.title.startsWith(cleanTab));
    if (!section) return [];
    return section.items.filter(
      (i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeTab, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-40">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 hidden md:block">
          {country?.toUpperCase()} &gt; {language?.toUpperCase()} &gt;
          <span className="font-semibold text-gray-700">{id}</span>
        </div>

        {/* Restaurant Header */}
        <div className="flex items-start pb-4">
          <img
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format"
            alt="Subway Logo"
            className="w-24 h-24 rounded-full mr-4 object-cover ring-4 ring-green-100 shadow-md"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{id}</h1>
            <p className="text-base text-gray-600 mt-1">
              Sandwiches • Fast Food
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-3 space-x-6">
              <span className="text-green-600 font-semibold">★ 4.7 Rating</span>
              <span className="flex items-center">
                <ShoppingBag size={14} className="mr-1" /> {currency} 189
                delivery fee
              </span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" /> 30 Min
              </span>
            </div>
          </div>
        </div>

        <hr className="mb-6 border-[#FFF9EE]" />

        {/* Tabs */}
        <div className="sticky top-0 bg-[#E8F4F1] z-10 py-3 border-b border-[#FFF9EE] shadow-sm">
          <HorizontalScroller>
            {topMenuTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium rounded-xl transition duration-150 [#E8F4F1]space-nowrap ${
                  tab === activeTab
                    ? "bg-green-600 text-[#E8F4F1] shadow-md"
                    : "text-gray-700 hover:bg-[#FFF9EE]"
                }`}
              >
                {tab}
              </button>
            ))}
          </HorizontalScroller>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center space-x-2 bg-[#E8F4F1] rounded-xl p-2 border border-[#FFF9EE] shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu items..."
            className="w-full outline-none text-gray-700 placeholder-gray-400 px-2 py-2 rounded-lg"
          />
        </div>

        {/* Menu + Cart */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 mt-6">
          {/* Menu */}
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((item: any) => (
                <FoodCard
                  key={item.id}
                  item={{ ...item, currency }}
                  onAddItem={handleAddToCart}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>

          {/* Sticky Cart Sidebar */}
          <div className="lg:w-4/12 xl:w-3/12 mt-8 lg:mt-0">
            <div className="sticky top-20">
              <CartSidebar onCheckout={handleCheckout} />
            </div>
          </div>
        </div>

        {/* Similar Restaurants */}
        <div className="bg-[#E8F4F1] py-10 mt-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-4">
            <SimilarRestaurantsSection restaurants={mockSimilarRestaurants} />
          </div>
        </div>

        {/* Product Modal */}
        {selectedItem && (
          <ProductModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}
