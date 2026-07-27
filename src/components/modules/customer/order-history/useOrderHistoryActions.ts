import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { setCart, setUnavailableItems } from "@/redux/slices/cartSlice";
import { reorderAction } from "@/app/actions/customer/order";
import { Order, OrderItem, OrderStatus } from "../types";



import React, { useState } from "react";
import { RatingModal } from "@/components/common/RatingModal";

// The reorder API returns the same item shape for both available
// ("success") and unavailable ("errors") items.
function mapReorderItem(
  item: any,
  restaurantId?: string,
  restaurantName?: string,
) {
  const discountAmount = item.discount ? Number(item.discount) : 0;
  const basePrice = Number(item.basePrice) || 0;
  const unitPrice = Math.max(0, basePrice - discountAmount);
  const selectedVariations = (item.variants || []).map((v: any) => ({
    name: v.optionName,
    groupName: v.groupName,
    additionalPrice: v.price,
    variantGroupId: v.variantId,
    id: v.variantId,
  }));
  const variantKey = JSON.stringify(
    selectedVariations.map((v: any) => v.name).sort(),
  );

  return {
    id: item.itemId,
    productId: item.itemId,
    name: item.itemName,
    description: item.description || "",
    price: unitPrice,
    originalPrice: basePrice,
    discount: item.discount != null ? String(item.discount) : null,
    image: item.image,
    imageUrl: item.image,
    quantity: item.quantity,
    restaurantId,
    restaurantName,
    selectedVariations,
    cartId: `${item.itemId}-${variantKey}`,
  };
}

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
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(
    null,
  );

  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReorder = async (order: Order) => {
    setReorderingOrderId(order.orderId);
    try {
      const res = await reorderAction(order.orderId);
      if (!res.success || !res.data) {
        toast.error(res.message || t("reorder_failed"));
        return;
      }

      const data = res.data as any;
      const restaurantId = data.restaurantId || order.restaurantId;
      const restaurantName = data.restaurantName || order.restaurantName;

      const availableItems = (data.success || []).map((item: any) =>
        mapReorderItem(item, restaurantId, restaurantName),
      );
      const unavailableItems = (data.errors || []).map((item: any) =>
        mapReorderItem(item, restaurantId, restaurantName),
      );

      if (availableItems.length === 0 && unavailableItems.length === 0) {
        toast.error(t("reorder_no_items"));
        return;
      }

      // The cart only ever holds one restaurant's items at a time — always
      // replace it with the reordered restaurant's items rather than
      // merging with whatever was already there.
      dispatch(setCart(availableItems));
      dispatch(setUnavailableItems(unavailableItems));

      if (availableItems.length === 0) {
        toast.error(t("reorder_all_unavailable"));
      } else if (unavailableItems.length > 0) {
        toast.success(t("reorder_partial"));
      } else {
        toast.success(data.summary?.message || t("reorder"));
      }

      router.push("/checkout");
    } catch (error) {
      console.error("Reorder failed", error);
      toast.error(t("reorder_failed"));
    } finally {
      setReorderingOrderId(null);
    }
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

  return {
    handlePageChange,
    handleReorder,
    handleRateOrder,
    reorderingOrderId,
  };
}
