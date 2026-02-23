"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface PendingOrdersSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PendingOrdersSidebar({ open, onOpenChange }: PendingOrdersSidebarProps) {
    // Dummy data to match the image
    const pendingOrder = {
        table: "T4",
        timeAgo: "0m ago",
        items: 1,
        total: 15.75,
        status: "Pay Pending"
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                <SheetHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
                    <SheetTitle className="text-[15px] font-black text-[#1b2d22] tracking-tight border-none">Pending Orders</SheetTitle>
                    {/* The close button is rendered automatically by SheetContent usually, but we can customize if needed.
                        By default, shadcn Sheet includes an X button. */}
                </SheetHeader>

                <div className="p-4 flex-1 overflow-y-auto bg-white">
                    <div className="border border-gray-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[13px] font-black text-[#1eb589] tracking-tight">{pendingOrder.table}</span>
                            <span className="text-[11px] text-[#8ea89a] font-medium">{pendingOrder.timeAgo}</span>
                        </div>
                        <div className="text-[11px] text-[#556977] font-medium">
                            {pendingOrder.items} items · ${pendingOrder.total.toFixed(2)} · {pendingOrder.status}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
