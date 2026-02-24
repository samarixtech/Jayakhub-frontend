"use client";

import React, { useState } from "react";
import {
    Search,
    MessageSquare,
    Phone,
    Mail,
    ChevronRight,
    ChevronLeft,
    Plus,
    Play,
    ShoppingBag,
    CreditCard,
    Settings,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import CreateTicketDialog from "./CreateTicketDialog";
import TicketDetailSheet from "./TicketDetailSheet";


interface Ticket {
    id: string;
    subject: string;
    status: "OPEN" | "IN PROGRESS" | "RESOLVED";
    priority: "High" | "Medium" | "Low";
    updated: string;
}

interface KBCategory {
    name: string;
    description: string;
    articles: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}


const MOCK_TICKETS: Ticket[] = [
    { id: "TKT-1042", subject: "Menu items not syncing with P…", status: "OPEN", priority: "High", updated: "2 hours ago" },
    { id: "TKT-1041", subject: "Payout not received this wee…", status: "IN PROGRESS", priority: "High", updated: "6 hours ago" },
    { id: "TKT-1040", subject: "How to enable table reservati…", status: "OPEN", priority: "Medium", updated: "8 hours ago" },
    { id: "TKT-1039", subject: "Customer refund request for o…", status: "RESOLVED", priority: "Medium", updated: "1 day ago" },
    { id: "TKT-1038", subject: "Update delivery zone radius", status: "RESOLVED", priority: "Low", updated: "2 days ago" },
];

const KB_CATEGORIES: KBCategory[] = [
    { name: "Getting Started", description: "Setup guide, onboarding, first steps", articles: 12, icon: <BookOpen className="w-[18px] h-[18px]" />, color: "text-[#346853]", bgColor: "bg-[#f2f8f6] border border-[#e8f3ef]" },
    { name: "Orders & Delivery", description: "Order flow, tracking, delivery", articles: 18, icon: <ShoppingBag className="w-[18px] h-[18px]" />, color: "text-[#3b82f6]", bgColor: "bg-[#eff6ff] border border-[#dbeafe]" },
    { name: "Payments & Billing", description: "Payouts, invoices, billing info", articles: 14, icon: <CreditCard className="w-[18px] h-[18px]" />, color: "text-[#f59e0b]", bgColor: "bg-[#fffbeb] border border-[#fef3c7]" },
    { name: "Menu Management", description: "Items, categories, variants, photos", articles: 21, icon: <BookOpen className="w-[18px] h-[18px]" />, color: "text-[#a855f7]", bgColor: "bg-[#faf5ff] border border-[#f3e8ff]" },
    { name: "Account & Settings", description: "Profile, team roles, notifications", articles: 9, icon: <Settings className="w-[18px] h-[18px]" />, color: "text-[#3b82f6]", bgColor: "bg-[#eff6ff] border border-[#dbeafe]" },
    { name: "Troubleshooting", description: "Common issues, error codes, fixes", articles: 16, icon: <AlertCircle className="w-[18px] h-[18px]" />, color: "text-[#ec4899]", bgColor: "bg-[#fdf2f8] border border-[#fce7f3]" },
];

const FAQ_ITEMS = [
    { q: "How do I change my restaurant logo?", a: "Navigate to Settings > Profile and click on the camera icon to upload a new logo picture." },
    { q: "When do I get paid?", a: "Payouts are processed weekly. You can expect funds to arrive in your designated bank account every Wednesday." },
    { q: "Can I set different hours for weekends?", a: "Yes, go to Settings > Opening Hours. You can define specific time slots for each day of the week." },
    { q: "How do I add a new menu item?", a: "Go to Menu Management, select a category, and click the 'Add Item' button to enter the item details and price." },
    { q: "What happens when I mark an order as 'Ready'?", a: "The customer and delivery driver are notified immediately that the order is prepared and ready for pickup." },
    { q: "How do I handle a customer complaint?", a: "Please reach out to our Support team via Live Chat or Phone. We will mediate the process." },
    { q: "Can I export my financial data?", a: "Yes, you can export your payout and transaction history as a CSV file from the Finance tab." },
    { q: "How do I add team members?", a: "Go to Account & Settings > Team roles, and click 'Invite Member' to assign them specific access permissions." },
];

/* ──────────────────────────── Status Badge ──────────────────────────── */
const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
        OPEN: { bg: "bg-[#fef3c7]", text: "text-[#d97706]", label: "OPEN" },
        "IN PROGRESS": { bg: "bg-[#dbeafe]", text: "text-[#2563eb]", label: "IN PROGRESS" },
        RESOLVED: { bg: "bg-[#d1fae5]", text: "text-[#059669]", label: "RESOLVED" },
    };
    const s = map[status];
    return (
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${s.bg} ${s.text} w-fit`}>
            {s.label}
        </span>
    );
};

/* ──────────────────────────── Component ──────────────────────────── */
const SupportCenterView = () => {
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setSheetOpen(true);
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto pb-12">
            {/* ── Page Header ── */}
            <div className="flex justify-end items-center mb-4">
                <button
                    onClick={() => setTicketDialogOpen(true)}
                    className="flex items-center gap-1.5 bg-[#2E6B56] hover:bg-[#255745] text-white text-[12px] font-bold px-5 py-2 rounded-full transition-colors shadow-sm tracking-wide"
                >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                    New Ticket
                </button>
            </div>

            {/* ── Hero Search Banner ── */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#219e74] to-[#39cd96] px-8 py-12 mb-6 text-center text-white relative flex flex-col items-center justify-center shadow-sm overflow-hidden">
                {/* Decorative right-side shape */}
                <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 transform -skew-x-[35deg] origin-top translate-x-32" />
                <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#39cd96] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 opacity-80" />

                <h2 className="text-[22px] md:text-[24px] font-bold mb-2 relative z-10 tracking-wide text-white">How can we help you today?</h2>
                <p className="text-white/80 text-[13px] mb-6 relative z-10 font-medium">Search for articles, FAQs, or browse our knowledge base.</p>
                <div className="w-full max-w-[500px] relative z-10">
                    <Search className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="e.g. How to change opening hours.."
                        className="w-full h-11 pl-12 pr-4 rounded-full bg-white text-[13px] text-gray-800 placeholder:text-gray-400 border-0 outline-none shadow-sm focus:ring-2 focus:ring-white/40"
                    />
                </div>
            </div>

            {/* ── Contact Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Live Chat */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
                        <MessageSquare className="w-5 h-5 text-[#346853] fill-current opacity-80" />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-800 mb-1">Live Chat</h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E74]" />
                        Online – Avg 2 min wait
                    </div>
                </div>

                {/* Phone Support */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
                        <Phone className="w-5 h-5 text-[#346853] fill-current opacity-80" />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-800 mb-1">Phone Support</h3>
                    <p className="text-[12px] text-gray-500 font-medium">+964 750 000 0000</p>
                </div>

                {/* Email Us */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 md:py-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f3ef] flex items-center justify-center mb-4">
                        <Mail className="w-5 h-5 text-[#346853] fill-current opacity-80" />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-800 mb-1">Email Us</h3>
                    <p className="text-[12px] text-gray-500 font-medium">support@jayakhub.com</p>
                </div>
            </div>

            {/* ── Support Tickets + Knowledge Base ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
                {/* Support Tickets */}
                <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h3 className="text-[15px] font-bold text-[#1a1a1a]">Support Tickets</h3>
                            <p className="text-[12px] text-gray-400 mt-0.5">Your recent inquiries</p>
                        </div>
                        <button className="text-[12px] font-semibold text-gray-700 border border-gray-200 rounded-lg px-6 py-1.5 hover:bg-gray-50 transition-colors">
                            All
                        </button>
                    </div>

                    {/* Table Header */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[500px]">
                            <div className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 mb-2">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ticket</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Subject</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Priority</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Updated</span>
                            </div>
                            <div className="h-px bg-gray-100 mb-1" />

                            {/* Rows */}
                            {MOCK_TICKETS.map((t) => (
                                <div
                                    key={t.id}
                                    className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => handleTicketClick(t)}
                                >
                                    <span className="text-[12px] font-bold text-[#346853]">{t.id}</span>
                                    <span className="text-[12px] text-gray-600 truncate font-medium">{t.subject}</span>
                                    <StatusBadge status={t.status} />
                                    <span className={`text-[12px] font-semibold ${t.priority === "High" ? "text-red-500" : t.priority === "Medium" ? "text-amber-500" : "text-gray-500"}`}>{t.priority}</span>
                                    <span className="text-[11px] text-gray-400 text-right">{t.updated}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors shadow-sm">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#346853] text-white text-[13px] font-medium shadow-sm">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Knowledge Base */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-[15px] font-bold text-[#1a1a1a]">Knowledge Base</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">Browse help topics</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {KB_CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-bold text-gray-800">{cat.name}</h4>
                                        <p className="text-[11px] text-gray-400">{cat.description}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-400">{cat.articles} articles</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Frequently Asked Questions ── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">Frequently Asked Questions</h3>
                <div className="flex flex-col">
                    {FAQ_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col py-3.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                            onClick={() => toggleFaq(i)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-gray-700 font-medium">{item.q}</span>
                                <ChevronRight className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
                            </div>
                            {expandedFaq === i && (
                                <div className="mt-2 text-[12px] text-gray-500 pr-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Modals / Sheets ── */}
            <CreateTicketDialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen} />
            <TicketDetailSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                ticket={selectedTicket}
            />
        </div>
    );
};

export default SupportCenterView;
