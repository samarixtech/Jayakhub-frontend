"use client";

import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";

import { usePOS } from "@/context/POSContext";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateItemVariation } from "@/redux/slices/cartSlice";
import { RootState, AppDispatch } from "@/redux/store/store";

interface ItemModifiersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ItemModifiersModal({ open, onOpenChange }: ItemModifiersModalProps) {
    const { activeModifierItemId } = usePOS();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch<AppDispatch>();

    const activeItem = cartItems.find((i) => (i.cartId || i.id) === activeModifierItemId);
    const variations = activeItem?.variations || [];

    // Track local selection before saving
    const [selectedVarName, setSelectedVarName] = useState<string | null>(null);

    // Reset local selection when opening modal to match context
    useEffect(() => {
        if (open && activeItem) {
            setSelectedVarName(activeItem.selectedVariation?.name || null);
        }
    }, [open, activeItem]);

    const handleSave = () => {
        if (activeModifierItemId && selectedVarName) {
            const chosen = variations.find((v: any) => v.name === selectedVarName);
            if (chosen) {
                dispatch(updateItemVariation({
                    id: activeModifierItemId.toString(),
                    variation: chosen
                }));
            }
        }
        onOpenChange(false);
    };

    if (!activeItem) return null;

    return (
        <GlobalModal
            open={open}
            onOpenChange={onOpenChange}
            customStyle
            className="max-w-[450px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
        >
            <DialogHeader className="px-5 py-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
                <DialogTitle className="text-[20px] font-black tracking-[-0.01em] text-[#111827]">
                    {activeItem.name} Modifiers
                </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col p-5">
                {variations.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {variations.map((mod, i) => {
                            const isSelected = selectedVarName === mod.name;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVarName(mod.name)}
                                    className={`flex flex-col items-center justify-center h-[80px] p-2 text-center border rounded-[8px] transition-colors ${isSelected
                                        ? "border-[#1eb589] bg-emerald-50/50"
                                        : "border-gray-200 hover:border-[#1eb589] hover:bg-emerald-50/30"
                                        }`}
                                >
                                    <span className="text-[14px] font-[600] text-[#111827] capitalize">
                                        {mod.name}
                                    </span>
                                    {mod.additionalPrice > 0 && (
                                        <span className="text-[14px] font-[500] text-gray-500">
                                            +${mod.additionalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 mb-6">
                        <p className="text-gray-400 font-medium">No variations available for this item.</p>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    className="w-full bg-[#1eb589] hover:bg-[#159a72] text-white font-bold py-3.5 rounded-[8px] text-[16px] transition-colors"
                >
                    Save Modifiers
                </button>
            </div>
        </GlobalModal>
    );
}
