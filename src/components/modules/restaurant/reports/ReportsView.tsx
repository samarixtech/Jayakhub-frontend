"use client";

import React from "react";
import ReportsStatsCard from "./ReportsStatsCard";
import SalesChart from "./SalesChart";
import TopProductsList from "./TopProductsList";
import OrderSources from "./OrderSources";
import PeakHours from "./PeakHours";
import RecentOrders from "./RecentOrders";
import {
  ChevronDown,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ReportsView = () => {
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
          value="$45,232"
          trend="+21%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <ReportsStatsCard
          label="Total Orders"
          value="1,245"
          trend="+14%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <ReportsStatsCard
          label="Avg Order Value"
          value="$36.33"
          trend="+$3.20"
          trendLabel="vs last period"
          isPositive={true}
          icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
        <ReportsStatsCard
          label="Repeat Customer Rate"
          value="28.4%"
          trend="+2%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<Award className="w-4 h-4 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Charts & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <SalesChart />
        </div>

        {/* Top Products (Takes up 1 column) */}
        <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <TopProductsList />
        </div>
      </div>

      {/* Sources & Peak Hours Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <OrderSources />
        </div>
        <div className="col-span-1 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
          <PeakHours />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
        <RecentOrders />
      </div>
    </div>
  );
};

export default ReportsView;
