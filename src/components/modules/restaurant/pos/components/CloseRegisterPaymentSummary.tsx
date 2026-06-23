"use client";

import React from "react";
import { useCLC } from "@/context/CLCContext";

interface CloseRegisterPaymentSummaryProps {
  paymentSummary: any;
}

export const CloseRegisterPaymentSummary = ({
  paymentSummary,
}: CloseRegisterPaymentSummaryProps) => {
  const { formatPrice } = useCLC();
  return (
    <div className="border-t border-gray-100 pt-5 mb-2">
      <h3 className="text-[11px] font-bold text-[#556977] tracking-wide mb-3 uppercase">
        PAYMENT SUMMARY
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            Cash Payments
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.cash ?? 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            Card Payments
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.card ?? 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            Online Orders
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            {formatPrice(paymentSummary?.online ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
