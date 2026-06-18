"use client";
import { useState, useEffect } from "react";
import { OrderCardsSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";
import useLocale from "@/hooks/useLocals";
import { RatingModal } from "@/components/common/RatingModal";
import EmptyState from "@/components/common/EmptyState";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Order } from "../types";
import { OrderHistoryHeader } from "./components/OrderHistoryHeader";
import { OrderFilters } from "./components/OrderFilters";
import { OrderCard } from "./components/OrderCard";
import { usePagination } from "@/hooks/usePagination";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { useOrderHistoryActions } from "./useOrderHistoryActions";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cancelOrderAction } from "@/app/actions/customer/order";

export default function CustomerOrderHistoryView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<React.ComponentProps<typeof RatingModal>["orderInfo"] | null>(null);

  // Cancel Order State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  const { country, language } = useLocale();

  // Filters
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("all");

  // Pagination State
  const { page, limit, totalPages, handlePageChange, updatePaginationMeta } =
    usePagination({ initialLimit: 10 });

  const t = useTranslations("CustomerDashboard.OrderHistory");

  const { handleReorder, handleRateOrder } = useOrderHistoryActions({
    country,
    language,
    setCurrentPage: handlePageChange,
    setCurrentOrderInfo,
    setIsRatingModalOpen,
  });

  const handleCancelOrderClick = (order: Order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setCanceling(true);
    const toastId = toast.loading("Cancelling order...");
    try {
      const res = await cancelOrderAction(orderToCancel.orderId);
      if (res.success) {
        toast.success(res.message || "Order cancelled successfully", { id: toastId });
        setTriggerRefetch((prev) => prev + 1);
        setCancelModalOpen(false);
        setOrderToCancel(null);
      } else {
        toast.error(res.message || "Failed to cancel order", { id: toastId });
      }
    } catch {
      toast.error("Failed to cancel order", { id: toastId });
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");

        const filterParts = [...statusFilters];
        if (dateRange !== "all") {
          filterParts.push(dateRange);
        }

        const filterParam =
          filterParts.length > 0 ? filterParts.join(",") : undefined;
        const res = await getAllOrders(page, limit, filterParam);
        if (res.success) {
          const responseData = res.data as Record<string, unknown> | Order[] | null;
          if (
            responseData &&
            !Array.isArray(responseData) &&
            typeof responseData === "object" &&
            Array.isArray(responseData.orders)
          ) {
            setOrders(responseData.orders as Order[]);
          } else if (Array.isArray(responseData)) {
            setOrders(responseData as Order[]);
          } else {
            setOrders([]);
          }
          if (res.meta) {
            updatePaginationMeta(res.meta);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [dateRange, statusFilters, page, limit, updatePaginationMeta, triggerRefetch]);

  // Filter Logic (Removed client-side filtering, now handled server-side)

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8">
        <OrderHistoryHeader
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <OrderFilters
          showFilters={showFilters}
          statusFilters={statusFilters}
          setStatusFilters={setStatusFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="flex justify-end items-center gap-2 text-xs text-gray-400 font-medium">
          <span>{t("rows_per_page")}</span>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-gray-700 font-bold min-w-[40px] text-center">
            {limit}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <OrderCardsSkeleton />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={FileDown}
              title={t("no_orders_yet")}
              message={t("no_orders_message")}
            />
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                handleReorder={handleReorder}
                handleRateOrder={handleRateOrder}
                handleCancelOrder={handleCancelOrderClick}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <GlobalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              handlePageChange(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>

      {currentOrderInfo && (
        <RatingModal
          open={isRatingModalOpen}
          onOpenChange={setIsRatingModalOpen}
          orderInfo={currentOrderInfo}
        />
      )}

      {orderToCancel && (
        <GlobalModal
          open={cancelModalOpen}
          onOpenChange={setCancelModalOpen}
          title={t("cancel_order_title")}
          description={t("cancel_order_desc")}
          trigger={<></>}
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
      )}
    </div>
  );
}
