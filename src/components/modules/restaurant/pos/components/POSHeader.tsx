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
  Loader2,
  Menu,
  X,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePOS } from "@/context/POSContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import PendingOrdersSidebar from "./PendingOrdersSidebar";
import CloseRegisterModal from "./CloseRegisterModal";
import POSSettingsModal from "./POSSettingsModal";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../../public/EngLogo (2).png";
import { logoutAction } from "@/app/actions/auth/auth";
import { exportPosOrdersAction } from "@/app/actions/restaurant/pos";
import toast from "react-hot-toast";

export default function POSNavbar() {
  const t = useTranslations("POS.header");
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
  } = usePOS();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = useState(false);
  const [isCloseRegisterOpen, setIsCloseRegisterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (filters: Record<string, string> = { format: "csv" }) => {
    setIsExporting(true);
    try {
      toast.loading("Exporting POS orders CSV...", { id: "pos-export" });
      const format = (filters.format || "csv") as "xlsx" | "csv" | "csv-items" | "json";
      const res = await exportPosOrdersAction({
        format,
        startDate: filters.startDate,
        endDate: filters.endDate,
        orderStatus: filters.orderStatus,
        orderType: filters.orderType,
        paymentMethod: filters.paymentMethod,
        source: filters.source,
        search: filters.search,
      });

      if (res.success && res.data) {
        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: res.contentType || "text/csv" });
        const ext = format === "json" ? "json" : format.startsWith("csv") ? "csv" : "xlsx";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pos-export-${new Date().toISOString().split("T")[0]}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("POS orders exported successfully!", { id: "pos-export" });
      } else {
        toast.error(res.message || "Failed to export POS orders", { id: "pos-export" });
      }
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error("Failed to export POS orders", { id: "pos-export" });
    } finally {
      setIsExporting(false);
    }
  };

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
    <nav className="min-h-[64px] py-2 shrink-0 bg-[#1B3A57] text-white flex items-center justify-between px-3 sm:px-6 z-20 relative">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-full lg:max-w-xl">
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Image
            src={logo}
            alt={t("logoAlt")}
            width={120}
            height={40}
            className="h-[28px] sm:h-[36px] w-auto object-contain"
          />
        </div>

        {userRole !== "kitchen" && (
          <div className="relative flex-1 min-w-[120px]">
            <div className="absolute inset-y-0 left-2.5 sm:left-4 flex items-center pointer-events-none">
              <Search className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-white text-gray-900 rounded-full pl-8 sm:pl-11 pr-3 sm:pr-4 py-1.5 outline-none focus:ring-2 focus:ring-[#FF6B35]/50 text-[11px] sm:text-[13px] font-semibold placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>
        )}

        {/* Category dropdown — Desktop */}
        {!isOrdersPage && (
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 bg-white text-gray-800 rounded-full pl-4 pr-3 py-1.5 text-[12px] sm:text-[13px] font-semibold outline-none focus:ring-2 focus:ring-[#FF6B35]/50 cursor-pointer shadow-sm">
                  {activeCategory === "all" ? t("allCategories") : activeCategory}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white max-h-72 overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                >
                  <DropdownMenuRadioItem value="all">
                    {t("allCategories")}
                  </DropdownMenuRadioItem>
                  {(globalCategories || []).map((cat: string) => (
                    <DropdownMenuRadioItem key={cat} value={cat}>
                      {cat}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 ml-3 sm:ml-5">
        {/* BACK TO POS */}
        {userRole !== "kitchen" && (
          <Link
            href={"/restaurant/pos"}
            title="POS Main"
            className={`relative flex items-center justify-center p-2 rounded-full text-[13px] font-bold shadow-sm transition-colors cursor-pointer bg-white text-gray-800 hover:bg-gray-100 ml-1 sm:ml-2`}
          >
            <Home className="w-[15px] h-[15px] stroke-[2.5px]" />
          </Link>
        )}

        {/* Online Orders button */}
        <Link
          href={"/restaurant/pos/orders"}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-[6px] rounded-full text-[12px] sm:text-[13px] font-bold shadow-sm transition-colors cursor-pointer ${
            isOnlineOrdersPage
              ? "bg-[#FF6B35] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <Globe className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] stroke-[2.5px] shrink-0" />
          <span className="hidden sm:inline">{t("online")}</span>
        </Link>

        {/* POS Orders button */}
        <Link
          href={"/restaurant/pos/orders/pos"}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-[6px] rounded-full text-[12px] sm:text-[13px] font-bold shadow-sm transition-colors cursor-pointer ${
            isPosOrdersPage
              ? "bg-[#FF6B35] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <ShoppingCart className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] stroke-[2.5px] shrink-0" />
          <span className="hidden sm:inline">{t("posOrders")}</span>
        </Link>

        {/* Mobile Cart Toggle */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="lg:hidden relative p-2 bg-[#FF6B35] rounded-full text-white flex items-center justify-center shadow-sm cursor-pointer"
          aria-label="View Cart"
        >
          <ShoppingCart className="w-[16px] h-[16px] stroke-[2.5px]" />
          {totalItems > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-white">
              {totalItems}
            </div>
          )}
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative p-2 bg-white/10 hover:bg-white/20 rounded-full text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-[18px] h-[18px]" />
          ) : (
            <Menu className="w-[18px] h-[18px]" />
          )}
          {pendingOrdersCount > 0 && !isMobileMenuOpen && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
          )}
        </button>

        {/* Desktop Quick Tools */}
        <div className="hidden lg:flex items-center gap-4">
          {userRole !== "kitchen" && (
            <button
              onClick={() => setIsPendingOrdersOpen(true)}
              className="relative p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-left"
              title="Pending Orders"
            >
              <Clock className="w-[20px] h-[20px] text-white" />
              {pendingOrdersCount > 0 && (
                <div className="absolute top-0 -right-0.5 w-[14px] h-[14px] bg-[#ef4444] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white">
                  {pendingOrdersCount}
                </div>
              )}
            </button>
          )}

          {userRole !== "kitchen" && (
            <button
              onClick={() => setIsKeyboardOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors relative group cursor-pointer"
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-[20px] h-[20px] text-white stroke-[2.5px]" />
            </button>
          )}

          {userRole !== "cashier" && userRole !== "kitchen" && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors relative group cursor-pointer"
              title="POS Settings"
            >
              <Settings className="w-[20px] h-[20px] text-white stroke-[2.5px]" />
            </button>
          )}

          {userRole !== "kitchen" && (
            <button
              onClick={() => handleExport({ format: "csv" })}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-md cursor-pointer text-[12px] sm:text-[13px] font-bold shadow-sm transition-colors disabled:opacity-50"
              title="Export POS Orders to CSV"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
              )}
              <span>Export CSV</span>
            </button>
          )}

          {userRole !== "kitchen" && (
            <button
              onClick={() => setIsCloseRegisterOpen(true)}
              className="flex items-center gap-2 bg-[#f9e9cc] text-[#d68b20] px-3.5 py-1.5 rounded-md cursor-pointer text-[13px] font-bold ml-1 hover:bg-[#ffe3b5]"
            >
              <User className="w-[15px] h-[15px] stroke-[2.5px]" />
              {t("register")}
            </button>
          )}

          {userRole !== "kitchen" && (
            userRole === "restaurant_owner" ||
            userRole === "admin" ||
            userRole === "manager" ? (
              <Link
                href="/restaurant/dashboard"
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block"
                title="Dashboard"
              >
                <LogOut className="w-[20px] h-[20px]" />
              </Link>
            ) : (
              <button
                onClick={() => setIsCloseRegisterOpen(true)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block cursor-pointer"
                title="Close Register"
              >
                <LogOut className="w-[20px] h-[20px]" />
              </button>
            )
          )}

          {userRole === "kitchen" && (
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                try {
                  await logoutAction();
                  window.location.href = "/login";
                } catch (err) {
                  console.error("Logout failed", err);
                  setIsLoggingOut(false);
                }
              }}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white ml-2 block cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-[20px] h-[20px]" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Slide-down Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#152E48] border-t border-white/10 shadow-xl p-4 flex flex-col gap-4 z-40 animate-in slide-in-from-top-2">
          {/* Category Dropdown on Mobile */}
          {!isOrdersPage && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                {t("allCategories")}
              </label>
              <select
                value={activeCategory}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="all">{t("allCategories")}</option>
                {(globalCategories || []).map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            {userRole !== "kitchen" && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleExport({ format: "csv" });
                }}
                disabled={isExporting}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Export CSV</span>
              </button>
            )}

            {userRole !== "kitchen" && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPendingOrdersOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#FF6B35]" />
                <span>Pending Orders</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            )}

            {userRole !== "kitchen" && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsKeyboardOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                <Keyboard className="w-4 h-4 text-[#FF6B35]" />
                <span>Shortcuts</span>
              </button>
            )}

            {userRole !== "cashier" && userRole !== "kitchen" && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#FF6B35]" />
                <span>Settings</span>
              </button>
            )}

            {userRole !== "kitchen" && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCloseRegisterOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f9e9cc] text-[#d68b20] text-xs font-bold cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{t("register")}</span>
              </button>
            )}

            {userRole !== "kitchen" &&
              (userRole === "restaurant_owner" ||
              userRole === "admin" ||
              userRole === "manager" ? (
                <Link
                  href="/restaurant/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCloseRegisterOpen(true);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Close Till</span>
                </button>
              ))}

            {userRole === "kitchen" && (
              <button
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  setIsLoggingOut(true);
                  try {
                    await logoutAction();
                    window.location.href = "/login";
                  } catch (err) {
                    console.error("Logout failed", err);
                    setIsLoggingOut(false);
                  }
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}

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

      {isLoggingOut && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
          <span className="text-[14px] font-bold text-gray-600">Logging out...</span>
        </div>
      )}
    </nav>
  );
}
