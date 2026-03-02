"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import { restoreFromPending } from "@/redux/slices/cartSlice";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface PendingOrdersSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PendingOrdersSidebar({ open, onOpenChange }: PendingOrdersSidebarProps) {
    const dispatch = useDispatch<AppDispatch>();
    const pendingOrders = useSelector((state: RootState) => state.cart.pendingOrders);
    const currentCartItemsCount = useSelector((state: RootState) => state.cart.items.length);

    const handleRestore = (id: string) => {
        if (currentCartItemsCount > 0) {
            toast.error("Please clear or pay for the current cart before restoring a pending order.");
            return;
        }
        dispatch(restoreFromPending(id));
        toast.success("Order restored to cart!");
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                <SheetHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
                    <SheetTitle className="text-[15px] font-black text-[#1b2d22] tracking-tight border-none">Pending Orders</SheetTitle>
                    {/* The close button is rendered automatically by SheetContent usually, but we can customize if needed.
                        By default, shadcn Sheet includes an X button. */}
                </SheetHeader>

                <div className="p-4 flex-1 overflow-y-auto bg-white flex flex-col gap-3">
                    {pendingOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <p className="font-medium text-[13px]">No pending orders</p>
                        </div>
                    ) : (
                        pendingOrders.map((order) => {
                            const itemTotal = order.items.reduce((acc, item) => acc + item.quantity, 0);
                            const priceTotal = order.items.reduce((acc, item) => {
                                const itemPrice = item.selectedVariation ? item.price + item.selectedVariation.additionalPrice : item.price;
                                return acc + itemPrice * item.quantity;
                            }, 0);

                            // Try to get a table name from items, fallback to orderType
                            const displayName = order.items[0]?.tableName || (order.orderType === "Dine-In" ? "Table" : order.orderType);

                            // Format time ago roughly
                            const timeAgoMs = Date.now() - new Date(order.timestamp).getTime();
                            const minutesAgo = Math.floor(timeAgoMs / 60000);
                            const timeAgoStr = minutesAgo < 1 ? "Just now" : `${minutesAgo}m ago`;

                            return (
                                <div key={order.id} className="border border-gray-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-default group relative">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[13px] font-black text-[#1eb589] tracking-tight">{displayName}</span>
                                        <span className="text-[11px] text-[#8ea89a] font-medium">{timeAgoStr}</span>
                                    </div>
                                    <div className="text-[11px] text-[#556977] font-medium flex justify-between items-center mt-2">
                                        <span>{itemTotal} items · ${priceTotal.toFixed(2)}</span>
                                        <button
                                            onClick={() => handleRestore(order.id)}
                                            className="text-[#357252] hover:bg-[#e6f4ef] p-1.5 rounded-md transition-colors flex items-center gap-1.5 font-bold"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
