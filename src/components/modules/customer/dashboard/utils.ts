import { OrderStatus } from "../types";

export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case OrderStatus.DELIVERED:
      return { color: "text-emerald-600", bg: "bg-emerald-50" };
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
      return { color: "text-yellow-600", bg: "bg-yellow-50" };
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
