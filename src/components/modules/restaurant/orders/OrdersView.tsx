"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import OrdersTable from "./OrdersTable";
import OrderDetailsSheet, { Order as SheetOrder } from "./OrderDetailsSheet";
import { Receipt, Timer, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getRestaurantOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/restaurant/orders";
import { toast } from "react-hot-toast";

// Enum for Order Status
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

// Interface for API Order
interface ApiOrder {
  orderId: string;
  customerName: string;
  summary: string;
  totalPrice: number;
  status: string;
  dateTime: string;
}

interface OrderStats {
  todayOrders: number;
  liveOrders: number;
  totalRevenue: string;
}

// UI Order interface (adapted for OrdersTable/Sheet)
// We extend or map to match what child components expect.
// Assuming Child components expect 'Order' type.
// We might need to adjust child components if they have strict typing,
// but for now we'll map API data to a compatible structure.
interface UIOrder {
  id: string;
  customerName: string;
  customerPhone: string; // Not in API, will use placeholder
  status: string;
  date: string;
  items: any[]; // items details not in main list API, will use summary or fetch details
  subtotal: number;
  tax: number;
  total: number;
  // Extra fields to store original data if needed
  originalStatus?: string;
}

const OrdersView = () => {
  const ITEMS_PER_PAGE = 7;
  const [activeTab, setActiveTab] = useState<"live" | "past">("live");
  const [selectedOrder, setSelectedOrder] = useState<SheetOrder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    todayOrders: 0,
    liveOrders: 0,
    totalRevenue: "0.00",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getRestaurantOrdersAction();
        const resData = res.data as any;
        if (res.success && resData?.data) {
          setStats(resData.data.stats);
          const apiOrders: ApiOrder[] = resData.data.orders || [];

          // Map API orders to UI Orders
          const mappedOrders: UIOrder[] = apiOrders.map((o) => ({
            id: o.orderId,
            customerName: o.customerName,
            customerPhone: "N/A", // Placeholder
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
    }
    fetchOrders();
  }, []);

  // Helper to map API status to UI Status (if needed, or just use raw UpperCase)
  const mapApiStatusToUiStatus = (apiStatus: string) => {
    // API: pending, accepted, prepare, ready, out_of_delivery, delivered, rejected
    // UI Mock used: NEW, READY, OUT FOR DELIVERY, PREPARING
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
        return "CANCELLED"; // Mapping rejected to cancelled for UI compatibility
      default:
        return s.toUpperCase();
    }
  };

  // Helper to parse "3x Garlic Naan, 1x Special Mutton Karahi" into items array
  const parseSummaryToItems = (summary: string) => {
    // Very basic parser: "Qty x Name"
    // Split by comma
    if (!summary) return [];
    return summary.split(",").map((part, index) => {
      const trimmed = part.trim();
      const match = trimmed.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        return {
          id: `item-${index}`,
          name: match[2],
          quantity: parseInt(match[1]),
          price: 0, // Price per item is not in summary
        };
      }
      return { id: `item-${index}`, name: trimmed, quantity: 1, price: 0 };
    });
  };

  const handleOrderClick = (order: any) => {
    // Cast to SheetOrder if compatible or fetch details
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    // Map UI Status back to logic
    const s = order.originalStatus || order.status.toLowerCase(); // Use original if available for accurate filtering

    if (activeTab === "live") {
      // Live: pending, accepted, prepare, ready, out_for_delivery
      return [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARE,
        OrderStatus.READY,
        OrderStatus.OUT_FOR_DELIVERY,
      ].includes(s as OrderStatus);
    } else {
      // Past: delivered, rejected
      return [OrderStatus.DELIVERED, OrderStatus.REJECTED].includes(
        s as OrderStatus,
      );
    }
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        // Re-fetch orders to update UI
        const ordersRes = await getRestaurantOrdersAction();
        const ordersData = ordersRes.data as any;
        if (ordersRes.success && ordersData?.data) {
          setStats(ordersData.data.stats);
          const apiOrders: ApiOrder[] = ordersData.data.orders || [];
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

          // Also update the selected order so the sheet reflects the change immediately
          if (selectedOrder && selectedOrder.id === orderId) {
            const updatedOrder = mappedOrders.find((o) => o.id === orderId);
            if (updatedOrder) {
              setSelectedOrder(updatedOrder);
            }
          }
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

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={<Receipt className="w-6 h-6" />}
          value={stats.todayOrders.toString()}
          label="Total Today"
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          loading={loading}
        />
        <StatsCard
          icon={<Timer className="w-6 h-6" />}
          value={stats.liveOrders.toString()}
          label="Live Orders"
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-800"
          loading={loading}
        />
        <StatsCard
          icon={<Wallet className="w-6 h-6" />}
          value={`$${stats.totalRevenue}`}
          label="Revenue"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          loading={loading}
        />
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setActiveTab("live");
                setCurrentPage(1);
              }}
              className={`rounded-full px-6 font-medium h-9 ${
                activeTab === "live"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Live Orders
              <Badge className="ml-2 bg-gray-200 text-gray-700 pointer-events-none hover:bg-gray-200 border-none px-1.5 h-5 min-w-5">
                {
                  orders.filter((o) =>
                    [
                      OrderStatus.PENDING,
                      OrderStatus.ACCEPTED,
                      OrderStatus.PREPARE,
                      OrderStatus.READY,
                      OrderStatus.OUT_FOR_DELIVERY,
                    ].includes(o.originalStatus as OrderStatus),
                  ).length
                }
              </Badge>
            </Button>
            <Button
              onClick={() => {
                setActiveTab("past");
                setCurrentPage(1);
              }}
              variant="ghost"
              className={`rounded-full px-6 font-medium h-9 ${
                activeTab === "past"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Past Orders
              <Badge className="ml-2 bg-gray-200 text-gray-700 pointer-events-none hover:bg-gray-200 border-none px-1.5 h-5 min-w-5">
                {
                  orders.filter((o) =>
                    [OrderStatus.DELIVERED, OrderStatus.REJECTED].includes(
                      o.originalStatus as OrderStatus,
                    ),
                  ).length
                }
              </Badge>
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500">Show:</span>
              <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                {filteredOrders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Table w/ Pagination */}
        <div className="p-0">
          <OrdersTable
            data={paginatedOrders}
            onViewOrder={handleOrderClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>
      </div>

      {/* Details Sheet */}
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrdersView;
