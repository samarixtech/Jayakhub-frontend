"use client";

import React from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface Payout {
    id: string;
    date: string;
    amount: string;
    bank: string;
    status: "In Transit" | "Paid";
    eta?: string;
}

interface AllPayoutsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payouts: Payout[];
    onPayoutClick: (p: Payout) => void;
}

const AllPayoutsSheet = ({ open, onOpenChange, payouts, onPayoutClick }: AllPayoutsSheetProps) => {
    const total = payouts.reduce((sum, p) => {
        const num = parseFloat(p.amount.replace(/[$,]/g, ""));
        return sum + num;
    }, 0);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="w-[92vw] sm:w-[80vw] md:w-[50vw] lg:w-[45vw] xl:w-[42vw] sm:max-w-[50vw] border border-gray-200 rounded-l-2xl shadow-[-8px_0_24px_rgba(0,0,0,0.08)] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden right-0"
                side="right"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-7 pt-6 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-[20px] font-bold text-[#1a1a1a] leading-tight">All Payouts</SheetTitle>
                                <p className="text-[13px] text-gray-400 font-normal mt-1">{payouts.length} payouts to Citibank •••• 4242</p>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0"
                            >
                                <X className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-7 pb-6">
                        {/* Total bar */}
                        <div className="bg-[#f0f9f4] rounded-xl px-5 py-4 mb-6 flex justify-between items-center">
                            <span className="text-[14px] font-semibold text-[#2d6a4f]">Total Payouts ({payouts.length})</span>
                            <span className="text-[22px] font-black text-[#2d6a4f]">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </div>

                        {/* Table Header */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[500px]">
                                <div className="grid grid-cols-[minmax(60px,1fr)_minmax(70px,1fr)_minmax(72px,1fr)_minmax(90px,1.2fr)_minmax(56px,0.8fr)_minmax(52px,0.8fr)] gap-3 items-center mb-3">
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest">Payout ID</span>
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest">Date</span>
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest">Amount</span>
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest">Bank</span>
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest">Status</span>
                                    <span className="text-[10px] font-semibold text-[#a0a0a0] uppercase tracking-widest text-right">ETA</span>
                                </div>
                                <div className="h-px bg-gray-100 mb-1" />

                                {/* Payout Rows */}
                                {payouts.map((p) => (
                                    <div
                                        key={p.id}
                                        className="grid grid-cols-[minmax(60px,1fr)_minmax(70px,1fr)_minmax(72px,1fr)_minmax(90px,1.2fr)_minmax(56px,0.8fr)_minmax(52px,0.8fr)] gap-3 items-center py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50/80 rounded-lg transition-colors -mx-2 px-2"
                                        onClick={() => onPayoutClick(p)}
                                    >
                                        <span className="text-[13px] font-bold text-[#1a1a1a]">{p.id}</span>
                                        <span className="text-[13px] text-gray-500">{p.date}</span>
                                        <span className="text-[13px] font-bold text-[#1a1a1a]">{p.amount}</span>
                                        <span className="text-[12px] text-gray-400">{p.bank}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${p.status === "In Transit" ? "bg-orange-100 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>{p.status}</span>
                                        <span className="text-[12px] text-gray-400 text-right">{p.eta || "–"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AllPayoutsSheet;
