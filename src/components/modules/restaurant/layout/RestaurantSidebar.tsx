"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Megaphone,
  Star,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  HelpCircle,
  Database,
  Languages,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";

// TODO: add role based secure navigation items
// Navigation Items Structure
const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      {
        name: "Dashboard",
        href: "/restaurant/dashboard",
        icon: LayoutDashboard,
      },
      { name: "POS", href: "/restaurant/pos", icon: Store },
      { name: "Orders", href: "/restaurant/orders", icon: ShoppingCart },
      {
        name: "Menu Management",
        icon: UtensilsCrossed,
        isCollapsible: true,
        bgActive: true,
        items: [
          { name: "Items", href: "/restaurant/menu/items" },
          { name: "Categories", href: "/restaurant/menu/categories" },
          { name: "Variant Groups", href: "/restaurant/menu/variants" },
        ],
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { name: "Marketing", href: "/restaurant/marketing", icon: Megaphone },
      { name: "Ratings & Reviews", href: "/restaurant/reviews", icon: Star },
      { name: "Users & Roles", href: "/restaurant/users", icon: Users },
      {
        name: "Payment History",
        href: "/restaurant/payments",
        icon: CreditCard,
      },
      { name: "Reports", href: "/restaurant/reports", icon: BarChart2 },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { name: "APIs", href: "/restaurant/apis", icon: Database },
      { name: "Support Center", href: "/restaurant/support", icon: HelpCircle },
      { name: "Settings", href: "/restaurant/settings", icon: Settings },
    ],
  },
];

import { logoutAction } from "@/app/actions/auth/auth";
import { deleteCookie } from "cookies-next";
import useLocale from "@/hooks/useLocals";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

// ... imports ...

export function RestaurantSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { country, language } = useLocale();

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed", error);
    }
    deleteCookie("token");
    deleteCookie("role");
    window.location.href = `/${country}/${language}/login`;
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-none"
      style={
        {
          "--sidebar": "#346853",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-primary": "#ffffff",
          "--sidebar-accent": "rgba(255, 255, 255, 0.1)",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255, 255, 255, 0.1)",
          "--sidebar-ring": "rgba(255, 255, 255, 0.5)",
        } as React.CSSProperties
      }
    >
      {/* LOGO HEADER */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10 mb-2">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-4 w-full">
            {/* Placeholder Logo */}
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
              <Store className="text-white w-5 h-5" />
            </div>
            <Typography className="font-bold text-lg tracking-tight text-white">
              JAYAK HUB
            </Typography>
          </div>
        ) : (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Store className="text-white w-5 h-5" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 custom-scrollbar">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <Typography className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 px-4">
                {section.label}
              </Typography>
            )}
            <SidebarMenu>
              {section.items.map((item: any) => {
                if (item.isCollapsible) {
                  const isActiveGroup =
                    pathname?.startsWith("/restaurant/menu");
                  return (
                    <Collapsible
                      key={item.name}
                      defaultOpen={isActiveGroup}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.name}
                            className={`h-11 rounded-lg px-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all text-sidebar-foreground/80 group-data-[state=open]/collapsible:bg-sidebar-accent text-base ${isActiveGroup ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : ""}`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l-0 px-0 space-y-1 mt-1">
                            {item.items.map((subItem: any) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <SidebarMenuSubItem key={subItem.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={`h-10 pl-12 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/60 ${isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={isActive}
                      className={`h-11 rounded-lg px-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all text-base ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-sidebar-foreground/80"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:!p-0 border-t border-white/10 transition-all duration-300">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <LanguageSwitcher
              variant="sidebar"
              collapsed={isCollapsed}
              className="w-full group-data-[collapsible=icon]:w-11"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-red-500/20 text-red-300 hover:text-red-200 h-11 cursor-pointer group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="w-5 h-5 group-data-[collapsible=icon]:!size-6" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
