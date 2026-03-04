"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";

interface CloseRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CloseRegisterModal({
  open,
  onOpenChange,
}: CloseRegisterModalProps) {
  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
    >
      <DialogHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[16px] font-black tracking-tight text-[#1b2d22] border-none">
          Close Register
        </DialogTitle>
      </DialogHeader>

      <div className="p-6">
        <div className="bg-[#f8fafa] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[11px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
                TOTAL SALES
              </p>
              <p className="text-[26px] font-black text-[#1b2d22] tracking-tight leading-none">
                $50.40
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
                GROSS PROFIT
              </p>
              <p className="text-[26px] font-black text-[#1eb589] tracking-tight leading-none">
                $32.76
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
                TRANSACTIONS
              </p>
              <p className="text-[22px] font-black text-[#1b2d22] tracking-tight leading-none">
                3
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#657a8a] tracking-wide mb-1 uppercase">
                AVG ORDER
              </p>
              <p className="text-[22px] font-black text-[#1b2d22] tracking-tight leading-none">
                $16.80
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 mb-6">
          <h3 className="text-[12px] font-bold text-[#556977] tracking-wide mb-4 uppercase">
            PAYMENT SUMMARY
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13.5px] font-medium text-[#1b2d22]">
                Cash Payments
              </span>
              <span className="text-[13.5px] font-bold text-[#1b2d22]">
                $17.32
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13.5px] font-medium text-[#1b2d22]">
                Card Payments
              </span>
              <span className="text-[13.5px] font-bold text-[#1b2d22]">
                $15.75
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13.5px] font-medium text-[#1b2d22]">
                Online Orders
              </span>
              <span className="text-[13.5px] font-bold text-[#1b2d22]">
                $0.00
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3.5 rounded-xl text-[14.5px] transition-colors shadow-sm"
        >
          Close Shift & Print Report
        </button>
      </div>
    </GlobalModal>
  );
}
