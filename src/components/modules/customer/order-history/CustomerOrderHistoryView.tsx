"use client";
import { useState, useEffect } from "react";
import { OrdersSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";
import useLocale from "@/hooks/useLocals";
import { RatingModal } from "@/components/common/RatingModal";
import EmptyState from "@/components/common/EmptyState";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Order, OrderStatus } from "../types";
import { OrderHistoryHeader } from "./components/OrderHistoryHeader";
import { OrderFilters } from "./components/OrderFilters";
import { OrderCard } from "./components/OrderCard";
import { OrderPagination } from "./components/OrderPagination";
import { useOrderHistoryActions } from "./useOrderHistoryActions";

export default function CustomerOrderHistoryView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>(null);

  const { country, language } = useLocale();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("30");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const t = useTranslations('CustomerDashboard.OrderHistory');

  const { handlePageChange, handleReorder, handleRateOrder } =
    useOrderHistoryActions({
      country,
      language,
      setCurrentPage,
      setCurrentOrderInfo,
      setIsRatingModalOpen,
    });

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const res = await getAllOrders();
        if (res.success) {
          const responseData = res.data as any;
          if (
            responseData?.data?.orders &&
            Array.isArray(responseData.data.orders)
          ) {
            setOrders(responseData.data.orders);
          } else if (
            responseData?.orders &&
            Array.isArray(responseData.orders)
          ) {
            setOrders(responseData.orders);
          } else if (Array.isArray(responseData)) {
            setOrders(responseData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all") {
      const status = order.OrderStatus?.toLowerCase() || "";
      if (statusFilter === "delivered") return status === OrderStatus.DELIVERED;
      if (statusFilter === "cancelled") return status === OrderStatus.REJECTED;
      if (statusFilter === "active") {
        return [
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.PREPARE,
          OrderStatus.READY,
          OrderStatus.OUT_FOR_DELIVERY,
        ].includes(status as OrderStatus);
      }
    }
    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) return <OrdersSkeleton />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8">
        <OrderHistoryHeader
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <OrderFilters
          showFilters={showFilters}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="flex justify-end items-center gap-2 text-xs text-gray-400 font-medium">
          <span>{t('rows_per_page')}</span>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-gray-700 font-bold min-w-[40px] text-center">
            {itemsPerPage}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={FileDown}
              title={t('no_orders_yet')}
              message={t('no_orders_message')}
            />
          ) : (
            currentOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                handleReorder={handleReorder}
                handleRateOrder={handleRateOrder}
              />
            ))
          )}
        </div>

        {filteredOrders.length > 0 && (
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={(page) => handlePageChange(page, totalPages)}
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
    </div>
  );
}
