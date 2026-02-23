"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AllPayoutsSheet from "./AllPayoutsSheet";
import PayoutDetailSheet from "./PayoutDetailSheet";
import TransactionDetailSidebar, { TransactionDetail } from "./TransactionDetailSidebar";

/* ──────────────── Types ──────────────── */
export interface Payout {
  id: string;
  date: string;
  amount: string;
  bank: string;
  status: "In Transit" | "Paid";
  eta?: string;
}

interface Transaction {
  id: string;
  type: "Order" | "Refund";
  date: string;
  method: string;
  netAmount: number;
  fee: number;
  total: number;
}

/* ──────────────── Mock Data ──────────────── */
const MOCK_PAYOUTS: Payout[] = [
  { id: "PAY-0048", date: "Today, 4:00 PM", amount: "$3,450.00", bank: "Citibank •••• 4242", status: "In Transit", eta: "~2 business days" },
  { id: "PAY-0047", date: "Feb 14, 2026", amount: "$2,100.50", bank: "Citibank •••• 4242", status: "Paid" },
  { id: "PAY-0046", date: "Feb 07, 2026", amount: "$4,200.00", bank: "Citibank •••• 4242", status: "Paid" },
  { id: "PAY-0045", date: "Jan 31, 2026", amount: "$3,089.50", bank: "Citibank •••• 4242", status: "Paid" },
  { id: "PAY-0044", date: "Jan 24, 2026", amount: "$2,780.00", bank: "Citibank •••• 4242", status: "Paid" },
  { id: "PAY-0043", date: "Jan 17, 2026", amount: "$3,650.25", bank: "Citibank •••• 4242", status: "Paid" },
  { id: "PAY-0042", date: "Jan 10, 2026", amount: "$1,920.00", bank: "Citibank •••• 4242", status: "Paid" },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "#ORD-9923", type: "Order", date: "Feb 21, 12:15 PM", method: "Cash", netAmount: 55.99, fee: 1.5, total: 43.40 },
  { id: "#ORD-9927", type: "Order", date: "Feb 21, 11:45 PM", method: "Card", netAmount: 178.50, fee: -8.5, total: -170.50 },
  { id: "#ORD-9926", type: "Order", date: "Feb 21, 1:00 PM", method: "Online", netAmount: 134.00, fee: 0, total: 50.30 },
  { id: "#REF-1020", type: "Refund", date: "Feb 15, 10:00 PM", method: "Card", netAmount: -185.00, fee: 0, total: -186.30 },
  { id: "#ORD-9925", type: "Order", date: "Feb 19, 12:30 AM", method: "Wallet", netAmount: 685.00, fee: -32.5, total: 842.15 },
  { id: "#ORD-9924", type: "Order", date: "Feb 20, 14:30 PM", method: "Cash", netAmount: 195.60, fee: -14.0, total: -141.00 },
];

const PAYMENT_METHODS = [
  { name: "Cash", pct: 53, amount: "$7,767", color: "#346853" },
  { name: "Card", pct: 29, amount: "$4,481", color: "#f5a623" },
  { name: "Online", pct: 11, amount: "$1,523", color: "#3b82f6" },
  { name: "Wallet", pct: 5, amount: "$689", color: "#ef4444" },
];

