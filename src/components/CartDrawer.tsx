"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, clearCart } from "@/redux/slices/cartSlice";

import { X, Plus, Minus, ShoppingBag, Info, Trash2 } from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useCLC } from "@/app/context/CLCContext";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { currency, country, language } = useCLC();
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Mock data for display purposes
  const restaurantName = "JayakHub Selections";
  const deliveryFee = 10;
  const taxAmount = 0;

  const hasItems = cart.length > 0;

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    // if (quantity < 1) return; // Allow 0 to delete
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    router.push(
      `/${country.toLocaleLowerCase()}/${language.toLocaleLowerCase()}/checkout`,
    );
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* DRAWER PANEL */}
      <div
        className={`fixed top-0 right-0 w-full max-w-[400px] h-full bg-white z-[9999] shadow-2xl
        transition-transform duration-300 transform flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#346853]" />
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{restaurantName}</p>
            {hasItems && (
              <button
                onClick={handleClearCart}
                className="text-sm font-semibold text-[#346853] hover:text-[#2a5443] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          {hasItems ? (
            <div className="space-y-8">
              {/* ITEMS LIST */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Items in Cart</h3>
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          width={250}
                          height={250}
                          src={item.imageUrl || "/images/placeholder-thumb.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1 pr-2">
                              {item.name}
                            </h4>
                          </div>

                          {item.selectedVariations &&
                            item.selectedVariations.length > 0 && (
                              <p className="text-xs text-gray-500 mb-1">
                                {item.selectedVariations
                                  .map((v) => v.name)
                                  .join(", ")}
                              </p>
                            )}
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {/* Fallback description if needed, or remove if cluttered */}
                            {!item.selectedVariations?.length &&
                              item.description}
                          </p>
                        </div>
                        <p className="font-bold text-[#346853] text-sm">
                          {currency} {item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 self-center">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartId || item.id,
                              item.quantity - 1,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-4 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartId || item.id,
                              item.quantity + 1,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#346853] text-white hover:bg-[#2a5443] transition-colors shadow-sm shadow-[#346853]/20"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]"
                />
                <button className="px-6 py-3 bg-[#E8F5E9] text-[#346853] font-bold text-sm rounded-xl hover:bg-[#d6ede7] transition-colors">
                  Apply
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  Your cart is empty
                </p>
                <p className="text-sm mt-1 max-w-[200px] mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#346853] text-white text-sm font-bold rounded-lg hover:bg-[#2a5443] transition-colors"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {hasItems && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-6">
            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <div className="flex items-center gap-1">
                  <span>Delivery Fee</span>
                  <Info size={12} className="text-gray-400" />
                </div>
                <span className="font-medium text-[#346853]">
                  {currency} {deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 flex justify-between items-center border-t border-gray-50 mt-3">
                <span className="font-bold text-base text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  {currency} {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#346853] text-white py-4 px-6 rounded-xl font-bold flex justify-between items-center hover:bg-[#2a5443] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#346853]/20"
            >
              <span>Go to Checkout</span>
              <span>
                {currency} {total.toFixed(2)}
              </span>
            </button>

            <p className="text-center text-[10px] text-gray-400">
              Prices include VAT where applicable
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
