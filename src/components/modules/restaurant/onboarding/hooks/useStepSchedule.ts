"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  scheduleSchema,
  ScheduleInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "../OnboardingContext";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const useStepSchedule = () => {
  const { country, language } = useLocale();
  const router = useRouter();
  const { nextStep } = useOnboarding();

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

  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_schedule_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to load schedule", e);
      }
    }
  }, [form]);

  const onSubmit = (data: ScheduleInput) => {
    localStorage.setItem("onboarding_schedule_info", JSON.stringify(data));
    toast.success("Schedule saved");
    nextStep();
    router.push(`/restaurant/onboarding/step-kyc`);
  };

  return {
    form,
    onSubmit,
    days: DAYS,
  };
};
