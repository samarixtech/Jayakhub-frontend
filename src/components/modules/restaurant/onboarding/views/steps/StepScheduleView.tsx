"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useStepSchedule } from "../../hooks/useStepSchedule";

export default function StepScheduleView() {
  const { form, onSubmit, days } = useStepSchedule();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Operating Hours
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            {days.map((day) => {
              const dayKey = day.toLowerCase();

              return (
                <div
                  key={day}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <span className="text-sm font-bold text-gray-700 w-24">
                    {day}
                  </span>

                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`${dayKey}.openTime` as any}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="w-28 h-10 bg-gray-50 text-center text-sm border-none rounded-xl"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />

                    <span className="text-xs text-gray-400 font-bold uppercase">
                      To
                    </span>

                    <FormField
                      control={form.control}
                      name={`${dayKey}.closeTime` as any}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="w-28 h-10 bg-gray-50 text-center text-sm border-none rounded-xl"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                  </div>

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
