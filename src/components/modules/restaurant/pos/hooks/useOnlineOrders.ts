import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, ChefHat, CheckCircle2 } from "lucide-react";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/restaurant/orders";
import toast from "react-hot-toast";

export type OrderStatus = "incoming" | "preparing" | "ready";

export interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

export interface OrderRider {
  name: string;
  phone: number;
  image: string;
  vehicleNumber: string;
  vehicleType: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: number;
  timeAgo: string;
  items: string[];
  itemDetail: OrderItem[];
  total: number;
  status: OrderStatus;
  originalStatus: string;
  riderOrderId: string;
  prepareTime: string;
  rider: OrderRider | null;
}

const BASE_POLL_INTERVAL = 30_000;
const MAX_POLL_INTERVAL = 300_000;

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
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await getRestaurantOrdersAction(1, 50);
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
              customerPhone: o.customerPhone || 0,
              timeAgo: calculateTimeAgo(o.dateTime),
              items: o.summary
                ? o.summary.split(",").map((i: string) => i.trim())
                : [],
              itemDetail: o.itemDetail || [],
              total: o.totalPrice || 0,
              status: tabStatus,
              originalStatus: o.status,
              riderOrderId: o.riderOrderId || "",
              prepareTime: o.prepareTime || "",
              rider: o.rider || null,
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
        schedule();
      }, pollIntervalRef.current);
    };
    schedule();

    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    orderId: string,
    newApiStatus: string,
    localUiStatus?: OrderStatus,
  ) => {
    if (localUiStatus) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: localUiStatus } : o,
        ),
      );
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }

    try {
      const res = await updateOrderStatusAction(orderId, newApiStatus);
      if (!res.success) {
        toast.error(res.message || "Failed to update order status");
        fetchOrders();
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
    handleUpdateStatus(orderId, "ready", "ready");
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
    tabs,
    currentOrders,
    loading,
  };
};
