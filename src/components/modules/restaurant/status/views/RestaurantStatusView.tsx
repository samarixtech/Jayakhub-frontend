"use client";

import { Check, Clock, XCircle, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { useRestaurantStatus } from "../hooks/useRestaurantStatus";
import { StatusTimeline } from "../components/StatusTimeline";
import { useTranslations } from "next-intl";

export default function RestaurantStatusView() {
  const t = useTranslations("RestaurantDashboard.Status");
  const { status, loading, isNew } = useRestaurantStatus();

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
      <div className="h-[100dvh] lg:overflow-hidden bg-gray-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-lg p-4 sm:p-8 lg:p-10 text-center rounded-3xl shadow-lg border-none bg-white">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <XCircle className="w-10 h-10 text-red-500 stroke-[2px]" />
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {t("titleRejected")}
          </Typography>
          <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base mb-8">
            {t("descriptionRejected")}
          </Typography>
        </Card>
      </div>
    );
  }

  // PENDING VIEW (Existing User)
  if (status === "pending" && !isNew) {
    return (
      <div className="h-[100dvh] lg:overflow-hidden bg-gray-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-lg p-4 sm:p-8 lg:p-10 text-center rounded-3xl shadow-lg border-none bg-white">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <Clock className="w-10 h-10 text-orange-500 stroke-[2px]" />
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {t("titlePending")}
          </Typography>
          <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base mb-8">
            {t("descriptionPending")}
          </Typography>

          <div className="w-full border-t border-gray-100 mb-6 mt-2" />

          <div className="">
            <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {t("currentStatus")}
            </Typography>
            <StatusTimeline />
          </div>
        </Card>
      </div>
    );
  }

  // SUBMITTED VIEW (New Submission)
  return (
    <div className="h-[100dvh] lg:overflow-hidden bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-lg p-4 sm:p-8 lg:p-10 text-center rounded-3xl shadow-lg border-none bg-white text-balance">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 animate-in zoom-in duration-500">
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </div>
        </div>

        <Typography
          variant="h2"
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          {t("titleSubmitted")}
        </Typography>

        <Typography className="text-gray-500 leading-relaxed text-sm sm:text-base">
          {t("descriptionSubmitted")}
        </Typography>

        <div className="w-full border-t border-gray-100 mb-1 mt-3 sm:mt-8" />

        <div className="">
          <Typography className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-6 mt-3 sm:mt-6">
            {t("whatHappensNext")}
          </Typography>

          <StatusTimeline />
        </div>
      </Card>
    </div>
  );
}
