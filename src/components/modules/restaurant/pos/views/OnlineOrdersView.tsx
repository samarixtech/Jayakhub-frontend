"use client";

import {
  Bell,
  ChefHat,
  CheckCircle2,
  Check,
  X,
  Phone,
  Bike,
  Clock,
  Hash,
} from "lucide-react";
import { useCLC } from "@/context/CLCContext";
import { useOnlineOrders } from "../hooks/useOnlineOrders";

export default function OnlineOrdersView() {
  const { formatPrice } = useCLC();
  const {
    activeTab,
    setActiveTab,
    handleAccept,
    handleReject,
    handleMarkReady,
    tabs,
    currentOrders,
  } = useOnlineOrders();

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
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4 shadow-sm"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-black text-[#357252] bg-emerald-50 px-2 py-0.5 rounded text-[13px]">
                  {order.id}
                </span>
                <span className="font-bold text-[#111827] text-[15px]">
                  {order.customerName}
                </span>
                {order.customerPhone ? (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span className="text-[12px] font-medium">
                      +{order.customerPhone}
                    </span>
                  </div>
                ) : null}
                <span className="font-semibold text-gray-400 text-[13px]">
                  {order.timeAgo}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {order.status === "preparing" && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                    <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                      ACCEPTED
                    </span>
                  </div>
                )}

                {order.status === "ready" && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#fff8eb] rounded-full border border-[#ffe4b5]">
                    <ChefHat className="w-[14px] h-[14px] text-[#e8901e] stroke-[2.5px]" />
                    <span className="text-[#e8901e] font-black text-[11px] tracking-wider uppercase">
                      READY
                    </span>
                  </div>
                )}

                <span className="font-black text-[#111827] text-[16px] sm:text-[18px]">
                  {formatPrice(order.total)}
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {order.status === "incoming" && (
                    <>
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors shadow-sm"
                      >
                        <Check className="w-[16px] h-[16px] stroke-[2.5px]" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors"
                      >
                        <X className="w-[16px] h-[16px] stroke-[2.5px]" />
                        Reject
                      </button>
                    </>
                  )}

                  {order.status === "preparing" && (
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#357252] hover:bg-[#2a5a41] text-white rounded-lg font-bold text-[13px] sm:text-[14px] transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-[16px] h-[16px] stroke-[2.5px]" />
                      <span className="whitespace-nowrap">Mark Ready</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {(order.itemDetail.length > 0 ? order.itemDetail : []).map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="text-[12px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg"
                  >
                    {item.quantity}x {item.name}
                  </span>
                ),
              )}
              {order.itemDetail.length === 0 && (
                <p className="font-medium text-gray-500 text-[13px]">
                  {order.items.join(", ")}
                </p>
              )}
            </div>

            {/* Meta row: rider order ID + prepare time */}
            <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-gray-50">
              {order.riderOrderId && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[12px] font-bold">{order.riderOrderId}</span>
                </div>
              )}
              {order.prepareTime && order.prepareTime !== "0s" && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[12px] font-medium">
                    Prepared in {order.prepareTime}
                  </span>
                </div>
              )}
            </div>

            {/* Rider info (Ready tab) */}
            {order.status === "ready" && order.rider && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {order.rider.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${order.rider.image}`}
                      alt={order.rider.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Bike className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#1f2937] text-[14px] truncate">
                    {order.rider.name}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span className="text-[12px] font-medium">
                        +{order.rider.phone}
                      </span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-400 capitalize">
                      {order.rider.vehicleType} · {order.rider.vehicleNumber}
                    </span>
                  </div>
                </div>
                <div className="ml-auto shrink-0">
                  <Bike className="w-5 h-5 text-[#357252] stroke-[2px]" />
                </div>
              </div>
            )}

            {/* Ready — no rider yet */}
            {order.status === "ready" && !order.rider && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fff8eb] rounded-xl border border-[#ffe4b5]">
                <Bike className="w-4 h-4 text-[#e8901e] shrink-0" />
                <span className="text-[13px] font-semibold text-[#92400e]">
                  Waiting for rider assignment
                </span>
              </div>
            )}

            {/* Mobile status badge */}
            {order.status === "preparing" && (
              <div className="flex sm:hidden items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                  ACCEPTED
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
              No {activeTab} orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
