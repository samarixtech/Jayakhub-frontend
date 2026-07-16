import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { addToCart } from "@/redux/slices/cartSlice";
import { Order, OrderItem, OrderStatus } from "../types";



import React from "react";
import { RatingModal } from "@/components/common/RatingModal";

interface UseOrderHistoryActionsProps {
  country: string;
  language: string;
  setCurrentPage: (page: number) => void;
  setCurrentOrderInfo: React.Dispatch<React.SetStateAction<React.ComponentProps<typeof RatingModal>["orderInfo"] | null>>;
  setIsRatingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const getImageUrl = (path: string) => path || "";

export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.DELIVERED:
      return "bg-emerald-100 text-emerald-700";
    case OrderStatus.REJECTED:
    case OrderStatus.CANCELLED:
    case OrderStatus.RIDER_NOT_ASSIGNED:
      return "bg-red-100 text-red-600";
    case OrderStatus.OUT_FOR_DELIVERY:
      return "bg-purple-100 text-purple-700";
    case OrderStatus.READY:
      return "bg-indigo-100 text-indigo-700";
    case OrderStatus.PREPARE:
      return "bg-blue-100 text-blue-700";
    case OrderStatus.ACCEPTED:
      return "bg-blue-50 text-blue-600";
    case OrderStatus.PENDING:
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

export const getStatusLabel = (status: string, t?: (key: string) => string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.OUT_FOR_DELIVERY:
      return t ? t("out_for_delivery") : "Out for Delivery";
    case OrderStatus.RIDER_NOT_ASSIGNED:
      return t ? t("rider_not_assigned_badge") : "Rider Not Assigned";
    default:
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};

export function useOrderHistoryActions({
  setCurrentPage,
  setCurrentOrderInfo,
  setIsRatingModalOpen,
}: UseOrderHistoryActionsProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("CustomerDashboard.OrderHistory");

  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item) => {
      const cartItem = {
        id: item.id || `temp-${Date.now()}-${Math.random()}`,
        name: item.name,
        description: "",
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
        imageUrl: getImageUrl(item.image),
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName,
        selectedVariations: item.selectedVariations || [],
        cartId: `reorder-${order.orderId}-${item.id || item.name}-${Date.now()}`,
      };
      dispatch(addToCart(cartItem));
    });

    router.push("/checkout");
  };

  const handleRateOrder = (order: Order) => {
    setCurrentOrderInfo({
      rawOrder: order,
      orderNumber: `#${order.orderId?.substring(0, 8) || "Order"}`,
      restaurantName: order.restaurantName || t("restaurant_order_fallback"),
      items: (order.items || []).map((item) => ({
        id:
          item.id ||
          item.originalId ||
          item.orderItemId ||
          `temp-${Date.now()}-${Math.random()}`,
        originalId: item.id || item.originalId || item.orderItemId || null,
        orderItemId: item.orderItemId || null,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: getImageUrl(item.image),
      })),
      delivery: {
        driverName: (order as any).rider?.name || t("your_rider_fallback"),
        vehicle: (order as any).rider?.vehicleType || t("delivery_fallback"),
        time: order.orderTime || t("just_now"),
        driverImage: (order as any).rider?.image || "",
      },
    });
    setIsRatingModalOpen(true);
  };

  return { handlePageChange, handleReorder, handleRateOrder };
}
