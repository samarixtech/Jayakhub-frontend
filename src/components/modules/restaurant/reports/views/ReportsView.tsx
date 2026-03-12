"use client";
import React from "react";
import ReportsStatsCard from "../components/ReportsStatsCard";
import SalesChart from "../components/SalesChart";
import TopProductsList from "../components/TopProductsList";
import OrderSources from "../components/OrderSources";
import PeakHours from "../components/PeakHours";
import RecentOrders from "../components/RecentOrders";
import {
  ChevronDown,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReports } from "../hooks/useReports";

const ReportsView = () => {
  const { data, loading } = useReports();

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4332]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
        No report data available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      {/* Header - Date Filter Only */}
      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700 h-9"
        >
          <ChevronDown className="mr-2 w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold">Last 30 Days</span>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportsStatsCard
          label="Total Sales"
          value={`$${Number(data.totalSales).toLocaleString()}`}
          trend={`${data.lastPeriodSalesAverage}%`}
          trendLabel="vs last period"
          isPositive={Number(data.lastPeriodSalesAverage) >= 0}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <ReportsStatsCard
          label="Total Orders"
          value={data.totalOrders.toLocaleString()}
          trend={`${data.lastPeriodOrdersAverage}%`}
          trendLabel="vs last period"
          isPositive={Number(data.lastPeriodOrdersAverage) >= 0}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <ReportsStatsCard
          label="Avg Order Value"
          value={`$${Number(data.averageOrderValue).toFixed(2)}`}
          trend={`$${data.lastPeriodAverageOrderValue}`}
          trendLabel="vs last period"
          isPositive={Number(data.lastPeriodAverageOrderValue) >= 0}
          icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
        <ReportsStatsCard
          label="Repeat Customer Rate"
          value={data.repeatedCustomerRate}
          trend={Number(data.lastPeriodRepeatedCustomerRate)}
          trendLabel="vs last period"
          isPositive={Number(data.lastPeriodRepeatedCustomerRate) >= 0}
          icon={<Award className="w-4 h-4 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Charts & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <SalesChart graphData={data.salesGraph} />
        </div>

        {/* Top Products (Takes up 1 column) */}
        <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <TopProductsList products={data.topProducts} />
        </div>
      </div>

      {/* Sources & Peak Hours Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <OrderSources sources={data.orderResource} />
        </div>
        <div className="col-span-1 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <PeakHours peakHours={data.peakHours} />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
        <RecentOrders
          orders={data.orders?.items || []}
          totalCount={data.orders?.totalCount}
        />
      </div>
    </div>
  );
};

export default ReportsView;
