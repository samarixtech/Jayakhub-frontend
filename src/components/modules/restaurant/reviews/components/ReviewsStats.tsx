import { Star, MessageSquare, Flag, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface ReviewsStatsProps {
  summary: {
    averageRating: number;
    totalReviews: number;
    unrepliedReviews: number;
  };
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  footer: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  footer,
}) => {
  return (
    <Card className="rounded-[16px] border border-gray-100 shadow-sm overflow-hidden h-[140px] bg-white">
      <CardContent className="p-6 flex flex-col justify-between h-full bg-white">
        <div className="flex justify-between items-start">
          <span className="text-[#657a8a] text-[13px] font-bold">{title}</span>
          <div
            className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center ${iconColor}`}
          >
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-[#1b2d22] text-[32px] font-black leading-none">
            {value}
          </span>
          {footer}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReviewsStats({ summary }: ReviewsStatsProps) {
  // Safety check just in case
  const safeSummary = summary || {
    averageRating: 0,
    totalReviews: 0,
    unrepliedReviews: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Average Rating"
        value={safeSummary.averageRating}
        icon={<Star className="w-4 h-4" />}
        iconBgColor="bg-[#fff6e5]"
        iconColor="text-[#f5a623]"
        footer={
          <div className="flex items-center gap-1 text-[#1eb589] font-bold text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-3" /> Live
          </div>
        }
      />

      <StatCard
        title="Total Reviews"
        value={safeSummary.totalReviews}
        icon={<MessageSquare className="w-4 h-4" />}
        iconBgColor="bg-[#ecf2ff]"
        iconColor="text-[#5584ff]"
        footer={
          <div className="flex items-center gap-1 text-[#1eb589] font-bold text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-3" /> All time
          </div>
        }
      />

      <StatCard
        title="Unreplied"
        value={safeSummary.unrepliedReviews}
        icon={<Flag className="w-4 h-4" />}
        iconBgColor="bg-[#f4effc]"
        iconColor="text-[#9c59f6]"
        footer={
          <div className="text-[#657a8a] font-medium text-[12px] mt-0.5">
            Needs attention
          </div>
        }
      />
    </div>
  );
}
