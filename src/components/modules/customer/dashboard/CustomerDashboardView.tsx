"use client";

import { useEffect, useState } from "react";
import useLocale from "@/hooks/useLocals";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

import { Order, OrderSummary } from "../types";
import { DashboardStats } from "./components/DashboardStats";
import { RecentActivity } from "./components/RecentActivity";
import { QuickActions } from "./components/QuickActions";

export default function CustomerDashboardView() {
  const t = useTranslations("CustomerDashboard.DashboardView");
  const { country, language } = useLocale();
  const [summary, setSummary] = useState<OrderSummary>({
    totalSpend: "0.00",
    totalOrdersCount: 0,
    totalPendingOrders: 0,
    averageRating: "0.0",
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const result = await getAllOrders();

        if (result.success && result.data && result.data.data) {
          const apiData = result.data.data;
          if (apiData.summary) setSummary(apiData.summary);
          if (apiData.orders && Array.isArray(apiData.orders)) {
            setRecentOrders(apiData.orders.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <Typography
          variant="h2"
          className="text-2xl font-black text-gray-900 flex items-center gap-2"
        >
          {t("overview")}
        </Typography>
        <Typography variant="p" className="text-gray-500 text-sm mt-1">
          {t("welcome_message")}
        </Typography>
      </div>

      {/* Stats Grid */}
      <DashboardStats summary={summary} loading={loading} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentActivity
          recentOrders={recentOrders}
          loading={loading}
          country={country}
          language={language}
        />
        <QuickActions country={country} language={language} />
      </div>
    </div>
  );
}
