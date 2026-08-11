"use client";

import {
  ChevronDown,
  Search,
  LayoutGrid,
  ListFilter,
  Plus,
  Filter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEAL_TYPE_OPTIONS } from "../types/deals";

interface DealsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  onOpenBuilder: () => void;
}

export function DealsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
  onOpenBuilder,
}: DealsFiltersProps) {
  const t = useTranslations("RestaurantDashboard.Deals");
  const statusTabs = [
    { key: "all", label: t("status.all") },
    { key: "active", label: t("status.active") },
    { key: "inactive", label: t("status.inactive") },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="pl-10 h-10 rounded-xl border-gray-200 bg-white text-sm focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-xl border-gray-200 bg-white text-sm justify-between px-3 font-normal min-w-[170px] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {typeFilter === "all" ||
                    !DEAL_TYPE_OPTIONS.some((opt) => opt.value === typeFilter)
                      ? t("filters.allDealTypes")
                      : t(`dealTypes.${typeFilter}`)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl bg-white"
            >
              <DropdownMenuItem
                onClick={() => setTypeFilter("all")}
                className="cursor-pointer text-xs font-medium"
              >
                {t("filters.allDealTypes")}
              </DropdownMenuItem>
              {DEAL_TYPE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className="cursor-pointer text-xs font-medium"
                >
                  {t(`dealTypes.${opt.value}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-navy shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title={t("filters.gridViewTitle")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-navy shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title={t("filters.tableViewTitle")}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={onOpenBuilder}
            className="h-10 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-xs px-4 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("filters.createDeal")}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? "bg-navy text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
