"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Wallet,
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
    labelKey: "main",
    items: [
      {
        nameKey: "dashboard",
        href: "/restaurant/dashboard",
        icon: LayoutDashboard,
      },
      { nameKey: "pos", href: "/restaurant/pos", icon: Store },
      { nameKey: "orders", href: "/restaurant/orders", icon: ShoppingCart },
      {
        nameKey: "menuManagement",
        icon: UtensilsCrossed,
        isCollapsible: true,
        bgActive: true,
        items: [
          { nameKey: "items", href: "/restaurant/menu/items" },
          { nameKey: "categories", href: "/restaurant/menu/categories" },
          { nameKey: "variants", href: "/restaurant/menu/variants" },
        ],
      },
    ],
  },
  {
    labelKey: "management",
    items: [
      { nameKey: "reviews", href: "/restaurant/reviews", icon: Star },
      { nameKey: "users", href: "/restaurant/users", icon: Users },
      { nameKey: "finance", href: "/restaurant/payments", icon: CreditCard },
      { nameKey: "payouts", href: "/restaurant/payouts", icon: Wallet },
      { nameKey: "reports", href: "/restaurant/reports", icon: BarChart2 },
    ],
  },
  {
    labelKey: "settings",
    items: [
      { nameKey: "support", href: "/restaurant/support", icon: HelpCircle },
      { nameKey: "settings", href: "/restaurant/settings", icon: Settings },
    ],
  },
];

import { logoutAction } from "@/app/actions/auth/auth";
import { deleteCookie } from "cookies-next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useTranslations } from "next-intl";

export function RestaurantSidebar() {
  const t = useTranslations("RestaurantDashboard");
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed", error);
    }
    deleteCookie("token");
    deleteCookie("role");
    window.location.href = `/login`;
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
      {/* HEADER */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10 mb-2">
        <Link
          href={`/restaurants`}
          className="w-full flex items-center justify-center"
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2 px-4 w-full justify-center">
              {/* LOGO */}
              <Image
                src="/EngLogo (2).png"
                alt="Logo"
                width={180}
                height={200}
              />
            </div>
          ) : (
            <div className="">
              <Image src="/favicon.ico" alt="Logo" width={40} height={50} />
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 custom-scrollbar">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <Typography className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 px-4">
                {t(`Sidebar.sections.${section.labelKey}` as any)}
              </Typography>
            )}
            <SidebarMenu>
              {section.items.map((item: any) => {
                if (item.isCollapsible) {
                  const isActiveGroup =
                    pathname?.startsWith(`/restaurant/menu`);
                  return (
                    <Collapsible
                      key={item.nameKey}
                      defaultOpen={isActiveGroup}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(`Sidebar.items.${item.nameKey}` as any)}
                            className={`h-11 rounded-lg px-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all text-sidebar-foreground/80 group-data-[state=open]/collapsible:bg-sidebar-accent text-base ${isActiveGroup ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : ""}`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>
                              {t(`Sidebar.items.${item.nameKey}` as any)}
                            </span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l-0 px-0 space-y-1 mt-1">
                            {item.items.map((subItem: any) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <SidebarMenuSubItem key={subItem.nameKey}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={`h-10 pl-12 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/60 ${isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
                                  >
                                    <Link
                                      href={subItem.href}
                                    >
                                      <span>
                                        {t(
                                          `Sidebar.items.${subItem.nameKey}` as any,
                                        )}
                                      </span>
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
                  <SidebarMenuItem key={item.nameKey}>
                    <SidebarMenuButton
                      asChild
                      tooltip={t(`Sidebar.items.${item.nameKey}` as any)}
                      isActive={isActive}
                      className={`h-11 rounded-lg px-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all text-base ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-sidebar-foreground/80"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{t(`Sidebar.items.${item.nameKey}` as any)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0! border-t border-white/10 transition-all duration-300">
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
              className="hover:bg-red-500/20 text-red-300 hover:text-red-200 h-11 cursor-pointer group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="w-5 h-5 group-data-[collapsible=icon]:size-6!" />
              <span className="group-data-[collapsible=icon]:hidden">
                {t("Sidebar.logout")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
