"use client";
import React from "react";
import StatsCard from "@/components/modules/restaurant/orders/components/StatsCard";
import { Wallet, ArrowDownToLine, Clock, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";
import { PayoutStats } from "../hooks/usePayouts";

interface PayoutsStatsProps {
  stats: PayoutStats;
  loading: boolean;
}

const PayoutsStats: React.FC<PayoutsStatsProps> = ({ stats, loading }) => {
  const t = useTranslations("RestaurantDashboard.Payouts.stats");
  const { formatPrice } = useCLC();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatsCard
        icon={<Wallet className="w-6 h-6" />}
        value={formatPrice(stats.availableBalance)}
        label={t("availableBalance")}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-700"
        loading={loading}
      />
      <StatsCard
        icon={<ArrowDownToLine className="w-6 h-6" />}
        value={formatPrice(stats.totalWithdrawn)}
        label={t("totalWithdrawn")}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        loading={loading}
      />
      <StatsCard
        icon={<Clock className="w-6 h-6" />}
        value={formatPrice(stats.pendingPayouts)}
        label={t("pendingPayouts")}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
        loading={loading}
      />
      <StatsCard
        icon={<TrendingUp className="w-6 h-6" />}
        value={formatPrice(stats.totalEarnings)}
        label={t("totalEarnings")}
        iconBgColor="bg-teal-50"
        iconColor="text-teal-600"
        loading={loading}
      />
    </div>
  );
};

export default PayoutsStats;
