import { useState, useEffect } from "react";
import { getDashboardAnalyticsAction } from "@/app/actions/restaurant/dashboard";

export function useDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const res = await getDashboardAnalyticsAction();
      if (res.success && res.data) {
        setDashboardData((res.data as any).data);
      }
      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  // Chart Data Config
  const labels = dashboardData?.revenueChart?.map((item: any) => item.day) || [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  const dataPoints = dashboardData?.revenueChart?.map((item: any) =>
    parseFloat(item.amount),
  ) || [0, 0, 0, 0, 0, 0, 0];

  // Add extra padding to the max value for better chart visual
  const maxDataPoint = Math.max(...dataPoints, 500);

  const chartData = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: dataPoints,
        borderColor: "#2e6b49",
        backgroundColor: "rgba(46, 107, 73, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  // Calculate time ago format for activity feed
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return `Yesterday`;
    return `${diffDays} days ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IQD", "Rs.");
  };

  const ownerName = dashboardData?.ownerName || "Chef";
  const stats = dashboardData?.stats;
  const recentOrders = dashboardData?.recentOrders || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return {
    isOnline,
    setIsOnline,
    isLoading,
    chartData,
    maxDataPoint,
    getTimeAgo,
    formatCurrency,
    ownerName,
    stats,
    recentOrders,
    recentActivity,
  };
}
