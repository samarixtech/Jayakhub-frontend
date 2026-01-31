"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { usePathname } from "next/navigation";

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

  const segments = pathname?.split("/") || [];
  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : "";
  const pageTitle = PAGE_NAMES[lastSegment] || "Dashboard";

  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-100 shrink-0 gap-4">
      <SidebarTrigger className="-ml-2 text-gray-500 hover:bg-gray-100" />

      <Typography variant="h3" className="font-bold text-gray-900 text-lg">
        {pageTitle}
      </Typography>
    </header>
  );
}
