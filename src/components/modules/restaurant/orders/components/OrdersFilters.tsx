"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import GlobalDateFilter from "@/components/modules/restaurant/layout/GlobalDateFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  filteredOrdersCount: number;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  filteredOrdersCount,
}) => {
  const t = useTranslations("RestaurantDashboard.Orders.filters");

  const statusOptions = [
    { value: "all", label: t("allStatus") },
    { value: "pending", label: t("statusPending") },
    { value: "prepare", label: t("statusPrepare") },
    { value: "ready", label: t("statusReady") },
    { value: "accepted", label: t("statusAccepted") },
    { value: "out_of_delivery", label: t("statusOutOfDelivery") },
    { value: "delivered", label: t("statusDelivered") },
    { value: "rejected", label: t("statusRejected") },
  ];

  return (
    <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
      <div className="flex gap-3 items-center flex-wrap w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-[250px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 h-10 shadow-sm rounded-lg w-full"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-[180px] shrink-0">
          <Select
            value={selectedStatus || "all"}
            onValueChange={(val) => setSelectedStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full bg-white border-gray-200 h-10 shadow-sm rounded-lg px-3 text-gray-600">
              <SelectValue placeholder={t("allStatus")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Count Indicator */}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-gray-500">{t("show")}</span>
          <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
            {filteredOrdersCount}
          </div>
        </div>
      </div>

      <GlobalDateFilter />
    </div>
  );
};

export default OrdersFilters;
