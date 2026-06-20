"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse value
  const [hoursStr, minutesStr] = (value || "00:00").split(":");
  const selectedHour = parseInt(hoursStr, 10) || 0;
  const selectedMinute = parseInt(minutesStr, 10) || 0;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 1-minute intervals for flexibility

  const handleHourSelect = (hour: number) => {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(selectedMinute).padStart(2, "0");
    onChange(`${formattedHour}:${formattedMinute}`);
  };

  const handleMinuteSelect = (minute: number) => {
    const formattedHour = String(selectedHour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    onChange(`${formattedHour}:${formattedMinute}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full h-9 justify-center text-center font-normal gap-2 px-3 bg-background border-input hover:bg-muted/50 transition-colors",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <Clock className="h-4 w-4 opacity-50 shrink-0" />
          <span>{value || "00:00"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 bg-white" align="center">
        <div className="flex h-64 divide-x divide-border">
          {/* Hours Column */}
          <ScrollArea className="flex-1 h-full">
            <div className="flex flex-col p-1.5">
              <div className="text-xs text-muted-foreground bg-white font-semibold text-center py-1 border-b border-border/50 mb-1 sticky top-0 bg-popover z-10">
                Hrs
              </div>
              {hours.map((hour) => {
                const isSelected = selectedHour === hour;
                return (
                  <Button
                    key={hour}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-center text-center h-8 text-sm"
                    onClick={() => handleHourSelect(hour)}
                  >
                    {String(hour).padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Minutes Column */}
          <ScrollArea className="flex-1 h-full">
            <div className="flex flex-col p-1.5">
              <div className="text-xs text-muted-foreground bg-white font-semibold text-center py-1 border-b border-border/50 mb-1 sticky top-0 bg-popover z-10">
                Min
              </div>
              {minutes.map((minute) => {
                const isSelected = selectedMinute === minute;
                return (
                  <Button
                    key={minute}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-center text-center h-8 text-sm"
                    onClick={() => handleMinuteSelect(minute)}
                  >
                    {String(minute).padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
