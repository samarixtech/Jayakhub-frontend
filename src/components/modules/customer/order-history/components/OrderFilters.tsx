import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface OrderFiltersProps {
  showFilters: boolean;
  statusFilters: string[];
  setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>;
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
}

export const OrderFilters = ({
  showFilters,
  statusFilters,
  setStatusFilters,
  dateRange,
  setDateRange,
}: OrderFiltersProps) => {
  const t = useTranslations("CustomerDashboard.OrderHistory");

  return (
    <div
      className={`${
        showFilters ? "flex" : "hidden"
      } md:flex flex-col md:flex-row bg-white rounded-2xl p-4 md:p-2 md:pl-6 shadow-sm items-start md:items-center gap-4 md:gap-6 overflow-x-auto transition-all`}
    >
      <span className="text-sm font-bold text-gray-900 shrink-0 mb-2 md:mb-0">
        {t("filters_label")}
      </span>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
        {/* Status Checkboxes */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-all"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilters.length === 0}
            onCheckedChange={() => setStatusFilters([])}
          />
          <label
            htmlFor="filter-all"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {t("filter_all")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-active"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilters.includes("active")}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilters(["active"]);
              } else {
                setStatusFilters([]);
              }
            }}
          />
          <label
            htmlFor="filter-active"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {t("filter_active")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-delivered"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilters.includes("delivered")}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilters(["delivered"]);
              } else {
                setStatusFilters([]);
              }
            }}
          />
          <label
            htmlFor="filter-delivered"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {t("filter_delivered")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-rejected"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilters.includes("rejected")}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilters(["rejected"]);
              } else {
                setStatusFilters([]);
              }
            }}
          />
          <label
            htmlFor="filter-rejected"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {t("filter_rejected")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-cancelled"
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
            checked={statusFilters.includes("cancelled")}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilters(["cancelled"]);
              } else {
                setStatusFilters([]);
              }
            }}
          />
          <label
            htmlFor="filter-cancelled"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {t("filter_cancelled")}
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 md:ml-auto w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full md:w-[140px] h-9 rounded-lg border-gray-200 text-xs font-bold bg-gray-50">
            <SelectValue placeholder={t("date_range")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1">{t("last_30_days")}</SelectItem>
            <SelectItem value="3">{t("last_3_months")}</SelectItem>
            <SelectItem value="6">{t("last_6_months")}</SelectItem>
            <SelectItem value="12">{t("last_year")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
