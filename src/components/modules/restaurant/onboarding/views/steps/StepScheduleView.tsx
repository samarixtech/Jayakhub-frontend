"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TimePicker } from "@/components/ui/time-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useStepSchedule } from "../../hooks/useStepSchedule";
import { cn } from "@/lib/utils";

export default function StepScheduleView() {
  const { form, onSubmit, days, timezones, timezone, setTimezone, isLoadingTimezones, timezoneError } = useStepSchedule();
  const [tzOpen, setTzOpen] = useState(false);

  const selectedTz = timezones.find((tz) => tz.name === timezone);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Operating Hours
      </Typography>

      {/* Timezone Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-gray-400" />
          Timezone <span className="text-red-500">*</span>
        </Label>
        <Popover open={tzOpen} onOpenChange={setTzOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={tzOpen}
              className={cn(
                "w-full justify-between h-11 rounded-xl border-gray-200 text-sm font-normal",
                timezoneError && "border-red-500 focus:ring-red-500",
              )}
              disabled={isLoadingTimezones}
            >
              <span className={cn(!selectedTz && "text-gray-400")}>
                {isLoadingTimezones
                  ? "Loading timezones..."
                  : selectedTz
                    ? selectedTz.label
                    : "Select timezone"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white" align="start">
            <Command>
              <CommandInput placeholder="Search timezone..." className="h-9" />
              <CommandList className="max-h-64">
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup>
                  {timezones.map((tz) => (
                    <CommandItem
                      key={tz.name}
                      value={tz.label}
                      onSelect={() => {
                        setTimezone(tz.name);
                        setTzOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          timezone === tz.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {tz.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {timezoneError && (
          <p className="text-xs text-red-500 font-medium">Please select a timezone</p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            {days.map((day) => {
              const dayKey = day.toLowerCase();
              const isOpen = form.watch(`${dayKey}.isOpen` as any);

              return (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-0 sm:p-4 bg-transparent sm:bg-white border-b sm:border border-gray-100 sm:rounded-2xl sm:shadow-sm gap-4 py-4 sm:py-4"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <span className="text-[13px] sm:text-sm font-bold text-gray-700 w-24">
                      {day}
                    </span>
                    <div className="sm:hidden">
                      <FormField
                        control={form.control}
                        name={`${dayKey}.isOpen` as any}
                        render={({ field }) => (
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-emerald-bg"
                            />
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-center flex-1">
                    <FormField
                      control={form.control}
                      name={`${dayKey}.openTime` as any}
                      render={({ field }) => (
                        <FormItem className="relative pb-2 flex-1 max-w-[145px] sm:max-w-[160px]">
                          <FormControl>
                            <TimePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={!isOpen}
                            />
                          </FormControl>
                          <FormMessage className="text-[9px] sm:text-[10px] text-red-500 absolute -bottom-3 left-1/2 -translate-x-1/2 text-center w-[160px] leading-tight" />
                        </FormItem>
                      )}
                    />

                    <span className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-tighter sm:tracking-normal">
                      To
                    </span>

                    <FormField
                      control={form.control}
                      name={`${dayKey}.closeTime` as any}
                      render={({ field }) => (
                        <FormItem className="relative pb-2 flex-1 max-w-[145px] sm:max-w-[160px]">
                          <FormControl>
                            <TimePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={!isOpen}
                            />
                          </FormControl>
                          <FormMessage className="text-[9px] sm:text-[10px] text-red-500 absolute -bottom-3 left-1/2 -translate-x-1/2 text-center w-[160px] leading-tight" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="hidden sm:block">
                    <FormField
                      control={form.control}
                      name={`${dayKey}.isOpen` as any}
                      render={({ field }) => (
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-emerald-bg"
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              className="bg-emerald-bg text-white px-10 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
