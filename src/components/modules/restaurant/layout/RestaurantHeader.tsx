"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/common/UserProfile";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function RestaurantHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    };
    fetchProfile();
  }, []);

  const t = useTranslations("RestaurantDashboard.Sidebar.items");

  const segments = pathname?.split("/") || [];

  const PAGE_NAMES: Record<string, string> = {
    dashboard: t("dashboard"),
    orders: t("orders"),
    menu: t("menuManagement"),
    items: t("items"),
    categories: t("categories"),
    variants: t("variants"),
    settings: t("settings"),
    marketing: t("marketing"),
    reviews: t("reviews"),
    users: t("users"),
    payments: t("finance"),
    reports: t("reports"),
    apis: t("apis"),
    support: t("support"),
  };

  let activeSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    if (PAGE_NAMES[seg]) {
      activeSegment = seg;
      break;
    }
  }

  const pageTitle = PAGE_NAMES[activeSegment] || t("dashboard");

  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-100 shrink-0 gap-4">
      <SidebarTrigger className="-ml-2 text-gray-500 hover:bg-gray-100" />

      <Typography variant="h3" className="font-bold text-gray-900 text-lg">
        {pageTitle}
      </Typography>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100 rounded-full"
        >
        </Button>
        <UserProfile
          user={user}
          onLogout={async () => {
            await logoutAction();
            setUser(null);
            window.location.href = "/login";
          }}
        />
      </div>
    </header>
  );
}
