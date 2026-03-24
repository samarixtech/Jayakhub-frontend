import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReportsStatsCardProps {
  label: string;
  value: string;
  trend: string | number;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

const ReportsStatsCard: React.FC<ReportsStatsCardProps> = ({
  label,
  value,
  trend,
  isPositive,
  icon,
  iconBgColor = "bg-gray-50",
  className,
}) => {
  const t = useTranslations("RestaurantDashboard.Reports.stats");

  return (
    <Card
      className={cn(
        "border-gray-100 shadow-sm bg-white rounded-[16px]",
        className,
      )}
    >
      <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[13px] font-bold text-[#657a8a]">{label}</h3>
          <div
            className={`p-2 rounded-lg flex items-center justify-center ${iconBgColor}`}
          >
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <h2 className="text-[28px] font-black text-[#1b2d22] leading-none">
            {value}
          </h2>
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <span
              className={cn(
                "flex items-center",
                isPositive ? "text-emerald-500" : "text-red-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 stroke-3" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-0.5 stroke-3" />
              )}
              {trend}
            </span>
            <span className="text-[#1eb589] font-bold">{t("vsLastPeriod")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsStatsCard;
