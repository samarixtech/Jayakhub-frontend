"use client";

import { useEffect, useState } from "react";
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
import { getTimezonesAction } from "@/app/actions/public/timezones";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type TimezoneOption = {
  name: string;
  offset: string;
  label: string;
};

// Jan 1, 2024 00:00:00 UTC — a Monday — used as the reference week base
const BASE_MONDAY_EPOCH = 1704067200000;

const timeToEpoch = (dayIndex: number, timeStr: string): number => {
  const [hours = 0, minutes = 0] = (timeStr || "00:00").split(":").map(Number);
  return BASE_MONDAY_EPOCH + dayIndex * 86400000 + hours * 3600000 + minutes * 60000;
};

const epochToTimeStr = (epoch: number | string | null | undefined): string => {
  const num = Number(epoch);
  // If it's a small number or zero it's not a valid epoch — fall back to "09:00"
  if (!num || num < 86400000) return "09:00";
  const d = new Date(num);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const useStepSchedule = () => {
  const { country, language } = useLocale();
  const router = useRouter();
  const { nextStep } = useOnboarding();

  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [timezone, setTimezoneState] = useState<string>("");
  const [isLoadingTimezones, setIsLoadingTimezones] = useState(false);
  const [timezoneError, setTimezoneError] = useState(false);

  const setTimezone = (value: string) => {
    setTimezoneState(value);
    if (value) setTimezoneError(false);
  };

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

  // Load saved schedule — convert stored epochs back to HH:MM for the form
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_schedule_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { timezone: savedTimezone, ...scheduleOnly } = parsed;

        const formSchedule: any = {};
        Object.entries(scheduleOnly).forEach(([day, val]: [string, any]) => {
          formSchedule[day] = {
            isOpen: val.isOpen,
            openTime:
              typeof val.openTime === "number"
                ? epochToTimeStr(val.openTime)
                : val.openTime || "09:00",
            closeTime:
              typeof val.closeTime === "number"
                ? epochToTimeStr(val.closeTime)
                : val.closeTime || "23:00",
          };
        });

        form.reset(formSchedule);
        if (savedTimezone) setTimezone(savedTimezone);
      } catch (e) {
        console.error("Failed to load schedule", e);
      }
    }
  }, [form]);

  // Fetch timezone options from backend
  useEffect(() => {
    const fetchTimezones = async () => {
      setIsLoadingTimezones(true);
      try {
        const result = await getTimezonesAction();
        if (result.success && Array.isArray(result.data)) {
          setTimezones(result.data);
        }
      } catch (e) {
        console.error("Failed to fetch timezones", e);
      } finally {
        setIsLoadingTimezones(false);
      }
    };
    fetchTimezones();
  }, []);

  const onSubmit = (data: ScheduleInput) => {
    if (!timezone) {
      setTimezoneError(true);
      toast.error("Please select a timezone");
      return;
    }

    // Convert HH:MM → epoch milliseconds before storing
    const epochData: any = {};
    DAYS.forEach((day, idx) => {
      const dayKey = day.toLowerCase();
      const dayData = (data as any)[dayKey];
      epochData[dayKey] = {
        isOpen: dayData.isOpen,
        openTime: dayData.isOpen
          ? timeToEpoch(idx, dayData.openTime || "00:00")
          : 0,
        closeTime: dayData.isOpen
          ? timeToEpoch(idx, dayData.closeTime || "00:00")
          : 0,
      };
    });

    localStorage.setItem(
      "onboarding_schedule_info",
      JSON.stringify({ ...epochData, timezone }),
    );
    toast.success("Schedule saved");
    nextStep();
    router.push(`/restaurant/onboarding/step-kyc`);
  };

  return {
    form,
    onSubmit,
    days: DAYS,
    timezones,
    timezone,
    setTimezone,
    isLoadingTimezones,
    timezoneError,
  };
};
