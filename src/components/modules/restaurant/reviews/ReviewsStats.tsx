import React from "react";
import { Star, MessageSquare, Flag, ArrowUpRight } from "lucide-react";

export default function ReviewsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 1. Average Rating */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                    <span className="text-[#657a8a] text-[13px] font-bold">Average Rating</span>
                    <div className="w-8 h-8 rounded-lg bg-[#fff6e5] flex items-center justify-center text-[#f5a623]">
                        <Star className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[#1b2d22] text-[32px] font-black leading-none">4.8</span>
                    <div className="flex items-center gap-1 text-[#1eb589] font-bold text-[11px]">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> +0.2 this period
                    </div>
                </div>
            </div>

            {/* 2. Total Reviews */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                    <span className="text-[#657a8a] text-[13px] font-bold">Total Reviews</span>
                    <div className="w-8 h-8 rounded-lg bg-[#ecf2ff] flex items-center justify-center text-[#5584ff]">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[#1b2d22] text-[32px] font-black leading-none">1,248</span>
                    <div className="flex items-center gap-1 text-[#1eb589] font-bold text-[11px]">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> +142 this period
                    </div>
                </div>
            </div>

            {/* 3. Unreplied */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                    <span className="text-[#657a8a] text-[13px] font-bold">Unreplied</span>
                    <div className="w-8 h-8 rounded-lg bg-[#f4effc] flex items-center justify-center text-[#9c59f6]">
                        <Flag className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[#1b2d22] text-[32px] font-black leading-none">5</span>
                    <div className="text-[#657a8a] font-medium text-[12px] mt-0.5">
                        Needs attention
                    </div>
                </div>
            </div>

        </div>
    );
}
