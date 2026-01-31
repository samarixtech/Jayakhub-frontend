"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Mail, Rocket, XCircle, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";

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

export default function RestaurantStatusView() {
  const router = useRouter();
  const { country, language } = useLocale();
  const [status, setStatus] = useState<
    "pending" | "rejected" | "active" | null
  >(null);
  const [loading, setLoading] = useState(true);

  const { execute } = useServerAction(getRestaurantStatusAction, {
    onSuccess: (data: any) => {
      if (!data) return;

      const currentStatus = data.status;
      setStatus(currentStatus);
      setLoading(false);

      if (currentStatus === "active") {
        const targetCountry = country || "pakistan";
        const targetLang = language || "en";
        router.push(`/${targetCountry}/${targetLang}/restaurant/dashboard`);
      }
    },
    onError: (err) => {
      console.error("Failed to fetch status", err);
      setLoading(false);
      // Optional: redirect to onboarding if needed
      // router.push(`/${country}/${language}/restaurant/onboarding`);
    },
  });

  useEffect(() => {
    execute();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#346853]" />
      </div>
    );
  }

  // REJECTED VIEW
  if (status === "rejected") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 sm:p-12 text-center rounded-3xl shadow-lg border-none bg-white">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <XCircle className="w-10 h-10 text-red-500 stroke-[2px]" />
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Application Rejected
          </Typography>
          <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base mb-8">
            Unfortunately, your application to join JayakHub was not approved at
            this time. Please contact support for more details.
          </Typography>
        </Card>
      </div>
    );
  }

  // PENDING VIEW (Existing User)
  const isNew =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("new") === "true";

  if (status === "pending" && !isNew) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 sm:p-12 text-center rounded-3xl shadow-lg border-none bg-white">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <Clock className="w-10 h-10 text-orange-500 stroke-[2px]" />
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Application Pending
          </Typography>
          <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base mb-8">
            Your application is currently under review by our team. We will
            notify you once a decision has been made.
          </Typography>

          <div className="w-full border-t border-gray-100 mb-8 mt-4" />

          {/* Timeline Reuse or Simplified */}
          <div className="">
            <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              CURRENT STATUS
            </Typography>
            <div className="relative space-y-8 text-left">
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
              {TIMELINE_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative z-10 flex items-start gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.bgColor}`}
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
          </div>
        </Card>
      </div>
    );
  }

  // SUBMITTED VIEW (New Submission)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 sm:p-12 text-center rounded-3xl shadow-lg border-none bg-white">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 animate-in zoom-in duration-500">
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </div>
        </div>

        {/* Headings */}
        <Typography
          variant="h2"
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Application submitted!
        </Typography>

        <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base">
          Thank you for applying to join JayakHub. We've received your
          application and our team will review it shortly.
        </Typography>

        <div className="w-full border-t border-gray-100 mb-2 mt-8" />

        {/* Timeline */}
        <div className="">
          <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 mt-6">
            WHAT HAPPENS NEXT
          </Typography>

          <div className="relative space-y-8 text-left">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />

            {TIMELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative z-10 flex items-start gap-4"
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.bgColor}`}
                  >
                    <Icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>

                  {/* Text */}
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
        </div>
      </Card>
    </div>
  );
}
