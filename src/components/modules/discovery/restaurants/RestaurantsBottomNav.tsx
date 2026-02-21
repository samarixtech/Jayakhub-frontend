"use client";

import React from "react";
import Link from "next/link";
import { Home, SlidersHorizontal, ShoppingBag, User } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RestaurantsBottomNavProps {
  onFilterClick: () => void;
  onCartClick: () => void;
  isLoggedIn: boolean;
  user: any;
  showFilter?: boolean;
  country: string;
  language: string;
}

const RestaurantsBottomNav: React.FC<RestaurantsBottomNavProps> = ({
  onFilterClick,
  onCartClick,
  isLoggedIn,
  user,
  showFilter = true,
  country: propCountry,
  language: propLanguage,
}) => {
  const pathname = usePathname();
  const params = useParams();

  // Use URL params first to avoid middleware casing redirects
  const country = (params?.country as string) || propCountry || "pk";
  const language = (params?.language as string) || propLanguage || "en";

  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const isActive = (path: string) =>
    pathname === `/${country}/${language}${path}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 md:hidden pb-safe">
      {/* Home */}
      <Link
        href={`/${country}/${language}/restaurants`}
        className="flex flex-col items-center gap-1"
      >
        <Home
          className={`w-6 h-6 ${
            isActive("/restaurants") ? "text-[#346853]" : "text-gray-400"
          }`}
        />
        <span
          className={`text-[10px] font-medium ${
            isActive("/restaurants") ? "text-[#346853]" : "text-gray-500"
          }`}
        >
          Home
        </span>
      </Link>

      {/* Filter */}
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="flex flex-col items-center gap-1"
        >
          <SlidersHorizontal className="w-6 h-6 text-gray-400" />
          <span className="text-[10px] font-medium text-gray-500">Filters</span>
        </button>
      )}

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="flex flex-col items-center gap-1 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6 text-gray-400" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[9px] rounded-full bg-red-500 text-white border-2 border-white">
              {totalItems > 9 ? "9+" : totalItems}
            </Badge>
          )}
        </div>
        <span className="text-[10px] font-medium text-gray-500">Cart</span>
      </button>

      {/* Profile */}
      <Link
        href={`/${country}/${language}/customer/dashboard`}
        className="flex flex-col items-center gap-1"
      >
        {isLoggedIn && user ? (
          <Avatar className="h-6 w-6 border border-gray-200 transaction-transform hover:scale-105">
            <AvatarImage
              src={user?.avatar || user?.image}
              alt={user?.name || "User"}
            />
            <AvatarFallback className="bg-[#346853] text-white text-[9px] font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User
            className={`w-6 h-6 ${
              isActive("/customer/dashboard")
                ? "text-[#346853]"
                : "text-gray-400"
            }`}
          />
        )}
        <span
          className={`text-[10px] font-medium ${
            isActive("/customer/dashboard") ? "text-[#346853]" : "text-gray-500"
          }`}
        >
          Profile
        </span>
      </Link>
    </div>
  );
};

export default RestaurantsBottomNav;
