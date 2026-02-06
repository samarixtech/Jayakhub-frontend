"use client";

import React from "react";
import {
  Check,
  Utensils,
  Bike,
  MapPin,
  Star,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/restaurants/Header";

const ORDER_DATA = {
  id: "JKH-88291",
  placedAt: "12:15 PM",
  status: "Preparing",
  rider: {
    name: "Arjun K.",
    vehicle: "Honda Vario • B 1234 JKH",
    rating: 4.9,
    image: "/images/avatars/rider.png",
  },
  items: [
    {
      name: "Classic Cheeseburger",
      quantity: 2,
      price: 24.0,
      details: "No pickles, extra cheese",
    },
    { name: "Large Truffle Fries", quantity: 1, price: 6.5, details: "" },
  ],
  subtotal: 30.5,
  deliveryFee: 0,
  total: 30.5,
  address: {
    name: "Grand Indonesia East Mall",
    details: "Level 3, Shop 10-12, Jl. M.H. Thamrin No.1, Jakarta Pusat, 10310",
  },
  payment: {
    method: "Visa",
    last4: "4421",
  },
};

const TimelineItem = ({
  icon: Icon,
  title,
  description,
  time,
  status,
  isLast = false,
}: any) => {
  const isActive = status === "completed" || status === "active";
  const isCompleted = status === "completed";

  return (
    <div className="flex gap-4 relative">
      {/* Line connecting items */}
      {!isLast && (
        <div
          className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${isCompleted ? "bg-[#346853]" : "bg-gray-200"}`}
        />
      )}

      {/* Icon Circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
          isActive ? "bg-[#346853] text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="pb-8">
        <h3
          className={`font-bold text-lg ${isActive ? "text-gray-900" : "text-gray-400"}`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>
        {time && (
          <p
            className={`text-xs font-bold mt-2 ${isActive ? "text-[#346853]" : "text-gray-400"}`}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
};

export default function OrderTrackingView() {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { getCurrentOrder } =
          await import("@/app/actions/customer/order");
        const res = await getCurrentOrder();
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } catch (error) {
        console.error("Failed to load order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Live Order Tracking
            </h1>
            <p className="text-gray-500">
              Order #{order.orderId} • Place at {order.orderTime}
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#346853] hover:bg-[#2a5443] text-white font-bold h-10 px-6 rounded-lg">
              Contact Support
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold h-10 px-6 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Map & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-blue-50 rounded-2xl border border-gray-100 overflow-hidden relative">
              {/* Mock Map Background - Using a simple pattern or color to mimic map */}
              <div
                className="absolute inset-0 bg-[#E5F0F8] opacity-100"
                style={{
                  backgroundImage:
                    "radial-gradient(#C6DAE8 2px, transparent 2px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>

              {/* Mock Map Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-[#346853] rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                  <Bike className="text-white" />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm hover:bg-gray-100"
                >
                  <Plus size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm hover:bg-gray-100"
                >
                  <Minus size={16} />
                </Button>
              </div>

              <p className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-xs font-bold text-gray-600 rounded-md shadow-sm">
                Map View (Mock)
              </p>
            </div>

            {/* Order Journey Timeline */}
            <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8">
                Order Journey
              </h2>

              <div className="pl-2">
                <TimelineItem
                  icon={Check}
                  title="Order Confirmed"
                  description="We've received your order and the restaurant is starting soon."
                  time={order.orderTime}
                  status={
                    order.status === "pending" || order.status === "confirmed"
                      ? "completed"
                      : "completed"
                  }
                />
                <TimelineItem
                  icon={Utensils}
                  title="Preparing your food"
                  description="The chef is working their magic! Your order is being packed."
                  status={order.status === "preparing" ? "active" : "pending"}
                />
                <TimelineItem
                  icon={Bike}
                  title="On the way"
                  description="Hang tight! Your rider will be heading to you soon."
                  status={order.status === "on_the_way" ? "active" : "pending"}
                />
                <TimelineItem
                  icon={MapPin}
                  title="Delivered"
                  description="Enjoy your meal! Don't forget to rate the restaurant."
                  status={
                    order.status === "delivered" ? "completed" : "pending"
                  }
                  isLast={true}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Rider Card - Conditionally show or use Placeholder if API doesn't have it yet */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Your Rider
                </h3>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-900">4.9</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-[#346853]">R</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    Searching...
                  </h4>
                  <p className="text-sm text-gray-500">Assigning a rider</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Utensils className="w-4 h-4 text-[#346853]" />
                <h3 className="font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                {order.items &&
                  order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <span className="font-bold text-gray-900">
                            {item.quantity}x
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#346853] text-sm font-medium">
                  <span>Delivery Fee</span>
                  <span>FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#346853]" />
                <h3 className="font-bold text-gray-900">Delivery Address</h3>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  {order.userName}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order.fullAddress}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center gap-4">
              <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-[#346853]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Paid via{" "}
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                </p>
                <p className="text-xs text-gray-500">{order.orderDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
