"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Receipt, Banknote, Star, Timer, ArrowUpRight, ArrowDownRight, ShoppingBag, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
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
import Link from 'next/link';
import { getDashboardAnalyticsAction } from "@/app/actions/restaurant/dashboard";

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
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            const res = await getDashboardAnalyticsAction();
            if (res.success && res.data) {
                setDashboardData((res.data as any).data);
            }
            setIsLoading(false);
        };
        fetchDashboardData();
    }, []);

    // Chart Data Config
    const labels = dashboardData?.revenueChart?.map((item: any) => item.day) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dataPoints = dashboardData?.revenueChart?.map((item: any) => parseFloat(item.amount)) || [0, 0, 0, 0, 0, 0, 0];

    // Add extra padding to the max value for better chart visual
    const maxDataPoint = Math.max(...dataPoints, 500);

    const chartData = {
        labels: labels,
        datasets: [
            {
                fill: true,
                label: 'Revenue',
                data: dataPoints,
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
                    title: function (context: any) {
                        return context[0].label;
                    },
                    label: function (context: any) {
                        return 'Rs. ' + context.parsed.y;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                suggestedMax: maxDataPoint * 1.2,
                ticks: {
                    maxTicksLimit: 6,
                    color: '#8ea89a',
                    font: { size: 11, weight: 'bold' as const },
                    callback: (value: any) => 'Rs. ' + value
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

    // Calculate time ago format for activity feed
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hr ago`;
        if (diffDays === 1) return `Yesterday`;
        return `${diffDays} days ago`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(amount).replace('IQD', 'Rs.');
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto space-y-6">
                {/* Skeleton Header */}
                <div className="bg-gray-100 rounded-2xl h-24 w-full animate-pulse"></div>

                {/* Skeleton Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm h-[130px] flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skeleton Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        {/* Skeleton Chart */}
                        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-[360px] animate-pulse">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
                            <div className="w-full h-[280px] bg-gray-50 rounded"></div>
                        </div>
                    </div>
                    {/* Skeleton Activity */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-[360px] animate-pulse">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                                        <div className="flex flex-col gap-2 w-full mt-1">
                                            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                                            <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skeleton Table (Full Width) */}
                <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm min-h-[300px] w-full animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full h-12 bg-gray-50 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const stats = dashboardData?.stats;
    const recentOrders = dashboardData?.recentOrders || [];
    const recentActivity = dashboardData?.recentActivity || [];

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
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">{stats?.todayOrders?.value || 0}</span>
                        <div className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${stats?.todayOrders?.trend === 'down' ? 'bg-[#fff0f0] text-[#ef4444]' : 'bg-[#edf8eb] text-[#1eb589]'}`}>
                            {stats?.todayOrders?.trend === 'down' ? <ArrowDownRight className="w-3 h-3 stroke-[3]" /> : <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
                            {stats?.todayOrders?.changePercent || 0}% vs yesterday
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
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">
                            {formatCurrency(stats?.todayRevenue?.value || 0)}
                        </span>
                        <div className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${stats?.todayRevenue?.trend === 'down' ? 'bg-[#fff0f0] text-[#ef4444]' : 'bg-[#edf8eb] text-[#1eb589]'}`}>
                            {stats?.todayRevenue?.trend === 'down' ? <ArrowDownRight className="w-3 h-3 stroke-[3]" /> : <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
                            {stats?.todayRevenue?.changePercent || 0}% vs yesterday
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
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">{stats?.averageRating?.value || '0.0'}</span>
                        <div className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${stats?.averageRating?.trend?.includes('-') ? 'bg-[#fff0f0] text-[#ef4444]' : 'bg-[#edf8eb] text-[#1eb589]'}`}>
                            {stats?.averageRating?.trend?.includes('-') ? <ArrowDownRight className="w-3 h-3 stroke-[3]" /> : <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
                            {stats?.averageRating?.trend?.replace(/[+-]/g, '') || '0.0 this week'}
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
                        <span className="text-[#1b2d22] text-[28px] font-black leading-none">{stats?.prepareTime?.value || '0m'}</span>
                        <div className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${stats?.prepareTime?.trend?.includes('-') ? 'bg-[#fff0f0] text-[#ef4444]' : 'bg-[#edf8eb] text-[#1eb589]'}`}>
                            {stats?.prepareTime?.trend?.includes('-') ? <ArrowDownRight className="w-3 h-3 stroke-[3]" /> : <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
                            {stats?.prepareTime?.trend?.replace(/[+-]/g, '') || '0m vs avg'}
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
                            <span className="text-[11px] font-semibold text-[#8ea89a]">This Week</span>
                        </div>
                        <div className="flex-1 w-full relative">
                            {dataPoints.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                                    No chart data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Recent Activity) */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-[360px] flex flex-col">
                        <div className="mb-4 shrink-0">
                            <h2 className="text-[16px] font-bold text-[#1b2d22]">Recent Activity</h2>
                            <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Everything happening now</p>
                        </div>
                        <div className="flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-2">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity: any, idx: number) => (
                                    <div key={activity.id || idx} className="flex gap-4 items-start shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${activity.type === 'NEW_ORDER' ? 'bg-[#ecf2ff]' : activity.type === 'RATING' ? 'bg-[#fff6e5]' : activity.type === 'ORDER_COMPLETED' ? 'bg-[#e8f6f0]' : 'bg-[#f4effc]'}`}>
                                            {activity.type === 'NEW_ORDER' && <ShoppingBag className="w-4 h-4 text-[#5584ff]" />}
                                            {activity.type === 'RATING' && <Star className="w-4 h-4 text-[#f5a623]" />}
                                            {activity.type === 'ORDER_COMPLETED' && <CheckCircle className="w-4 h-4 text-[#1eb589]" />}
                                            {activity.type === 'WEEKLY_PAYOUT' && <Banknote className="w-4 h-4 text-[#9c59f6]" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-[#1b2d22]">{activity.title}</span>
                                            <span className="text-[11px] font-medium text-[#8ea89a] mt-0.5">{getTimeAgo(activity.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-sm text-gray-500">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Recent Orders Table (Full Width) */}
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col w-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-[16px] font-bold text-[#1b2d22]">Recent Orders</h2>
                        <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">Active and completed today</p>
                    </div>
                    <Link href="/restaurant/orders" className="text-[13px] font-bold text-[#357252] flex items-center gap-1 hover:underline">
                        View all <span>→</span>
                    </Link>
                </div>
                <div className="overflow-x-auto w-full pb-4">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[25%]">Order</th>
                                <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[25%]">Customer</th>
                                <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[15%]">Items</th>
                                <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[15%]">Total</th>
                                <th className="pb-3 text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider w-[20%]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order: any, idx: number) => (
                                    <tr key={order.orderId} className={idx !== recentOrders.length - 1 ? "border-b border-gray-50 hover:bg-gray-50/50 transition-colors" : "hover:bg-gray-50/50 transition-colors"}>
                                        <td className="py-4 text-[13px] font-bold text-[#1b2d22]">{order.orderId}</td>
                                        <td className="py-4">
                                            <div className="text-[13px] font-bold text-[#1b2d22] truncate max-w-[150px]">{order.customerName}</div>
                                        </td>
                                        <td className="py-4 text-[13px] font-medium text-[#1b2d22]">{order.itemCount} items</td>
                                        <td className="py-4 text-[13px] font-bold text-[#1b2d22]">{formatCurrency(order.totalPrice)}</td>
                                        <td className="py-4">
                                            {order.orderStatus.toLowerCase() === "pending" && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fff7d1] text-[#b8860b]">
                                                    NEW
                                                </span>
                                            )}
                                            {order.orderStatus.toLowerCase() === "ready" && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e6f0ff] text-[#2b6cb0]">
                                                    PREPARING
                                                </span>
                                            )}
                                            {order.orderStatus.toLowerCase() === "delivered" && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e8f6f0] text-[#1eb589]">
                                                    DELIVERED
                                                </span>
                                            )}
                                            {order.orderStatus.toLowerCase() === "rejected" && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fff0f0] text-[#ef4444]">
                                                    REJECTED
                                                </span>
                                            )}
                                            {!["pending", "ready", "delivered", "rejected"].includes(order.orderStatus.toLowerCase()) && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600">
                                                    {order.orderStatus}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
