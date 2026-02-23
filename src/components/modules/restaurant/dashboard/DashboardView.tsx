"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Receipt, Banknote, Star, Timer, ArrowUpRight, ArrowDownRight, ShoppingBag, CheckCircle } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

export default function DashboardView() {
    const [isOnline, setIsOnline] = useState(true);

    // Chart Data Config
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                fill: true,
                label: 'Revenue',
                data: [1100, 1300, 950, 1400, 1150, 1600, 1500],
                borderColor: '#2e6b49',
                backgroundColor: 'rgba(46, 107, 73, 0.05)',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 4,
            }
        ]
    };

    const chartOptions = {
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
                callbacks: {
                    label: function (context: any) {
                        return '$' + context.parsed.y;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 500,
                max: 2000,
                ticks: {
                    stepSize: 500,
                    color: '#8ea89a',
                    font: { size: 11, weight: 'bold' as const },
                    callback: (value: any) => '$' + (value / 1000) + 'k'
                },
                border: { display: false },
                grid: {
                    color: '#f3f4f6',
                    drawTicks: false,
                }
            },
            x: {
                ticks: {
                    color: '#8ea89a',
                    font: { size: 11, weight: 'bold' as const },
                    padding: 10
                },
                border: { display: false },
                grid: { display: false }
            }
        }
    };

    // Table Data
    const recentOrders = [
        { id: "#1248", customer: "Hassan A.", type: "Delivery", items: 4, total: "$54.00", status: "NEW" },
        { id: "#1247", customer: "Ahmed M.", type: "Pickup", items: 3, total: "$42.50", status: "PREPARING" },
        { id: "#1246", customer: "Sara K.", type: "Delivery", items: 2, total: "$28.00", status: "DELIVERED" },
    ];

    return (
        <div className="w-full max-w-[1200px] mx-auto space-y-6">

            {/* Top Greeting Header */}
            <div className="bg-[#357252] rounded-2xl flex items-center justify-between px-6 py-5 shadow-sm">
                <div>
                    <h1 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
                        Good afternoon, Ahmed! <span>👋</span>
                    </h1>
                    <p className="text-emerald-100/90 text-[13px] font-medium">
                        Your restaurant is ready to receive orders
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/20 rounded-full pl-4 pr-1.5 py-1.5 border border-white/10 backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold">Online</span>
                    <Switch
                        checked={isOnline}
                        onCheckedChange={setIsOnline}
                        className="data-[state=checked]:bg-[#1eb589] data-[state=unchecked]:bg-gray-400/50"
                    />
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Today's Orders */}
                <div className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[#657a8a] text-[12px] font-bold">Today's Orders</span>
                        <div className="w-8 h-8 rounded-full bg-[#ecf2ff] flex items-center justify-center text-[#5584ff]">
                            <Receipt className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">24</span>
                        <div className="flex items-center gap-1 bg-[#edf8eb] text-[#1eb589] w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3 stroke-[3]" /> +12% vs yesterday
                        </div>
                    </div>
                </div>

                {/* 2. Revenue Today */}
                <div className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[#657a8a] text-[12px] font-bold">Revenue Today</span>
                        <div className="w-8 h-8 rounded-full bg-[#e8f6f0] flex items-center justify-center text-[#1eb589]">
                            <Banknote className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">$486</span>
                        <div className="flex items-center gap-1 bg-[#edf8eb] text-[#1eb589] w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3 stroke-[3]" /> +8% vs yesterday
                        </div>
                    </div>
                </div>

                {/* 3. Avg Rating */}
                <div className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[#657a8a] text-[12px] font-bold">Avg Rating</span>
                        <div className="w-8 h-8 rounded-full bg-[#fff6e5] flex items-center justify-center text-[#f5a623]">
                            <Star className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">4.8</span>
                        <div className="flex items-center gap-1 bg-[#edf8eb] text-[#1eb589] w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3 stroke-[3]" /> +0.2 this week
                        </div>
                    </div>
                </div>

                {/* 4. Prep Time */}
                <div className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[#657a8a] text-[12px] font-bold">Prep Time</span>
                        <div className="w-8 h-8 rounded-full bg-[#f4effc] flex items-center justify-center text-[#9c59f6]">
                            <Timer className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">18m</span>
                        <div className="flex items-center gap-1 bg-[#fff0f0] text-[#ef4444] w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold">
                            <ArrowDownRight className="w-3 h-3 stroke-[3]" /> -2m vs avg
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column (Charts & Tables) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {/* Revenue Overview Chart */}
                    <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col h-[360px]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-[16px] font-bold text-[#1b2d22]">Revenue Overview</h2>
                                <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Last 7 Days</p>
                            </div>
                            <span className="text-[11px] font-semibold text-[#8ea89a]">This Month</span>
                        </div>
                        <div className="flex-1 w-full relative">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Placeholder for Recent Orders Table */}
                    <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-[16px] font-bold text-[#1b2d22]">Recent Orders</h2>
                                <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Active and completed today</p>
                            </div>
                            <button className="text-[13px] font-bold text-[#357252] flex items-center gap-1 hover:underline">
                                View all <span>→</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto w-full pb-4">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[15%]">Order</th>
                                        <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[30%]">Customer</th>
                                        <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[20%]">Items</th>
                                        <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[15%]">Total</th>
                                        <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[20%]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, idx) => (
                                        <tr key={order.id} className={idx !== recentOrders.length - 1 ? "border-b border-gray-50" : ""}>
                                            <td className="py-4 text-[13px] font-bold text-[#1b2d22]">{order.id}</td>
                                            <td className="py-4">
                                                <div className="text-[13px] font-bold text-[#1b2d22]">{order.customer}</div>
                                                <div className="text-[11px] font-medium text-[#8ea89a]">{order.type}</div>
                                            </td>
                                            <td className="py-4 text-[13px] font-medium text-[#1b2d22]">{order.items} items</td>
                                            <td className="py-4 text-[13px] font-bold text-[#1b2d22]">{order.total}</td>
                                            <td className="py-4">
                                                {order.status === "NEW" && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fff7d1] text-[#b8860b]">
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === "PREPARING" && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e6f0ff] text-[#2b6cb0]">
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === "DELIVERED" && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e8f6f0] text-[#1eb589]">
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Recent Activity) */}
                <div className="xl:col-span-1">
                    {/* Placeholder for Recent Activity */}
                    <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-full flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-[16px] font-bold text-[#1b2d22]">Recent Activity</h2>
                            <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Everything happening now</p>
                        </div>
                        <div className="flex flex-col gap-6">
                            {/* Activity 1 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#ecf2ff] flex items-center justify-center shrink-0 mt-0.5">
                                    <ShoppingBag className="w-4 h-4 text-[#5584ff]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#1b2d22]">New order #1547 received</span>
                                    <span className="text-[11px] font-medium text-[#8ea89a] mt-0.5">2 minutes ago</span>
                                </div>
                            </div>

                            {/* Activity 2 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#fff6e5] flex items-center justify-center shrink-0 mt-0.5">
                                    <Star className="w-4 h-4 text-[#f5a623]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#1b2d22]">5-star review from Sarah M.</span>
                                    <span className="text-[11px] font-medium text-[#8ea89a] mt-0.5">15 minutes ago</span>
                                </div>
                            </div>

                            {/* Activity 3 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#e8f6f0] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle className="w-4 h-4 text-[#1eb589]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#1b2d22]">Order #1545 completed</span>
                                    <span className="text-[11px] font-medium text-[#8ea89a] mt-0.5">28 minutes ago</span>
                                </div>
                            </div>

                            {/* Activity 4 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#f4effc] flex items-center justify-center shrink-0 mt-0.5">
                                    <Banknote className="w-4 h-4 text-[#9c59f6]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#1b2d22]">Weekly payout of $2,450 sent</span>
                                    <span className="text-[11px] font-medium text-[#8ea89a] mt-0.5">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
