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
import Link from "next/link";
import { usePlanAccess } from "@/hooks/use-plan-access";

export default function RestaurantHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { isExpired, isCancelled } = usePlanAccess();

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
  const isExpiredOrCancelled = isExpired || isCancelled;
  // Header (title + profile dropdown) is hidden on every restaurant page —
  // including Subscription itself — whenever the plan is expired/cancelled.
  // Only the sidebar trigger stays, so mobile users can still open the
  // sidebar (and its always-enabled Subscription link) to navigate.
  const isBlocked = isExpiredOrCancelled;

  return (
    <>
      {isExpiredOrCancelled && (
        <div className="w-full min-h-[72px] bg-red-500 text-white text-sm font-semibold text-center py-5 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 shrink-0">
          <span>
            {isCancelled
              ? "Your subscription has been cancelled."
              : "Your subscription has expired."}
          </span>
          <Link
            href="/restaurant/subscription"
            className="underline underline-offset-2 hover:text-red-100 transition-colors font-bold"
          >
            Go to Subscription Management to renew.
          </Link>
        </div>
      )}
      {isBlocked ? (
        // Everything is disabled except the Subscription module — still show
        // the trigger so the sidebar (and its always-enabled Subscription
        // link) stays reachable on mobile, where it's off-canvas otherwise.
        <header className="flex items-center h-16 px-6 bg-white border-b border-gray-100 shrink-0 gap-4">
          <SidebarTrigger className="-ml-2 text-gray-500 hover:bg-gray-100" />
        </header>
      ) : (
        <header className="flex items-center h-16 px-6 bg-white border-b border-gray-100 shrink-0 gap-4">
          <SidebarTrigger className="-ml-2 text-gray-500 hover:bg-gray-100" />

          <Typography variant="h3" className="font-bold text-gray-900 text-lg">
            {pageTitle}
          </Typography>

          <div className="ml-auto flex items-center gap-2">
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
      )}
    </>
  );
}
