"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Bike, MapPin } from "lucide-react";
import { RootState } from "@/redux/store/store";
import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useRouter } from "next/navigation";
import Header from "../../components/restaurants/Header";

const Checkout: React.FC = () => {
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.items);
  const restaurantInfo = {
    name: "Subway - F8",
    deliveryFee: 100,
    deliveryTime: "10-25 mins",
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + restaurantInfo.deliveryFee + tax;

  const hasItems = cart.length > 0;
  const handleGoShopping = () => {
    router.back();
  };

  if (!hasItems) {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your Cart is Empty 🥺
        </h1>
        <p className="text-gray-600">
          Please add items before proceeding to checkout.
        </p>
        <button
          onClick={handleGoShopping}
          className="mt-6 px-6 py-3 bg-[#0B5D4E] text-[#E8F4F1] rounded-lg hover:bg-[#0B5D4E] transition"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-44 pb-12">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Review Payment and Address 💳
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: ADDRESS & PAYMENT (Steps) */}
          <div className="lg:w-7/12 space-y-8">
            {/* 1. DELIVERY/PICKUP TABS */}
            <div className="bg-[#E8F4F1] p-4 rounded-xl shadow-md border border-[#FFF9EE]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Choose Option
              </h2>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 bg-[#0B5D4E] text-[#E8F4F1] px-4 py-2 rounded-lg shadow-lg">
                  <Bike size={20} />
                  <span className="font-semibold">Delivery</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-700 bg-[#FFF9EE] px-4 py-2 rounded-lg hover:bg-[#FFF9EE] transition">
                  <MapPin size={20} />
                  <span className="font-semibold">Pick-up</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Delivery time: {restaurantInfo.deliveryTime}
              </p>
            </div>

            {/* 2. ADDRESS SECTION */}
            <CheckoutAddress />

            {/* 3. PAYMENT SECTION */}
            <CheckoutPayment />
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & PLACE ORDER */}
          <div className="lg:w-5/12 sticky top-24 self-start">
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={restaurantInfo.deliveryFee}
              tax={tax}
              total={total}
              cartItems={cart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
