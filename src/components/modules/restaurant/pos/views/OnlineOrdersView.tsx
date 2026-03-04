"use client";

import React from "react";
import {
  Bell,
  ChefHat,
  CheckCircle2,
  Check,
  X,
  Phone,
  Bike,
  User,
} from "lucide-react";
import Image from "next/image";
import { useOnlineOrders } from "../hooks/useOnlineOrders";

export default function OnlineOrdersView() {
  const {
    activeTab,
    setActiveTab,
    handleAccept,
    handleReject,
    handleMarkReady,
    handleHandoffToggle,
    handleCompleteHandoff,
    tabs,
    currentOrders,
  } = useOnlineOrders();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full overflow-hidden shrink-0">
      {/* Tabs */}
      <div className="p-4 sm:p-6 pb-4 sm:pb-6 bg-white shrink-0">
        <div className="flex gap-4">
          {tabs.map((tab) => {
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
        {currentOrders.map((order) => (
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
                {order.items.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-t-0">
              {order.status === "preparing" && (
                <div className="items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 hidden md:flex">
                  <Check className="w-[14px] h-[14px] text-[#357252] stroke-[3px]" />
                  <span className="text-[#357252] font-black text-[11px] tracking-wider uppercase">
                    ACCEPTED
                  </span>
                </div>
              )}

              {order.status === "ready" && (
                <div className="items-center gap-1.5 px-3 py-1 bg-[#fff8eb] rounded-full border border-[#ffe4b5] hidden md:flex shrink-0">
                  <ChefHat className="w-[14px] h-[14px] text-[#e8901e] stroke-[2.5px]" />
                  <span className="text-[#e8901e] font-black text-[11px] tracking-wider uppercase">
                    READY
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 shrink-0 px-2 sm:px-4">
                <span className="font-black text-[#111827] text-[16px] sm:text-[18px]">
                  ${order.total.toFixed(2)}
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

            {/* Hand-off & Rider Tracker UI (Ready State Only) */}
            {order.status === "ready" && (
              <div className="w-full md:w-[320px] lg:w-[360px] shrink-0 border border-emerald-100 rounded-xl bg-white p-4 ml-0 md:ml-4 mt-4 md:mt-0 shadow-sm relative overflow-hidden">
                {order.handoffStage === "rider_assigned" ? (
                  <>
                    {/* Rider Info */}
                    <div
                      className="flex items-center justify-between mb-6 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2 -mt-2"
                      onClick={() => handleHandoffToggle(order.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                            alt="Rider"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[#1f2937] text-[15px]">
                            Zain M.
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span className="text-[12px] font-medium">
                              +964 750 987 6543
                            </span>
                          </div>
                        </div>
                      </div>
                      <Bike className="w-6 h-6 text-[#205139] stroke-[2px]" />
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative px-2 mb-6">
                      {/* Track Line */}
                      <div className="absolute top-[9px] left-6 right-6 h-[3px] bg-gray-100 rounded-full z-0"></div>
                      <div className="absolute top-[9px] left-6 w-[33%] h-[3px] bg-[#357252] rounded-full z-0"></div>

                      <div className="flex justify-between relative z-10 text-center">
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center text-white ring-4 ring-white">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            Assigned
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center ring-4 ring-white border-[3px] border-white">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            En Route
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-gray-200 ring-4 ring-white"></div>
                          <span className="text-[9px] font-bold text-gray-400">
                            Arriving
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-gray-200 ring-4 ring-white"></div>
                          <span className="text-[9px] font-bold text-gray-400">
                            Arrived
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="font-bold text-gray-500 text-[13px]">
                        ETA:{" "}
                      </span>
                      <span className="font-black text-[#357252] text-[13px]">
                        ~10 min
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div
                      className="flex items-center justify-between mb-4 cursor-pointer"
                      onClick={() => handleHandoffToggle(order.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                            alt="Rider"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[#1f2937] text-[15px]">
                            Zain M.
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span className="text-[12px] font-medium">
                              +964 750 987 6543
                            </span>
                          </div>
                        </div>
                      </div>
                      <Bike className="w-6 h-6 text-[#205139] stroke-[2px]" />
                    </div>

                    {/* Progress Tracker (Static for Handoff View) */}
                    <div className="relative px-2 mb-6">
                      {/* Track Line */}
                      <div className="absolute top-[9px] left-6 right-6 h-[3px] bg-[#357252] rounded-full z-0"></div>

                      <div className="flex justify-between relative z-10 text-center">
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center text-white ring-4 ring-white">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            Assigned
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center text-white ring-4 ring-white border-[3px] border-[#357252]">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            En Route
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center text-white ring-4 ring-white">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            Arriving
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-10">
                          <div className="w-5 h-5 rounded-full bg-[#357252] flex items-center justify-center ring-4 ring-white border-[3px] border-white">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                          <span className="text-[9px] font-black text-[#357252]">
                            Arrived
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <span className="font-bold text-[#6b7280] text-[14px]">
                        ETA:{" "}
                      </span>
                      <span className="font-black text-[#205139] text-[14px]">
                        Now
                      </span>
                    </div>

                    <div className="flex-1 bg-[#f0faef] border border-dashed border-[#a7f3d0] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden group">
                      <span className="text-[12px] font-black tracking-widest text-[#9ca3af] uppercase relative z-10 mb-1">
                        Order ID for Rider
                      </span>
                      <span className="font-black text-[40px] text-[#357252] tracking-wider relative z-10 leading-none mb-1">
                        {order.id}
                      </span>
                      <p className="text-[13px] font-bold text-[#6b7280] max-w-[280px] leading-relaxed relative z-10">
                        Give this Order ID to the rider for confirmation
                      </p>

                      <button
                        onClick={() => handleCompleteHandoff(order.id)}
                        className="mt-5 w-full bg-[#357252] hover:bg-[#205139] text-white py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] relative z-10"
                      >
                        <div className="w-5 h-5 bg-[#0ea5e9]/0 text-[#00ff00] flex items-center justify-center rounded-[3px]">
                          <Check className="w-4 h-4 stroke-[4px]" />
                        </div>
                        Complete Handoff
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Accepted Badge */}

            {order.status === "preparing" && (
              <div className="flex md:hidden items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mt-2">
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
