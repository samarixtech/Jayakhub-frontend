import React from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface OrderHistoryHeaderProps {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OrderHistoryHeader = ({
  showFilters,
  setShowFilters,
}: OrderHistoryHeaderProps) => {
  const t = useTranslations("CustomerDashboard.OrderHistory");

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-4">
      <div>
        <Typography
          variant="h2"
          className="text-[#111827] font-black text-xl md:text-2xl"
        >
          {t("title")}
        </Typography>
        <Typography
          variant="small"
          className="text-gray-500 mt-0.5 md:mt-1 text-xs md:text-sm"
        >
          {t("subtitle")}
        </Typography>
      </div>
      <div className="flex gap-2.5 md:gap-3 w-full sm:w-auto">
        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex-1 sm:flex-none rounded-full border-gray-200 bg-white text-gray-700 h-9 px-3 hover:bg-gray-50 text-[10px] font-bold"
        >
          <Filter className="h-3 w-3 mr-1.5" /> {t("filters_btn")}
        </Button>
      </div>
    </header>
  );
};
