"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MarketingView() {
  const t = useTranslations("RestaurantDashboard.Marketing");

  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="w-full rounded-2xl bg-linear-to-r from-[#1E9E74] to-[#38C894] p-10 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
        {/* Decorative background circles/shapes to match the subtle background shapes in the image */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-sm md:text-base text-white/90 leading-relaxed font-light">
            {t("heroSubtitle").split("Cancel anytime.")[0]}
            <br className="hidden md:block" />
            {t("heroSubtitle").includes("Cancel anytime.") ? "Cancel anytime." : ""}
          </p>
        </div>
      </div>

      {/* Section Header */}
      <div className="w-full py-2 mb-2 mt-4">
        <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
          {t("availablePackages")}
        </h2>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* Plan 1: Storefront Visibility */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col h-full relative">
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5">
              {t("storefrontVisibility.title")}
            </h3>
            <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed min-h-[36px]">
              {t("storefrontVisibility.description")}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline text-gray-900">
              <span className="text-3xl md:text-4xl font-black tracking-tight">
                {t("storefrontVisibility.price")}
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-400 ml-1">
                {t("storefrontVisibility.period")}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <ul className="space-y-3 mb-6">
              {[0, 1, 2, 3].map((idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 text-[#346853] shrink-0 fill-white"
                    strokeWidth={1.5}
                  />
                  <span className="text-[12px] md:text-[13px] text-gray-700 font-medium">
                    {t(`storefrontVisibility.features.${idx}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full py-2.5 px-4 rounded-xl border border-[#346853] text-[#346853] font-semibold text-sm hover:bg-[#346853]/5 transition-colors">
            {t("storefrontVisibility.button")}
          </button>
        </div>

        {/* Plan 2: Growth Partner */}
        <div className="bg-white rounded-xl border-2 border-[#346853] p-5 md:p-6 flex flex-col h-full relative overflow-hidden shadow-lg shadow-[#346853]/5">
          {/* Recommended Button */}
          <div className="absolute top-5 -right-12 bg-[#346853] text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-12 rotate-45 transform origin-center shadow-sm">
            {t("growthPartner.badge")}
          </div>

          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5">
              {t("growthPartner.title")}
            </h3>
            <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed min-h-[36px] pr-8">
              {t("growthPartner.description")}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline text-gray-900">
              <span className="text-3xl md:text-4xl font-black tracking-tight">
                {t("growthPartner.price")}
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-400 ml-1">
                {t("growthPartner.period")}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <ul className="space-y-3 mb-6">
              {[0, 1, 2, 3, 4].map((idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 text-[#346853] shrink-0 fill-white"
                    strokeWidth={1.5}
                  />
                  <span className="text-[12px] md:text-[13px] text-gray-700 font-medium">
                    {t(`growthPartner.features.${idx}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full py-2.5 px-4 rounded-xl bg-[#346853] text-white font-semibold text-sm hover:bg-[#2a5443] transition-colors shadow-sm">
            {t("growthPartner.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
