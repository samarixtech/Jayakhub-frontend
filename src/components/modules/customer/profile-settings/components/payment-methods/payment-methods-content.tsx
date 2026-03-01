"use client";

import { ChevronRight, CreditCard, Loader2 } from "lucide-react";
import { usePaymentMethods } from "./usePaymentMethods";

export function PaymentMethodsContent() {
  const { defaultCard, loading } = usePaymentMethods();

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (defaultCard) {
    return (
      <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-3xl border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-[#1A1F71] p-2 rounded-lg">
            <CreditCard className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 capitalize">
              {defaultCard.cardType || "Card"} ending in{" "}
              {defaultCard.cardNumber
                ? defaultCard.cardNumber.slice(-4)
                : "••••"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Expires {defaultCard.expiryDate} • Default
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-gray-50 rounded-3xl border border-dashed">
      <p className="text-xs text-gray-500">No default card set</p>
    </div>
  );
}
