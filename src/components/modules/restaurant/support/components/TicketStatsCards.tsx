"use client";

import { Ticket, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import type { TicketStats } from "../hooks/useTicketStats";

const priorityLabel: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

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
        label="Total Tickets"
        value={stats?.total ?? "N/A"}
        sub={
          open !== null ? (
            <p className="text-[11px] text-gray-400">
              {open > 0 ? `${open} open` : "All handled"}
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<Clock className="w-5 h-5 text-amber-500" />}
        iconBg="bg-amber-50"
        label="Pending"
        value={stats?.pending ?? "N/A"}
        sub={
          stats && stats.total > 0 ? (
            <p className="text-[11px] text-amber-500">
              {Math.round((stats.pending / stats.total) * 100)}% of total
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<CheckCircle2 className="w-5 h-5 text-[#346853]" />}
        iconBg="bg-[#e8f3ef]"
        label="Resolved"
        value={stats?.resolved ?? "N/A"}
        sub={
          stats && stats.total > 0 ? (
            <p className="text-[11px] text-[#346853]">
              {Math.round((stats.resolved / stats.total) * 100)}% resolved
            </p>
          ) : undefined
        }
      />

      <StatCard
        icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        iconBg="bg-rose-50"
        label="By Priority"
        value={
          stats?.topPriority ? (
            <span className={`text-[18px] ${priorityColor[stats.topPriority] || "text-gray-600"}`}>
              {priorityLabel[stats.topPriority] || stats.topPriority}
            </span>
          ) : (
            "N/A"
          )
        }
        sub={
          stats ? (
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((p) =>
                stats.byPriority[p] ? (
                  <span key={p} className={`text-[10px] font-semibold ${priorityColor[p]}`}>
                    {priorityLabel[p]} {stats.byPriority[p]}
                  </span>
                ) : null
              )}
            </div>
          ) : undefined
        }
      />
    </div>
  );
};
