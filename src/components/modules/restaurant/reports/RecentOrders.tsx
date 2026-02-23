import React, { useState } from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { cn } from "@/lib/utils";
import OrderDetailSidebar, { OrderDetail } from "./OrderDetailSidebar";

interface Order {
    id: string;
    orderId: string;
    date: string;
    time: string;
    status: "Completed" | "Preparing" | "Cancelled";
    customer: string;
    items: string;
    source: string;
    total: string;
}

const RECENT_ORDERS: Order[] = [
    {
        id: "1",
        orderId: "#ORD-2048",
        date: "Feb 21",
        time: "3:35 PM",
        status: "Completed",
        customer: "Hassan Ali",
        items: "Cheeseburger × 2, Fries × 1",
        source: "Walk-in",
        total: "$30.00",
    },
    {
        id: "2",
        orderId: "#ORD-2047",
        date: "Feb 21",
        time: "2:45 PM",
        status: "Completed",
        customer: "Sara Khalid",
        items: "Pepperoni Pizza × 1, Vanilla Shake × 2",
        source: "Online",
        total: "$27.00",
    },
    {
        id: "3",
        orderId: "#ORD-2046",
        date: "Feb 21",
        time: "2:30 PM",
        status: "Preparing",
        customer: "Ahmed Noor",
        items: "Chicken Wrap × 2, Lemonade × 2",
        source: "App",
        total: "$32.00",
    },
    {
        id: "4",
        orderId: "#ORD-2045",
        date: "Feb 21",
        time: "1:30 PM",
        status: "Completed",
        customer: "Maya Barzani",
        items: "Caesar Salad × 1, Lava Cake × 1",
        source: "Walk-in",
        total: "$18.00",
    },
    {
        id: "5",
        orderId: "#ORD-2044",
        date: "Feb 21",
        time: "12:00 PM",
        status: "Cancelled",
        customer: "Omar Rashid",
        items: "Cheeseburger × 3, Fries × 2",
        source: "Phone",
        total: "$84.00",
    },
    {
        id: "6",
        orderId: "#ORD-2043",
        date: "Feb 21",
        time: "11:30 AM",
        status: "Completed",
        customer: "Zara Mustafa",
        items: "Pizza × 2, Lemonade × 3",
        source: "Online",
        total: "$42.00",
    },
];

const getStatusStyles = (status: Order["status"]) => {
    switch (status) {
        case "Completed":
            return "bg-emerald-50 text-emerald-600";
        case "Preparing":
            return "bg-amber-50 text-amber-600";
        case "Cancelled":
            return "bg-red-50 text-red-600";
        default:
            return "bg-gray-50 text-gray-600";
    }
};

const RecentOrders = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const handleOrderClick = (order: Order) => {
        // Map Order to OrderDetail for the sidebar
        setSelectedOrder({
            id: order.id,
            orderId: order.orderId,
            date: order.date,
            time: order.time,
            status: order.status,
            customer: order.customer,
            source: order.source,
            total: order.total,
        });
        setSidebarOpen(true);
    };

    const handleAllOrdersClick = () => {
        // Just show the first order as dummy behavior for "All Orders" opening the sidebar
        if (RECENT_ORDERS.length > 0) {
            handleOrderClick(RECENT_ORDERS[0]);
        }
    };

    const columns: Column<Order>[] = [
        {
            header: "ORDER",
            cell: (item) => (
                <div className="flex flex-col gap-1 py-1">
                    <span className="font-bold text-[#1b2d22] text-[13px]">{item.orderId}</span>
                    <span className="text-[11px] text-[#8ea89a]">{item.date}, {item.time}</span>
                </div>
            ),
        },
        {
            header: "STATUS",
            cell: (item) => (
                <div className="py-2">
                    <span
                        className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-lg leading-none inline-flex max-w-min",
                            getStatusStyles(item.status)
                        )}
                    >
                        {item.status}
                    </span>
                </div>
            ),
        },
        {
            header: "CUSTOMER",
            cell: (item) => (
                <span className="text-[#1b2d22] font-medium text-[13px]">{item.customer}</span>
            ),
        },
        {
            header: "ITEMS",
            cell: (item) => (
                <span className="text-[#657a8a] text-[12px]">{item.items}</span>
            ),
        },
        {
            header: "SOURCE",
            cell: (item) => (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[11px] font-bold max-w-min">
                    {item.source}
                </span>
            ),
        },
        {
            header: "TOTAL",
            cell: (item) => (
                <span className="font-bold text-[#1b2d22] text-[13px]">{item.total}</span>
            ),
        },
    ];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Recent Orders</h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">Click any order for details</p>
                </div>
                <button
                    onClick={handleAllOrdersClick}
                    className="text-[12px] font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    All Orders
                </button>
            </div>

            <GlobalTable
                data={RECENT_ORDERS}
                columns={columns}
                onRowClick={handleOrderClick}
            />

            {/* Pagination Footer */}
            <div className="flex justify-between items-center mt-4 text-[12px] text-[#8ea89a]">
                <span>Showing 1-6 of 10</span>
                <div className="flex gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400">&lt;</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1b2d22] text-white">1</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-[#1b2d22]">2</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400">&gt;</button>
                </div>
            </div>

            <OrderDetailSidebar
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
                order={selectedOrder}
            />
        </div>
    );
};

export default RecentOrders;
