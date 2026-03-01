"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

interface POSSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function POSSettingsModal({
    open,
    onOpenChange,
}: POSSettingsModalProps) {
    const [tables, setTables] = useState([
        { id: "T2", capacity: 2 },
        { id: "T3", capacity: 6 },
        { id: "T4", capacity: 4 },
        { id: "T5", capacity: 4 },
        { id: "T6", capacity: 2 },
        { id: "T7", capacity: 8 },
        { id: "T8", capacity: 4 },
        { id: "T9", capacity: 6 },
        { id: "T10", capacity: 2 },
    ]);

    const removeTable = (id: string) => {
        setTables(tables.filter((t) => t.id !== id));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[450px] p-0 overflow-hidden bg-white gap-0">
                <DialogHeader className="p-4 sm:p-5 border-b border-gray-100 bg-white">
                    <DialogTitle className="text-[18px] sm:text-[20px] font-black text-[#1f2937]">
                        POS Settings — Tables
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col bg-white">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="w-[100px]">Table</div>
                        <div className="flex-1 text-center">Capacity</div>
                        <div className="w-[60px] text-right">Remove</div>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 bg-white"
                            >
                                <div className="w-[100px] font-black text-[#1f2937] text-[14px]">
                                    {table.id}
                                </div>
                                <div className="flex-1 text-center font-semibold text-gray-500 text-[13px]">
                                    {table.capacity} seats
                                </div>
                                <div className="w-[60px] flex justify-end">
                                    <button
                                        onClick={() => removeTable(table.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-[16px] h-[16px]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Table name (e.g. T13)"
                                className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-md text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]"
                            />
                            <input
                                type="number"
                                placeholder="Seats"
                                className="w-[80px] h-10 px-3 bg-white border border-gray-200 rounded-md text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]"
                            />
                            <button className="h-10 px-4 bg-[#357252] hover:bg-[#2a5a41] text-white rounded-md text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
                                <Plus className="w-[16px] h-[16px] stroke-[2.5px]" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
