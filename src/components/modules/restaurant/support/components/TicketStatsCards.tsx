"use client";

import { Ticket, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TicketStats } from "../hooks/useTicketStats";

const priorityColor: Record<string, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-amber-500",
  HIGH: "text-red-500",
  URGENT: "text-rose-600",
};

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}

const StatCard = ({ icon, iconBg, label, value, sub }: StatCardProps) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-[22px] font-bold text-[#1a1a1a] leading-none">{value}</p>
      {sub && <div className="mt-1.5">{sub}</div>}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse shrink-0" />
    <div className="flex-1">
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface TicketStatsCardsProps {
  stats: TicketStats | null;
  isLoading: boolean;
}

export const TicketStatsCards = ({ stats, isLoading }: TicketStatsCardsProps) => {
  const t = useTranslations("RestaurantDashboard.Support.statsCards");
  const priorityLabel: Record<string, string> = {
    LOW: t("priorities.low"),
    MEDIUM: t("priorities.medium"),
    HIGH: t("priorities.high"),
    URGENT: t("priorities.urgent"),
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const open = stats ? stats.total - stats.pending - stats.resolved : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<Ticket className="w-5 h-5 text-[#346853]" />}
        iconBg="bg-[#e8f3ef]"
        label={t("totalTickets")}
        value={stats?.total ?? t("na")}
        sub={
          open !== null ? (
            <p className="text-[11px] text-gray-400">
              {open > 0 ? t("openCount", { count: open }) : t("allHandled")}
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<Clock className="w-5 h-5 text-amber-500" />}
        iconBg="bg-amber-50"
        label={t("pending")}
        value={stats?.pending ?? t("na")}
        sub={
          stats && stats.total > 0 ? (
            <p className="text-[11px] text-amber-500">
              {t("ofTotal", { percent: Math.round((stats.pending / stats.total) * 100) })}
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<CheckCircle2 className="w-5 h-5 text-[#346853]" />}
        iconBg="bg-[#e8f3ef]"
        label={t("resolved")}
        value={stats?.resolved ?? t("na")}
        sub={
          stats && stats.total > 0 ? (
            <p className="text-[11px] text-[#346853]">
              {t("resolvedPercent", { percent: Math.round((stats.resolved / stats.total) * 100) })}
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        iconBg="bg-rose-50"
        label={t("byPriority")}
        value={
          stats?.topPriority ? (
            <span className={`text-[18px] ${priorityColor[stats.topPriority] || "text-gray-600"}`}>
              {priorityLabel[stats.topPriority] || stats.topPriority}
            </span>
          ) : (
            t("na")
          )
        }
      />
    </div>
  );
};
