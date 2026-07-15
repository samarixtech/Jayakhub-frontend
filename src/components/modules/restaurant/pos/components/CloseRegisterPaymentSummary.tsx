"use client";

import React from "react";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

interface CloseRegisterPaymentSummaryProps {
  paymentSummary: any;
}

export const CloseRegisterPaymentSummary = ({
  paymentSummary,
}: CloseRegisterPaymentSummaryProps) => {
  const t = useTranslations("POS.closeRegister.paymentSummary");
  const { formatPrice } = useCLC();
  return (
    <div className="border-t border-gray-100 pt-5 mb-2">
      <h3 className="text-[11px] font-bold text-[#556977] tracking-wide mb-3 uppercase">
        {t("title")}
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            {t("cash")}
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.cash ?? 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            {t("card")}
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.card ?? 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            {t("online")}
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.online ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
