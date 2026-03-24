import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getDashboardAnalyticsAction } from "@/app/actions/restaurant/dashboard";
import { updateRestaurantProfileAction } from "@/app/actions/restaurant/settings";
import toast from "react-hot-toast";

export function useDashboard() {
  const t = useTranslations("RestaurantDashboard");
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const res = await getDashboardAnalyticsAction();
      if (res.success && res.data) {
        const payload = (res.data as any).data;
        setDashboardData(payload);
        if (payload && typeof payload.isOnline === "boolean") {
          setIsOnline(payload.isOnline);
        }
      }
      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  const handleOnlineToggle = async (newStatus: boolean) => {
    setIsOnline(newStatus); // Optimistic update
    setIsToggling(true);

    try {
      const formData = new FormData();
      formData.append("isOnline", newStatus.toString());

      const res = await updateRestaurantProfileAction(formData);
      if (!res.success) {
        // Revert on failure
        setIsOnline(!newStatus);
        toast.error(t("status.updateFailed"));
      } else {
        toast.success(t("status.updateSuccess", { status: newStatus ? t("status.online") : t("status.offline") }));
      }
    } catch (error) {
      // Revert on error
      setIsOnline(!newStatus);
      toast.error(t("status.updateFailed"));
    } finally {
      setIsToggling(false);
    }
  };

  // Chart Data Config
  const labels = dashboardData?.revenueChart?.map((item: any) => item.day) || [
    t("revenueChart.days.mon"),
    t("revenueChart.days.tue"),
    t("revenueChart.days.wed"),
    t("revenueChart.days.thu"),
    t("revenueChart.days.fri"),
    t("revenueChart.days.sat"),
    t("revenueChart.days.sun"),
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

    if (diffMins < 60) return t("recentActivity.timeAgo.mins", { count: diffMins });
    if (diffHours < 24) return t("recentActivity.timeAgo.hours", { count: diffHours });
    if (diffDays === 1) return t("recentActivity.timeAgo.yesterday");
    return t("recentActivity.timeAgo.days", { count: diffDays });
  };

  const ownerName = dashboardData?.ownerName || "Chef";
  const stats = dashboardData?.stats;
  const recentOrders = dashboardData?.recentOrders || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return {
    isOnline,
    setIsOnline: handleOnlineToggle,
    isToggling,
    isLoading,
    chartData,
    maxDataPoint,
    getTimeAgo,
    ownerName,
    stats,
    recentOrders,
    recentActivity,
  };
}
