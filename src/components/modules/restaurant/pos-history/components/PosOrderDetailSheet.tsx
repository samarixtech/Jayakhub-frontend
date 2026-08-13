"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCLC } from "@/context/CLCContext";
import { PosOrderRow } from "../hooks/usePosHistory";
import { StatusPill } from "../views/PosHistoryView";
import { useTranslations } from "next-intl";

interface PosOrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PosOrderRow | null;
}

function formatDateTime(isoStr: string) {
  if (!isoStr) return "—";
  return format(new Date(isoStr), "dd/MM/yyyy, hh:mm a");
}

export default function PosOrderDetailSheet({
  open,
  onOpenChange,
  order,
}: PosOrderDetailSheetProps) {
  const t = useTranslations("POS.historyDetail");
  const { formatPrice } = useCLC();

  if (!order) return null;

  const deliveryFee = Number(order.deliveryFee) || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-sm p-0 flex flex-col h-full bg-white !bg-white">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gray-100 flex-none sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900">
                {t("orderTitle", { id: order.id })}
              </SheetTitle>
              <p className="text-xs text-gray-500 font-medium">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-white">
          {/* Status */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t("status")}
              </h4>
              <StatusPill status={order.orderStatus} />
            </div>
            <div className="text-right">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t("orderType")}
              </h4>
              <span className="text-sm font-bold text-gray-900">
                {order.orderType}
              </span>
            </div>
          </div>

          {/* Order Info */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("orderInfo")}
            </h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t("table")}</span>
              <span className="text-gray-900 font-bold">
                {order.tableName || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">{t("paymentMethod")}</span>
              <span className="text-gray-900 font-bold">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("items")}
            </h4>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div
                  key={`${item.itemId}-${idx}`}
                  className="flex justify-between items-start"
                >
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-gray-900 w-6">
                      {item.quantity}x
                    </span>
                    <div>
                      <span className="text-sm text-gray-700">
                        {item.itemName}
                      </span>
                      {item.variants && item.variants.length > 0 && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.variants
                            .map((v) => `${v.groupName}: ${v.optionName}`)
                            .join(", ")}
                        </p>
                      )}
                      {!!item.discount && (
                        <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                          {t("discountApplied")}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deals */}
          {order.deals && order.deals.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Deals
                </h4>
                <div className="space-y-4">
                  {order.deals.map((deal, idx) => {
                    const dealQty = deal.quantity || 1;
                    const discountAmt = Number(deal.discountAmount) || 0;
                    const unitDealPrice =
                      Number(
                        deal.dealPrice ??
                          deal.discountedPrice ??
                          deal.price ??
                          deal.totalAmount,
                      ) || 0;
                    const totalDealPrice = unitDealPrice * dealQty;
                    return (
                      <div
                        key={`${deal.dealId || idx}`}
                        className="flex justify-between items-start"
                      >
                        <div className="flex gap-3">
                          <span className="text-sm font-bold text-[#FF6B35] w-6">
                            {dealQty}x
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-900">
                                {deal.title}
                              </span>
                              <span className="bg-orange-100 text-[#FF6B35] text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full">
                                DEAL
                              </span>
                            </div>
                            {deal.items && deal.items.length > 0 && (
                              <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-orange-200">
                                {deal.items.map((di, diIdx) => {
                                  const itemQty = di.quantity || 1;
                                  return (
                                    <p
                                      key={diIdx}
                                      className="text-[12px] text-gray-600 font-medium"
                                    >
                                      • {di.name}{" "}
                                      <span className="font-bold text-gray-900">
                                        x{itemQty}
                                      </span>
                                    </p>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          {totalDealPrice > 0 && (
                            <span className="text-sm font-bold text-gray-900 block">
                              {formatPrice(totalDealPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {order.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t("notes")}
                </h4>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("paymentSummary")}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("itemsTotal")}</span>
                <span className="text-gray-900 font-medium">
                  {formatPrice(order.itemsTotal)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("deliveryFee")}</span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-900">{t("grandTotal")}</span>
                <span className="text-brand-orange">
                  {formatPrice(order.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
