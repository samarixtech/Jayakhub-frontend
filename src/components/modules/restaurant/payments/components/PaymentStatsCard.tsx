import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PaymentStatsCardProps {
  label: string;
  amount: string;
  subtext?: string;
  subtextClassName?: string;
  icon: React.ReactNode;
  className?: string;
}

const PaymentStatsCard: React.FC<PaymentStatsCardProps> = ({
  label,
  amount,
  subtext,
  subtextClassName,
  icon,
  className,
}) => {
  return (
    <Card className={cn("border-gray-100 shadow-sm bg-white", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          <div className="p-2 rounded-lg bg-gray-50 text-gray-400">{icon}</div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">{amount}</h2>
          {subtext && (
            <p className={cn("text-sm font-medium", subtextClassName)}>
              {subtext}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatsCard;
