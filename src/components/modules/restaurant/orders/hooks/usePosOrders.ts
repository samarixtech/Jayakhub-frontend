"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, ChefHat, CheckCircle2 } from "lucide-react";
import { getCartListAction, updateCartStatusAction } from "@/app/actions/restaurant/cart";
import toast from "react-hot-toast";

export enum PosOrderStatus {
  COMPLETE = "complete",
  PENDING = "pending",
  PREPARE = "prepare",
  CANCELLED = "cancelled"
}

export type OrderStatus = "incoming" | "preparing" | "ready";

export interface Order {
  id: string;
  customerName: string;
  timeAgo: string;
  items: string[];
  total: number;
  status: OrderStatus;
  handoffStage?: "rider_assigned" | "handoff_code";
  originalStatus: string;
}

const BASE_POLL_INTERVAL = 30_000;
const MAX_POLL_INTERVAL = 300_000; // 5 min cap

export const usePosOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("incoming");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const consecutiveErrorsRef = useRef(0);
  const pollIntervalRef = useRef(BASE_POLL_INTERVAL);

  const mapApiStatusToTabStatus = (status: string): OrderStatus | null => {
    const s = status.toLowerCase();
    if (s === PosOrderStatus.PENDING) return "incoming";
    if (s === PosOrderStatus.PREPARE || s === "preparing" || s === "accepted") return "preparing";
    if (s === PosOrderStatus.COMPLETE) return "ready";
    return null;
  };

  const calculateTimeAgo = (dateString: string) => {
    const timeAgoMs = Date.now() - new Date(dateString).getTime();
    const minutesAgo = Math.max(0, Math.floor(timeAgoMs / 60000));
    return minutesAgo < 1 ? "Just now" : `${minutesAgo}m ago`;
  };

  const fetchOrders = useCallback(async () => {
    if (isFetchingRef.current) return; // prevent concurrent requests
    isFetchingRef.current = true;
    try {
      const res = await getCartListAction();
      if (res.success && Array.isArray(res.data)) {
        consecutiveErrorsRef.current = 0;
        pollIntervalRef.current = BASE_POLL_INTERVAL;

        const mapped: Order[] = [];
        res.data.forEach((order: any) => {
          const tabStatus = mapApiStatusToTabStatus(order.orderStatus || PosOrderStatus.PENDING);
          if (tabStatus) {
            const formattedItems = (order.items || []).map((it: any) => {
              const variantNames = (it.variants || []).map((v: any) => v.optionName);
              const nameWithOptions = it.itemName + (variantNames.length > 0 ? ` (${variantNames.join(", ")})` : "");
              return it.quantity > 1 ? `${nameWithOptions} x${it.quantity}` : nameWithOptions;
            });
            
            mapped.push({
              id: order.id,
              customerName: order.tableName ? `Table ${order.tableName}` : (order.orderType || "Walk-In"),
              timeAgo: calculateTimeAgo(order.createdAt),
              items: formattedItems,
              total: parseFloat(order.grandTotal || "0"),
              status: tabStatus,
              originalStatus: order.orderStatus || PosOrderStatus.PENDING,
            });
          }
        });

        setOrders(mapped);
      } else {
        consecutiveErrorsRef.current += 1;
        pollIntervalRef.current = Math.min(
          BASE_POLL_INTERVAL * 2 ** consecutiveErrorsRef.current,
          MAX_POLL_INTERVAL,
        );
      }
    } catch (error) {
      console.error("Failed to fetch POS orders:", error);
      consecutiveErrorsRef.current += 1;
      pollIntervalRef.current = Math.min(
        BASE_POLL_INTERVAL * 2 ** consecutiveErrorsRef.current,
        MAX_POLL_INTERVAL,
      );
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeoutId = setTimeout(async () => {
        await fetchOrders();
        schedule();
      }, pollIntervalRef.current);
    };
    schedule();

    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newApiStatus: string) => {
    try {
      const res = await updateCartStatusAction(orderId, newApiStatus);
      if (res.success) {
        toast.success(`Order status updated`);
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Error updating order status");
    }
  };

  const handleAccept = (orderId: string) => {
    handleUpdateStatus(orderId, PosOrderStatus.PREPARE);
  };

  const handleReject = (orderId: string) => {
    handleUpdateStatus(orderId, PosOrderStatus.CANCELLED);
  };

  const handleMarkReady = (orderId: string) => {
    handleUpdateStatus(orderId, PosOrderStatus.COMPLETE);
  };

  const handleHandoffToggle = () => {};
  const handleCompleteHandoff = () => {};

  const incomingOrders = orders.filter((o) => o.status === "incoming");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const tabs = [
    {
      id: "incoming" as const,
      label: "Incoming",
      count: incomingOrders.length,
      icon: Bell,
    },
    {
      id: "preparing" as const,
      label: "Preparing",
      count: preparingOrders.length,
      icon: ChefHat,
    },
    {
      id: "ready" as const,
      label: "Completed",
      count: readyOrders.length,
      icon: CheckCircle2,
    },
  ];

  const currentOrders =
    activeTab === "incoming"
      ? incomingOrders
      : activeTab === "preparing"
        ? preparingOrders
        : readyOrders;

  return {
    activeTab,
    setActiveTab,
    orders,
    handleAccept,
    handleReject,
    handleMarkReady,
    handleHandoffToggle,
    handleCompleteHandoff,
    tabs,
    currentOrders,
    loading,
  };
};
