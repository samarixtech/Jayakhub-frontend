"use client";

import React, { useState } from "react";
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
import { formatOrderDateTime } from "@/lib/utils/date";
import EmptyState from "@/components/common/EmptyState";
import { Utensils } from "lucide-react";
import { useTranslations } from "next-intl";
import { GlobalModal } from "@/components/common/GlobalModal";
import { cancelOrderAction } from "@/app/actions/customer/order";
import { toast } from "react-hot-toast";

export default function OrderTrackingView({ params }: { params: any }) {
  const unwrappedParams = params ? React.use(params as any) : {};
  const orderIdFromUrl = (unwrappedParams as any)?.id;

  const { order, loading, subtotal, total, deliveryFee, coupon, rider, refetch } =
    useOrderTracking(orderIdFromUrl);

  const t = useTranslations("CustomerDashboard.OrderHistory");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const isRejected = order?.orderStatus?.toLowerCase() === "rejected";

  const isCancelable =
    !isRejected &&
    (order?.orderStatus || order?.status)?.toLowerCase() === "pending" &&
    order?.paymentMethod?.toLowerCase() === "cod";

  const handleConfirmCancel = async () => {
    setCanceling(true);
    const toastId = toast.loading("Cancelling order...");
    try {
      const res = await cancelOrderAction(order.orderId);
      if (res.success) {
        toast.success(res.message || "Order cancelled successfully", { id: toastId });
        setCancelModalOpen(false);
        refetch();
      } else {
        toast.error(res.message || "Failed to cancel order", { id: toastId });
      }
    } catch {
      toast.error("Failed to cancel order", { id: toastId });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return <OrderTrackingSkeleton />;
  }

  if (!order) {
    return (
      <EmptyState
        icon={Utensils}
        title={"Order not found"}
        message={"NO order found for this order ID"}
      />
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
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {isRejected ? "Order Cancelled" : "Live Order Tracking"}
              </h1>
              {isRejected && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-500">
                  Cancelled
                </span>
              )}
            </div>
            <p className="text-gray-500">
              Order #{order.orderId} • Place at{" "}
              {formatOrderDateTime(order.orderDate, order.orderTime)}
            </p>
          </div>
          <div className="flex gap-3">
            {isCancelable && (
              <Button
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold h-10 px-6 rounded-lg"
                onClick={() => setCancelModalOpen(true)}
              >
                {t("cancel_order_btn")}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Map & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <OrderMap address={order.address} />
            <OrderTimeline
              orderDate={order.orderDate}
              orderTime={order.orderTime}
              orderStatus={order.orderStatus}
            />
          </div>

          {/* Right Column Sidebar info */}
          <div className="lg:col-span-4 space-y-6">
            <RiderCard rider={rider} />
            <OrderSummaryTable
              items={order.items || []}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              coupon={coupon}
            />
            <DeliveryDetails
              userName={order.userName}
              address={order.address}
              paymentMethod={order.paymentMethod}
              paymentDetails={order.paymentDetails}
            />
          </div>
        </div>
      </div>

      <GlobalModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        title={t("cancel_order_title")}
        description={t("cancel_order_desc")}
        isOutsideDisabled={true}
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setCancelModalOpen(false)}
            className="rounded-full cursor-pointer"
            disabled={canceling}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmCancel}
            className="rounded-full bg-red-600 hover:bg-red-500 text-white cursor-pointer"
            disabled={canceling}
          >
            {canceling ? "Cancelling..." : t("cancel_order_confirm")}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
}
