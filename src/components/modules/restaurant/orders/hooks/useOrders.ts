"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
  handoffOrderAction,
} from "@/app/actions/restaurant/orders";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { formatOrderDateTime } from "@/lib/utils/date";
import { format } from "date-fns";
import { useDateFilter } from "@/components/providers/DateFilterProvider";

// Convert an ISO/datetime string to the format expected by formatOrderDateTime
function isoToOrderDateTime(isoStr: string): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toLowerCase();
  return formatOrderDateTime(`${day}/${month}/${year}`, time);
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
  RIDER_NOT_ASSIGNED = "rider_not_assigned",
}

export interface ApiOrderRider {
  name: string;
  phone: string | number;
  image?: string;
  vehicleNumber: string;
  vehicleType: string;
}

export interface ApiOrder {
  orderId: string;
  customerName: string;
  customerPhone: string | number;
  discount?: number;
  summary: string;
  itemDetail?: {
    name: string;
    price: string | number;
    quantity: number;
    discount?: string | number;
  }[];
  totalPrice: number;
  status: string;
  dateTime: string;
  riderOrderId?: string;
  prepareTime?: string;
  rider?: ApiOrderRider;
  handoff?: boolean;
  isCritical?: boolean;
  paymentMethod?: string;
}

export interface OrderStats {
  totalOrders: number;
  liveOrders: number;
  totalDelivered: number;
  totalRevenue: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface UIOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  originalStatus?: string;
  riderOrderId?: string;
  prepareTime?: string;
  rider?: ApiOrderRider;
  handoff?: boolean;
  isCritical?: boolean;
  paymentMethod?: string;
}

import { usePagination } from "@/hooks/usePagination";

export const useOrders = () => {
  const t = useTranslations("POS.ordersHook");
  const { startDate, endDate } = useDateFilter();
  const { page, limit, totalPages, totalCount, handlePageChange, updatePaginationMeta } =
    usePagination({ initialLimit: 10 });
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<UIOrder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    liveOrders: 0,
    totalDelivered: 0,
    totalRevenue: "0.00",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    handlePageChange(1);
  }, [searchQuery, selectedStatus, handlePageChange]);

  const mapApiStatusToUiStatus = (apiStatus: string) => {
    const s = apiStatus.toLowerCase();
    switch (s) {
      case OrderStatus.PENDING:
        return "NEW";
      case OrderStatus.ACCEPTED:
        return "ACCEPTED";
      case OrderStatus.PREPARE:
        return "PREPARING";
      case OrderStatus.READY:
        return "READY";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "OUT FOR DELIVERY";
      case OrderStatus.DELIVERED:
        return "DELIVERED";
      case OrderStatus.REJECTED:
        return "CANCELLED";
      case OrderStatus.RIDER_NOT_ASSIGNED:
        return "RIDER NOT ASSIGNED";
      default:
        return s.toUpperCase();
    }
  };

  const parseSummaryToItems = (summary: string): OrderItem[] => {
    if (!summary) return [];
    return summary.split(",").map((part, index) => {
      const trimmed = part.trim();
      const match = trimmed.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        return {
          id: `item-${index}`,
          name: match[2],
          quantity: parseInt(match[1]),
          price: 0,
        };
      }
      return { id: `item-${index}`, name: trimmed, quantity: 1, price: 0 };
    });
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const startStr = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
      const endStr = endDate ? format(endDate, "yyyy-MM-dd") : undefined;
      const res = await getRestaurantOrdersAction(
        page,
        limit,
        selectedStatus || undefined,
        startStr,
        endStr,
        debouncedSearchQuery || undefined,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resData = res.data as any;
      if (res.success && resData?.data) {
        const apiStats = resData.data.stats || {};
        setStats({
          totalOrders: apiStats.totalOrders || 0,
          liveOrders: apiStats.liveOrders || 0,
          totalDelivered: apiStats.totalDelivered || 0,
          totalRevenue: (apiStats.deliveredRevenue || 0).toString(),
        });
        if (res.meta) {
          updatePaginationMeta(res.meta);
        }
        const apiOrders: ApiOrder[] = resData.data.orders || [];

        const mappedOrders: UIOrder[] = apiOrders.map((o) => {
          let items: OrderItem[] = [];
          if (o.itemDetail && o.itemDetail.length > 0) {
            items = o.itemDetail.map((item, idx) => {
              const itemDiscount =
                typeof item.discount === "string"
                  ? parseFloat(item.discount)
                  : item.discount || 0;
              // The API only sends the discount at the order level, not per
              // item. When there's just one distinct item, it unambiguously
              // belongs to that item; with multiple items there's no way to
              // attribute it, so it's only shown in the order-level summary.
              const discount =
                itemDiscount || (o.itemDetail!.length === 1 ? o.discount || 0 : 0);
              return {
                id: `item-${idx}`,
                name: item.name,
                quantity: item.quantity,
                price:
                  typeof item.price === "string"
                    ? parseFloat(item.price)
                    : item.price,
                discount,
              };
            });
          } else {
            items = parseSummaryToItems(o.summary);
          }

          return {
            id: o.orderId,
            customerName: o.customerName,
            customerPhone: o.customerPhone ? o.customerPhone.toString() : "N/A",
            status: mapApiStatusToUiStatus(o.status),
            date: isoToOrderDateTime(o.dateTime),
            items,
            subtotal: o.totalPrice + (o.discount || 0),
            discount: o.discount || 0,
            total: o.totalPrice,
            originalStatus: o.status,
            riderOrderId: o.riderOrderId,
            prepareTime: o.prepareTime,
            rider: o.rider,
            handoff: !!o.handoff,
            isCritical: !!o.isCritical,
            paymentMethod: o.paymentMethod,
          };
        });
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedStatus, debouncedSearchQuery, updatePaginationMeta, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        await fetchOrders();

        // Update selected order if it's the one that was updated
        if (selectedOrder && selectedOrder.id === orderId) {
          /*
           * We need to wait for fetchOrders to finish or manually update it
           * Re-fetching orders above updates the 'orders' state.
           * The effect of setOrders will be seen in the next render.
           * To be safe, we can find the updated order from the fresh data if we had it,
           * or just close the sheet (which the original code did in handleUpdateClick in OrderDetailsSheet)
           */
        }

        toast.success(t("statusUpdated"));
      } else {
        toast.error(res.message || t("updateFailed"));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t("updateError"));
    }
  };

  const handleHandoff = async (orderId: string) => {
    try {
      const res = await handoffOrderAction(orderId);
      if (res.success) {
        await fetchOrders();
        toast.success(t("handedOff"));
      } else {
        toast.error(res.message || t("handoffFailed"));
      }
    } catch (error) {
      console.error("Error handing off order:", error);
      toast.error(t("handoffError"));
    }
  };

  const handleOrderClick = (order: UIOrder) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const paginatedOrders = orders;
  const filteredOrders = orders;

  return {
    orders,
    stats,
    loading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    isSheetOpen,
    setIsSheetOpen,
    currentPage: page,
    setCurrentPage: handlePageChange,
    paginatedOrders,
    filteredOrders,
    totalPages,
    totalCount,
    handleStatusUpdate,
    handleHandoff,
    handleOrderClick,
  };
};
