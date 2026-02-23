import React from "react";

interface OrderSource {
    id: string;
    source: string;
    orders: number;
    revenue: string;
    percentage: number;
    color: string;
}

const ORDER_SOURCES: OrderSource[] = [
    {
        id: "1",
        source: "Walk-in / Dine-in",
        orders: 520,
        revenue: "$18,930",
        percentage: 42,
        color: "bg-[#1B4332]", // Dark Green
    },
    {
        id: "2",
        source: "Online Ordering",
        orders: 380,
        revenue: "$14,208",
        percentage: 31,
        color: "bg-[#3B82F6]", // Blue
    },
    {
        id: "3",
        source: "Third-Party Apps",
        orders: 210,
        revenue: "$7,890",
        percentage: 17,
        color: "bg-[#F97316]", // Orange
    },
    {
        id: "4",
        source: "Phone Orders",
        orders: 135,
        revenue: "$4,203",
        percentage: 10,
        color: "bg-[#A855F7]", // Purple
    },
];

const OrderSources = () => {
    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-[16px] font-bold text-gray-900">Order Sources</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">
                    Where your orders come from
                </p>
            </div>

            <div className="space-y-6">
                {ORDER_SOURCES.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[13px] font-bold text-gray-900 leading-none">
                                {item.source}
                            </span>
                            <span className="text-[13px] font-bold text-gray-900 leading-none">
                                {item.percentage}%
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>

                        <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                            {item.orders} orders • {item.revenue}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSources;
