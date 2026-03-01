"use client";
import { Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id?: string;
  cartId?: string;
  name: string;
  price: number;
  basePrice?: number;
  quantity: number;
  restaurantName?: string;
  selectedVariations?: { name: string }[];
}

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  cartItems: CartItem[];
  onPlaceOrder?: () => void;
  isPlacingOrder?: boolean;
}

const OrderSummary = ({
  subtotal,
  deliveryFee,
  tax,
  total,
  cartItems,
  onPlaceOrder,
  isPlacingOrder = false,
}: OrderSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Delivery Time Estimate */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#346853]">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Est. Delivery Time
          </p>
          <p className="font-bold text-gray-900">25 - 35 mins</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-1">Your items</h3>
        <p className="text-sm text-gray-500 mb-6">
          From: {cartItems[0]?.restaurantName || "Restaurant"}
        </p>

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.cartId || item.id}
              className="flex justify-between items-start text-sm"
            >
              <div className="flex gap-2">
                <span className="font-bold text-[#346853]">
                  {item.quantity}x
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.selectedVariations &&
                    item.selectedVariations.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {item.selectedVariations.map((v) => v.name).join(", ")}
                      </p>
                    )}
                </div>
              </div>
              <span className="font-medium text-gray-900">
                ${((item.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 mb-6">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl text-[#346853]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Promo Code */}
        <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-2 px-2 text-gray-400">
            <Tag size={18} />
          </div>
          <input
            type="text"
            placeholder="Promo code"
            className="bg-transparent border-none text-sm outline-none w-full"
          />
          <button className="text-xs font-bold text-[#346853] px-3 hover:underline">
            APPLY
          </button>
        </div>

        <Button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className="w-full h-12 bg-[#346853] hover:bg-[#2a5443] text-white font-bold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>

        <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
          By placing your order, you agree to JayakHub's{" "}
          <span className="underline cursor-pointer">Terms & Conditions</span>.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
