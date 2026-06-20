"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsData } from "@/types";
import { useServerAction } from "@/hooks/use-server-action";
import { updateRestaurantScheduleAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";
import { TimePicker } from "@/components/ui/time-picker";
import { useRouter } from "next/navigation";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";

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

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function HoursView({ settings }: { settings: SettingsData | null }) {
  const t = useTranslations("RestaurantDashboard.Settings.hours");
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

  if (!settings) {
    return <SettingsSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-gray-500">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0 text-sm">
          {/* Header Row */}
          <div className="grid grid-cols-[1.5fr_1.5fr_auto_1.5fr_1.5fr] gap-x-4 pb-2 mb-2 border-b border-border text-muted-foreground font-medium px-2 items-center">
            <span>{t("tableDay")}</span>
            <span className="text-center">{t("tableOpen")}</span>
            <span className="w-4"></span>
            <span className="text-center">{t("tableClose")}</span>
            <span className="text-right">{t("tableStatus")}</span>
          </div>

          {schedules.map((schedule, index) => (
            <div
              key={schedule.dayOfWeek}
              className={`grid grid-cols-[1.5fr_1.5fr_auto_1.5fr_1.5fr] gap-x-4 py-3 border-b border-border/50 last:border-b-0 px-2 transition-colors rounded-lg hover:bg-muted/50 items-center ${schedule.isClosed ? "opacity-60" : ""}`}
            >
              {/* Day */}
              <span className="font-medium text-foreground">
                {schedule.dayOfWeek}
              </span>

              {/* Open Time */}
              <div className="relative">
                <TimePicker
                  value={formatTimeForInput(schedule.openTime)}
                  onChange={(val) => handleTimeChange(index, "openTime", val)}
                  disabled={schedule.isClosed}
                />
              </div>

              <span className="text-muted-foreground w-4 text-center text-xs">
                {t("to")}
              </span>

              {/* Close Time */}
              <div className="relative">
                <TimePicker
                  value={formatTimeForInput(schedule.closeTime)}
                  onChange={(val) => handleTimeChange(index, "closeTime", val)}
                  disabled={schedule.isClosed}
                />
              </div>

              {/* Toggle */}
              <div className="flex justify-end">
                <Switch
                  checked={!schedule.isClosed}
                  onCheckedChange={() => handleToggleClosed(index)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border pt-6 mt-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isDirty}
          className={`
            min-w-[140px] transition-all duration-300 gap-2
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
              {t("saveBtn")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
