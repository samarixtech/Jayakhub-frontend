import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  showFilters: boolean;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
}

export const OrderFilters = ({
  showFilters,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
}: OrderFiltersProps) => {
  return (
    <div
      className={`${
        showFilters ? "flex" : "hidden"
      } md:flex flex-col md:flex-row bg-white rounded-2xl p-4 md:p-2 md:pl-6 shadow-sm items-start md:items-center gap-4 md:gap-6 overflow-x-auto transition-all`}
    >
      <span className="text-sm font-bold text-gray-900 shrink-0 mb-2 md:mb-0">
        Filters:
      </span>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
        {/* Status Checkboxes */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-all"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilter === "all"}
            onCheckedChange={() => setStatusFilter("all")}
          />
          <label
            htmlFor="filter-all"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            All
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-active"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilter === "active"}
            onCheckedChange={() => setStatusFilter("active")}
          />
          <label
            htmlFor="filter-active"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Active
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-delivered"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilter === "delivered"}
            onCheckedChange={() => setStatusFilter("delivered")}
          />
          <label
            htmlFor="filter-delivered"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Delivered
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-cancelled"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilter === "cancelled"}
            onCheckedChange={() => setStatusFilter("cancelled")}
          />
          <label
            htmlFor="filter-cancelled"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Rejected/Cancelled
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 md:ml-auto w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full md:w-[140px] h-9 rounded-lg border-gray-200 text-xs font-bold bg-gray-50">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 3 Months</SelectItem>
            <SelectItem value="180">Last 6 Months</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
