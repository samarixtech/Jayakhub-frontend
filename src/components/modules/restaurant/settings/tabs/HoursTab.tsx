import React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsData } from "../types";

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? "pm" : "am";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(displayH).padStart(2, "0")}:${minutes} ${suffix}`;
}

export function HoursTab({ settings }: { settings: SettingsData | null }) {
  const schedules = settings?.schedules || [];
  const profile = settings?.profile;
  const isOnline = profile?.status === "active";

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Operating Hours</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Set your weekly schedule.
        </p>
      </div>

      {/* Restaurant Status Toggle */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Restaurant Status
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isOnline
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <Switch
            checked={isOnline}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="space-y-0">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-b-0"
          >
            {/* Day */}
            <span className="w-[120px] text-sm font-medium text-gray-700">
              {schedule.dayOfWeek}
            </span>

            {/* Open Time */}
            <div className="flex items-center gap-1.5">
              <Input
                defaultValue={formatTime(schedule.openTime)}
                className="h-9 w-[120px] text-sm text-center border-gray-200 focus-visible:ring-primary/20"
                readOnly
              />
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <span className="text-sm text-gray-400">to</span>

            {/* Close Time */}
            <div className="flex items-center gap-1.5">
              <Input
                defaultValue={formatTime(schedule.closeTime)}
                className="h-9 w-[120px] text-sm text-center border-gray-200 focus-visible:ring-primary/20"
                readOnly
              />
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Toggle */}
            <Switch
              checked={!schedule.isClosed}
              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Save Schedule
        </Button>
      </div>
    </div>
  );
}
