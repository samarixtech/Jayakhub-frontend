"use client";

import React, { useState } from "react";
import {
  Utensils,
  ShoppingBag,
  Bike,
  ReceiptText,
  User,
  Plus,
  Minus,
  X,
  Clock,
  Coffee,
} from "lucide-react";
import { usePOS } from "../../context/POSContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TableModal from "./table-modal";
import ItemModifiersModal from "./item-modifiers-modal";
import PaymentModal from "./payment-modal";

export default function POSCartPanel() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
    isCartOpen,
    setIsCartOpen,
  } = usePOS();
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isModifiersOpen, setIsModifiersOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const CartContent = () => (
    <div className="w-full h-full lg:w-[300px] xl:w-[320px] bg-white lg:border-l border-gray-200 flex flex-col z-10 shrink-0">
      {/* Top Toggle */}
      <div className="p-3">
        <div className="flex border border-gray-200 rounded-md overflow-hidden h-[36px]">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#357252] text-white text-[11px] font-bold transition-all">
            <Utensils className="w-[13px] h-[13px]" />{" "}
            <span className="hidden lg:inline">Dine-In</span>
            <span className="lg:hidden">Dine</span>
          </button>
          <div className="w-px bg-gray-200"></div>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-[11px] font-semibold transition-all">
            <ShoppingBag className="w-[13px] h-[13px]" />{" "}
            <span className="hidden lg:inline">Takeaway</span>
            <span className="lg:hidden">Take</span>
          </button>
          <div className="w-px bg-gray-200"></div>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-[11px] font-semibold transition-all">
            <Bike className="w-[13px] h-[13px]" /> Delivery
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Table & Customer Details */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="flex border border-gray-100 rounded-md text-[11px] bg-white h-[36px]">
            <div
              onClick={() => setIsTableModalOpen(true)}
              className="flex-1 px-3 border-r border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-400 font-[800] uppercase tracking-wider text-[9px]">
                Table
              </span>
              <span className="font-black text-[#111] text-[12px]">T4</span>
            </div>
            <div className="flex-1 px-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <User className="w-[12px] h-[12px] text-[#357252] stroke-[2.5px]" />
              <span className="font-bold text-[#111] text-[12px] truncate">
                Walk-In
              </span>
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-[100px] p-0 bg-white">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
              <div className="mb-3">
                <ReceiptText className="w-10 h-10 text-gray-200 stroke-[1.5px]" />
              </div>
              <p className="font-bold text-gray-400 text-[13px]">
                No items yet
              </p>
              <p className="text-[11px] mt-0.5 text-gray-300 font-medium text-center px-4">
                Tap a menu item to start your order
              </p>
            </div>
          ) : (
            <div className="flex flex-col px-3 gap-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col p-3 border border-[#f5e1c4] bg-[#fffbf4] transition-colors rounded-xl shadow-[0_1px_3px_rgba(245,166,35,0.1)]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-1 pr-2">
                      <span className="font-black text-[#111827] text-[13px] leading-tight">
                        {item.name}
                      </span>
                      <span className="px-[5px] py-[2px] rounded-[3px] bg-[#fff1d6] text-[#c97a22] text-[8px] font-black uppercase tracking-wider">
                        NEW
                      </span>
                    </div>
                    <span className="font-black text-[#111827] text-[13px]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-start gap-3 mb-3">
                    <div className="flex items-center bg-[#f0f4ff] rounded p-0.5 mt-1 border border-blue-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center bg-transparent text-[#6b7280] hover:text-[#374151] transition-colors"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5px]" />
                      </button>
                      <span className="w-6 text-center font-bold text-[12px] text-[#111827]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center bg-transparent text-[#6b7280] hover:text-[#374151] transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5px]" />
                      </button>
                    </div>
                    <span className="text-[#6b7280] font-medium text-[11px] mt-1">
                      @ ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsModifiersOpen(true)}
                      className="text-[#357252] hover:text-[#2a5a41] text-[10px] font-bold transition-colors"
                    >
                      Modifiers
                    </button>
                    <button className="text-[#357252] hover:text-[#2a5a41] text-[10px] font-bold transition-colors">
                      Note
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#ef4444] hover:text-[#dc2626] text-[10px] font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Area */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-white shrink-0 mt-auto">
        <div className="space-y-[4px] text-[12px] mb-4">
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Items</span>
            <span className="text-gray-700">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Subtotal</span>
            <span className="text-gray-700">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Tax (5%)</span>
            <span className="text-gray-700">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="font-black text-gray-900 text-[15px] sm:text-[16px]">
            Total
          </span>
          <span className="font-black text-gray-900 text-[15px] sm:text-[16px]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="w-[70px] bg-[#fffcf7] text-[#e87a27] font-bold py-2 md:py-2.5 rounded-[6px] flex flex-col items-center justify-center gap-[4px] hover:bg-[#ffeadd] transition-colors shadow-[0_1px_2px_rgba(232,122,39,0.1)]">
            <Coffee className="w-[16px] h-[16px] stroke-[2px]" />
            <span className="text-[10px] uppercase font-black tracking-tight">
              KOT
            </span>
          </button>
          <button className="flex-1 bg-[#fffbe6] text-[#b8860b] font-bold py-2 md:py-2.5 rounded-[6px] flex flex-col items-center justify-center gap-[4px] hover:bg-[#fff7d1] transition-colors shadow-[0_1px_2px_rgba(184,134,11,0.1)]">
            <Clock className="w-[16px] h-[16px] stroke-[2px]" />
            <span className="text-[10px] uppercase font-black tracking-tight">
              Pay Later
            </span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex-1 bg-[#1eb589] hover:bg-[#159a72] text-white font-bold py-2 md:py-2.5 rounded-[6px] flex items-center justify-center gap-1.5 text-[14px] transition-colors shadow-[0_1px_2px_rgba(30,181,137,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
          >
            Pay →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex shrink-0 h-full">
        <CartContent />
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="p-0 w-full sm:w-[400px] bg-white border-l-0 flex flex-col"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <CartContent />
          </div>
        </SheetContent>
      </Sheet>

      <TableModal open={isTableModalOpen} onOpenChange={setIsTableModalOpen} />
      <ItemModifiersModal
        open={isModifiersOpen}
        onOpenChange={setIsModifiersOpen}
      />
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
      />
    </>
  );
}
