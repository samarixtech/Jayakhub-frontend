"use client";
import React, { useState } from "react";
import {
  Search,
  Globe,
  Clock,
  LogOut,
  Keyboard,
  User,
  ShoppingCart,
  Settings,
  ChevronDown,
  Home,
} from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { usePOS } from "@/context/POSContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import PendingOrdersSidebar from "./PendingOrdersSidebar";
import CloseRegisterModal from "./CloseRegisterModal";
import POSSettingsModal from "./POSSettingsModal";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../../public/EngLogo (2).png";

export default function POSNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isOnlineOrdersPage = pathname.endsWith("/orders");
  const isPosOrdersPage = pathname.endsWith("/orders/pos");
  const isOrdersPage = isOnlineOrdersPage || isPosOrdersPage;

  const {
    cartItems,
    setIsCartOpen,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    globalCategories,
    isPosLoading,
  } = usePOS();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = useState(false);
  const [isCloseRegisterOpen, setIsCloseRegisterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pendingOrdersCount = useSelector(
    (state: RootState) => state.cart.pendingOrders.length,
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [userRole, setUserRole] = useState<string>("restaurant_owner");

  React.useEffect(() => {
    const match = document.cookie.match(new RegExp("(^| )role=([^;]+)"));
    if (match) setUserRole(decodeURIComponent(match[2]).toLowerCase());
  }, []);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F4") {
        e.preventDefault();
        setIsPendingOrdersOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="h-[64px] shrink-0 bg-[#357252] text-white flex items-center justify-between px-3 sm:px-6 z-20 relative">
      <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Image
            src={logo}
            alt="Jayak Hub Logo"
            width={120}
            height={40}
            className="h-[30px] sm:h-[36px] w-auto object-contain"
          />
        </div>

        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
            <Search className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu..."
            className="w-full bg-white text-gray-900 rounded-full pl-9 sm:pl-11 pr-4 py-1.5 sm:py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-[12px] sm:text-[13px] font-semibold placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        {/* Category dropdown — hidden on orders page */}
        {!isOrdersPage && !isPosLoading && (
          <div className="relative hidden lg:block">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none bg-white text-gray-800 rounded-full pl-4 pr-8 py-1.5 text-[12px] sm:text-[13px] font-semibold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="all">All</option>
              {(globalCategories || []).map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* BACK TO POS */}
        <Link
          href={"/restaurant/pos"}
          className={`relative flex items-center gap-2 p-2.5 rounded-full text-[13px] font-bold shadow-sm transition-colors cursor-pointer bg-white text-gray-800 hover:bg-gray-100`}
        >
          <Home className="w-[15px] h-[15px] stroke-[2.5px]" />
        </Link>

        {/* Online Orders button */}
        <Link
          href={"/restaurant/pos/orders"}
          className={`relative flex items-center gap-2 px-4 py-[6px] rounded-full text-[13px] font-bold shadow-sm transition-colors cursor-pointer ${
            isOnlineOrdersPage
              ? "bg-emerald-500 text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <Globe className="w-[15px] h-[15px] stroke-[2.5px]" />
          Online
        </Link>

        {/* POS Orders button */}
        <Link
          href={"/restaurant/pos/orders/pos"}
          className={`relative flex items-center gap-2 px-4 py-[6px] rounded-full text-[13px] font-bold shadow-sm transition-colors cursor-pointer ${
            isPosOrdersPage
              ? "bg-emerald-500 text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <ShoppingCart className="w-[15px] h-[15px] stroke-[2.5px]" />
          POS Orders
        </Link>

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
            {pendingOrdersCount > 0 && (
              <div className="absolute top-0 -right-0.5 w-[14px] h-[14px] bg-[#ef4444] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#357252]">
                {pendingOrdersCount}
              </div>
            )}
          </button>

          <button
            onClick={() => setIsKeyboardOpen(true)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors relative group"
          >
            <Keyboard className="w-[20px] h-[20px] text-white stroke-[2.5px]" />
          </button>

          {userRole !== "cashier" && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors relative group"
            >
              <Settings className="w-[20px] h-[20px] text-white stroke-[2.5px]" />
            </button>
          )}

          <button
            onClick={() => setIsCloseRegisterOpen(true)}
            className="flex items-center gap-2 bg-[#f9e9cc] text-[#d68b20] px-3.5 py-1.5 rounded-md cursor-pointer text-[13px] font-bold ml-1 hover:bg-[#ffe3b5]"
          >
            <User className="w-[15px] h-[15px] stroke-[2.5px]" />
            Register
          </button>

          {userRole === "restaurant_owner" ||
          userRole === "admin" ||
          userRole === "manager" ? (
            <Link
              href="/restaurant/dashboard"
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block"
            >
              <LogOut className="w-[20px] h-[20px]" />
            </Link>
          ) : (
            <button
              onClick={() => setIsCloseRegisterOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block"
            >
              <LogOut className="w-[20px] h-[20px]" />
            </button>
          )}
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
      <POSSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </nav>
  );
}
