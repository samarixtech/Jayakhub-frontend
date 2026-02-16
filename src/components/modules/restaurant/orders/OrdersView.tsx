"use client";

import React, { useState } from "react";
import StatsCard from "./StatsCard";
import OrdersTable from "./OrdersTable";
import OrderDetailsSheet, { Order } from "./OrderDetailsSheet";
import { Receipt, Timer, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: "#ORD-1014",
    customerName: "Ahmed Hassan",
    customerPhone: "+964 770 123 4567",
    status: "NEW", // Yellow
    date: "31/01/2026 14:17",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 1, price: 8.0 },
      { id: "2", name: "Pepsi", quantity: 2, price: 4.0 },
    ],
    subtotal: 16.0,
    tax: 0.0,
    total: 16.0,
  },
  {
    id: "#ORD-1028",
    customerName: "Fatima Noor",
    customerPhone: "+964 770 333 4444",
    status: "READY", // Green
    date: "31/01/2026 13:10",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 1, price: 8.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 6.0 },
    ],
    subtotal: 14.0,
    tax: 0.0,
    total: 14.0,
  },
  {
    id: "#ORD-1032",
    customerName: "Sara Ali",
    customerPhone: "+964 770 999 8888",
    status: "READY",
    date: "31/01/2026 10:36",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 2, price: 16.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 10.0 },
    ],
    subtotal: 26.0,
    tax: 0.0,
    total: 26.0,
  },
  {
    id: "#ORD-1030",
    customerName: "Omar Khalid",
    customerPhone: "+964 770 111 2222",
    status: "OUT FOR DELIVERY",
    date: "31/01/2026 07:47",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 1, price: 8.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 6.0 },
    ],
    subtotal: 14.0,
    tax: 0.0,
    total: 14.0,
  },
  {
    id: "#ORD-1019",
    customerName: "Sara Ali",
    customerPhone: "+964 770 999 8888",
    status: "OUT FOR DELIVERY",
    date: "31/01/2026 03:26",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 3, price: 24.0 },
      { id: "2", name: "Pepsi", quantity: 2, price: 16.0 },
    ],
    subtotal: 40.0,
    tax: 0.0,
    total: 40.0,
  },
  {
    id: "#ORD-1004",
    customerName: "Zainab Karim",
    customerPhone: "+964 770 555 6666",
    status: "OUT FOR DELIVERY",
    date: "30/01/2026 18:20",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 2, price: 16.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 10.0 },
    ],
    subtotal: 26.0,
    tax: 0.0,
    total: 26.0,
  },
  {
    id: "#ORD-1045",
    customerName: "Ahmed Hassan",
    customerPhone: "+964 770 123 4567",
    status: "NEW", // Yellow
    date: "30/01/2026 18:06",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 2, price: 16.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 10.0 },
    ],
    subtotal: 26.0,
    tax: 0.0,
    total: 26.0,
  },
  {
    id: "#ORD-1042",
    customerName: "Fatima Noor",
    customerPhone: "+964 770 333 4444",
    status: "NEW", // Yellow
    date: "30/01/2026 15:47",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 3, price: 24.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 14.0 },
    ],
    subtotal: 38.0,
    tax: 0.0,
    total: 38.0,
  },
  {
    id: "#ORD-1037",
    customerName: "Sara Ali",
    customerPhone: "+964 770 999 8888",
    status: "OUT FOR DELIVERY",
    date: "29/01/2026 04:38",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 1, price: 8.0 },
      { id: "2", name: "Pepsi", quantity: 1, price: 6.0 },
    ],
    subtotal: 14.0,
    tax: 0.0,
    total: 14.0,
  },
  {
    id: "#ORD-1044",
    customerName: "Ahmed Hassan",
    customerPhone: "+964 770 123 4567",
    status: "PREPARING", // Blue
    date: "29/01/2026 00:17",
    items: [
      { id: "1", name: "Chicken Shawarma", quantity: 2, price: 16.0 },
      { id: "2", name: "Pepsi", quantity: 2, price: 12.0 },
    ],
    subtotal: 28.0,
    tax: 0.0,
    total: 28.0,
  },
];

const OrdersView = () => {
  const [activeTab, setActiveTab] = useState<"live" | "past">("live");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={<Receipt className="w-6 h-6" />}
          value="5"
          label="Total Today"
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatsCard
          icon={<Timer className="w-6 h-6" />}
          value="44"
          label="Live Orders"
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-800"
        />
        <StatsCard
          icon={<Wallet className="w-6 h-6" />}
          value="$0.00"
          label="Revenue"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab("live")}
              className={`rounded-full px-6 font-medium h-9 ${
                activeTab === "live"
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Live Orders
              <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30 border-none px-1.5 h-5 min-w-[1.25rem]">
                44
              </Badge>
            </Button>
            <Button
              onClick={() => setActiveTab("past")}
              variant="ghost"
              className={`rounded-full px-6 font-medium h-9 ${
                activeTab === "past"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Past Orders
              <Badge className="ml-2 bg-gray-200 text-gray-700 pointer-events-none hover:bg-gray-200 border-none px-1.5 h-5 min-w-[1.25rem]">
                11
              </Badge>
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500">Show:</span>
              <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                10
              </div>
            </div>
          </div>
        </div>

        {/* Table w/ Pagination */}
        <div className="p-0">
          <OrdersTable
            data={MOCK_ORDERS.filter((order) => {
              if (activeTab === "live") {
                return [
                  "NEW",
                  "READY",
                  "PREPARING",
                  "OUT FOR DELIVERY",
                ].includes(order.status);
              }
              return ["DELIVERED", "CANCELLED"].includes(order.status);
            })}
            onViewOrder={handleOrderClick}
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Details Sheet */}
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
};

export default OrdersView;
