"use client";

import React from "react";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

interface CloseRegisterMetricsProps {
  metrics: any;
}

export const CloseRegisterMetrics = ({
  metrics,
}: CloseRegisterMetricsProps) => {
  const t = useTranslations("POS.closeRegister.metrics");
  const { formatPrice } = useCLC();
  return (
    <div className="bg-[#f8fafa] rounded-xl p-5 mb-5">
      <div className="grid grid-cols-3 gap-y-5 gap-x-4">
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            {t("totalSales")}
          </p>
          <p className="text-[20px] font-black text-[#1b2d22] tracking-tight leading-none">
            {formatPrice(metrics?.totalSales ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            {t("transactions")}
          </p>
          <p className="text-[20px] font-black text-[#1b2d22] tracking-tight leading-none">
            {metrics?.transactions || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
            {t("avgOrder")}
          </p>
          <p className="text-[20px] font-black text-[#1b2d22] tracking-tight leading-none">
            {formatPrice(metrics?.averageOrder ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
