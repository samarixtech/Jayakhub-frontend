"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DollarSign, TrendingUp, CreditCard, ShoppingCart } from "lucide-react";

import FinanceHeader from "../components/FinanceHeader";
import { FinanceSkeleton } from "@/components/skeletons/FinanceSkeleton";
import AllPayoutsSheet from "../components/AllPayoutsSheet";
import PayoutDetailSheet from "../components/PayoutDetailSheet";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import DonutChart from "../components/DonutChart";
import { useFinanceOverview } from "../hooks/useFinanceOverview";
import TransactionsTable from "../tables/TransactionsTable";
import { useCLC } from "@/context/CLCContext";
import { useRouter, useParams } from "next/navigation";

/* ──────────────── Types ──────────────── */
export interface Payout {
  id: string;
  amount: string;
  status: "approved" | "rejected" | "pending";
  requestType: string;
  stripeTransferId: string | null;
  processedAt: string;
  createdAt: string;
}

const formatPayoutDate = (isoStr: string) => {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatChartLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* ──────────────── Main Component ──────────────── */
const PaymentsView = () => {
  const tStats = useTranslations("RestaurantDashboard.Payments.stats");
  const tTrend = useTranslations("RestaurantDashboard.Payments.revenueTrend");
  const tMethods = useTranslations("RestaurantDashboard.Payments.paymentMethods");
  const tTax = useTranslations("RestaurantDashboard.Payments.taxCommissions");
  const tPayouts = useTranslations("RestaurantDashboard.Payments.payouts");
  const { formatPrice } = useCLC();
  const router = useRouter();
  const params = useParams();
  const { data, loading, error } = useFinanceOverview();

  const [allPayoutsOpen, setAllPayoutsOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [payoutDetailOpen, setPayoutDetailOpen] = useState(false);

  const payouts: Payout[] = data?.payouts || [];

  if (loading) return <FinanceSkeleton />;

  if (error || !data) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-red-500">
        <p>Failed to load finance data.</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  const handlePayoutClick = (p: Payout) => {
    setAllPayoutsOpen(false);
    setSelectedPayout(p);
    setTimeout(() => setPayoutDetailOpen(true), 150);
  };

  const revenueTrend = data.revenueTrend || [];
  const currentPoints = revenueTrend.map((d) => d.revenue);
  const chartLabels = revenueTrend.map((d) => formatChartLabel(d.date));
  const prevPoints = currentPoints.map((v) => v * 0.8);

  const pmColors: Record<string, string> = {
    card: "#f5a623",
    cod: "#346853",
    cash: "#346853",
    online: "#3b82f6",
    wallet: "#ef4444",
  };

  const paymentMethods = (data.paymentMethods || []).map((pm) => ({
    name: pm.method.toUpperCase(),
    pct: Math.round(pm.percentage),
    amount: formatPrice(pm.amount),
    color: pmColors[pm.method.toLowerCase()] || "#cccccc",
  }));

  const donutPcts = paymentMethods.map((p) => p.pct);
  const donutColors = paymentMethods.map((p) => p.color);

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 space-y-6">
      <FinanceHeader restaurantName={data.restaurantName} />

      <div className="space-y-6">
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
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">{tTrend("title")}</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">{tTrend("subtitle")}</p>
            </div>
            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#346853] rounded-full" />
                <span className="text-[11px] text-gray-500">{tTrend("currentPeriod")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-gray-300 rounded-full" />
                <span className="text-[11px] text-gray-500">{tTrend("previousPeriod")}</span>
              </div>
            </div>
            <RevenueChart points={currentPoints} prevPoints={prevPoints} labels={chartLabels} />
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-5">{tMethods("title")}</h3>
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
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">{tTax("title")}</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">{tTax("subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">{tTax("platformCommission")}</span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.breakdown?.totalCommission ?? "0")}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">{tTax("deliveryCosts")}</span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.breakdown?.totalDeliveryFees ?? "0")}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">{tTax("totalWithdrawals")}</span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.breakdown?.totalWithdrawals ?? "0")}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">{tTax("requestedWithdrawals")}</span>
                <span className="text-[20px] font-black text-[#1a1a1a]">
                  {formatPrice(data.breakdown?.requestedWithdrawals ?? "0")}
                </span>
              </div>
            </div>
            <div className="bg-[#e8f5ee] rounded-xl px-5 py-3.5 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-[#2d6a4f]">{tTax("netEarnings")}</span>
              <span className="text-[20px] font-black text-[#2d6a4f]">
                {formatPrice(data.netEarnings ?? data.metrics.netProfit)}
              </span>
            </div>
          </div>

          {/* Payouts */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">{tPayouts("title")}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">{tPayouts("subtitle")}</p>
              </div>
              <button
                onClick={() => router.push(`/${params.country}/${params.language}/restaurant/payouts`)}
                className="text-[12px] font-semibold text-[#346853] hover:text-[#2a5644] transition-colors"
              >
                {tPayouts("viewAllBtn")}
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <div className="grid grid-cols-4 gap-2 items-center px-1 mb-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{tPayouts("payoutId") || "Payout ID"}</span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{tPayouts("date")}</span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">{tPayouts("amount")}</span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">{tPayouts("status")}</span>
                </div>
                <div className="h-px bg-gray-100 mb-1" />
                {payouts.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-4 gap-2 items-center px-1 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handlePayoutClick(p)}
                  >
                    <span className="text-[12px] font-bold text-emerald-700 truncate">{p.id}</span>
                    <span className="text-[12px] text-gray-500">{formatPayoutDate(p.processedAt || p.createdAt)}</span>
                    <span className="text-[12px] font-semibold text-[#1a1a1a] text-right">{p.amount}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-right ml-auto w-fit ${
                      p.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                      p.status === "rejected" ? "bg-red-50 text-red-500" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
                {payouts.length === 0 && (
                  <div className="py-4 text-center text-[12px] text-gray-500">{tPayouts("noPayouts")}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable />
      </div>

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
    </div>
  );
};

export default PaymentsView;
