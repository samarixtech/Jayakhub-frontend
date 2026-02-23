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
    { name: "Getting Started", description: "Setup guide, onboarding, first steps", articles: 12, icon: <BookOpen className="w-4 h-4" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { name: "Orders & Delivery", description: "Order flow, tracking, delivery", articles: 18, icon: <ShoppingBag className="w-4 h-4" />, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "Payments & Billing", description: "Payouts, invoices, billing info", articles: 9, icon: <CreditCard className="w-4 h-4" />, color: "text-amber-600", bgColor: "bg-amber-50" },
    { name: "Menu Management", description: "Items, categories, variants, photos", articles: 21, icon: <BookOpen className="w-4 h-4" />, color: "text-purple-600", bgColor: "bg-purple-50" },
    { name: "Account & Settings", description: "Profile, team roles, notifications", articles: 14, icon: <Settings className="w-4 h-4" />, color: "text-slate-600", bgColor: "bg-slate-100" },
    { name: "Troubleshooting", description: "Common issues, error codes, fixes", articles: 16, icon: <AlertCircle className="w-4 h-4" />, color: "text-red-500", bgColor: "bg-red-50" },
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
            <div className="flex justify-between items-center mb-6">
                <div /> {/* spacer — page title is in the RestaurantHeader */}
                <button
                    onClick={() => setTicketDialogOpen(true)}
                    className="flex items-center gap-2 bg-[#346853] hover:bg-[#2a5644] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Ticket
                </button>
            </div>

            {/* ── Hero Search Banner ── */}
            <div className="bg-[#346853] rounded-2xl px-8 py-10 mb-8 text-center">
                <h2 className="text-white text-[24px] font-bold mb-2">How can we help you today?</h2>
                <p className="text-white/70 text-[14px] mb-6">Search for articles, FAQs, or browse our knowledge base</p>
                <div className="max-w-[480px] mx-auto relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="e.g. How to change opening hours..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-[13px] text-gray-700 placeholder:text-gray-400 border-0 outline-none focus:ring-2 focus:ring-white/30"
                    />
                </div>
            </div>

            {/* ── Contact Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {/* Live Chat */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#346853] flex items-center justify-center mb-3">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-0.5">Live Chat</h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Online · Avg 2 min wait
                    </div>
                </div>

                {/* Phone Support */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-0.5">Phone Support</h3>
                    <p className="text-[12px] text-gray-500">+964 750 000 0000</p>
                </div>

                {/* Email Us */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                        <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-0.5">Email Us</h3>
                    <p className="text-[12px] text-gray-500">support@jayakhub.com</p>
                </div>
            </div>

            {/* ── Support Tickets + Knowledge Base ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
                {/* Support Tickets */}
                <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a]">Support Tickets</h3>
                            <p className="text-[12px] text-gray-400 mt-0.5">Your recent inquiries</p>
                        </div>
                        <button className="text-[12px] font-semibold text-[#346853] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
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
                                    className="grid grid-cols-[72px_1fr_100px_64px_80px] gap-2 items-center px-1 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => handleTicketClick(t)}
                                >
                                    <span className="text-[12px] font-semibold text-[#1a1a1a]">{t.id}</span>
                                    <span className="text-[12px] text-gray-600 truncate">{t.subject}</span>
                                    <StatusBadge status={t.status} />
                                    <span className={`text-[12px] font-semibold ${t.priority === "High" ? "text-red-600" : t.priority === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{t.priority}</span>
                                    <span className="text-[11px] text-gray-400 text-right">{t.updated}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-1 mt-5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#346853] text-white text-[12px] font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50 transition-colors">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Knowledge Base */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-[16px] font-bold text-[#1a1a1a]">Knowledge Base</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">Browse help topics</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {KB_CATEGORIES.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg ${cat.bgColor} flex items-center justify-center ${cat.color}`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-[#1a1a1a]">{cat.name}</h4>
                                        <p className="text-[11px] text-gray-400">{cat.description}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-gray-400">{cat.articles} articles</span>
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
