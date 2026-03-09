import { DollarSign, ShoppingBag, Star, Timer } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "../../types";
import { useTranslations } from "next-intl";

interface DashboardStatsProps {
  summary: OrderSummary;
  loading: boolean;
}

export const DashboardStats = ({ summary, loading }: DashboardStatsProps) => {
  const t = useTranslations('CustomerDashboard.DashboardStats');

  const STATS = [
    {
      label: t('total_spent'),
      value: `$${summary.totalSpend}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: t('total_orders'),
      value: summary.totalOrdersCount.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: t('average_rating'),
      value: summary.averageRating?.toString() || "0.0",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: t('active_orders'),
      value: summary.totalPendingOrders.toString(),
      icon: Timer,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <Card
          key={stat.label}
          className="border-none shadow-sm rounded-3xl bg-white"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <Typography className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {stat.label}
              </Typography>
              {loading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <Typography className="text-xl font-black text-gray-900 leading-tight">
                  {stat.value}
                </Typography>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
