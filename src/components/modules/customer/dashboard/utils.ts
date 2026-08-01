import { OrderStatus } from "../types";

export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.DELIVERED:
      return { color: "text-forest-green", bg: "bg-forest-green/10" };
    case OrderStatus.REJECTED:
      return { color: "text-red-600", bg: "bg-red-50" };
    case OrderStatus.OUT_FOR_DELIVERY:
      return { color: "text-purple-600", bg: "bg-purple-50" };
    case OrderStatus.READY:
      return { color: "text-indigo-600", bg: "bg-indigo-50" };
    case OrderStatus.PREPARE:
      return { color: "text-blue-600", bg: "bg-blue-50" };
    case OrderStatus.ACCEPTED:
      return { color: "text-blue-500", bg: "bg-blue-50" };
    case OrderStatus.PENDING:
    default:
      return { color: "text-gold-deep", bg: "bg-secondary/15" };
  }
};

export const getStatusLabel = (status: string, t?: (key: string) => string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.OUT_FOR_DELIVERY:
      return t ? t("out_for_delivery") : "Out for Delivery";
    default:
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};
