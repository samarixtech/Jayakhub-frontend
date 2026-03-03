"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrdersFiltersProps {
  activeTab: "live" | "past";
  onTabChange: (tab: "live" | "past") => void;
  onPageReset: () => void;
  liveOrdersCount: number;
  pastOrdersCount: number;
  filteredOrdersCount: number;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  activeTab,
  onTabChange,
  onPageReset,
  liveOrdersCount,
  pastOrdersCount,
  filteredOrdersCount,
}) => {
  return (
    <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            onTabChange("live");
            onPageReset();
          }}
          className={`rounded-full px-6 font-medium h-9 ${
            activeTab === "live"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Live Orders
          <Badge className="ml-2 bg-gray-200 text-gray-700 pointer-events-none hover:bg-gray-200 border-none px-1.5 h-5 min-w-5">
            {liveOrdersCount}
          </Badge>
        </Button>
        <Button
          onClick={() => {
            onTabChange("past");
            onPageReset();
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
            {pastOrdersCount}
          </Badge>
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-500">Show:</span>
          <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
            {filteredOrdersCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilters;
