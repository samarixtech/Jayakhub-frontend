import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GlobalSelect from "@/components/common/GlobalSelect";
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

  const categoryOptions = filters.map((filter) => ({
    value: filter.label,
    label: `${filter.label} (${filter.count})`,
  }));

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

      <div className="w-full sm:w-[220px] shrink-0">
        <GlobalSelect
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          className="h-10"
        />
      </div>
    </div>
  );
};
