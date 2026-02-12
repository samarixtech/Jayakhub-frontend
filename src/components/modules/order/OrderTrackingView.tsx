"use client";

import React, { use } from "react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getCurrentOrder } from "@/app/actions/customer/order";

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
          className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${
            isCompleted ? "bg-[#346853]" : "bg-gray-200"
          }`}
        />
      )}

      {/* Icon Circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
          isActive ? "bg-[#346853] text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="pb-8">
        <h3
          className={`font-bold text-lg ${
            isActive ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>
        {time && (
          <p
            className={`text-xs font-bold mt-2 ${
              isActive ? "text-[#346853]" : "text-gray-400"
            }`}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
};

export default function OrderTrackingView({ params }: { params: any }) {
  const unwrappedParams = params ? React.use(params as any) : {};
  const orderIdFromUrl = (unwrappedParams as any)?.id;

  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getCurrentOrder(orderIdFromUrl);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          console.error("Failed to load order:", response.message);
          setOrder(null);
        }
      } catch (error) {
        console.error("Error loading order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderIdFromUrl]);

  if (loading) {
    return <OrderTrackingSkeleton />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Order not found.
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0,
  );
  // Delivery Fee logic: if total > subtotal, diff is fee. Else 0.
  const total = Number(order.totalAmount);
  // Ideally delivery fee should be in data, but if subtotal > total (discount?), or subtotal < total (fee?)
  // Let's assume Free if close matches.
  const deliveryFee = total > subtotal ? total - subtotal : 0;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-gray-900">
                Track {order.orderId}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
            {/* Embedded Map */}
            <div className="w-full h-[300px] bg-blue-50 rounded-2xl border border-gray-100 overflow-hidden relative">
              <iframe
                title="Order Location"
                src={
                  order.address
                    ? `https://maps.google.com/maps?q=${order.address.latitude},${order.address.longitude}&z=15&output=embed`
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24097834749!2d106.829518!3d-6.175392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1652802379149!5m2!1sen!2sid"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Overlay controls (optional, distinct from map interaction) */}
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
                  status="completed"
                />
                <TimelineItem
                  icon={Utensils}
                  title="Preparing your food"
                  description="The chef is working their magic! Your order is being packed."
                  status={
                    order.status === "preparing" || order.status === "paid"
                      ? "active"
                      : "pending"
                  }
                  // Note: mocking status mapping. 'paid' -> preparing?
                  time="Expected 12:30 PM"
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
            {/* Rider Card */}
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
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden relative">
                  {/* Avatar Mock */}
                  <Image
                    src="https://avatar.vercel.sh/rider"
                    alt="Rider"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    Arjun K.
                  </h4>
                  <p className="text-sm text-gray-500">
                    Honda Vario • B 1234 JKH
                  </p>
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
                        <p className="text-xs text-gray-400 mt-0.5">
                          No pickles, extra cheese
                        </p>
                        {/* Static detail as per screenshot, or use item.description if available */}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#346853] text-sm font-medium">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "$10"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  ${total.toFixed(2)}
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
                  {order?.userName || "Grand Indonesia East Mall"}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order?.address?.fullAddress ||
                    "Level 3, Shop 10-12, Jl. M.H. Thamrin No.1, Jakarta Pusat, 10310"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-5 border bg-white rounded flex items-center justify-center">
                    {order.paymentMethod === "card" ? (
                      <CreditCard size={12} />
                    ) : (
                      <div className="text-[10px] font-bold">COD</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Paid via {order.paymentDetails?.cardType || "Cash"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.paymentDetails?.cardNumber || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Something went wrong with your order?
              </p>
              <button className="text-[#346853] font-bold text-sm hover:underline">
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTrackingSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="flex justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="w-full h-[300px] rounded-2xl" />
            <Skeleton className="w-full h-[300px] rounded-2xl" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="w-full h-[120px] rounded-2xl" />
            <Skeleton className="w-full h-[300px] rounded-2xl" />
            <Skeleton className="w-full h-[150px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
