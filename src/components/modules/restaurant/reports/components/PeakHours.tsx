"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PeakHour {
  timeRange: string;
  orders: number;
  color: string;
  percentage: number;
}

interface PeakHoursProps {
  peakHours?: any;
}

const DEFAULT_PEAK_HOURS: PeakHour[] = [
  {
    timeRange: "12 PM - 2 PM",
    orders: 380,
    color: "bg-[#ef4444]",
    percentage: 100,
  },
  {
    timeRange: "6 PM - 8 PM",
    orders: 340,
    color: "bg-[#f97316]",
    percentage: 89,
  },
  {
    timeRange: "8 PM - 10 PM",
    orders: 260,
    color: "bg-[#166534]",
    percentage: 68,
  },
  {
    timeRange: "10 AM - 12 PM",
    orders: 180,
    color: "bg-[#3b82f6]",
    percentage: 47,
  },
];

const PeakHours = ({ peakHours }: PeakHoursProps) => {
  const data: PeakHour[] = Array.isArray(peakHours)
    ? peakHours.slice(0, 4).map((item, index) => {
        const maxOrders = Math.max(...peakHours.map((p: any) => p.orders || 1));
        return {
          timeRange: item.timeRange || item.time || "N/A",
          orders: item.orders || 0,
          color:
            item.color ||
            DEFAULT_PEAK_HOURS[index % DEFAULT_PEAK_HOURS.length].color,
          percentage: (item.orders / maxOrders) * 100,
        };
      })
    : DEFAULT_PEAK_HOURS;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-[18px] font-black text-[#1b2d22]">Peak Hours</h2>
        <p className="text-[14px] font-bold text-[#94a3b8] mt-0.5">
          Busiest times today
        </p>
      </div>

      <div className="space-y-7">
        {data.map((item, index) => (
          <div key={index} className="space-y-2.5">
            <div className="flex justify-between items-center text-[15px] font-black text-[#1b2d22]">
              <span>{item.timeRange}</span>
              <span>{item.orders} orders</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  item.color,
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeakHours;
