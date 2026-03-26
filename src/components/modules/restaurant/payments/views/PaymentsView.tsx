"use client";

import { useState, useRef } from "react";
import { getFilterOptions } from "../constants";
import { useTranslations } from "next-intl";

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
import { useCLC } from "@/context/CLCContext";
import { formatOrderDateTime } from "@/lib/utils/date";

function isoToOrderDateTime(isoStr: string): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(d).toLowerCase();
  return formatOrderDateTime(`${day}/${month}/${year}`, time);
}

/* ──────────────── Types ──────────────── */
export interface Payout {
  id: string;
  date: string;
  amount: string;
  bank: string;
  status: "In Transit" | "Paid";
  eta?: string;
}

/* ──────────────── Main Component ──────────────── */
const PaymentsView = () => {
  const tStats = useTranslations("RestaurantDashboard.Payments.stats");
  const tTrend = useTranslations("RestaurantDashboard.Payments.revenueTrend");
  const tMethods = useTranslations(
    "RestaurantDashboard.Payments.paymentMethods",
  );
  const tTax = useTranslations("RestaurantDashboard.Payments.taxCommissions");
  const tPayouts = useTranslations("RestaurantDashboard.Payments.payouts");
  const tTransactions = useTranslations(
    "RestaurantDashboard.Payments.transactions",
  );
  const tHeader = useTranslations("RestaurantDashboard.Payments.header");
  const filterOptions = getFilterOptions(tHeader);

  const { formatPrice } = useCLC();
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
    const formatted = isoToOrderDateTime(t.date);
    const [datePart, timePart] = formatted.split(" • ");

    setSelectedTransaction({
      id: t.orderId,
      type: t.type,
      date: datePart ?? formatted,
      time: timePart ?? "",
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
    amount: formatPrice(pm.amount),
    color: pmColors[pm.method.toLowerCase()] || "#cccccc",
  }));

  const donutPcts = paymentMethods.map((p) => p.pct);
  const donutColors = paymentMethods.map((p) => p.color);

  const filterLabel =
    filterOptions.find((o) => o.value === filter)?.label ||
    tHeader("filterAllTime");

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
            label={tStats("totalRevenue")}
            value={formatPrice(data.metrics.totalRevenue)}
            trend={`↑ ${data.metrics.totalRevenueGrowth}`}
            icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            label={tStats("netProfit")}
            value={formatPrice(data.metrics.netProfit)}
            trend={`↑ ${data.metrics.netProfitGrowth}`}
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            label={tStats("platformFees")}
            value={formatPrice(data.metrics.platformFees)}
            trend={data.metrics.platformFeesLabel}
            icon={<CreditCard className="w-4 h-4 text-amber-600" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            label={tStats("avgOrderValue")}
            value={formatPrice(data.metrics.avgOrderValue)}
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
                {tTrend("title")}
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {tTrend("subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#346853] rounded-full" />
                <span className="text-[11px] text-gray-500">
                  {tTrend("currentPeriod")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 bg-gray-300 rounded-full border-dashed"
                  style={{ borderTop: "1.5px dashed #ccc", height: 0 }}
                />
                <span className="text-[11px] text-gray-500">
                  {tTrend("previousPeriod")}
                </span>
              </div>
            </div>
            <RevenueChart points={currentPoints} prevPoints={prevPoints} />
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">
              {tMethods("title")}
            </h3>
            <div className="flex items-center justify-center mb-5">
              <DonutChart
                pcts={donutPcts}
                colors={donutColors}
                totalValue={formatPrice(data.metrics.totalRevenue)}
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
                {tTax("title")}
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {tTax("subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  {tTax("taxCollected")}
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.metrics.taxCollected)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  {tTax("platformCommission")}
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.metrics.platformCommission)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  {tTax("paymentProcessing")}
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.metrics.paymentProcessing)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">
                  {tTax("deliveryCosts")}
                </span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.metrics.deliveryCosts)}
                </span>
              </div>
            </div>
            <div className="bg-[#e8f5ee] rounded-xl px-5 py-3.5 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-[#2d6a4f]">
                {tTax("netEarnings")}
              </span>
              <span className="text-[20px] font-black text-[#2d6a4f]">
                {formatPrice(data.metrics.netProfit)}
              </span>
            </div>
          </div>

          {/* Payouts */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                  {tPayouts("title")}
                </h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {tPayouts("subtitle")}
                </p>
              </div>
              <button
                onClick={() => setAllPayoutsOpen(true)}
                className="text-[12px] font-semibold text-[#346853] hover:text-[#2a5644] transition-colors"
              >
                {tPayouts("viewAllBtn")}
              </button>
            </div>

            {/* Table Header */}
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <div className="grid grid-cols-[1fr_80px_110px_60px_60px] gap-2 items-center px-1 mb-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {tPayouts("date")}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {tPayouts("amount")}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {tPayouts("bank")}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {tPayouts("status")}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                    {tPayouts("eta")}
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
                    {tPayouts("noPayouts")}
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
                {tTransactions("title")}
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {tTransactions("countSubtitle", {
                  count: data.transactions.items.length,
                  total: data.transactions.totalCount,
                })}
              </p>
            </div>
            <button className="text-[12px] font-semibold text-[#346853] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              {tTransactions("allTypesBtn")}
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_80px_1.5fr_1fr_1fr_80px_1fr] gap-4 items-center px-4 mb-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("transaction")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("type")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("date")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("method")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("netAmount")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("fee")}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("total")}
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
                    {isoToOrderDateTime(t.date)}
                  </span>
                  <span className="text-[13px] font-medium text-gray-600 capitalize">
                    {t.method}
                  </span>
                  <span
                    className={`text-[13px] font-bold text-right ${parseFloat(t.netAmount) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}
                  >
                    {formatPrice(parseFloat(t.netAmount))}
                  </span>
                  <span className="text-[13px] font-medium text-gray-400 text-right">
                    {formatPrice(parseFloat(t.fee))}
                  </span>
                  <span
                    className={`text-[14px] font-black text-right ${parseFloat(t.total) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}
                  >
                    {formatPrice(parseFloat(t.total))}
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
