"use client";

import React from "react";

interface CloseRegisterPaymentSummaryProps {
  paymentSummary: any;
}

export const CloseRegisterPaymentSummary = ({
  paymentSummary,
}: CloseRegisterPaymentSummaryProps) => {
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
            ${paymentSummary?.cash?.toFixed(2) || "0.00"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            Card Payments
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            ${paymentSummary?.card?.toFixed(2) || "0.00"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[12.5px] font-medium text-[#1b2d22]">
            Online Orders
          </span>
          <span className="text-[12.5px] font-bold text-[#1b2d22]">
            ${paymentSummary?.online?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};
