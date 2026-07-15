"use client";
import { useState, useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";
import { useExport } from "@/utils/use-export";
import { format } from "date-fns";

interface PaymentHistoryHeaderProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export function PaymentHistoryHeader({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: PaymentHistoryHeaderProps) {
  const t = useTranslations("CustomerDashboard.Billing");

  // Popover open states
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // Draft states initialized with prop values
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);

  // Synchronize draft states with props when props change
  useEffect(() => {
    setTempStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setTempEndDate(endDate);
  }, [endDate]);

  const handleApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const handleDelete = () => {
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const isApplyDisabled = !tempStartDate && !tempEndDate;
  const isDeleteDisabled = !tempStartDate && !tempEndDate && !startDate && !endDate;

  const { isExporting, handleExport } = useExport({
    successMessage: t("export_success"),
    errorMessage: t("export_error")
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

      <div className="flex flex-col xl:flex-row items-stretch xl:items-end gap-4 w-full md:w-auto">
        <div className="flex flex-wrap items-end gap-3 w-full sm:w-auto">
          {/* Start Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider pl-0.5">{t("start_date")}</span>
            <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-3 text-[#1E293B] cursor-pointer shadow-sm min-w-[145px] text-[13px]"
                >
                  <span className="truncate">
                    {tempStartDate ? format(tempStartDate, "MM/dd/yyyy") : t("pick_date")}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 ml-1.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={tempStartDate}
                  modifiersClassNames={{
                    today: "!bg-[#346853]/10 !text-[#346853] font-bold rounded-md",
                  }}
                  onSelect={(date) => {
                    setTempStartDate(date);
                    setIsStartOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider pl-0.5">{t("end_date")}</span>
            <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-3 text-[#1E293B] cursor-pointer shadow-sm min-w-[145px] text-[13px]"
                >
                  <span className="truncate">
                    {tempEndDate ? format(tempEndDate, "MM/dd/yyyy") : t("pick_date")}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 ml-1.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={tempEndDate}
                  disabled={tempStartDate ? { before: tempStartDate } : undefined}
                  onSelect={(date) => {
                    setTempEndDate(date);
                    setIsEndOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            disabled={isApplyDisabled}
            className="h-9 rounded-lg bg-[#346853] hover:bg-[#346853]/90 text-white font-bold text-[13px] px-5 shadow-sm cursor-pointer"
          >
            {t("apply")}
          </Button>

          {/* Delete Button */}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="h-9 rounded-lg border border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-[13px] px-5 shadow-sm cursor-pointer"
          >
            {t("clear")}
          </Button>
        </div>

        <Button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="h-9 rounded-lg bg-[#346853] hover:bg-[#346853]/90 text-white font-bold text-[13px] px-4 shadow-sm flex items-center justify-center cursor-pointer min-w-[120px]"
        >
          <FileDown className="w-4 h-4 mr-2 stroke-[2.5px]" />
          {isExporting ? t("exporting") : t("export_csv")}
        </Button>
      </div>
    </header>
  );
}
