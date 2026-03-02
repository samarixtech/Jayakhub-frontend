import React from "react";
import { Utensils, CheckCircle, PauseCircle, Shapes } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface MenuItemsStatsProps {
  stats: { label: string; value: number }[];
}

const ICON_MAP: Record<string, any> = {
  "Total Items": {
    icon: Utensils,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  Active: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  Inactive: {
    icon: PauseCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  Categories: { icon: Shapes, color: "text-blue-600", bgColor: "bg-blue-100" },
};

export const MenuItemsStats: React.FC<MenuItemsStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const config = ICON_MAP[stat.label];
        const Icon = config.icon;

        return (
          <Card
            key={idx}
            className="p-4 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 border-none shadow-sm h-full"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor}`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.color}`} />
            </div>
            <div className="flex flex-col items-center sm:items-start justify-center min-w-0 w-full sm:w-auto">
              <Typography
                variant="h3"
                className="font-bold text-gray-900 text-xl sm:text-2xl leading-none mb-1 text-center sm:text-left"
              >
                {stat.value}
              </Typography>
              <Typography
                variant="p"
                className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide truncate text-center sm:text-left w-full"
              >
                {stat.label}
              </Typography>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
