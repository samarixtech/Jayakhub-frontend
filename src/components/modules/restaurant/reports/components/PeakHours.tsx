import React from "react";

interface PeakHour {
  id: string;
  timeRange: string;
  orders: number;
  percentage: number;
  color: string;
}

interface PeakHoursProps {
  peakHours?: any;
}

const PeakHours = ({ peakHours }: PeakHoursProps) => {
  const displayTime = typeof peakHours === 'object' && peakHours !== null ? peakHours.time : (peakHours || "N/A");

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-gray-900">Peak Hours</h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Busiest time range detected
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center py-6 bg-emerald-50 rounded-xl border border-emerald-100">
        <span className="text-[14px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
          Busiest Period
        </span>
        <span className="text-[28px] font-black text-[#1B4332]">
          {displayTime}
        </span>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-4">
        Based on orders from the last 7 days
      </p>
    </div>
  );
};

export default PeakHours;
