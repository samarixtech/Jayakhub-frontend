"use client";

import React from "react";
import { X, CheckCircle2, Circle, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface Ticket {
    id: string;
    subject: string;
    status: "OPEN" | "IN PROGRESS" | "RESOLVED";
    priority: "High" | "Medium" | "Low";
    updated: string;
}

interface TicketDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: Ticket | null;
}

/* ── Status badge identical to the main page ── */
const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
        OPEN: { bg: "bg-orange-100", text: "text-orange-700", label: "OPEN" },
        "IN PROGRESS": { bg: "bg-blue-100", text: "text-blue-700", label: "IN PROGRESS" },
        RESOLVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "RESOLVED" },
    };
    const s = map[status];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${s.bg} ${s.text}`}>
            {s.label}
        </span>
    );
};

/* ── Timeline step ── */
interface TimelineStepProps {
    label: string;
    time: string;
    iconType: "done" | "active" | "pending";
}
const TimelineStep = ({ label, time, iconType }: TimelineStepProps) => (
    <div className="flex items-start gap-3 relative">
        {/* Icon */}
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
        {/* Text */}
        <div>
            <p className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
        </div>
    </div>
);

/* ── Conversation message ── */
interface MessageProps {
    sender: string;
    senderType: "user" | "agent";
    text: string;
    time: string;
}
const Message = ({ sender, senderType, text, time }: MessageProps) => (
    <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${senderType === "user" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}>
            {sender[0]}
        </div>
        <div className="flex-1 min-w-0">
            <span className="text-[12px] font-semibold text-[#1a1a1a] block">{sender}</span>
            <div className={`mt-1 rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${senderType === "agent"
                    ? "bg-[#e8f5ee] text-[#1a1a1a]"
                    : "bg-white border border-gray-100 text-gray-700"
                }`}>
                {text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">{time}</span>
        </div>
    </div>
);

/* ──────────────────────────── Component ──────────────────────────── */
const TicketDetailSheet = ({ open, onOpenChange, ticket }: TicketDetailSheetProps) => {
    if (!ticket) return null;

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
                                <SheetTitle className="text-[17px] font-bold text-[#1a1a1a] leading-tight">{ticket.subject.replace("…", "")}</SheetTitle>
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

                        {/* Priority + Created */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">Priority</span>
                                <span className="text-[14px] font-semibold text-[#1a1a1a]">{ticket.priority}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">Created</span>
                                <span className="text-[14px] font-semibold text-[#1a1a1a]">2026-02-22 09:15</span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                        {/* Status Timeline */}
                        <div>
                            <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-4">Status</h4>
                            <div className="space-y-4 relative">
                                {/* Connector line */}
                                <div className="absolute left-[9px] top-5 bottom-3 w-px bg-gray-200" />
                                <TimelineStep label="Ticket Created" time="Today, 9:15 AM" iconType="done" />
                                <TimelineStep label="Agent Assigned" time="Today, 9:20 AM" iconType="done" />
                                <TimelineStep label="Awaiting Response" time="Now" iconType="active" />
                                <TimelineStep label="Resolution" time="–" iconType="pending" />
                            </div>
                        </div>

                        {/* Conversation */}
                        <div>
                            <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-4">Conversation</h4>
                            <div className="space-y-4">
                                <Message
                                    sender="You"
                                    senderType="user"
                                    text="I added 3 new items to the menu but they are not showing up on the POS terminal. I have tried refreshing multiple times."
                                    time="Today, 9:15 AM"
                                />
                                <Message
                                    sender="Support Agent"
                                    senderType="agent"
                                    text="Hi! Thanks for reaching out. Let me check your menu sync status. Can you confirm if you're using the latest version of the POS app?"
                                    time="Today, 9:22 AM"
                                />
                                <Message
                                    sender="You"
                                    senderType="user"
                                    text="Yes, I updated yesterday. Version 2.4.1"
                                    time="Today, 9:26 AM"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reply Input */}
                    <div className="border-t border-gray-100 px-6 py-4">
                        <p className="text-[13px] font-semibold text-[#1a1a1a] mb-2">Reply</p>
                        <textarea
                            placeholder="Type your message..."
                            rows={2}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors resize-none mb-3"
                        />
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
                            >
                                Cancel
                            </button>
                            <button className="flex items-center gap-2 bg-[#346853] hover:bg-[#2a5644] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors">
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default TicketDetailSheet;
