"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/restaurant/orders";
import { toast } from "react-hot-toast";

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

export interface ApiOrder {
  orderId: string;
  customerName: string;
  summary: string;
  totalPrice: number;
  status: string;
  dateTime: string;
}

export interface OrderStats {
  todayOrders: number;
  liveOrders: number;
  totalRevenue: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface UIOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  originalStatus?: string;
}

export const useOrders = () => {
  const ITEMS_PER_PAGE = 7;
  const [activeTab, setActiveTab] = useState<"live" | "past">("live");
  const [selectedOrder, setSelectedOrder] = useState<UIOrder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    todayOrders: 0,
    liveOrders: 0,
    totalRevenue: "0.00",
  });
  const [loading, setLoading] = useState(true);

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
      const res = await getRestaurantOrdersAction();
      const resData = res.data as any;
      if (res.success && resData?.data) {
        setStats(resData.data.stats);
        const apiOrders: ApiOrder[] = resData.data.orders || [];

        const mappedOrders: UIOrder[] = apiOrders.map((o) => ({
          id: o.orderId,
          customerName: o.customerName,
          customerPhone: "N/A",
          status: mapApiStatusToUiStatus(o.status),
          date: new Date(o.dateTime).toLocaleString(),
          items: parseSummaryToItems(o.summary),
          subtotal: o.totalPrice,
          tax: 0,
          total: o.totalPrice,
          originalStatus: o.status,
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        await fetchOrders();

        // Update selected order if it's the one that was updated
        if (selectedOrder && selectedOrder.id === orderId) {
          // We need to wait for fetchOrders to finish or manually update it
          // Re-fetching orders above updates the 'orders' state.
          // The effect of setOrders will be seen in the next render.
          // To be safe, we can find the updated order from the fresh data if we had it,
          // or just close the sheet (which the original code did in handleUpdateClick in OrderDetailsSheet)
        }

        toast.success("Order status updated successfully");
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleOrderClick = (order: UIOrder) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const s = order.originalStatus || order.status.toLowerCase();
    if (activeTab === "live") {
      return [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARE,
        OrderStatus.READY,
        OrderStatus.OUT_FOR_DELIVERY,
      ].includes(s as OrderStatus);
    } else {
      return [OrderStatus.DELIVERED, OrderStatus.REJECTED].includes(
        s as OrderStatus,
      );
    }
  });

  const liveOrdersCount = orders.filter((o) =>
    [
      OrderStatus.PENDING,
      OrderStatus.ACCEPTED,
      OrderStatus.PREPARE,
      OrderStatus.READY,
      OrderStatus.OUT_FOR_DELIVERY,
    ].includes(o.originalStatus as OrderStatus),
  ).length;

  const pastOrdersCount = orders.filter((o) =>
    [OrderStatus.DELIVERED, OrderStatus.REJECTED].includes(
      o.originalStatus as OrderStatus,
    ),
  ).length;

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return {
    orders,
    stats,
    loading,
    activeTab,
    setActiveTab,
    selectedOrder,
    setSelectedOrder,
    isSheetOpen,
    setIsSheetOpen,
    currentPage,
    setCurrentPage,
    paginatedOrders,
    filteredOrders,
    totalPages,
    handleStatusUpdate,
    handleOrderClick,
    liveOrdersCount,
    pastOrdersCount,
  };
};
