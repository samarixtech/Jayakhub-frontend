"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface SupportHeaderProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function SupportHeader({
  onOpenCreateModal,
  onRefresh,
  isRefreshing = false,
}: SupportHeaderProps) {
  const t = useTranslations("CustomerDashboard.Support");
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100/60 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <LifeBuoy className="w-6 h-[#3B82F6] h-6" />
        </div>
        <div>
          <Typography className="text-xl font-bold text-slate-900">
            {t("title")}
          </Typography>
          <Typography className="text-sm text-slate-500">
            {t("subtitle")}
          </Typography>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-3.5"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin text-primary" : ""}`}
          />
          {t("refresh")}
        </Button>

        <Button
          onClick={onOpenCreateModal}
          size="sm"
          className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow h-10 px-4 font-medium transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("newTicket")}
        </Button>
      </div>
    </div>
  );
}
