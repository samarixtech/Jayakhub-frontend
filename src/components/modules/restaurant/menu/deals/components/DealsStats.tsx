"use client";

import { Tag, Sparkles, TrendingUp, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export interface DealsStatsData {
  totalDeals: number;
  activeDeals: number;
  scheduledPromos?: number;
  scheduledDeals?: number;
  avgComboSavings?: number;
  avgDiscount?: number;
  topPerformingDeal?: {
    id?: string;
    title?: string;
    ordersCount?: number;
  } | null;
  topDealTitle?: string;
}

interface DealsStatsProps {
  stats: DealsStatsData;
}

export function DealsStats({ stats }: DealsStatsProps) {
  const t = useTranslations("RestaurantDashboard.Deals");
  const totalDeals = stats?.totalDeals ?? 0;
  const activeDeals = stats?.activeDeals ?? 0;
  const topDealTitle =
    stats?.topPerformingDeal?.title ?? stats?.topDealTitle ?? t("common.notAvailable");
  const avgSavings = stats?.avgComboSavings ?? stats?.avgDiscount ?? 0;
  const scheduledPromos =
    stats?.scheduledPromos ?? stats?.scheduledDeals ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CARD 1: TOTAL COMBOS */}
      <Card className="p-4 border border-gray-100 rounded-2xl shadow-xs bg-white flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <Typography className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("stats.totalComboDeals")}
          </Typography>
          <div className="flex items-baseline gap-2 mt-0.5">
            <Typography className="text-2xl font-bold text-gray-900">
              {totalDeals}
            </Typography>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeDeals} {t("stats.activeSuffix")}
            </span>
          </div>
        </div>
      </Card>

      {/* CARD 2: TOP PERFORMER */}
      <Card className="p-4 border border-gray-100 rounded-2xl shadow-xs bg-white flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <Typography className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("stats.topPerformingDeal")}
          </Typography>
          <Typography className="text-base font-bold text-gray-900 truncate mt-0.5">
            {topDealTitle}
          </Typography>
        </div>
      </Card>

      {/* CARD 3: AVERAGE SAVINGS */}
      <Card className="p-4 border border-gray-100 rounded-2xl shadow-xs bg-white flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Percent className="w-6 h-6" />
        </div>
        <div>
          <Typography className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("stats.avgComboSavings")}
          </Typography>
          <div className="flex items-baseline gap-2 mt-0.5">
            <Typography className="text-2xl font-bold text-gray-900">
              {avgSavings}%
            </Typography>
            <span className="text-xs text-gray-500 font-normal">{t("stats.discount")}</span>
          </div>
        </div>
      </Card>

      {/* CARD 4: SCHEDULED PROMOS */}
      <Card className="p-4 border border-gray-100 rounded-2xl shadow-xs bg-white flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <Typography className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("stats.scheduledPromos")}
          </Typography>
          <div className="flex items-baseline gap-2 mt-0.5">
            <Typography className="text-2xl font-bold text-gray-900">
              {scheduledPromos}
            </Typography>
            <span className="text-xs text-gray-500">{t("stats.upcoming")}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
