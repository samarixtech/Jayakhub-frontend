"use client";

import React, { useState, useRef } from "react";
import { filterOptions } from "../constants";

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import FinanceHeader from "../components/FinanceHeader";
import { FinanceSkeleton } from "@/components/skeletons/FinanceSkeleton";
import AllPayoutsSheet from "../components/AllPayoutsSheet";
import PayoutDetailSheet from "../components/PayoutDetailSheet";
import TransactionDetailSidebar, {
  TransactionDetail,
} from "../components/TransactionDetailSidebar";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import DonutChart from "../components/DonutChart";
import { useFinanceOverview } from "../hooks/useFinanceOverview";
import { FinanceReportPDF } from "../components/FinanceReportPDF";

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
  type: string;
  date: string;
  method: string;
  netAmount: number;
  fee: number;
  total: number;
}

/* ──────────────── Main Component ──────────────── */
const PaymentsView = () => {
  const [filter, setFilter] = useState("all");
  const { data, loading, error } = useFinanceOverview(filter);

  const [allPayoutsOpen, setAllPayoutsOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [payoutDetailOpen, setPayoutDetailOpen] = useState(false);

  // Ref for the content we want to export to PDF
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfReportRef = useRef<HTMLDivElement>(null);

  // Since payouts are not in the API currently, we initialize an empty array as requested
  const payouts: Payout[] = [];

  const [transactionSidebarOpen, setTransactionSidebarOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);

  if (loading) {
    return <FinanceSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-red-500">
        <p>Failed to load finance data.</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  const handleTransactionClick = (t: any) => {
    // Map API data into TransactionDetail format
    const parsedDate = new Date(t.date);
    const timeStr = parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    setSelectedTransaction({
      id: t.orderId,
      type: t.type,
      date: dateStr,
      time: timeStr,
      customer: t.customerName,
      paymentMethod: t.method,
      total: `$${Math.abs(parseFloat(t.total)).toFixed(2)}`,
      netAmount: t.netAmount,
      fee: t.fee,
    });
    setTransactionSidebarOpen(true);
  };

  const handlePayoutClick = (p: Payout) => {
    setAllPayoutsOpen(false);
    setSelectedPayout(p);
    setTimeout(() => {
      setPayoutDetailOpen(true);
    }, 150);
  };

  // Process revenue points for the chart
  const currentPoints = data.revenueTrend.map((d) => d.revenue);
  // Default fallback if previous points are not in API
  const maxPrev = currentPoints.length || 7;
  const prevPoints = Array.from(
    { length: maxPrev },
    (_, i) => (currentPoints[i] || 0) * 0.8,
  );

  // Process payment methods
  const pmColors: Record<string, string> = {
    card: "#f5a623",
    cod: "#346853",
    cash: "#346853",
    online: "#3b82f6",
    wallet: "#ef4444",
  };

  const paymentMethods = data.paymentMethods.map((pm) => ({
    name: pm.method.charAt(0).toUpperCase() + pm.method.slice(1).toLowerCase(),
    pct: Math.round(pm.percentage),
    amount: `$${pm.amount}`,
    color: pmColors[pm.method.toLowerCase()] || "#cccccc",
  }));

  const donutPcts = paymentMethods.map((p) => p.pct);
  const donutColors = paymentMethods.map((p) => p.color);

  const filterLabel =
    filterOptions.find((o) => o.value === filter)?.label || "All Time";

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 space-y-6">
      <FinanceHeader
        filter={filter}
        setFilter={setFilter}
        reportRef={pdfReportRef}
        restaurantName={data.restaurantName}
      />

      <div ref={reportRef} className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Revenue"
            value={`$${data.metrics.totalRevenue}`}
            trend={`↑ ${data.metrics.totalRevenueGrowth}`}
            icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            label="Net Profit"
            value={`$${data.metrics.netProfit}`}
            trend={`↑ ${data.metrics.netProfitGrowth}`}
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            label="Platform Fees"
            value={`$${data.metrics.platformFees}`}
            trend={data.metrics.platformFeesLabel}
            icon={<CreditCard className="w-4 h-4 text-amber-600" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            label="Avg Order Value"
            value={`$${data.metrics.avgOrderValue}`}
            trend={`↑ ${data.metrics.avgOrderValueGrowth}`}
            icon={<ShoppingCart className="w-4 h-4 text-purple-600" />}
            iconBg="bg-purple-50"
          />
        </div>

        {/* Revenue Trend + Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Revenue Trend
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Daily revenue over selected period
              </p>
            </div>
            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#346853] rounded-full" />
                <span className="text-[11px] text-gray-500">
                  Current Period
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 bg-gray-300 rounded-full border-dashed"
                  style={{ borderTop: "1.5px dashed #ccc", height: 0 }}
                />
                <span className="text-[11px] text-gray-500">
                  Previous Period
                </span>
              </div>
            </div>
            <RevenueChart points={currentPoints} prevPoints={prevPoints} />
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">
              Payment Methods
            </h3>
            <div className="flex items-center justify-center mb-5">
              <DonutChart
                pcts={donutPcts}
                colors={donutColors}
                totalValue={`$${data.metrics.totalRevenue}`}
              />
            </div>
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-[13px] font-medium text-[#1a1a1a]">
                      {m.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] text-gray-400 w-8 text-right">
                      {m.pct}%
                    </span>
                    <span className="text-[13px] font-semibold text-[#1a1a1a] w-16 text-right">
                      {m.amount}
                    </span>
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
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Tax & Commissions
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Breakdown for this period
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  Tax Collected
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  ${data.metrics.taxCollected}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  Platform Commission
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  ${data.metrics.platformCommission}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  Payment Processing
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  ${data.metrics.paymentProcessing}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  Delivery Costs
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  ${data.metrics.deliveryCosts}
                </span>
              </div>
            </div>
            <div className="bg-[#e8f5ee] rounded-xl px-5 py-3.5 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-[#2d6a4f]">
                Net Earnings
              </span>
              <span className="text-[20px] font-black text-[#2d6a4f]">
                ${data.metrics.netProfit}
              </span>
            </div>
          </div>

          {/* Payouts */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                  Payouts
                </h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Transfers to your bank ending •••• 4242
                </p>
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
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Bank
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                    ETA
                  </span>
                </div>
                <div className="h-px bg-gray-100 mb-1" />

                {payouts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[1fr_80px_110px_60px_60px] gap-2 items-center px-1 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handlePayoutClick(p)}
                  >
                    <span className="text-[12px] font-medium text-[#1a1a1a]">
                      {p.date}
                    </span>
                    <span className="text-[12px] font-semibold text-[#1a1a1a]">
                      {p.amount}
                    </span>
                    <span className="text-[12px] text-gray-500">{p.bank}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.status === "In Transit" ? "bg-orange-100 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[11px] text-gray-400 text-right">
                      {p.eta || "–"}
                    </span>
                  </div>
                ))}
                {payouts.length === 0 && (
                  <div className="py-4 text-center text-[12px] text-gray-500">
                    No payouts found for this period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Transactions
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {data.transactions.items.length} of{" "}
                {data.transactions.totalCount}
              </p>
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
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Transaction
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Method
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Net Amount
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Fee
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Total
                </span>
              </div>
              <div className="h-px bg-gray-100 mb-2" />

              {/* Table Body */}
              {data.transactions.items.map((t) => (
                <div
                  key={t.orderId}
                  className="grid grid-cols-[1fr_80px_1.5fr_1fr_1fr_80px_1fr] gap-4 items-center px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleTransactionClick(t)}
                >
                  <span className="text-[13px] font-bold text-emerald-600">
                    {t.orderId}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded w-fit ${t.type === "Refund" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}
                  >
                    {t.type}
                  </span>
                  <span className="text-[13px] font-medium text-gray-600">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[13px] font-medium text-gray-600 capitalize">
                    {t.method}
                  </span>
                  <span
                    className={`text-[13px] font-bold text-right ${parseFloat(t.netAmount) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}
                  >
                    ${Math.abs(parseFloat(t.netAmount)).toFixed(2)}
                  </span>
                  <span className="text-[13px] font-medium text-gray-400 text-right">
                    {parseFloat(t.fee) < 0 ? "-" : ""}$
                    {Math.abs(parseFloat(t.fee)).toFixed(2)}
                  </span>
                  <span
                    className={`text-[14px] font-black text-right ${parseFloat(t.total) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}
                  >
                    {parseFloat(t.total) < 0 ? "-" : ""}$
                    {Math.abs(parseFloat(t.total)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-1 mt-5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#346853] text-white text-[12px] font-bold">
              {data.transactions.page}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* End report wrapper */}

      {/* Sheets */}
      <AllPayoutsSheet
        open={allPayoutsOpen}
        onOpenChange={setAllPayoutsOpen}
        payouts={payouts}
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

      <FinanceReportPDF
        data={data}
        pdfRef={pdfReportRef}
        filterLabel={filterLabel}
      />
    </div>
  );
};

export default PaymentsView;
