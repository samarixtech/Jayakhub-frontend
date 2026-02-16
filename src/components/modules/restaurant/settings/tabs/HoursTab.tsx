"use client";

import React, { useState, useEffect } from "react";
import { Clock, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsData } from "../types";
import { useServerAction } from "@/hooks/use-server-action";
import { updateRestaurantScheduleAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function formatTimeForInput(timeStr: string): string {
  if (!timeStr) return "";
  // Ensure "HH:MM" format for input type="time"
  const [hours, minutes] = timeStr.split(":");
  return `${hours}:${minutes}`;
}

const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function HoursTab({ settings }: { settings: SettingsData | null }) {
  const router = useRouter();
  const initialSchedules = React.useMemo(() => {
    // Ensure all days are present, default to closed if missing
    const existing = settings?.schedules || [];
    return DAYS_ORDER.map((day) => {
      const found = existing.find((s) => s.dayOfWeek === day);
      return (
        found || {
          dayOfWeek: day,
          openTime: "09:00:00",
          closeTime: "22:00:00",
          isClosed: true,
        }
      );
    });
  }, [settings?.schedules]);

  const [schedules, setSchedules] = useState(initialSchedules);
  const [isDirty, setIsDirty] = useState(false);

  // Sync state if initialSchedules changes
  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  // Check for changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(schedules) !== JSON.stringify(initialSchedules);
    setIsDirty(hasChanges);
  }, [schedules, initialSchedules]);

  const { execute: updateSchedule, isPending } = useServerAction(
    updateRestaurantScheduleAction,
    {
      onSuccess: () => {
        router.refresh();
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    },
  );

  const handleTimeChange = (
    index: number,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    const newSchedules = [...schedules];
    // Append seconds to match backend format "HH:MM:SS"
    newSchedules[index] = { ...newSchedules[index], [field]: `${value}:00` };
    setSchedules(newSchedules);
  };

  const handleToggleClosed = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      isClosed: !newSchedules[index].isClosed,
    };
    setSchedules(newSchedules);
  };

  const handleSubmit = () => {
    // Format payload: remove extra fields if any, ensure time format
    const payload = schedules.map(
      ({ dayOfWeek, openTime, closeTime, isClosed }) => ({
        dayOfWeek,
        openTime,
        closeTime,
        isClosed,
      }),
    );
    updateSchedule(payload);
  };

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Operating Hours</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Set your weekly opening and closing times.
        </p>
      </div>

      <div className="space-y-0 text-sm">
        {/* Header Row */}
        <div className="flex items-center gap-4 pb-2 mb-2 border-b border-gray-100 text-gray-500 font-medium px-2">
          <span className="w-[120px]">Day</span>
          <span className="w-[120px] text-center">Open Time</span>
          <span className="w-4"></span>
          <span className="w-[120px] text-center">Close Time</span>
          <div className="flex-1" />
          <span className="w-[60px] text-right">Status</span>
        </div>

        {schedules.map((schedule, index) => (
          <div
            key={schedule.dayOfWeek}
            className={`flex items-center gap-4 py-3 border-b border-gray-50 last:border-b-0 px-2 transition-colors rounded-lg hover:bg-gray-50/50 ${schedule.isClosed ? "opacity-60" : ""}`}
          >
            {/* Day */}
            <span className="w-[120px] font-medium text-gray-700">
              {schedule.dayOfWeek}
            </span>

            {/* Open Time */}
            <div className="relative">
              <Input
                type="time"
                value={formatTimeForInput(schedule.openTime)}
                onChange={(e) =>
                  handleTimeChange(index, "openTime", e.target.value)
                }
                disabled={schedule.isClosed}
                className="h-9 w-[120px] text-center border-gray-200 focus-visible:ring-primary/20 bg-white"
              />
            </div>

            <span className="text-gray-400 w-4 text-center text-xs">to</span>

            {/* Close Time */}
            <div className="relative">
              <Input
                type="time"
                value={formatTimeForInput(schedule.closeTime)}
                onChange={(e) =>
                  handleTimeChange(index, "closeTime", e.target.value)
                }
                disabled={schedule.isClosed}
                className="h-9 w-[120px] text-center border-gray-200 focus-visible:ring-primary/20 bg-white"
              />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Toggle */}
            <div className="w-[60px] flex justify-end">
              <Switch
                checked={!schedule.isClosed}
                onCheckedChange={() => handleToggleClosed(index)}
                className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isDirty}
          className={`
                min-w-[140px] transition-all duration-300 gap-2
                ${
                  !isDirty || isPending
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                }
            `}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Schedule
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
