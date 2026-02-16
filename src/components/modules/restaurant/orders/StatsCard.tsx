import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  iconBgColor = "bg-green-100",
  iconColor = "text-green-600",
  className,
}) => {
  return (
    <Card className={cn("border-none shadow-sm bg-white", className)}>
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-xl flex items-center justify-center min-w-[3rem] min-h-[3rem]",
            iconBgColor,
            iconColor,
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{value}</h3>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
