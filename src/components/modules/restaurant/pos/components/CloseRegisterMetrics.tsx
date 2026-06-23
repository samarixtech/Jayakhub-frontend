"use client";

import React from "react";
import { useCLC } from "@/context/CLCContext";

interface CloseRegisterMetricsProps {
  metrics: any;
}

export const CloseRegisterMetrics = ({
  metrics,
}: CloseRegisterMetricsProps) => {
  const { formatPrice } = useCLC();
  return (
    <div className="bg-[#f8fafa] rounded-xl p-5 mb-5">
      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            TOTAL SALES
          </p>
          <p className="text-[22px] font-black text-[#1b2d22] tracking-tight leading-none">
            {formatPrice(metrics?.totalSales ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            GROSS PROFIT
          </p>
          <p className="text-[22px] font-black text-[#1eb589] tracking-tight leading-none">
            {formatPrice(metrics?.grossProfit ?? 0)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            TRANSACTIONS
          </p>
          <p className="text-[18px] font-black text-[#1b2d22] tracking-tight leading-none">
            {metrics?.transactions || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            AVG ORDER
          </p>
          <p className="text-[18px] font-black text-[#1b2d22] tracking-tight leading-none">
            {formatPrice(metrics?.averageOrder ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
