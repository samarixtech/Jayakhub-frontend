"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  FileCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

// ==================== TAB CONFIG ====================
const tabs = [
  {
    id: "profile",
    icon: Store,
    href: "/restaurant/settings/profile",
  },
  {
    id: "location",
    icon: MapPin,
    href: "/restaurant/settings/location",
  },
  {
    id: "hours",
    icon: Clock,
    href: "/restaurant/settings/hours",
  },
  {
    id: "finance",
    icon: DollarSign,
    href: "/restaurant/settings/finance",
  },
  {
    id: "security",
    icon: Shield,
    href: "/restaurant/settings/security",
  },
  {
    id: "documents",
    icon: FileCheck,
    href: "/restaurant/settings/documents",
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const t = useTranslations("RestaurantDashboard.Settings.sidebar");

  return (
    <nav className="w-full md:w-60 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit sticky top-6 z-10">
      <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 hidden md:block">
        {t("menuTitle")}
      </h2>
      <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = pathname?.includes(tab.href);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                }
                border md:border-0
              `}
            >
              <tab.icon
                className={`w-4 h-4 ${isActive ? "text-primary" : "text-gray-400"}`}
              />
              {t(tab.id as any)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
