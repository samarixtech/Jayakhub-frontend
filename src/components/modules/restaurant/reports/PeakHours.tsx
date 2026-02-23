import React from "react";

interface PeakHour {
    id: string;
    timeRange: string;
    orders: number;
    percentage: number;
    color: string;
}

const PEAK_HOURS: PeakHour[] = [
    {
        id: "1",
        timeRange: "12 PM - 3 PM",
        orders: 380,
        percentage: 80,
        color: "bg-[#ef4444]", // Red
    },
    {
        id: "2",
        timeRange: "6 PM - 8 PM",
        orders: 240,
        percentage: 55,
        color: "bg-[#f97316]", // Orange
    },
    {
        id: "3",
        timeRange: "8 PM - 10 PM",
        orders: 200,
        percentage: 45,
        color: "bg-[#1B4332]", // Dark Green
    },
    {
        id: "4",
        timeRange: "10 AM - 12 PM",
        orders: 120,
        percentage: 30,
        color: "bg-[#3B82F6]", // Blue
    },
];

const PeakHours = () => {
    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-[16px] font-bold text-gray-900">Peak Hours</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">
                    Busiest times today
                </p>
            </div>

            <div className="space-y-6">
                {PEAK_HOURS.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[13px] font-bold text-gray-900 leading-none">
                                {item.timeRange}
                            </span>
                            <span className="text-[11px] font-bold text-gray-500 leading-none">
                                {item.orders} orders
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeakHours;
