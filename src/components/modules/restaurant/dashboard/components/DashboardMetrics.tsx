import { Receipt, Banknote, Star, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { MetricsCard } from "./MetricsCard";

interface DashboardMetricsProps {
  stats: any;
  formatCurrency: (amount: number) => string;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  stats,
  formatCurrency,
}) => {
  const t = useTranslations("RestaurantDashboard");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title={t("metrics.todaysOrders")}
        icon={Receipt}
        iconBgColor="bg-[#ecf2ff]"
        iconColor="text-[#5584ff]"
        value={stats?.todayOrders?.value || 0}
        trend={stats?.todayOrders?.trend}
        changeText={`${stats?.todayOrders?.changePercent || 0}% ${t("metrics.vsYesterday")}`}
      />

      <MetricsCard
        title={t("metrics.revenueToday")}
        icon={Banknote}
        iconBgColor="bg-[#e8f6f0]"
        iconColor="text-[#1eb589]"
        value={formatCurrency(stats?.todayRevenue?.value || 0)}
        trend={stats?.todayRevenue?.trend}
        changeText={`${stats?.todayRevenue?.changePercent || 0}% ${t("metrics.vsYesterday")}`}
      />

      <MetricsCard
        title={t("metrics.avgRating")}
        icon={Star}
        iconBgColor="bg-[#fff6e5]"
        iconColor="text-[#f5a623]"
        value={stats?.averageRating?.value || "0.0"}
        trend={stats?.averageRating?.trend}
        changeText={`${stats?.averageRating?.trend?.replace(/[+-]/g, "") || "0.0"} ${t("metrics.thisWeek")}`}
      />

      <MetricsCard
        title={t("metrics.prepTime")}
        icon={Timer}
        iconBgColor="bg-[#f4effc]"
        iconColor="text-[#9c59f6]"
        value={stats?.prepareTime?.value || "0m"}
        trend={stats?.prepareTime?.trend}
        changeText={`${stats?.prepareTime?.trend?.replace(/[+-]/g, "") || "0m"} ${t("metrics.vsAvg")}`}
      />
    </div>
  );
};
