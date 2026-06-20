"use client";

import React from "react";
import { X, CheckCircle2, Clock, Circle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

interface Payout {
    id: string;
    amount: string;
    status: "approved" | "rejected" | "pending";
    requestType: string;
    stripeTransferId: string | null;
    processedAt: string;
    createdAt: string;
}

const formatDate = (isoStr: string) => {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

interface PayoutDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payout: Payout | null;
}

/* ── Timeline Step ── */
const TimelineStep = ({ label, time, iconType }: { label: string; time: string; iconType: "done" | "active" | "pending" }) => (
    <div className="flex items-start gap-3 relative">
        {iconType === "done" && (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
        )}
        {iconType === "active" && (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3 h-3 text-white" />
            </div>
        )}
        {iconType === "pending" && (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center shrink-0 mt-0.5">
                <Circle className="w-2 h-2 text-gray-300" />
            </div>
        )}
        <div>
            <p className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
        </div>
    </div>
);

const PayoutDetailSheet = ({ open, onOpenChange, payout }: PayoutDetailSheetProps) => {
    const t = useTranslations("RestaurantDashboard.Payments.payoutDetailSheet");

    if (!payout) return null;

    const amountNum = parseFloat(payout.amount || "0");
    const processedDate = formatDate(payout.processedAt || payout.createdAt);
    const createdDate = formatDate(payout.createdAt);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="w-[92vw] sm:w-[80vw] md:w-[50vw] lg:w-[45vw] xl:w-[42vw] sm:max-w-[50vw] border border-gray-200 rounded-l-2xl shadow-[-8px_0_24px_rgba(0,0,0,0.08)] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden right-0"
                side="right"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-7 pt-6 pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-[20px] font-bold text-[#1a1a1a] leading-tight">{t("title", { id: payout.id })}</SheetTitle>
                                <p className="text-[13px] text-gray-400 font-normal mt-1">{t("subtitle", { date: processedDate })}</p>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0"
                            >
                                <X className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>

                    {/* Content — compact, no scroll needed */}
                    <div className="px-7 py-5 space-y-4">
                        {/* Payout Amount + Status */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">{t("amount")}</span>
                                <span className="text-[20px] font-black text-[#1a1a1a] leading-tight">{payout.amount}</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">{t("status")}</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold ${
                                    payout.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                                    payout.status === "rejected" ? "bg-red-50 text-red-500" :
                                    "bg-orange-100 text-orange-600"
                                }`}>{payout.status}</span>
                            </div>
                        </div>

                        {/* Period + Orders */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-1">{t("period")}</span>
                                <span className="text-[14px] font-bold text-[#1a1a1a]">{t("periodValue")}</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-1">{t("ordersIncluded")}</span>
                                <span className="text-[14px] font-bold text-[#1a1a1a]">{t("ordersValue", { count: 31 })}</span>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-1">Requested</span>
                                <span className="text-[14px] font-bold text-[#1a1a1a]">{createdDate}</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl px-4 py-3">
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-1">Processed</span>
                                <span className="text-[14px] font-bold text-[#1a1a1a]">{processedDate}</span>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-gray-50 rounded-xl px-5 py-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-[#1a1a1a]">{t("netPayout")}</span>
                                <span className="text-[15px] font-black text-[#1a1a1a]">{amountNum.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payout Timeline */}
                        <div className="pt-1">
                            <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-3">{t("payoutTimeline")}</h4>
                            <div className="space-y-3 relative">
                                <div className="absolute left-[9px] top-5 bottom-2 w-px bg-gray-200" />
                                {payout.status === "approved" ? (
                                    <>
                                        <TimelineStep label={t("payoutDeposited")} time={processedDate} iconType="done" />
                                        <TimelineStep label={t("inTransit")} time={createdDate} iconType="done" />
                                        <TimelineStep label={t("payoutInitiated")} time={createdDate} iconType="done" />
                                    </>
                                ) : payout.status === "rejected" ? (
                                    <>
                                        <TimelineStep label="Rejected" time={processedDate} iconType="pending" />
                                        <TimelineStep label={t("payoutInitiated")} time={createdDate} iconType="done" />
                                    </>
                                ) : (
                                    <>
                                        <TimelineStep label={t("payoutDeposited")} time={t("pending")} iconType="pending" />
                                        <TimelineStep label={t("inTransit")} time={createdDate} iconType="active" />
                                        <TimelineStep label={t("payoutInitiated")} time={createdDate} iconType="done" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default PayoutDetailSheet;
