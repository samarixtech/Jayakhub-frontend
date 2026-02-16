"use client";

import React from "react";
import ReportsStatsCard from "./ReportsStatsCard";
import SalesChart from "./SalesChart";
import TopProductsList from "./TopProductsList";
import TrafficSourceTable from "./TrafficSourceTable";
import {
  Download,
  ChevronDown,
  DollarSign,
  Eye,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ReportsView = () => {
  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700"
        >
          <span className="mr-2">Last 30 Days</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700"
        >
          <Download className="mr-2 w-4 h-4 text-gray-400" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportsStatsCard
          label="Total Sales"
          value="$45,231.89"
          trend="+21%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
        />
        <ReportsStatsCard
          label="Online Store Sessions"
          value="12,405"
          trend="-5%"
          trendLabel="vs last period"
          isPositive={false}
          icon={<Eye className="w-5 h-5 text-gray-400" />}
        />
        <ReportsStatsCard
          label="Returning Customer Rate"
          value="28.45%"
          trend="+2%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<Users className="w-5 h-5 text-gray-400" />}
        />
        <ReportsStatsCard
          label="Total Orders"
          value="1,245"
          trend="+14%"
          trendLabel="vs last period"
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5 text-gray-400" />}
        />
      </div>

      {/* Charts & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <SalesChart />
        </div>

        {/* Top Products (Takes up 1 column) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <TopProductsList />
        </div>
      </div>

      {/* Traffic Source Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <TrafficSourceTable />
      </div>
    </div>
  );
};

export default ReportsView;
