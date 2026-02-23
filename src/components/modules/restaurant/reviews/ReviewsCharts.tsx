"use client";

import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function ReviewsCharts() {
    // Rating Trend Chart Config
    const trendData = {
        labels: ['Feb 1', 'Feb 7', 'Feb 13', 'Feb 19', 'Feb 25', 'Feb 30'], // Following mock labels vaguely
        datasets: [
            {
                fill: true,
                label: 'Average Rating',
                data: [4.2, 4.3, 4.6, 4.4, 4.9, 4.5, 4.8, 4.6, 4.9, 4.7, 4.9, 4.7, 5.0, 4.7, 4.9], // Approximation curve
                borderColor: '#f5a623', // Yellow line
                backgroundColor: 'rgba(245, 166, 35, 0.05)',
                borderWidth: 2,
                tension: 0.2, // Smooth curve
                pointRadius: 0,
                pointHoverRadius: 4,
            }
        ]
    };

    const trendOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1b2d22',
                padding: 10,
                titleFont: { size: 13, family: 'sans-serif' },
                bodyFont: { size: 13, family: 'sans-serif', weight: 'bold' as const },
                displayColors: false,
            }
        },
        scales: {
            y: {
                min: 3.0,
                max: 5.0,
                ticks: {
                    stepSize: 0.5,
                    color: '#8ea89a',
                    font: { size: 10, weight: 'bold' as const },
                },
                border: { display: false },
                grid: {
                    color: '#f3f4f6',
                    drawTicks: false,
                    borderDash: [5, 5] // Dashed grid lines
                }
            },
            x: {
                ticks: {
                    color: '#8ea89a',
                    font: { size: 10, weight: 'bold' as const },
                    padding: 10,
                    maxTicksLimit: 6 // Match the 6 labels on mock
                },
                border: { display: false },
                grid: { display: false }
            }
        }
    };

    // Distribution Doughnut Config
    const distData = {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Stars'],
        datasets: [
            {
                data: [75, 15, 6, 3, 2], // Approximate percentages based on mock text
                backgroundColor: [
                    '#f5a623', // Yellow
                    '#5584ff', // Blue
                    '#9c59f6', // Purple
                    '#f97316', // Orange
                    '#ef4444'  // Default red
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
                cutout: '75%', // Thickness of doughnut ring
                hoverOffset: 4
            }
        ]
    };

    const distOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false // Custom text in center, ignoring tooltips mostly
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Rating Trend (Line Chart) */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm col-span-2 flex flex-col min-h-[340px]">
                <div className="mb-4">
                    <h2 className="text-[16px] font-bold text-[#1b2d22]">Rating Trend</h2>
                    <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Average ratings over selected period</p>
                </div>
                <div className="flex-1 w-full relative">
                    <Line data={trendData} options={trendOptions} />
                </div>
            </div>

            {/* Rating Distribution (Doughnut Chart) */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm col-span-1 flex flex-col h-full min-h-[340px]">
                <div className="mb-2">
                    <h2 className="text-[16px] font-bold text-[#1b2d22]">Rating Distribution</h2>
                    <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Breakdown by stars</p>
                </div>

                {/* Chart Container */}
                <div className="w-full flex-1 relative flex items-center justify-center mt-2 max-h-[160px]">
                    <Doughnut data={distData} options={distOptions} />
                    {/* Center Text absolute placed */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mt-1">
                        <span className="text-[26px] font-black text-[#1b2d22] leading-none">75%</span>
                        <span className="text-[11px] font-bold text-[#8ea89a] mt-1">5 Stars</span>
                    </div>
                </div>

                {/* Custom Legend Layout corresponding to mock */}
                <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#f5a623]"></span>
                            <span className="text-[11px] font-bold text-[#8ea89a]">5 Stars</span>
                        </div>
                        <span className="text-[11px] font-black text-[#1b2d22]">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5584ff]"></span>
                            <span className="text-[11px] font-bold text-[#8ea89a]">4 Stars</span>
                        </div>
                        <span className="text-[11px] font-black text-[#1b2d22]">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#9c59f6]"></span>
                            <span className="text-[11px] font-bold text-[#8ea89a]">3 Stars</span>
                        </div>
                        <span className="text-[11px] font-black text-[#1b2d22]">6%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
                            <span className="text-[11px] font-bold text-[#8ea89a]">2 Stars</span>
                        </div>
                        <span className="text-[11px] font-black text-[#1b2d22]">3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                            <span className="text-[11px] font-bold text-[#8ea89a]">1 Stars</span>
                        </div>
                        <span className="text-[11px] font-black text-[#1b2d22]">2%</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
