"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { TicketStats } from "../types";
import { Ticket, Clock, CheckCircle2, Archive } from "lucide-react";

interface SupportStatsProps {
  stats: TicketStats;
  loading?: boolean;
}

export function SupportStats({ stats, loading = false }: SupportStatsProps) {
  const t = useTranslations("CustomerDashboard.Support");
  const statCards = [
    {
      title: t("total"),
      value: stats.total,
      icon: Ticket,
      iconBg: "bg-blue-50 text-blue-600",
      dot: "bg-blue-500",
      border: "border-blue-100",
    },
    {
      title: t("pending"),
      value: stats.pending,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
      dot: "bg-[#F59E0B]",
      border: "border-amber-100",
    },
    {
      title: t("resolved"),
      value: stats.resolved,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
      dot: "bg-[#10B981]",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </p>
              )}
            </div>

            <div
              className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
