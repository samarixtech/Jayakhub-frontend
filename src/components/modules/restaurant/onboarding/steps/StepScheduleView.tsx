"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  scheduleSchema,
  ScheduleInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";

export default function StepScheduleView() {
  const { country, language } = useLocale();
  const router = useRouter();
  const { nextStep, prevStep } = useOnboarding();

  const form = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema) as any,
    defaultValues: DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day.toLowerCase()]: {
          isOpen: true,
          openTime: "09:00",
          closeTime: "23:00",
        },
      }),
      {} as ScheduleInput,
    ),
  });

  // Load data
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_schedule_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (e) { }
    }
  }, [form]);

  const onSubmit = (data: any) => {
    console.log("Static Mode: Saving Schedule", data);
    localStorage.setItem("onboarding_schedule_info", JSON.stringify(data));
    toast.success("Schedule saved");
    nextStep();
    router.push(`/${country}/${language}/restaurant/onboarding/step-kyc`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Operating Hours
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            {DAYS.map((day) => {
              const dayKey = day.toLowerCase() as keyof ScheduleInput;

              return (
                <div
                  key={day}
                  className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl"
                >
                  <span className="text-sm font-bold text-gray-700 w-24">
                    {day}
                  </span>

                  <div className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name={`${dayKey}.openTime` as any}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="w-28 h-9 bg-gray-50/50 text-center text-xs border-none"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />

                    <span className="text-xs text-gray-400 font-bold">to</span>

                    <FormField
                      control={form.control}
                      name={`${dayKey}.closeTime` as any}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="w-28 h-9 bg-gray-50/50 text-center text-xs border-none"
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
                        />
                      </FormControl>
                    )}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 border-t border-gray-50 gap-4 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                prevStep();
                router.back();
              }}
              className="w-full sm:w-auto text-gray-400 font-bold hover:bg-transparent"
            >
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Typography className="text-sm font-medium text-gray-500">
                Step 04 of 06
              </Typography>
              <Button
                type="submit"
                disabled={false}
                className="w-full sm:w-auto bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                Next Step
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
