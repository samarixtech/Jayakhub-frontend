"use client";

import React, { useState } from "react";
import {
  Search,
  Wifi,
  Clock,
  LogOut,
  Keyboard,
  User,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { usePOS } from "../../../../context/POSContext";
import KeyboardShortcutsModal from "./keyboard-shortcuts-modal";
import PendingOrdersSidebar from "./pending-orders-sidebar";
import CloseRegisterModal from "./close-Register";
import Link from "next/link";
import Image from "next/image";

export default function POSNavbar() {
  const { cartItems, setIsCartOpen, setIsSidebarOpen, isSidebarOpen } =
    usePOS();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = useState(false);
  const [isCloseRegisterOpen, setIsCloseRegisterOpen] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="h-[64px] shrink-0 bg-[#357252] text-white flex items-center justify-between px-3 sm:px-6 z-20 relative">
      <div className="flex items-center gap-4 sm:gap-12 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Image
              src="/EngLogo (2).png"
              alt="Jayak Hub Logo"
              width={120}
              height={40}
              className="h-[30px] sm:h-[36px] w-auto object-contain"
            />
          </div>
        </div>

        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
            <Search className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full bg-white text-gray-900 rounded-full pl-9 sm:pl-11 pr-4 py-1.5 sm:py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-[12px] sm:text-[13px] font-semibold placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden lg:flex items-center gap-2 bg-white text-gray-800 px-4 py-[6px] rounded-full cursor-pointer text-[13px] font-bold shadow-sm">
          <Wifi className="w-[15px] h-[15px] text-gray-600 stroke-[2.5px]" />
          Online
        </div>

        {/* Mobile Cart Toggle */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="lg:hidden relative p-2 bg-[#f1a43a] rounded-full text-[#357252] flex items-center justify-center shadow-sm"
        >
          <ShoppingCart className="w-[18px] h-[18px] stroke-[2.5px]" />
          {totalItems > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#357252]">
              {totalItems}
            </div>
          )}
        </button>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setIsPendingOrdersOpen(true)}
            className="relative p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-left"
          >
            <Clock className="w-[20px] h-[20px] text-white" />
            <div className="absolute -top-0 -right-0.5 w-[14px] h-[14px] bg-[#ef4444] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#357252]">
              1
            </div>
          </button>

          <button
            onClick={() => setIsKeyboardOpen(true)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors relative group"
          >
            <Keyboard className="w-[20px] h-[20px] text-white stroke-[2.5px]" />
          </button>

          <button
            onClick={() => setIsCloseRegisterOpen(true)}
            className="flex items-center gap-2 bg-[#f9e9cc] text-[#d68b20] px-3.5 py-1.5 rounded-md cursor-pointer text-[13px] font-bold ml-1 hover:bg-[#ffe3b5]"
          >
            <User className="w-[15px] h-[15px] stroke-[2.5px]" />
            Register 1
          </button>

          <Link
            href="/restaurant/dashboard"
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block"
          >
            <LogOut className="w-[20px] h-[20px]" />
          </Link>
        </div>
      </div>

      <KeyboardShortcutsModal
        open={isKeyboardOpen}
        onOpenChange={setIsKeyboardOpen}
      />
      <PendingOrdersSidebar
        open={isPendingOrdersOpen}
        onOpenChange={setIsPendingOrdersOpen}
      />
      <CloseRegisterModal
        open={isCloseRegisterOpen}
        onOpenChange={setIsCloseRegisterOpen}
      />
    </nav>
  );
}
