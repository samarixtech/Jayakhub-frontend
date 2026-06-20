"use client";

import React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import GlobalDateFilter from "@/components/modules/restaurant/layout/GlobalDateFilter";
import { useExport } from "@/utils/use-export";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import { format } from "date-fns";

interface FinanceHeaderProps {
  restaurantName: string;
}

const FinanceHeader = ({ restaurantName }: FinanceHeaderProps) => {
  const t = useTranslations("RestaurantDashboard.Payments.header");
  const { startDate, endDate } = useDateFilter();
  const { isExporting, handleExport } = useExport({
    successMessage: "Finance report exported successfully!",
    errorMessage: "Failed to export finance report.",
  });

  const onExport = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `Finance_Report_${restaurantName.replace(/\s+/g, "_")}_${dateStr}.csv`;
    handleExport("finance-dashboard/export", filename, {
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      <div className="flex items-center gap-3">
        <GlobalDateFilter />
        <Button
          variant="outline"
          className="bg-[#346853] text-white hover:bg-[#2a5644] hover:text-white border-0 h-9 text-[13px]"
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <Download className="mr-2 w-4 h-4" />
          )}
          {isExporting ? t("exportingBtn") : t("exportBtn")}
        </Button>
      </div>
    </div>
  );
};

export default FinanceHeader;
