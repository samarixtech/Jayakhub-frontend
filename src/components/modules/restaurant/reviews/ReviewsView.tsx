"use client";

import React from "react";
import { Calendar } from "lucide-react";

import ReviewsStats from "./ReviewsStats";
import ReviewsCharts from "./ReviewsCharts";
import ReviewList from "./ReviewList";

export default function ReviewsView() {
    return (
        <div className="w-full max-w-[1024px] mx-auto space-y-6 px-4 md:px-0">
            {/* Top Filter */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Last 30 Days
                </button>
            </div>

            {/* Metrics Cards Row */}
            <ReviewsStats />

            {/* Charts Row */}
            <ReviewsCharts />

            {/* Reviews List Section (includes filter pills and details sheet) */}
            <ReviewList />
        </div>
    );
}
