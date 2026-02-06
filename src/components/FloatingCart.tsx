"use client";

import React from "react";
import { ShoppingBasket, ChevronRight } from "lucide-react";
import { useCLC } from "@/app/context/CLCContext";

interface FloatingCartProps {
  itemCount: number;
  totalPrice: number;
  restaurantName: string;
  onClick: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({
  itemCount,
  totalPrice,
  restaurantName,
  onClick,
}) => {
  const { currency } = useCLC();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 md:px-0 z-50 flex justify-center pointer-events-none">
      <button
        onClick={onClick}
        className="pointer-events-auto bg-[#346853] text-white w-full max-w-xl rounded-xl shadow-2xl p-3 flex items-center justify-between hover:bg-[#2c5846] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ShoppingBasket size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm leading-tight">View your cart</p>
            <p className="text-[10px] text-white/80 uppercase tracking-wide font-medium mt-0.5">
              {itemCount} ITEMS • {restaurantName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-base">
            {currency} {totalPrice.toFixed(2)}
          </span>
          <ChevronRight size={18} className="text-white/80" />
        </div>
      </button>
    </div>
  );
};

export default FloatingCart;
