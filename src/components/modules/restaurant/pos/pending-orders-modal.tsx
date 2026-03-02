"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { RootState, AppDispatch } from "@/redux/store/store";
import { restoreFromPending } from "@/redux/slices/cartSlice";
import { Clock, ShoppingBag, Utensils, Bike } from "lucide-react";
import toast from "react-hot-toast";

interface PendingOrdersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PendingOrdersModal({ open, onOpenChange }: PendingOrdersModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const pendingOrders = useSelector((state: RootState) => state.cart.pendingOrders);
    const currentCartItemsCount = useSelector((state: RootState) => state.cart.items.length);

    const handleRestore = (id: string) => {
        if (currentCartItemsCount > 0) {
            toast.error("Please clear or pay for the current cart before restoring a pending order.");
            return;
        }
        dispatch(restoreFromPending(id));
        toast.success("Order restored!");
        onOpenChange(false);
    };

    return (
        <GlobalModal
            open={open}
            onOpenChange={onOpenChange}
            customStyle
            className="max-w-[450px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
        >
            <DialogHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between text-left">
                <DialogTitle className="text-[18px] font-black tracking-tight text-[#111] border-none flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#b8860b]" />
                    Pending Orders
                </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col p-4 max-h-[60vh] overflow-y-auto">
                {pendingOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Clock className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
                        <p className="font-semibold text-[14px]">No pending orders</p>
                        <p className="text-[12px] text-gray-400 mt-1">Orders you save for later will appear here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {pendingOrders.map((order) => {
                            const itemTotal = order.items.reduce((acc, item) => acc + item.quantity, 0);
                            const priceTotal = order.items.reduce((acc, item) => {
                                const itemPrice = item.selectedVariation ? item.price + item.selectedVariation.additionalPrice : item.price;
                                return acc + itemPrice * item.quantity;
                            }, 0);

                            const OrderIcon = order.orderType === "Dine-In" ? Utensils : order.orderType === "Takeaway" ? ShoppingBag : Bike;

                            return (
                                <div key={order.id} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 hover:border-[#357252] transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[13px] text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                                <OrderIcon className="w-3 h-3" />
                                                {order.orderType}
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-medium">
                                                {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <span className="font-black text-[#111] text-[14px]">${priceTotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[12px] text-gray-500 font-medium">
                                            {itemTotal} item{itemTotal !== 1 ? 's' : ''} • {order.items.map(i => i.name).join(', ').substring(0, 30)}...
                                        </span>
                                        <button
                                            onClick={() => handleRestore(order.id)}
                                            className="bg-[#357252] hover:bg-[#2a5a41] text-white text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors"
                                        >
                                            Restore
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </GlobalModal>
    );
}
