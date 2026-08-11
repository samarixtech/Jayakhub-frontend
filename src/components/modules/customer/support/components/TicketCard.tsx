"use client";
import React from "react";
import { useTranslations } from "next-intl";
import {
  SupportTicket,
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_LABEL_KEY,
  PRIORITY_LABEL_KEY,
} from "../types";
import { Calendar, Trash2, Tag, ChevronRight, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface TicketCardProps {
  ticket: SupportTicket;
  onSelect: (ticket: SupportTicket) => void;
  onDeleteClick: (ticket: SupportTicket, e: React.MouseEvent) => void;
}

export function TicketCard({ ticket, onSelect, onDeleteClick }: TicketCardProps) {
  const t = useTranslations("CustomerDashboard.Support");
  const priorityStyle = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.MEDIUM;
  const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS.OPEN;
  const statusLabel = t(STATUS_LABEL_KEY[ticket.status] || STATUS_LABEL_KEY.OPEN);
  const priorityLabel = t(PRIORITY_LABEL_KEY[ticket.priority] || PRIORITY_LABEL_KEY.MEDIUM);

  const formattedDate = ticket.createdAt
    ? (() => {
        try {
          return format(new Date(ticket.createdAt), "dd MMM yyyy");
        } catch {
          return ticket.createdAt;
        }
      })()
    : t("recentlyFallback");

  return (
    <div
      onClick={() => onSelect(ticket)}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Left Priority Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-200 group-hover:w-2"
        style={{ backgroundColor: priorityStyle.bar }}
      />

      <div className="p-5 pl-6 space-y-3">
        {/* Top Header: ID & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              #{ticket.id.slice(-6).toUpperCase()}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${statusStyle.bg} ${statusStyle.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {statusLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => onDeleteClick(ticket, e)}
            className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
            title={t("deleteTicketTooltip")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Subject & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
            {ticket.subject}
          </h3>
          {ticket.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {ticket.description}
            </p>
          )}
        </div>

        {/* Chips & Date */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-50">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Chip */}
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {priorityLabel} {t("priorityBadgeSuffix")}
            </span>

            {/* Category Chip */}
            {ticket.category && (
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                {ticket.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-primary font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <MessageSquare className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
