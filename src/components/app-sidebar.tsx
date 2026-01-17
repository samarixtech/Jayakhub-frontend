"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart,
  User,
  Mail,
  MapPin,
  LogOut,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLocale from "@/hooks/useLocals";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Order History", href: "/dashboard/orderHistory", icon: Users },
  { name: "My Profile", href: "/dashboard/profileSettings", icon: User },
  { name: "My Address", href: "/dashboard/address", icon: MapPin },
  {
    name: "Payment History",
    href: "/dashboard/paymentHistory",
    icon: BarChart,
  },
  {
    name: "Change Password",
    href: "/dashboard/changePassword",
    icon: Settings,
  },
];

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Administrator",
};

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { country, language } = useLocale();
  const getLocalizedHref = (path: string) => `/${country}/${language}${path}`;

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      {/* HEADER */}
      <SidebarHeader className="bg-[#E8F4F1] p-0 border-b border-gray-200 h-16 flex items-center justify-center">
        <div
          className={`flex items-center gap-3 w-full ${isCollapsed ? "justify-center" : "px-4"}`}
        >
          <div className="w-9 h-9 bg-[#0B5D4E] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-[#0B5D4E] tracking-tight truncate">
              DASHBOARD
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent className="bg-[#E8F4F1] px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const localizedHref = getLocalizedHref(item.href);
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={isActive}
                      className={`h-11 w-full rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#0B5D4E]! text-white! shadow-md"
                          : "text-gray-600 hover:bg-white/50"
                      }`}
                    >
                      <Link
                        href={localizedHref}
                        className="flex items-center w-full"
                      >
                        <div
                          className={`flex items-center justify-center shrink-0 rounded-lg transition-colors ${
                            isCollapsed ? "w-full h-full" : "p-1.5 mr-2"
                          } ${isActive && !isCollapsed ? "bg-white" : ""}`}
                        >
                          <item.icon
                            size={isCollapsed ? 20 : 18}
                            className={
                              isActive
                                ? isCollapsed
                                  ? "text-white"
                                  : "text-[#0B5D4E]"
                                : "text-gray-600"
                            }
                          />
                        </div>
                        {!isCollapsed && (
                          <span className="font-medium truncate">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER / PROFILE */}
      <SidebarFooter className="bg-white border-t border-gray-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`hover:bg-gray-100 rounded-xl transition-all ${isCollapsed ? "justify-center p-0" : ""}`}
                >
                  <div className="w-8 h-8 bg-[#0B5D4E] rounded-full flex items-center justify-center shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex flex-col items-start text-left ml-2 overflow-hidden">
                        <span className="text-sm font-semibold text-gray-900 truncate w-24">
                          {userData.name}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                          {userData.role}
                        </span>
                      </div>
                      <ChevronUp className="ml-auto text-gray-400" size={14} />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isCollapsed ? "right" : "top"}
                align={isCollapsed ? "start" : "end"}
                className="w-56 mb-2 p-2 shadow-xl border-gray-100"
              >
                <div className="px-2 py-1.5 mb-2 bg-gray-50 rounded-lg flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600 truncate">
                    {userData.email}
                  </span>
                </div>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <User size={16} className="mr-2" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Settings size={16} className="mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                  <LogOut size={16} className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
