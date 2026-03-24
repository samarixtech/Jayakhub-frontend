"use client";

import React from "react";
import { X, Check, Utensils, Receipt } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

interface OrderItem {
    name: string;
    qty: number;
    price: number;
    total: number;
}

interface ActivityEvent {
    id: string;
    type: "received" | "prepared" | "placed";
    title: string;
    time: string;
}

export interface TransactionDetail {
    id: string; // The transaction ID, e.g., #ORD-9928
    type: "Order" | "Refund";
    date: string;
    time?: string;
    customer: string;
    paymentMethod: string;
    total: string;
    netAmount?: string;
    fee?: string;
    items?: OrderItem[];
    activities?: ActivityEvent[];
}

interface TransactionDetailSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: TransactionDetail | null;
}

const getActivityIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
        case "received":
            return (
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center z-10">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
            );
        case "prepared":
            return (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center z-10">
                    <Utensils className="w-3.5 h-3.5 text-blue-600" />
                </div>
            );
        case "placed":
            return (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center z-10">
                    <Receipt className="w-3.5 h-3.5 text-gray-500" />
                </div>
            );
    }
};

const TransactionDetailSidebar = ({ open, onOpenChange, transaction }: TransactionDetailSidebarProps) => {
    const t = useTranslations("RestaurantDashboard.Payments.transactionSidebar");

    if (!transaction) return null;

    // Use dummy data if detailed items are missing
    const items = transaction.items || [
        { name: "Grilled Chicken Plate", qty: 2, price: 18.0, total: 36.0 },
        { name: "Mixed Salad", qty: 1, price: 8.0, total: 8.0 },
        { name: "Fresh Juice", qty: 2, price: 4.0, total: 8.0 },
    ];

    const activities = transaction.activities || [
        { id: "1", type: "received", title: `Payment received via ${transaction.paymentMethod}`, time: `${transaction.date}, ${transaction.time || "3:15 PM"}` },
        { id: "2", type: "prepared", title: "Order prepared and delivered", time: `${transaction.date}, ${transaction.time || "3:15 PM"}` },
        { id: "3", type: "placed", title: `Order placed by ${transaction.customer}`, time: `${transaction.date}, ${transaction.time || "3:15 PM"}` },
    ];

    const subtotal = transaction.total;
    const feeFormatted = transaction.fee ? `${transaction.fee.startsWith("-") ? "" : "-"}$${Math.abs(parseFloat(transaction.fee)).toFixed(2)}` : "-$2.60";
    const netAmount = transaction.netAmount ? `$${Math.abs(parseFloat(transaction.netAmount)).toFixed(2)}` : "$49.40";

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
                            <h2 className="text-[18px] font-bold text-[#1b2d22] leading-tight">{transaction.id}</h2>
                            <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                                {transaction.type} · {transaction.date}, {transaction.time || "3:15 PM"}
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
                            {/* Order Total / Type */}
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("orderTotal")}</span>
                                <span className="text-[20px] font-bold text-[#1b2d22]">{subtotal}</span>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center items-start">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("type")}</span>
                                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${transaction.type === "Refund" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                                    {transaction.type}
                                </span>
                            </div>

                            {/* Date & Time / Payment Method */}
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("dateTime")}</span>
                                <span className="text-[14px] font-bold text-[#1b2d22]">{transaction.date}, {transaction.time || "3:15 PM"}</span>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("paymentMethod")}</span>
                                <span className="text-[14px] font-bold text-[#1b2d22]">{transaction.paymentMethod}</span>
                            </div>

                            {/* Customer (Full Width if needed, but mockup shows it taking a slot) */}
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center col-span-1">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("customer")}</span>
                                <span className="text-[14px] font-bold text-[#1b2d22]">{transaction.customer}</span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-[13px] font-bold text-[#1b2d22] mb-3">{t("orderItems")}</h3>
                            <div className="space-y-4">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[13px] font-bold text-[#1b2d22]">{item.name}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{t("qty", { qty: item.qty })}</p>
                                        </div>
                                        <span className="text-[13px] font-bold text-[#1b2d22]">${item.total.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-gray-500">{t("subtotal")}</span>
                                <span className="text-[12px] font-bold text-[#1b2d22]">{subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-gray-500">{t("platformFee")}</span>
                                <span className="text-[12px] font-bold text-red-500">{feeFormatted}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[13px] font-bold text-[#2d6a4f]">{t("netAmount")}</span>
                                <span className="text-[15px] font-black text-[#2d6a4f]">{netAmount}</span>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div>
                            <h3 className="text-[13px] font-bold text-[#1b2d22] mb-4">{t("activity")}</h3>
                            <div className="relative border-l border-gray-200 ml-3 pl-5 space-y-6">
                                {activities.map((act, index) => (
                                    <div key={act.id} className="relative">
                                        {/* Icon positioning */}
                                        <div className="absolute -left-[32.5px] top-0 bg-[#f8f9fa] py-1">
                                            {getActivityIcon(act.type)}
                                        </div>

                                        {/* Activity Content */}
                                        <div className="flex flex-col pt-0.5">
                                            <span className="text-[12px] font-bold text-[#1b2d22]">{act.title}</span>
                                            <span className="text-[11px] text-gray-400 mt-0.5">{act.time}</span>
                                        </div>
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

export default TransactionDetailSidebar;
