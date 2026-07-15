"use client";

import {
  Bell,
  ChefHat,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";
import { useCLC } from "@/context/CLCContext";
import { usePosOrders } from "../hooks/usePosOrders";
import { useTranslations } from "next-intl";

export default function PosOrdersView() {
  const t = useTranslations("POS.posOrders");
  const { formatPrice } = useCLC();
  const {
    activeTab,
    setActiveTab,
    handleAccept,
    handleReject,
    handleMarkReady,
    tabs,
    currentOrders,
    loading,
  } = usePosOrders();

  if (loading && currentOrders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full overflow-hidden shrink-0">
      {/* Tabs */}
      <div className="p-4 sm:p-6 pb-4 sm:pb-6 bg-white shrink-0">
        <div className="flex gap-4">
          {(tabs || []).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 px-4 rounded-xl border-2 transition-colors ${
                  isActive
                    ? "border-emerald-100 bg-emerald-50/50 text-[#357252]"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                }`}
              >
                <span className="font-black text-[16px] sm:text-[18px]">
                  {tab.count}
                </span>
                <Icon
                  className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ${
                    isActive ? "text-[#357252]" : "text-gray-400"
                  }`}
                  strokeWidth={2.5}
                />
                <span className="font-bold text-[13px] sm:text-[14px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-0 space-y-4">
        {(currentOrders || []).map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex flex-col gap-1.5 flex-1 w-full max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="font-black text-[#357252] bg-emerald-50 px-2 py-0.5 rounded text-[13px]">
                  {order.id}
                </span>
                <span className="font-bold text-[#111827] text-[15px]">
                  {order.customerName}
                </span>
                <span className="font-semibold text-gray-400 text-[13px]">
                  {order.timeAgo}
                </span>
              </div>
              <p className="font-medium text-gray-500 text-[13px] leading-relaxed line-clamp-2">
                {(order.items || []).join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-t-0">
              {order.status === "preparing" && (
                <div className="items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 hidden md:flex">
                  <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                  <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                    {t("accepted")}
                  </span>
                </div>
              )}

              {order.status === "ready" && (
                <div className="items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 hidden md:flex shrink-0">
                  <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                  <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                    {t("completed")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 shrink-0 px-2 sm:px-4">
                <span className="font-black text-[#111827] text-[16px] sm:text-[18px]">
                  {formatPrice(order.total)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {order.status === "incoming" && (
                  <>
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors shadow-sm"
                    >
                      <Check className="w-[16px] h-[16px] stroke-[2.5px]" />
                      {t("accept")}
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors"
                    >
                      <X className="w-[16px] h-[16px] stroke-[2.5px]" />
                      {t("reject")}
                    </button>
                  </>
                )}

                {order.status === "preparing" && (
                  <button
                    onClick={() => handleMarkReady(order.id)}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#357252] hover:bg-[#2a5a41] text-white rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-[16px] h-[16px] stroke-[2.5px]" />
                    <span className="whitespace-nowrap">{t("complete")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Accepted Badge */}
            {order.status === "preparing" && (
              <div className="flex md:hidden items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mt-2">
                <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                  {t("accepted")}
                </span>
              </div>
            )}

            {/* Mobile Completed Badge */}
            {order.status === "ready" && (
              <div className="flex md:hidden items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mt-2">
                <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                  {t("completed")}
                </span>
              </div>
            )}
          </div>
        ))}

        {currentOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
            {activeTab === "incoming" && (
              <Bell className="w-12 h-12 mb-4 text-gray-200" />
            )}
            {activeTab === "preparing" && (
              <ChefHat className="w-12 h-12 mb-4 text-gray-200" />
            )}
            {activeTab === "ready" && (
              <CheckCircle2 className="w-12 h-12 mb-4 text-gray-200" />
            )}
            <p className="font-bold text-[14px] sm:text-[15px]">
              {t("noOrders", {
                tab:
                  tabs.find((tab) => tab.id === activeTab)?.label ?? activeTab,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
