import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, ChefHat, CheckCircle2 } from "lucide-react";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/restaurant/orders";
import toast from "react-hot-toast";

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

export const useOnlineOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("incoming");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const consecutiveErrorsRef = useRef(0);
  const pollIntervalRef = useRef(BASE_POLL_INTERVAL);

  const mapApiStatusToTabStatus = (status: string): OrderStatus | null => {
    const s = status.toLowerCase();
    if (s === "pending") return "incoming";
    if (s === "accepted" || s === "prepare") return "preparing";
    if (s === "ready") return "ready";
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
      const res = await getRestaurantOrdersAction(1, 50, "live");
      const resData = res.data as any;
      if (res.success && resData?.data) {
        consecutiveErrorsRef.current = 0;
        pollIntervalRef.current = BASE_POLL_INTERVAL;

        const apiOrders = resData.data.orders || [];
        const mapped: Order[] = [];
        apiOrders.forEach((o: any) => {
          const tabStatus = mapApiStatusToTabStatus(o.status);
          if (tabStatus) {
            mapped.push({
              id: o.orderId,
              customerName: o.customerName || "Customer",
              timeAgo: calculateTimeAgo(o.dateTime),
              items: o.summary
                ? o.summary.split(",").map((i: string) => i.trim())
                : [],
              total: o.totalPrice || 0,
              status: tabStatus,
              originalStatus: o.status,
              handoffStage:
                tabStatus === "ready" ? "rider_assigned" : undefined,
            });
          }
        });

        setOrders((current) =>
          mapped.map((newOrder) => {
            const existing = current.find((ex) => ex.id === newOrder.id);
            return existing?.handoffStage
              ? { ...newOrder, handoffStage: existing.handoffStage }
              : newOrder;
          }),
        );
      } else {
        // Server returned an error response — back off
        consecutiveErrorsRef.current += 1;
        pollIntervalRef.current = Math.min(
          BASE_POLL_INTERVAL * 2 ** consecutiveErrorsRef.current,
          MAX_POLL_INTERVAL,
        );
      }
    } catch (error) {
      console.error("Failed to fetch online orders:", error);
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
        schedule(); // reschedule with current (possibly backed-off) interval
      }, pollIntervalRef.current);
    };
    schedule();

    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    orderId: string,
    newApiStatus: string,
    localUiStatus?: OrderStatus,
    localHandoffStage?: "rider_assigned" | "handoff_code",
  ) => {
    // Optimistic UI update
    if (localUiStatus) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: localUiStatus,
                handoffStage: localHandoffStage ?? o.handoffStage,
              }
            : o,
        ),
      );
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }

    try {
      const res = await updateOrderStatusAction(orderId, newApiStatus);
      if (!res.success) {
        toast.error(res.message || "Failed to update order status");
        fetchOrders(); // Revert on failure
      } else {
        toast.success(`Order updated`);
        fetchOrders();
      }
    } catch (err) {
      toast.error("Error updating order");
      fetchOrders();
    }
  };

  const handleAccept = (orderId: string) => {
    handleUpdateStatus(orderId, "prepare", "preparing");
  };

  const handleReject = (orderId: string) => {
    handleUpdateStatus(orderId, "rejected");
  };

  const handleMarkReady = (orderId: string) => {
    handleUpdateStatus(orderId, "ready", "ready", "rider_assigned");
  };

  const handleHandoffToggle = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.status === "ready") {
          return {
            ...o,
            handoffStage:
              o.handoffStage === "rider_assigned"
                ? "handoff_code"
                : "rider_assigned",
          };
        }
        return o;
      }),
    );
  };

  const handleCompleteHandoff = (orderId: string) => {
    handleUpdateStatus(orderId, "out_of_delivery");
  };

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
      label: "Ready",
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