/* ──────────────── Stat Card ──────────────── */
const StatCard = ({ label, value, trend, icon, iconBg }: {
  label: string; value: string; trend: string; icon: React.ReactNode; iconBg: string;
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <span className="text-[13px] font-medium text-gray-500">{label}</span>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
    </div>
    <span className="text-[28px] font-black text-[#1a1a1a] leading-tight">{value}</span>
    <span className="text-[12px] font-semibold text-emerald-600">{trend}</span>
  </div>
);

/* ──────────────── Revenue Chart (SVG placeholder) ──────────────── */
const RevenueChart = () => {
  const points = [120, 200, 180, 280, 240, 350, 310, 380, 340, 400, 420, 460, 480, 510, 490, 520, 550, 530, 560, 580];
  const prevPoints = [80, 130, 110, 160, 140, 200, 180, 220, 200, 250, 240, 280, 260, 300, 290, 310, 320, 300, 330, 340];
  const maxY = 600;
  const w = 560;
  const h = 200;

  const toPath = (pts: number[]) =>
    pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - (p / maxY) * h}`).join(" ");

  const labels = ["Jan 29", "Feb 1", "Feb 5", "Feb 9", "Feb 13", "Feb 17", "Feb 21"];
  const yLabels = ["$1700", "$1200", "$700", "$475", "$238", "$0"];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w + 40} ${h + 30}`} className="w-full h-auto">
        {/* Y grid lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={40} y1={i * (h / 5)} x2={w + 40} y2={i * (h / 5)} stroke="#f0f0f0" strokeWidth="1" />
        ))}
        {/* Y labels */}
        {yLabels.map((l, i) => (
          <text key={i} x={0} y={i * (h / 5) + 4} fill="#a0a0a0" fontSize="9" fontWeight="600">{l}</text>
        ))}
        {/* X labels */}
        {labels.map((l, i) => (
          <text key={i} x={40 + i * (w / (labels.length - 1))} y={h + 20} fill="#a0a0a0" fontSize="9" fontWeight="600" textAnchor="middle">{l}</text>
        ))}
        {/* Previous period (dashed) */}
        <polyline
          points={prevPoints.map((p, i) => `${40 + (i / (prevPoints.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")}
          fill="none" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 3"
        />
        {/* Current period fill */}
        <polygon
          points={`40,${h} ${points.map((p, i) => `${40 + (i / (points.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")} ${w + 40},${h}`}
          fill="url(#greenGrad)" opacity="0.15"
        />
        {/* Current period line */}
        <polyline
          points={points.map((p, i) => `${40 + (i / (points.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")}
          fill="none" stroke="#346853" strokeWidth="2"
        />
        <defs>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#346853" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#346853" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/* ──────────────── Donut Chart ──────────────── */
const DonutChart = () => {
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const stroke = 22;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const colors = ["#346853", "#f5a623", "#3b82f6", "#ef4444"];
  const pcts = [53, 29, 11, 5];

  return (
    <svg viewBox="0 0 180 180" className="w-[160px] h-[160px]">
      {pcts.map((pct, i) => {
        const dash = (pct / 100) * circ;
        const gap = circ - dash;
        const seg = (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={colors[i]} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return seg;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#1a1a1a" fontSize="18" fontWeight="900">$18,460</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#a0a0a0" fontSize="9" fontWeight="600">Total</text>
    </svg>
  );
};

/* ──────────────── Main Component ──────────────── */
const PaymentsView = () => {
  const [allPayoutsOpen, setAllPayoutsOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [payoutDetailOpen, setPayoutDetailOpen] = useState(false);

  const [transactionSidebarOpen, setTransactionSidebarOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);

  const handleTransactionClick = (t: Transaction) => {
    // Map existing mock data into TransactionDetail format
    const timeRegex = /\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)/;
    const timeMatch = t.date.match(timeRegex);
    const timeStr = timeMatch ? timeMatch[0] : undefined;

    setSelectedTransaction({
      id: t.id,
      type: t.type,
      date: t.date.replace(timeRegex, "").replace(", ", "").trim(), // basic date parse
      time: timeStr,
      customer: "Hassan Ali", // Fallback dummy customer
      paymentMethod: t.method,
      total: `$${Math.abs(t.total).toFixed(2)}`,
      netAmount: t.netAmount.toString(),
      fee: t.fee.toString(),
    });
    setTransactionSidebarOpen(true);
  };

  const handlePayoutClick = (p: Payout) => {
    // Close All Payouts sheet first, then open detail
    setAllPayoutsOpen(false);
    setSelectedPayout(p);
    // Small delay so the closing animation finishes before the detail opens
    setTimeout(() => {
      setPayoutDetailOpen(true);
    }, 150);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="flex justify-end items-center gap-3 pt-1">
        <Button variant="outline" className="bg-white border-gray-200 h-9 text-[13px]">
          <ChevronDown className="mr-2 w-4 h-4 text-gray-400" />
          Last 120 Days
        </Button>
        <Button variant="outline" className="bg-white border-gray-200 h-9 text-[13px]">
          <Download className="mr-2 w-4 h-4 text-gray-400" />
          Export
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Revenue" value="$18,460" trend="↑ +12% vs last month" icon={<DollarSign className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50" />
        <StatCard label="Net Profit" value="$14,230" trend="↑ +8% vs last month" icon={<TrendingUp className="w-4 h-4 text-blue-600" />} iconBg="bg-blue-50" />
        <StatCard label="Platform Fees" value="$1,846" trend="10% of revenue" icon={<CreditCard className="w-4 h-4 text-amber-600" />} iconBg="bg-amber-50" />
        <StatCard label="Avg Order Value" value="$24.50" trend="↑ +$0.94 vs last month" icon={<ShoppingCart className="w-4 h-4 text-purple-600" />} iconBg="bg-purple-50" />
      </div>

      {/* Revenue Trend + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-[16px] font-bold text-[#1a1a1a]">Revenue Trend</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Daily revenue over selected period</p>
          </div>
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#346853] rounded-full" />
              <span className="text-[11px] text-gray-500">Current Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-300 rounded-full border-dashed" style={{ borderTop: "1.5px dashed #ccc", height: 0 }} />
              <span className="text-[11px] text-gray-500">Previous Period</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">Payment Methods</h3>
          <div className="flex items-center justify-center mb-5">
            <DonutChart />
          </div>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{m.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-gray-400 w-8 text-right">{m.pct}%</span>
                  <span className="text-[13px] font-semibold text-[#1a1a1a] w-16 text-right">{m.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax & Commissions + Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax & Commissions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-[16px] font-bold text-[#1a1a1a]">Tax & Commissions</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Breakdown for this period</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <span className="text-[11px] text-gray-400 font-medium block mb-1">Tax Collected</span>
              <span className="text-[20px] font-black text-[#1a1a1a]">$923</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">1% of gross sales</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <span className="text-[11px] text-gray-400 font-medium block mb-1">Platform Commission</span>
              <span className="text-[20px] font-black text-[#1a1a1a]">$1,846</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">10% service fee</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <span className="text-[11px] text-gray-400 font-medium block mb-1">Payment Processing</span>
              <span className="text-[20px] font-black text-[#1a1a1a]">$461</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <span className="text-[11px] text-gray-400 font-medium block mb-1">Delivery Costs</span>
              <span className="text-[20px] font-black text-[#1a1a1a]">$680</span>
            </div>
          </div>
          <div className="bg-[#e8f5ee] rounded-xl px-5 py-3.5 flex justify-between items-center">
            <span className="text-[13px] font-semibold text-[#2d6a4f]">Net Earnings</span>
            <span className="text-[20px] font-black text-[#2d6a4f]">$14,550</span>
          </div>
        </div>

        {/* Payouts */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">Payouts</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Transfers to your bank ending •••• 4242</p>
            </div>
            <button
              onClick={() => setAllPayoutsOpen(true)}
              className="text-[12px] font-semibold text-[#346853] hover:text-[#2a5644] transition-colors"
            >
              View All
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-[1fr_80px_110px_60px_60px] gap-2 items-center px-1 mb-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Bank</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">ETA</span>
              </div>
              <div className="h-px bg-gray-100 mb-1" />

              {MOCK_PAYOUTS.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1fr_80px_110px_60px_60px] gap-2 items-center px-1 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => handlePayoutClick(p)}
                >
                  <span className="text-[12px] font-medium text-[#1a1a1a]">{p.date}</span>
                  <span className="text-[12px] font-semibold text-[#1a1a1a]">{p.amount}</span>
                  <span className="text-[12px] text-gray-500">{p.bank}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.status === "In Transit" ? "bg-orange-100 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>{p.status}</span>
                  <span className="text-[11px] text-gray-400 text-right">{p.eta || "–"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1a1a]">Transactions</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">8 of 72</p>
          </div>
          <button className="text-[12px] font-semibold text-[#346853] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            All Types
          </button>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px_1.5fr_1fr_1fr_80px_1fr] gap-4 items-center px-4 mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Transaction</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Method</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Net Amount</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Fee</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Total</span>
            </div>
            <div className="h-px bg-gray-100 mb-2" />

            {/* Table Body */}
            {MOCK_TRANSACTIONS.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[1fr_80px_1.5fr_1fr_1fr_80px_1fr] gap-4 items-center px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => handleTransactionClick(t)}
              >
                <span className="text-[13px] font-bold text-emerald-600">{t.id}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded w-fit ${t.type === "Refund" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}>{t.type}</span>
                <span className="text-[13px] font-medium text-gray-600">{t.date}</span>
                <span className="text-[13px] font-medium text-gray-600">{t.method}</span>
                <span className={`text-[13px] font-bold text-right ${t.netAmount < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}>${Math.abs(t.netAmount).toFixed(2)}</span>
                <span className="text-[13px] font-medium text-gray-400 text-right">{t.fee < 0 ? "-" : ""}${Math.abs(t.fee).toFixed(2)}</span>
                <span className={`text-[14px] font-black text-right ${t.total < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}>{t.total < 0 ? "-" : ""}${Math.abs(t.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 mt-5">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#346853] text-white text-[12px] font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sheets */}
      <AllPayoutsSheet
        open={allPayoutsOpen}
        onOpenChange={setAllPayoutsOpen}
        payouts={MOCK_PAYOUTS}
        onPayoutClick={handlePayoutClick}
      />
      <PayoutDetailSheet
        open={payoutDetailOpen}
        onOpenChange={setPayoutDetailOpen}
        payout={selectedPayout}
      />

      <TransactionDetailSidebar
        open={transactionSidebarOpen}
        onOpenChange={setTransactionSidebarOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default PaymentsView;
