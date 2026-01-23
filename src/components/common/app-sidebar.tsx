"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MapPin,
  CreditCard,
  Wallet,
  ReceiptText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import LocalizedLink from "../navigation/LocalizedLink";
import { Typography } from "@/components/ui/typography";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-none bg-transparent h-fit transition-all duration-300 top-[120px] pl-4"
    >
      <div className="flex flex-col h-fit bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 p-6">
        {/* SECTION LABEL */}
        {!isCollapsed && (
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
                  >
                    <LocalizedLink
                      href={item.href}
                      className="flex items-center"
                    >
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 ${isCollapsed ? "mx-auto" : "mr-4"}`}
                      />
                      {!isCollapsed && (
                        <span
                          className={`text-base font-semibold truncate ${isActive ? "text-[#346853]" : "text-slate-500"}`}
                        >
                          {item.name}
                        </span>
                      )}
                    </LocalizedLink>
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
