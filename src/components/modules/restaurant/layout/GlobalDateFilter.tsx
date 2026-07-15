"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import { useTranslations } from "next-intl";

export default function GlobalDateFilter() {
  const t = useTranslations("RestaurantDashboard.Orders.filters");
  const { startDate, endDate, setStartDate, setEndDate, clearDates } = useDateFilter();

  const [tempStartDate, setTempStartDate] = React.useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = React.useState<Date | undefined>(endDate);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempStartDate(startDate);
  }, [startDate]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempEndDate(endDate);
  }, [endDate]);

  const handleApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const isModified =
    (tempStartDate ? tempStartDate.getTime() : 0) !== (startDate ? startDate.getTime() : 0) ||
    (tempEndDate ? tempEndDate.getTime() : 0) !== (endDate ? endDate.getTime() : 0);

  return (
    <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100/80 shadow-sm">
      {/* Start Date */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1.5">{t("from")}</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-2.5 text-gray-800 cursor-pointer hover:border-primary/30 hover:bg-gray-50/50 transition-all text-xs min-w-[115px] shadow-sm"
            >
              <span className="truncate">
                {tempStartDate ? format(tempStartDate, "MM/dd/yyyy") : t("startDate")}
              </span>
              <CalendarIcon className="h-3.5 w-3.5 text-gray-400 shrink-0 ml-1.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-md border border-gray-100" align="start">
            <Calendar
              mode="single"
              selected={tempStartDate}
              onSelect={setTempStartDate}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("to")}</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 justify-between text-left font-normal border border-gray-200 bg-white rounded-lg px-2.5 text-gray-800 cursor-pointer hover:border-primary/30 hover:bg-gray-50/50 transition-all text-xs min-w-[115px] shadow-sm"
            >
              <span className="truncate">
                {tempEndDate ? format(tempEndDate, "MM/dd/yyyy") : t("endDate")}
              </span>
              <CalendarIcon className="h-3.5 w-3.5 text-gray-400 shrink-0 ml-1.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-md border border-gray-100" align="start">
            <Calendar
              mode="single"
              selected={tempEndDate}
              onSelect={setTempEndDate}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        disabled={!isModified}
        className="h-8 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs px-3 font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {t("apply")}
      </Button>

      {/* Clear/Reset Button */}
      {(tempStartDate || tempEndDate) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setTempStartDate(undefined);
            setTempEndDate(undefined);
            clearDates();
          }}
          className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
          title={t("clearDates")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
