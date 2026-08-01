"use client";

import type { Ticket } from "../support.types";
import { StatusBadge } from "./StatusBadge";
import { useTranslations } from "next-intl";
import GlobalTable, { Column } from "@/components/common/GlobalTable";

interface AllTicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  onTicketClick: (ticket: Ticket) => void;
}

const priorityColor: Record<string, string> = {
  URGENT: "text-rose-600 font-semibold",
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-gray-500",
};

function formatTimeAgo(
  dateStr: string,
  t: ReturnType<typeof useTranslations>,
): string {
  if (!dateStr) return "—";
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t("timeAgo.justNow");
  if (minutes < 60) return t("timeAgo.minutes", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("timeAgo.hours", { count: hours });
  const days = Math.floor(hours / 24);
  return t("timeAgo.days", { count: days });
}

export const AllTicketsTable = ({
  tickets,
  isLoading,
  onTicketClick,
}: AllTicketsTableProps) => {
  const t = useTranslations("RestaurantDashboard.Support.ticketsTable");

  const columns: Column<Ticket>[] = [
    {
      header: t("colTicket"),
      cell: (ticket) => (
        <span className="text-[12px] font-bold text-brand-orange whitespace-nowrap">
          {ticket.id}
        </span>
      ),
    },
    {
      header: t("colSubject"),
      cell: (ticket) => (
        <span className="text-[12px] text-navy truncate font-medium max-w-[160px] block">
          {ticket.subject}
        </span>
      ),
    },
    {
      header: t("colCategory"),
      cell: (ticket) => (
        <span className="text-[12px] text-gray-500 truncate capitalize">
          {ticket.category}
        </span>
      ),
    },
    {
      header: t("colDesc"),
      cell: (ticket) => (
        <span className="text-[12px] text-gray-400 truncate max-w-[200px] block">
          {ticket.description?.trim()}
        </span>
      ),
    },
    {
      header: t("colStatus"),
      cell: (ticket) => <StatusBadge status={ticket.status} />,
    },
    {
      header: t("colPriority"),
      cell: (ticket) => (
        <span
          className={`text-[12px] font-semibold capitalize ${
            priorityColor[(ticket.priority || "").toUpperCase()] ||
            "text-gray-500"
          }`}
        >
          {(ticket.priority || "").toLowerCase()}
        </span>
      ),
    },
    {
      header: t("colUpdated"),
      cell: (ticket) => (
        <span className="text-[11px] text-gray-400 whitespace-nowrap">
          {formatTimeAgo(ticket.updatedAt || ticket.createdAt, t)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-navy">{t("title")}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      <GlobalTable
        data={tickets}
        columns={columns}
        loading={isLoading}
        emptyMessage={t("noTickets")}
        onRowClick={onTicketClick}
      />
    </div>
  );
};
