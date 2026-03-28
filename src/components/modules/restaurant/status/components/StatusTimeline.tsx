"use client";

import { Check, Clock, Mail, Rocket } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

export function StatusTimeline() {
  const t = useTranslations("RestaurantDashboard.Status.timeline");
  
  const TIMELINE_STEPS = [
    {
      title: t("step1.title"),
      description: t("step1.description"),
      icon: Check,
      status: "completed",
      bgColor: "bg-emerald-500",
      iconColor: "text-white",
    },
    {
      title: t("step2.title"),
      description: t("step2.description"),
      icon: Clock,
      status: "current",
      bgColor: "bg-[#346853]",
      iconColor: "text-white",
    },
    {
      title: t("step3.title"),
      description: t("step3.description"),
      icon: Mail,
      status: "upcoming",
      bgColor: "bg-white border border-gray-200",
      iconColor: "text-gray-400",
    },
    {
      title: t("step4.title"),
      description: t("step4.description"),
      icon: Rocket,
      status: "upcoming",
      bgColor: "bg-white border border-gray-200",
      iconColor: "text-gray-400",
    },
  ];

  return (
    <div className="relative space-y-3 sm:space-y-6 lg:space-y-5 text-left">
      <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
      {TIMELINE_STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="relative z-10 flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step.bgColor}`}
            >
              <Icon className={`w-5 h-5 ${step.iconColor}`} />
            </div>
            <div className="pt-0.5">
              <Typography className="text-sm font-bold text-gray-900">
                {step.title}
              </Typography>
              <Typography className="text-xs text-gray-500 mt-0.5">
                {step.description}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
