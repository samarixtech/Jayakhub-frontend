import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ReportsStatsCardProps {
  label: string;
  value: string;
  trend: string; // e.g., "+21%"
  trendLabel?: string; // e.g., "vs last period"
  isPositive: boolean;
  icon: React.ReactNode;
  className?: string;
}

const ReportsStatsCard: React.FC<ReportsStatsCardProps> = ({
  label,
  value,
  trend,
  trendLabel = "vs last period",
  isPositive,
  icon,
  className,
}) => {
  return (
    <Card className={cn("border-gray-100 shadow-sm bg-white", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold text-gray-500">{label}</h3>
          <div className="p-2 rounded-lg bg-gray-50 text-gray-400">{icon}</div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center text-xs font-bold",
                isPositive ? "text-emerald-500" : "text-red-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trend}
            </span>
            <span className="text-xs text-green-500 font-medium">
              {trendLabel}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsStatsCard;
