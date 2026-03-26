"use client";
import ReportsStatsCard from "../components/ReportsStatsCard";
import SalesChart from "../components/SalesChart";
import TopProductsList from "../components/TopProductsList";
import OrderSources from "../components/OrderSources";
import PeakHours from "../components/PeakHours";
import RecentOrders from "../components/RecentOrders";
import { DollarSign, ShoppingBag, TrendingUp, Award } from "lucide-react";
import { useReports } from "../hooks/useReports";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ReportsSkeleton } from "@/components/skeletons/ReportsSkeleton";

const ReportsView = () => {
  const t = useTranslations("RestaurantDashboard.Reports");
  const { formatPrice } = useCLC();
  const {
    data,
    loading,
    filter,
    setFilter,
    page,
    totalPages,
    handlePageChange,
  } = useReports();

  if (loading) {
    return <ReportsSkeleton />;
  }

  if (!data) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
        {t("header.noData")}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      {/* Header - Date Filter Only */}
      <div className="flex justify-end pt-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px] bg-white border-gray-200 text-gray-700 h-9 font-bold text-xs">
            <SelectValue placeholder={t("header.last30Days")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="1">30 Days</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="12">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportsStatsCard
          label={t("stats.totalSales")}
          value={formatPrice(data.totalSales) || "N/A"}
          trend={`${data.lastPeriodSalesAverage}%`}
          isPositive={Number(data.lastPeriodSalesAverage) >= 0}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <ReportsStatsCard
          label={t("stats.totalOrders")}
          value={data.totalOrders.toLocaleString()}
          trend={`${data.lastPeriodOrdersAverage}%`}
          isPositive={Number(data.lastPeriodOrdersAverage) >= 0}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <ReportsStatsCard
          label={t("stats.avgOrderValue")}
          value={formatPrice(data.averageOrderValue) || "N/A"}
          trend={`${data.lastPeriodAverageOrderValue}%`}
          isPositive={Number(data.lastPeriodAverageOrderValue) >= 0}
          icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
        <ReportsStatsCard
          label={t("stats.repeatCustomerRate")}
          value={`${data.repeatedCustomerRate}%`}
          trend={`${data.lastPeriodRepeatedCustomerRate}%`}
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
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ReportsView;
