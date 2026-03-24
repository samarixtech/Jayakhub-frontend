import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

import { UIOrder as Order } from "../hooks/useOrders";

interface OrderDetailsSheetProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const t = useTranslations("RestaurantDashboard.Orders.details");
  const [updatingAction, setUpdatingAction] = useState<string | null>(null);

  if (!order) return null;

  const handleUpdateClick = async (newStatus: string) => {
    setUpdatingAction(newStatus);
    try {
      await onStatusUpdate(order.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingAction(null);
    }
  };

  const renderFooterActions = () => {
    // Normalize status for check
    const currentStatus = order.originalStatus || order.status.toLowerCase();

    // PENDING (NEW, PENDING) -> Accept / Reject
    if (currentStatus === "pending" || currentStatus === "new") {
      return (
        <div className="flex gap-3 w-full">
          <Button
            onClick={() => handleUpdateClick("rejected")}
            disabled={!!updatingAction}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {updatingAction === "rejected" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {t("rejectBtn")}
          </Button>
          <Button
            onClick={() => handleUpdateClick("accepted")}
            disabled={!!updatingAction}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            {updatingAction === "accepted" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {t("acceptBtn")}
          </Button>
        </div>
      );
    }

    // ACCEPTED -> Prepare (Green)
    if (currentStatus === "accepted") {
      return (
        <Button
          onClick={() => handleUpdateClick("prepare")}
          disabled={!!updatingAction}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          {updatingAction === "prepare" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {t("startPrepareBtn")}
        </Button>
      );
    }

    // PREPARE -> Ready (Green)
    if (currentStatus === "prepare" || currentStatus === "preparing") {
      return (
        <Button
          onClick={() => handleUpdateClick("ready")}
          disabled={!!updatingAction}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          {updatingAction === "ready" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {t("markReadyBtn")}
        </Button>
      );
    }

    // For other statuses (ready, out_for_delivery, delivered, rejected), return null
    return null;
  };

  const footerContent = renderFooterActions();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gray-100 flex-none sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900">
                {t("orderTitle", { id: order.id })}
              </SheetTitle>
              <p className="text-xs text-gray-500 font-medium">{order.date}</p>
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

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("status")}
            </h4>
            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
              {order.status}
            </span>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("customer")}
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {order.customerName}
                </p>
                <p className="text-xs text-gray-500">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("items")}
            </h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-gray-900 w-6">
                      {item.quantity}x
                    </span>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t("paymentSummary")}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("subtotal")}</span>
                <span className="text-gray-900 font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("tax")}</span>
                <span className="text-gray-900 font-medium">
                  ${order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-900">{t("total")}</span>
                <span className="text-emerald-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions, Only render if there are actions */}
        {footerContent && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 flex-none">
            {footerContent}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
