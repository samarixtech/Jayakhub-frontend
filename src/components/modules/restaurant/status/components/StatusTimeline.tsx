"use client";

import { Check, Clock, Mail, Rocket } from "lucide-react";
import { Typography } from "@/components/ui/typography";

const TIMELINE_STEPS = [
  {
    title: "Application Submitted",
    description: "Your application is in our queue",
    icon: Check,
    status: "completed",
    bgColor: "bg-emerald-500",
    iconColor: "text-white",
  },
  {
    title: "Team Review",
    description: "Usually takes 1-2 business days",
    icon: Clock,
    status: "current",
    bgColor: "bg-[#346853]",
    iconColor: "text-white",
  },
  {
    title: "Confirmation Email",
    description: "You'll receive an email once approved",
    icon: Mail,
    status: "upcoming",
    bgColor: "bg-white border border-gray-200",
    iconColor: "text-gray-400",
  },
  {
    title: "Go Live",
    description: "Start accepting orders on JayakHub",
    icon: Rocket,
    status: "upcoming",
    bgColor: "bg-white border border-gray-200",
    iconColor: "text-gray-400",
  },
];

export function StatusTimeline() {
  return (
    <div className="relative space-y-8 text-left">
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
