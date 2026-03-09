"use client";

import { X, CheckCircle2, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Ticket } from "../support.types";
import { StatusBadge } from "./StatusBadge";

interface TicketDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

interface TimelineStepProps {
  label: string;
  time: string;
  iconType: "done" | "active" | "pending";
}

const TimelineStep = ({ label, time, iconType }: TimelineStepProps) => (
  <div className="flex items-start gap-3 relative">
    {iconType === "done" && (
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
      </div>
    )}
    {iconType === "active" && (
      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <Clock className="w-3 h-3 text-white" />
      </div>
    )}
    {iconType === "pending" && (
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
    )}
    <div>
      <p className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">
        {label}
      </p>
      <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
    </div>
  </div>
);

const TicketDetailSheet = ({
  open,
  onOpenChange,
  ticket,
}: TicketDetailSheetProps) => {
  if (!ticket) return null;

  const createdDate = new Date(ticket.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[420px] border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.06)] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden"
        side="right"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="pr-8">
                <SheetTitle className="text-[17px] font-bold text-[#1a1a1a] leading-tight">
                  {ticket.subject}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[12px] text-gray-400">{ticket.id}</span>
                  <span className="text-gray-300">•</span>
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">
                  Priority
                </span>
                <span className="text-[14px] font-semibold text-[#1a1a1a] capitalize">
                  {ticket.priority.charAt(0) +
                    ticket.priority.slice(1).toLowerCase()}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">
                  Created
                </span>
                <span className="text-[14px] font-semibold text-[#1a1a1a]">
                  {createdDate}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-2">
                Description
              </h4>
              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                {ticket.description || "No description provided."}
              </p>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-4">
                Status
              </h4>
              <div className="space-y-4 relative">
                <div className="absolute left-[9px] top-5 bottom-3 w-px bg-gray-200" />
                <TimelineStep
                  label="Ticket Created"
                  time={createdDate}
                  iconType="done"
                />
                {ticket.status === "IN_PROGRESS" ||
                ticket.status === "RESOLVED" ? (
                  <TimelineStep
                    label="Agent Assigned"
                    time="—"
                    iconType="done"
                  />
                ) : (
                  <TimelineStep
                    label="Agent Assigned"
                    time="Pending"
                    iconType="pending"
                  />
                )}
                {ticket.status === "RESOLVED" ? (
                  <TimelineStep label="Resolved" time="—" iconType="done" />
                ) : ticket.status === "IN_PROGRESS" ? (
                  <TimelineStep
                    label="Awaiting Response"
                    time="Now"
                    iconType="active"
                  />
                ) : (
                  <TimelineStep
                    label="Awaiting Response"
                    time="—"
                    iconType="pending"
                  />
                )}
                {ticket.status !== "RESOLVED" && (
                  <TimelineStep
                    label="Resolution"
                    time="—"
                    iconType="pending"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailSheet;
