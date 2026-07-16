"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Loader2 } from "lucide-react";
import { useCloseRegister } from "../hooks/useCloseRegister";
import { ShiftReportPDF } from "./ShiftReportPDF";
import { CloseRegisterMetrics } from "./CloseRegisterMetrics";
import { CloseRegisterPaymentSummary } from "./CloseRegisterPaymentSummary";
import { CloseRegisterOrderTypeSummary } from "./CloseRegisterOrderTypeSummary";
import { CloseRegisterOrdersList } from "./CloseRegisterOrdersList";
import { useTranslations } from "next-intl";

interface CloseRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CloseRegisterModal({
  open,
  onOpenChange,
}: CloseRegisterModalProps) {
  const t = useTranslations("POS.closeRegister");
  const { data, isLoading, isPending, pdfRef, handleCloseShift } =
    useCloseRegister({ open, onOpenChange });

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
    >
      <DialogHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[16px] font-black tracking-tight text-[#1b2d22] border-none">
          {t("title")}
        </DialogTitle>
      </DialogHeader>

      <div className="p-6 relative max-h-[80vh] overflow-y-auto">
        <div className="bg-white mb-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#357252]" />
            </div>
          ) : data ? (
            <>
              <div className="mb-4 border-b border-gray-100 pb-4">
                <h2 className="text-[17px] font-black tracking-tight text-[#1b2d22]">
                  {t("shiftReport")}
                </h2>
                <div className="flex justify-between items-center mt-2 text-[12px] text-gray-500 font-medium">
                  <span>{new Date().toLocaleString()}</span>
                  <span>
                    {t("cashier", { name: data.user?.name || t("unknown") })}
                  </span>
                </div>
              </div>

              <CloseRegisterMetrics metrics={data.metrics} />
              <CloseRegisterPaymentSummary
                paymentSummary={data.paymentSummary}
              />
              <CloseRegisterOrderTypeSummary
                orderTypeSummary={data.orderTypeSummary}
              />
              <CloseRegisterOrdersList orders={data.orders} />
            </>
          ) : (
            <p className="text-sm text-center text-gray-500 py-6">
              {t("noData")}
            </p>
          )}
        </div>

        {/* Hidden PDF Template */}
        <ShiftReportPDF data={data} pdfRef={pdfRef} />

        <button
          onClick={handleCloseShift}
          disabled={isPending || isLoading || !data}
          className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isPending ? t("closing") : t("closeShiftPrint")}
        </button>
      </div>
    </GlobalModal>
  );
}
