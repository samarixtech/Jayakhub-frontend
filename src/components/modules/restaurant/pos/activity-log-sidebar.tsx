"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Bell, XCircle, MapPin, Bike, ShoppingCart } from "lucide-react";

interface ActivityLogSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ActivityLogSidebar({
    open,
    onOpenChange,
}: ActivityLogSidebarProps) {
    const [activeTab, setActiveTab] = useState("all");

    const tabs = [
        { id: "all", label: "All" },
        { id: "tables", label: "Tables" },
        { id: "online", label: "Online" },
        { id: "payments", label: "Payments" },
    ];

    const logs = [
        {
            id: 1,
            type: "order_alert",
            message: "New online order JH-1105 from Layla Z.",
            time: "10:51 · 28 Feb",
            icon: Bell,
            iconBg: "bg-[#fff1d6]",
            iconColor: "text-[#c97a22]",
        },
        {
            id: 2,
            type: "order_alert",
            message: "New online order JH-1104 from Omar B.",
            time: "10:50 · 28 Feb",
            icon: Bell,
            iconBg: "bg-[#fff1d6]",
            iconColor: "text-[#c97a22]",
        },
        {
            id: 3,
            type: "order_rejected",
            message: "Order JH-1102 rejected",
            time: "10:50 · 28 Feb",
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
        {
            id: 4,
            type: "order_rejected",
            message: "Order JH-1103 rejected",
            time: "10:50 · 28 Feb",
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
        {
            id: 5,
            type: "order_alert",
            message: "New online order JH-1103 from Youssef T.",
            time: "10:49 · 28 Feb",
            icon: Bell,
            iconBg: "bg-[#fff1d6]",
            iconColor: "text-[#c97a22]",
        },
        {
            id: 6,
            type: "rider_arrived",
            message: "Rider arrived for JH-1100",
            time: "10:47 · 28 Feb",
            icon: MapPin,
            iconBg: "bg-emerald-50",
            iconColor: "text-[#357252]",
        },
        {
            id: 7,
            type: "rider_arriving",
            message: "Rider arriving for JH-1100",
            time: "10:47 · 28 Feb",
            icon: MapPin,
            iconBg: "bg-[#fff1d6]",
            iconColor: "text-[#c97a22]",
        },
        {
            id: 8,
            type: "rider_en_route",
            message: "Rider en route for JH-1100",
            time: "10:47 · 28 Feb",
            icon: Bike,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
        },
        {
            id: 9,
            type: "rider_assigned",
            message: "Rider Rami S. assigned to JH-1100",
            time: "10:47 · 28 Feb",
            icon: Bike,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
        },
        {
            id: 10,
            type: "order_ready",
            message: "Order JH-1100 marked ready",
            time: "10:47 · 28 Feb",
            icon: ShoppingCart,
            iconBg: "bg-[#fff1d6]",
            iconColor: "text-[#c97a22]",
        },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:w-[400px] border-l-0 p-0 bg-white flex flex-col"
            >
                <SheetHeader className="px-6 py-5 border-b border-gray-100 shrink-0 text-left">
                    <SheetTitle className="text-[18px] sm:text-[20px] font-black text-[#1f2937]">
                        Activity Log
                    </SheetTitle>
                </SheetHeader>

                <div className="px-6 pt-2 pb-0 border-b border-gray-100 shrink-0 bg-white">
                    <div className="flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 text-[13px] font-bold capitalize transition-colors relative ${activeTab === tab.id
                                        ? "text-[#357252]"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#357252] rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
                    <div className="flex flex-col gap-5">
                        {logs.map((log) => {
                            const Icon = log.icon;
                            return (
                                <div key={log.id} className="flex gap-4 items-start group">
                                    <div
                                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${log.iconBg}`}
                                    >
                                        <Icon className={`w-4 h-4 ${log.iconColor}`} />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <span className="text-[13px] font-bold text-[#1f2937] leading-tight group-hover:text-[#357252] transition-colors cursor-pointer">
                                            {log.message}
                                        </span>
                                        <span className="text-[11px] font-semibold text-gray-400 mt-1">
                                            {log.time}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
