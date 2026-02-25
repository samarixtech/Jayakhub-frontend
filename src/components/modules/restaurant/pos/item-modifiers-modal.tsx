"use client";

import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";

interface ItemModifiersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const modifiers = [
    { id: "1", label: "Extra Cheese", price: "+$1" },
    { id: "2", label: "No Onion" },
    { id: "3", label: "Spicy" },
    { id: "4", label: "Take Away Pack" },
    { id: "5", label: "Sugar Free" },
    { id: "6", label: "Salt Less" },
];

export default function ItemModifiersModal({ open, onOpenChange }: ItemModifiersModalProps) {
    return (
        <GlobalModal
            open={open}
            onOpenChange={onOpenChange}
            customStyle
            className="max-w-[450px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
        >
            <DialogHeader className="px-5 py-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
                <DialogTitle className="text-[20px] font-black tracking-[-0.01em] text-[#111827]">Item Modifiers</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col p-5">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {modifiers.map((mod) => (
                        <button
                            key={mod.id}
                            className="flex flex-col items-center justify-center h-[90px] p-2 text-center border border-gray-200 rounded-[8px] hover:border-[#1eb589] hover:bg-emerald-50/30 transition-colors"
                        >
                            <span className="text-[14px] font-[500] text-[#111827] leading-tight">
                                {mod.label}
                            </span>
                            {mod.price && (
                                <span className="text-[14px] font-[500] text-[#111827]">
                                    ({mod.price})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onOpenChange(false)}
                    className="w-full bg-[#1eb589] hover:bg-[#159a72] text-white font-bold py-3.5 rounded-[8px] text-[16px] transition-colors"
                >
                    Save Modifiers
                </button>
            </div>
        </GlobalModal>
    );
}
