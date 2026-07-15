"use client";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface OrderDetail {
  id: string;
  orderId: string;
  date: string;
  time: string;
  status: "Completed" | "Preparing" | "Cancelled";
  customer: string;
  source: string;
  total: string;
  paymentMethod?: string;
  prepDuration?: string;
  subtotal?: string;
  tax?: string;
  itemsList?: OrderItem[];
}

interface OrderDetailSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetail | null;
}

const getStatusBadge = (
  status: OrderDetail["status"],
  t: (key: string) => string,
) => {
  switch (status) {
    case "Completed":
      return (
        <span className="bg-[#e6f4ea] text-[#1e8e3e] px-3 py-1 rounded-full text-[12px] font-bold">
          {t("completed")}
        </span>
      );
    case "Preparing":
      return (
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[12px] font-bold">
          {t("preparing")}
        </span>
      );
    case "Cancelled":
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[12px] font-bold">
          {t("cancelled")}
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[12px] font-bold">
          {status}
        </span>
      );
  }
};

const OrderDetailSidebar = ({
  open,
  onOpenChange,
  order,
}: OrderDetailSidebarProps) => {
  const t = useTranslations("RestaurantDashboard.Reports.recentOrders.detail");
  const { formatPrice } = useCLC();
  if (!order) return null;

  const items = order.itemsList || [];
  const paymentMethod = order.paymentMethod || "N/A";
  const prepDuration = order.prepDuration || "N/A";
  const subtotal = order.subtotal || "$0.00";
  const tax = order.tax || "$0.00";
  const finalTotal = order.total || "$0.00";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[420px] md:max-w-[460px] border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.06)] p-0 flex flex-col overflow-hidden bg-[#f8f9fa] [&>button]:hidden right-0"
        side="right"
      >
        <div className="flex flex-col w-full h-full bg-[#f8f9fa]">
          {/* Header */}
          <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <h2 className="text-[18px] font-bold text-[#1b2d22] leading-tight">
                {order.orderId}
              </h2>
              <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                {order.status} · {order.date}, {order.time}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Order Total */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("orderTotal")}
                </span>
                <span className="text-[20px] font-bold text-[#1b2d22]">
                  {finalTotal}
                </span>
              </div>
              {/* Status */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center items-start">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("status")}
                </span>
                {getStatusBadge(order.status, t)}
              </div>
              {/* Customer */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("customer")}
                </span>
                <span className="text-[14px] font-bold text-[#1b2d22]">
                  {order.customer}
                </span>
              </div>
              {/* Order Source */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("orderSource")}
                </span>
                <span className="text-[14px] font-bold text-[#1b2d22]">
                  {order.source}
                </span>
              </div>
              {/* Payment Method */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("paymentMethod")}
                </span>
                <span className="text-[14px] font-bold text-[#1b2d22]">
                  {paymentMethod}
                </span>
              </div>
              {/* Prep Duration */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {t("prepDuration")}
                </span>
                <span className="text-[14px] font-bold text-[#1b2d22]">
                  {prepDuration}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1b2d22] mb-3">
                {t("orderItems")}
              </h3>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <p className="text-[13px] font-bold text-[#1b2d22]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {t("qty")} {item.qty} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-[#1b2d22]">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">
                  {t("subtotal")}
                </span>
                <span className="text-[12px] font-bold text-[#1b2d22]">
                  {subtotal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">{t("tax")}</span>
                <span className="text-[12px] font-bold text-[#1b2d22]">
                  {tax}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[13px] font-bold text-[#2d6a4f]">
                  {t("total")}
                </span>
                <span className="text-[15px] font-black text-[#2d6a4f]">
                  {finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailSidebar;
