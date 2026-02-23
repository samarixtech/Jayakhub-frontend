"use client";

import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { CircleCheck } from "lucide-react";

interface TableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const tables = [
    { id: "T1", status: "Pay Pending", details: "Pay Pending" },
    { id: "T2", status: "Available", details: "2 Seats" },
    { id: "T3", status: "Available", details: "6 Seats" },
    { id: "T4", status: "Available", details: "4 Seats" },
    { id: "T5", status: "Available", details: "4 Seats" },
    { id: "T6", status: "Available", details: "2 Seats" },
    { id: "T7", status: "Selected", details: "8 Seats" },
    { id: "T8", status: "Available", details: "4 Seats" },
    { id: "T9", status: "Available", details: "6 Seats" },
    { id: "T10", status: "Available", details: "2 Seats" },
    { id: "T11", status: "Available", details: "4 Seats" },
    { id: "T12", status: "Available", details: "8 Seats" },
];

export default function TableModal({ open, onOpenChange }: TableModalProps) {
    return (
        <GlobalModal
            open={open}
            onOpenChange={onOpenChange}
            customStyle
            className="sm:max-w-[720px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-xl rounded-[16px] text-left"
        >
            <DialogHeader className="px-6 py-[18px] border-b border-gray-100 flex flex-row items-center justify-between text-left">
                <DialogTitle className="text-[20px] font-black tracking-tight text-[#111827]">Select Table</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col flex-1 p-6">
                {/* Legend */}
                <div className="flex items-center gap-[18px] mb-[30px]">
                    <div className="flex items-center gap-[6px]">
                        <div className="w-[18px] h-[12px] rounded-[4px] bg-[#9df3c4]"></div>
                        <span className="text-[14px] font-[800] text-[#3e5648]">Available</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                        <div className="w-[18px] h-[12px] rounded-[4px] bg-[#ffadad]"></div>
                        <span className="text-[14px] font-[800] text-[#3e5648]">Occupied</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                        <div className="w-[18px] h-[12px] rounded-[4px] bg-[#ffd066]"></div>
                        <span className="text-[14px] font-[800] text-[#3e5648]">Pay Pending</span>
                    </div>
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-4 gap-[20px]">
                    {tables.map((table) => {
                        let bgClass = "";
                        let borderClass = "";
                        let titleClass = "";
                        let detailsClass = "";

                        if (table.status === "Pay Pending") {
                            bgClass = "bg-[#fffcf7]";
                            borderClass = "border-[#ffd98a]";
                            titleClass = "text-[#cc7c50]";
                            detailsClass = "text-[#cc7c50] font-[800]";
                        } else if (table.status === "Selected") {
                            bgClass = "bg-[#357252]";
                            borderClass = "border-transparent";
                            titleClass = "text-white";
                            detailsClass = "text-[#759885] font-[800]";
                        } else {
                            // Available
                            bgClass = "bg-[#f5fdf7]";
                            borderClass = "border-[#bbf4d4]";
                            titleClass = "text-[#1b2d22]";
                            detailsClass = "text-[#8ea89a] font-[800]";
                        }

                        return (
                            <button
                                key={table.id}
                                className={`relative flex flex-col items-center justify-center h-[130px] rounded-[16px] border ${bgClass} ${borderClass} transition-colors hover:opacity-90`}
                            >
                                {table.status === "Selected" && (
                                    <div className="absolute top-[10px] right-[10px]">
                                        <CircleCheck className="w-[16px] h-[16px] text-white stroke-[2px]" />
                                    </div>
                                )}
                                <span className={`text-[24px] font-[900] tracking-tight leading-none mb-[8px] ${titleClass}`}>
                                    {table.id}
                                </span>
                                <span className={`text-[13px] ${detailsClass}`}>
                                    {table.details}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </GlobalModal>
    );
}
