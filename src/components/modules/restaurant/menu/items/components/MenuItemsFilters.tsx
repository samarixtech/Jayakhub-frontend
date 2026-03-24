import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface MenuItemsFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: { label: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

export const MenuItemsFilters: React.FC<MenuItemsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  selectedCategory,
  setSelectedCategory,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.views");

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <div className="relative w-full sm:w-[250px] shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white border-gray-200 h-10 shadow-sm rounded-lg w-full"
        />
      </div>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
        {filters.map((filter) => (
          <Badge
            key={filter.label}
            variant={selectedCategory === filter.label ? "default" : "outline"}
            onClick={() => setSelectedCategory(filter.label)}
            className={`h-9 px-4 rounded-full cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === filter.label
                ? "bg-emerald-bg hover:bg-emerald-bg-hover text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {filter.label}
            <span
              className={`ml-2 text-xs opacity-80 ${
                selectedCategory === filter.label
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {filter.count}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};
