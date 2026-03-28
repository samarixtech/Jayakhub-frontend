import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/redux/slices/cartSlice";
import { Order, OrderStatus } from "../types";

interface UseOrderHistoryActionsProps {
  country: string;
  language: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentOrderInfo: React.Dispatch<React.SetStateAction<any>>;
  setIsRatingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/\\/g, "/");
  const hasLeadingSlash = cleanPath.startsWith("/");
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return hasLeadingSlash
    ? `${cleanBaseUrl}${cleanPath}`
    : `${cleanBaseUrl}/${cleanPath}`;
};

export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.DELIVERED:
      return "bg-emerald-100 text-emerald-700";
    case OrderStatus.REJECTED:
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

export const getStatusLabel = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.OUT_FOR_DELIVERY:
      return "Out for Delivery";
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

  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item: any) => {
      const cartItem = {
        id: item.id || `temp-${Date.now()}-${Math.random()}`,
        name: item.name,
        description: "",
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
        imageUrl: getImageUrl(item.image),
        restaurantId: (order as any).restaurantId,
        restaurantName: (order as any).restaurantName,
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
      restaurantName: "Restaurant Order",
      items: (order.items || []).map((item: any) => ({
        id:
          item.id ||
          item.itemId ||
          item.orderItemId ||
          `temp-${Date.now()}-${Math.random()}`,
        originalId: item.id || item.itemId || item.orderItemId || null,
        orderItemId: item.orderItemId || null,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: getImageUrl(item.image),
      })),
      delivery: {
        driverName: "Your Rider",
        vehicle: "Delivery",
        time: order.orderTime || "Just now",
        driverImage:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200",
      },
    });
    setIsRatingModalOpen(true);
  };

  return { handlePageChange, handleReorder, handleRateOrder };
}
