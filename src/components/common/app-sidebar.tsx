"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MapPin,
  CreditCard,
  Wallet,
  ReceiptText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";

const navItems = [
  { name: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/customer/order-history", icon: ReceiptText },
  { name: "Profile", href: "/customer/profile-settings", icon: User },
  { name: "Addresses", href: "/customer/address", icon: MapPin },
  { name: "Billing", href: "/customer/payment-history", icon: CreditCard },
  { name: "Wallet", href: "/customer/wallet", icon: Wallet },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={
        isMobile
          ? "border-none bg-white h-full"
          : "border-none bg-transparent h-fit transition-all duration-300 top-[120px] pl-4"
      }
    >
      <div
        className={`flex flex-col h-full ${
          isMobile
            ? "bg-white p-4"
            : "bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 p-6"
        }`}
      >
        {/* HEADER: LOGO + CLOSE BUTTON (MOBILE ONLY) */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 px-2">
            <Typography className="text-lg font-black text-emerald-900">
              Menu
            </Typography>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={18} strokeWidth={2.5} />
            </Button>
          </div>
        )}

        {/* SECTION LABEL (DESKTOP ONLY) */}
        {!isCollapsed && !isMobile && (
          <Typography className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-6 px-4">
            Account
          </Typography>
        )}

        <SidebarContent className="p-0">
          <SidebarMenu className="gap-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    isActive={isActive}
                    className={`h-14 transition-all duration-200 rounded-2xl px-4 ${
                      isActive
                        ? "bg-emerald-50 text-[#346853] hover:bg-emerald-50 hover:text-[#346853]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 ${isCollapsed && !isMobile ? "mx-auto" : "mr-4"}`}
                      />
                      {(!isCollapsed || isMobile) && (
                        <span
                          className={`text-base font-semibold truncate ${isActive ? "text-[#346853]" : "text-slate-500"}`}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
