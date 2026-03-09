"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useOrderTracking } from "./hooks/useOrderTracking";
import OrderTrackingSkeleton from "@/components/skeletons/OrderTrackingSkeleton";
import { OrderMap } from "./components/tracking/OrderMap";
import { OrderTimeline } from "./components/tracking/OrderTimeline";
import { RiderCard } from "./components/tracking/RiderCard";
import { OrderSummaryTable } from "./components/tracking/OrderSummaryTable";
import { DeliveryDetails } from "./components/tracking/DeliveryDetails";

export default function OrderTrackingView({ params }: { params: any }) {
  const unwrappedParams = params ? React.use(params as any) : {};
  const orderIdFromUrl = (unwrappedParams as any)?.id;

  const { order, loading, subtotal, total, deliveryFee } =
    useOrderTracking(orderIdFromUrl);

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
          {/* Left Column Map & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <OrderMap address={order.address} />
            <OrderTimeline
              orderTime={order.orderTime}
              orderStatus={order.orderStatus}
            />
          </div>

          {/* Right Column Sidebar info */}
          <div className="lg:col-span-4 space-y-6">
            <RiderCard />
            <OrderSummaryTable
              items={order.items || []}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
            />
            <DeliveryDetails
              userName={order.userName}
              address={order.address}
              paymentMethod={order.paymentMethod}
              paymentDetails={order.paymentDetails}
            />

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
