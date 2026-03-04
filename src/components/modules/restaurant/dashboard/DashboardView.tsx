"use client";

import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardMetrics } from "./components/DashboardMetrics";
import { RevenueChart } from "./components/RevenueChart";
import { RecentActivity } from "./components/RecentActivity";
import { RecentOrdersTable } from "./components/RecentOrdersTable";

export default function DashboardView() {
  const {
    isOnline,
    setIsOnline,
    isToggling,
    isLoading,
    chartData,
    maxDataPoint,
    getTimeAgo,
    formatCurrency,
    ownerName,
    stats,
    recentOrders,
    recentActivity,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      <DashboardHeader
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        isToggling={isToggling}
        ownerName={ownerName}
      />

      <DashboardMetrics stats={stats} formatCurrency={formatCurrency} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Charts & Tables) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <RevenueChart chartData={chartData} maxDataPoint={maxDataPoint} />
        </div>

        {/* Right Column (Recent Activity) */}
        <div className="xl:col-span-1">
          <RecentActivity activities={recentActivity} getTimeAgo={getTimeAgo} />
        </div>
      </div>

      <RecentOrdersTable
        orders={recentOrders}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
