"use client";

import React from "react";
import StatsCard from "./StatsCard";
import { Receipt, Timer, Wallet } from "lucide-react";

interface OrdersStatsProps {
  stats: {
    todayOrders: number;
    liveOrders: number;
    totalRevenue: string;
  };
  loading: boolean;
}

const OrdersStats: React.FC<OrdersStatsProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        icon={<Receipt className="w-6 h-6" />}
        value={stats.todayOrders.toString()}
        label="Total Today"
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-700"
        loading={loading}
      />
      <StatsCard
        icon={<Timer className="w-6 h-6" />}
        value={stats.liveOrders.toString()}
        label="Live Orders"
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-800"
        loading={loading}
      />
      <StatsCard
        icon={<Wallet className="w-6 h-6" />}
        value={`$${stats.totalRevenue}`}
        label="Revenue"
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        loading={loading}
      />
    </div>
  );
};

export default OrdersStats;
