"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { useTranslations } from "next-intl";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  const t = useTranslations("POS.shortcuts");

  const shortcuts = [
    { action: t("searchMenu"), key: "F1" },
    { action: t("openPayment"), key: "F3" },
    { action: t("pendingOrders"), key: "F4" },
    { action: t("closeModal"), key: "Esc" },
  ];

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-[16px] text-left"
    >
      <DialogHeader className="px-6 pt-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[20px] font-black tracking-tight text-[#1b2d22]">
          {t("title")}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-4 gap-0">
        {shortcuts.map((shortcut, idx) => (
          <div
            key={idx}
            className={`flex justify-between items-center py-3 ${idx !== shortcuts.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <span className="text-[15px] font-medium text-[#1b2d22]">
              {shortcut.action}
            </span>
            <div className="bg-[#f4f6f8] text-[#1b2d22] text-[13px] font-bold px-3 py-1.5 rounded-[6px] min-w-[36px] flex items-center justify-center border border-gray-200 shadow-sm">
              {shortcut.key}
            </div>
          </div>
        ))}
      </div>
    </GlobalModal>
  );
}
