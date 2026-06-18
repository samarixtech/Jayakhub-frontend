"use client";
import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";
import { useExport } from "@/utils/use-export";
import { format } from "date-fns";

export function PaymentHistoryHeader() {
  const t = useTranslations("CustomerDashboard.Billing");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { isExporting, handleExport } = useExport({
    successMessage: "CSV export completed successfully!",
    errorMessage: "Failed to export CSV. Please try again."
  });

  const handleExportCSV = async () => {
    await handleExport(
      "all-orders/export",
      "payment-history-export.csv",
      {
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      }
    );
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div>
        <Typography
          variant="h2"
          className="text-[#1E293B] font-bold text-[22px] tracking-tight"
        >
          {t("title")}
        </Typography>
        <Typography className="text-[#64748B] text-[13px] font-medium mt-1">
          {t("subtitle")}
        </Typography>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2">
          {/* Start Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Start Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-3 text-[#1E293B] cursor-pointer shadow-sm min-w-[145px] text-[13px]"
                >
                  <span className="truncate">
                    {startDate ? format(startDate, "MM/dd/yyyy") : "Pick date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 ml-1.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">End Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-3 text-[#1E293B] cursor-pointer shadow-sm min-w-[145px] text-[13px]"
                >
                  <span className="truncate">
                    {endDate ? format(endDate, "MM/dd/yyyy") : "Pick date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 ml-1.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="h-9 mt-auto sm:mt-5 rounded-lg bg-[#346853] hover:bg-[#346853]/90 text-white font-bold text-[13px] px-4 shadow-sm flex items-center justify-center cursor-pointer"
        >
          <FileDown className="w-4 h-4 mr-2 stroke-[2.5px]" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>
    </header>
  );
}
