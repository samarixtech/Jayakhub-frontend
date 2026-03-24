"use client";

import { Loader2 } from "lucide-react";
import type { Ticket } from "../support.types";
import { StatusBadge } from "./StatusBadge";
import { useTranslations } from "next-intl";

interface TicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  onTicketClick: (ticket: Ticket) => void;
}

const priorityColor: Record<string, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-gray-500",
};

function formatTimeAgo(dateStr: string, t: any): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return t("timeAgo.minutes", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("timeAgo.hours", { count: hours });
  const days = Math.floor(hours / 24);
  return t("timeAgo.days", { count: days });
}

export const TicketsTable = ({
  tickets,
  isLoading,
  onTicketClick,
}: TicketsTableProps) => {
  const t = useTranslations("RestaurantDashboard.Support.ticketsTable");
  return (
    <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-[#1a1a1a]">
            {t("title")}
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 mb-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colTicket")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colSubject")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colStatus")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colPriority")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                {t("colUpdated")}
              </span>
            </div>
            <div className="h-px bg-gray-100 mb-1" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 py-4 border-b border-gray-50 last:border-0"
              >
                <div className="h-3.5 w-14 bg-gray-200 rounded animate-pulse" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3.5 w-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-gray-400">
          {t("noTickets")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 mb-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colTicket")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colSubject")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colStatus")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {t("colPriority")}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                {t("colUpdated")}
              </span>
            </div>
            <div className="h-px bg-gray-100 mb-1" />

            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onTicketClick(ticket)}
              >
                <span className="text-[12px] font-bold text-[#346853]">
                  {ticket.id.length > 10 ? ticket.id.slice(0, 10) + "…" : ticket.id}
                </span>
                <span className="text-[12px] text-gray-600 truncate font-medium">
                  {ticket.subject}
                </span>
                <StatusBadge status={ticket.status} />
                <span
                  className={`text-[12px] font-semibold capitalize ${priorityColor[ticket.priority] || "text-gray-500"}`}
                >
                  {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                </span>
                <span className="text-[11px] text-gray-400 text-right">
                  {formatTimeAgo(ticket.updatedAt, t)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
