import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, ChefHat, CheckCircle2, Bike } from "lucide-react";
import { getCookie } from "cookies-next";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
  handoffOrderAction,
  resolveNoRiderAction,
} from "@/app/actions/restaurant/orders";
import { useSocket } from "@/components/providers/SocketProvider";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export type OrderStatus = "incoming" | "preparing" | "ready" | "out_for_delivery";

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
  handoff: boolean;
  isCritical: boolean;
}

const BASE_POLL_INTERVAL = 30_000;
const MAX_POLL_INTERVAL = 300_000;

export const useOnlineOrders = () => {
  const t = useTranslations("POS.onlineOrders");
  const isKitchen = getCookie("role") === "kitchen";
  const [activeTab, setActiveTab] = useState<OrderStatus>(
    isKitchen ? "preparing" : "incoming",
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const consecutiveErrorsRef = useRef(0);
  const pollIntervalRef = useRef(BASE_POLL_INTERVAL);
  const { socket } = useSocket();

  const mapApiStatusToTabStatus = (status: string): OrderStatus | null => {
    const s = status.toLowerCase();
    if (s === "pending") return "incoming";
    if (s === "accepted" || s === "prepare") return "preparing";
    if (s === "ready") return "ready";
    if (s === "out_of_delivery") return "out_for_delivery";
    return null;
  };

  const calculateTimeAgo = (dateString: string) => {
    const timeAgoMs = Date.now() - new Date(dateString).getTime();
    const minutesAgo = Math.max(0, Math.floor(timeAgoMs / 60000));
    return minutesAgo < 1
      ? t("justNow")
      : t("minutesAgo", { minutes: minutesAgo });
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
              customerName: o.customerName || t("customer"),
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
              handoff: !!o.handoff,
              isCritical: !!o.isCritical,
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
  }, [t]);

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

  // Live-mark an order critical the moment the backend broadcasts that no
  // rider was found within its window — no need to wait for the next poll.
  useEffect(() => {
    if (!socket) return;

    const handleNoRiderAvailable = (data: { orderId: string }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === data.orderId ? { ...o, isCritical: true } : o,
        ),
      );
    };

    socket.on("NO_RIDER_AVAILABLE", handleNoRiderAvailable);
    return () => {
      socket.off("NO_RIDER_AVAILABLE", handleNoRiderAvailable);
    };
  }, [socket]);

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
        toast.error(res.message || t("toasts.updateFailed"));
        fetchOrders();
      } else {
        toast.success(t("toasts.updated"));
        fetchOrders();
      }
    } catch (err) {
      toast.error(t("toasts.updateError"));
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

  const handleHandoff = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "out_for_delivery", handoff: true }
          : o,
      ),
    );

    try {
      const res = await handoffOrderAction(orderId);
      if (!res.success) {
        toast.error(res.message || t("toasts.handoffFailed"));
        fetchOrders();
      } else {
        toast.success(t("toasts.handedOff"));
        fetchOrders();
      }
    } catch (err) {
      toast.error(t("toasts.handoffError"));
      fetchOrders();
    }
  };

  const handleCancelNoRider = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      const res = await resolveNoRiderAction(orderId);
      if (res.success) {
        toast.success(
          res.data?.refunded
            ? t("toasts.cancelledRefunded")
            : t("toasts.cancelledCod"),
        );
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        toast.error(res.message || t("toasts.cancelFailed"));
      }
    } catch (err) {
      toast.error(t("toasts.cancelError"));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const incomingOrders = orders.filter((o) => o.status === "incoming");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const outForDeliveryOrders = orders.filter(
    (o) => o.status === "out_for_delivery",
  );

  const tabs = [
    {
      id: "incoming" as const,
      label: t("tabs.incoming"),
      count: incomingOrders.length,
      icon: Bell,
    },
    {
      id: "preparing" as const,
      label: t("tabs.preparing"),
      count: preparingOrders.length,
      icon: ChefHat,
    },
    {
      id: "ready" as const,
      label: t("tabs.ready"),
      count: readyOrders.length,
      icon: CheckCircle2,
    },
    {
      id: "out_for_delivery" as const,
      label: t("tabs.outForDelivery"),
      count: outForDeliveryOrders.length,
      icon: Bike,
    },
  ].filter(
    (tab) =>
      !isKitchen ||
      (tab.id !== "incoming" && tab.id !== "out_for_delivery"),
  );

  const currentOrders =
    activeTab === "incoming"
      ? incomingOrders
      : activeTab === "preparing"
        ? preparingOrders
        : activeTab === "ready"
          ? readyOrders
          : outForDeliveryOrders;

  return {
    activeTab,
    setActiveTab,
    orders,
    handleAccept,
    handleReject,
    handleMarkReady,
    handleHandoff,
    handleCancelNoRider,
    cancellingOrderId,
    tabs,
    currentOrders,
    loading,
    isKitchen,
  };
};
