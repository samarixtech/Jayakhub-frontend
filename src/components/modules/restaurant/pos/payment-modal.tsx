"use client";

import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Banknote, CreditCard, Smartphone, Check, Printer } from "lucide-react";
import { usePOS } from "@/app/context/POSContext";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentMethod = "cash" | "card" | "online" | null;
type PaymentStep = "select" | "receipt";

export default function PaymentModal({
  open,
  onOpenChange,
}: PaymentModalProps) {
  const { cartItems, subtotal, tax, total } = usePOS();
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [step, setStep] = useState<PaymentStep>("select");
  const [amountTendered, setAmountTendered] = useState<string>("100");

  // Total logic wrapper for rendering safely
  const displayTotal = total > 0 ? total : 17.32; // Fallback for UI visualization based on screenshot
  const displaySubtotal = subtotal > 0 ? subtotal : 16.5;
  const displayTax = tax > 0 ? tax : 0.83;

  // Reset state when modal is toggled
  React.useEffect(() => {
    if (open) {
      setMethod(null);
      setStep("select");
      setAmountTendered(displayTotal.toFixed(2));
    }
  }, [open, displayTotal]);

  const handleConfirm = () => {
    if (method) {
      setStep("receipt");
    }
  };

  const handleNewOrder = () => {
    // Here you'd clear cart etc.
    onOpenChange(false);
  };

  if (step === "receipt") {
    return (
      <GlobalModal
        open={open}
        onOpenChange={onOpenChange}
        customStyle
        className="sm:max-w-[400px] p-6 flex flex-col items-center bg-white border-none shadow-2xl rounded-2xl text-center"
      >
        <div className="flex flex-col items-center w-full pb-6">
          <h2 className="text-[22px] font-black text-[#357252] tracking-tight mb-1">
            JayakHub
          </h2>
          <p className="text-[13px] text-[#8ea89a] font-medium mb-6">
            Restaurant POS
          </p>

          <div className="flex justify-between w-full text-[13px] text-[#1b2d22] font-semibold mb-6">
            <span>#1004</span>
            <span>21/02/2026 12:18</span>
          </div>

          <div className="w-full space-y-3 mb-6">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-[14px] text-[#1b2d22] font-medium"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-[14px] text-[#1b2d22] font-medium">
                <span>1x BBQ Chicken Pizza</span>
                <span>$16.50</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-2 mb-4">
            <div className="flex justify-between text-[14px] text-[#3e5648] font-medium">
              <span>Subtotal</span>
              <span>${displaySubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[14px] text-[#3e5648] font-medium">
              <span>Tax (5%)</span>
              <span>${displayTax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between w-full text-[18px] text-[#111] font-black mb-8">
            <span>Total</span>
            <span>${displayTotal.toFixed(2)}</span>
          </div>

          <div className="text-center mb-6">
            <p className="text-[14px] text-[#3e5648] font-medium mb-2">
              Paid via{" "}
              <span className="font-black text-[#111] capitalize">
                {method}
              </span>
            </p>
            <p className="text-[12px] text-[#8ea89a] font-medium">
              Thank you for dining with us!
            </p>
          </div>

          <div className="flex w-full gap-3">
            <button className="flex-1 bg-[#357252] hover:bg-[#2a5a41] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Printer className="w-4 h-4 stroke-[2.5px]" /> Print
            </button>
            <button
              onClick={handleNewOrder}
              className="flex-1 bg-[#f4f6f8] hover:bg-[#e9ecef] text-[#111] font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              New Order
            </button>
          </div>
        </div>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
    >
      <DialogHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[18px] font-black tracking-tight text-[#111] border-none">
          Complete Payment
        </DialogTitle>
      </DialogHeader>

      <div className="p-5">
        {/* Header Total */}
        <div className="bg-[#f2fbf5] rounded-xl flex flex-col items-center justify-center py-4 mb-4">
          <span className="text-[32px] font-black text-[#357252] leading-none mb-1">
            ${displayTotal.toFixed(2)}
          </span>
          <span className="text-[12px] text-[#789684] font-semibold">
            Total Payable
          </span>
        </div>

        {/* Discount Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Discount"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#357252] text-[#111] font-medium placeholder:text-gray-400"
          />
          <button className="w-[45px] bg-white border border-gray-200 text-gray-700 font-bold rounded-lg flex items-center justify-center text-[14px] hover:bg-gray-50 transition-colors">
            %
          </button>
          <button className="px-5 bg-white border border-gray-200 text-[#111] font-bold rounded-lg flex items-center justify-center text-[13px] hover:bg-gray-50 transition-colors shadow-sm">
            Apply
          </button>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-[#556977] text-[13px] font-medium">
            <span>Subtotal</span>
            <span>${displaySubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#556977] text-[13px] font-medium">
            <span>Tax (5%)</span>
            <span>${displayTax.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center mb-4">
          <span className="text-[15px] font-black text-[#111]">Total</span>
          <span className="text-[15px] font-black text-[#111]">
            ${displayTotal.toFixed(2)}
          </span>
        </div>

        {/* Method Selection */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => setMethod("cash")}
            className={`relative flex flex-col items-center justify-center py-3 rounded-xl border ${method === "cash" ? "bg-[#357252] border-[#357252] text-white" : "bg-white border-gray-200 text-[#111] hover:border-gray-300"} transition-all`}
          >
            {method === "cash" && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white stroke-[3px]" />
            )}
            <Banknote
              className={`w-5 h-5 mb-1.5 ${method === "cash" ? "text-white" : "text-[#2a3c30]"} stroke-[2px]`}
            />
            <span
              className={`text-[12px] font-bold ${method === "cash" ? "text-white" : "text-[#111]"}`}
            >
              Cash
            </span>
          </button>

          <button
            onClick={() => setMethod("card")}
            className={`relative flex flex-col items-center justify-center py-3 rounded-xl border ${method === "card" ? "bg-[#357252] border-[#357252] text-white" : "bg-white border-gray-200 text-[#111] hover:border-gray-300"} transition-all`}
          >
            {method === "card" && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white stroke-[3px]" />
            )}
            <CreditCard
              className={`w-5 h-5 mb-1.5 ${method === "card" ? "text-white" : "text-[#2a3c30]"} stroke-[2px]`}
            />
            <span
              className={`text-[12px] font-bold ${method === "card" ? "text-white" : "text-[#111]"}`}
            >
              Card
            </span>
          </button>

          <button
            onClick={() => setMethod("online")}
            className={`relative flex flex-col items-center justify-center py-3 rounded-xl border ${method === "online" ? "bg-[#357252] border-[#357252] text-white" : "bg-white border-gray-200 text-[#111] hover:border-gray-300"} transition-all`}
          >
            {method === "online" && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white stroke-[3px]" />
            )}
            <Smartphone
              className={`w-5 h-5 mb-1.5 ${method === "online" ? "text-white" : "text-[#2a3c30]"} stroke-[2px]`}
            />
            <span
              className={`text-[12px] font-bold ${method === "online" ? "text-white" : "text-[#111]"}`}
            >
              Online
            </span>
          </button>
        </div>

        {/* Amount Tendered (Cash only) */}
        {method === "cash" && (
          <div className="bg-[#fcfdfd] border border-gray-100 p-3 rounded-xl mb-4 flex flex-col items-center">
            <span className="text-[#657a8a] text-[11px] font-bold mb-1.5 w-full text-left">
              Amount Tendered
            </span>
            <input
              type="text"
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
              className="w-full border border-gray-200 text-center rounded-lg py-1.5 text-[16px] font-black text-[#111] focus:outline-none focus:border-[#357252] mb-2"
            />
            {(() => {
              const change = parseFloat(amountTendered) - displayTotal;
              return (
                <span
                  className={`text-[14px] font-black ${change >= 0 ? "text-[#1eb589]" : "text-red-500"}`}
                >
                  Change: ${change >= 0 ? change.toFixed(2) : "0.00"}
                </span>
              );
            })()}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!method}
          className={`w-full font-bold py-3 rounded-xl text-[14.5px] transition-colors ${
            !method
              ? "bg-[#8debb4] text-white cursor-not-allowed opacity-80"
              : "bg-[#1eb589] hover:bg-[#159a72] text-white shadow-md"
          }`}
        >
          {!method
            ? "Select Payment Method"
            : `Confirm ${method.charAt(0).toUpperCase() + method.slice(1)} Payment`}
        </button>
      </div>
    </GlobalModal>
  );
}
