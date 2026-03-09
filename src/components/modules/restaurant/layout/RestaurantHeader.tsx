"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/common/UserProfile";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Map paths to readable names
const PAGE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  menu: "Menu Management",
  items: "Items",
  categories: "Categories",
  variants: "Variant Groups",
  settings: "Settings",
  marketing: "Marketing",
  reviews: "Ratings & Reviews",
  users: "Users & Roles",
  payments: "Payment History",
  reports: "Reports",
  apis: "APIs",
  support: "Support Center",
};

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

  const segments = pathname?.split("/") || [];
  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : "";
  const pageTitle = PAGE_NAMES[lastSegment] || "Dashboard";

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
          <Bell className="w-5 h-5" />
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
