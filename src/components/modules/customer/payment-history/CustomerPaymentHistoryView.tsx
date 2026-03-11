"use client";

import { useState, useEffect } from "react";
import { PaymentHistorySkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";
import { PaymentHistoryHeader } from "./components/payment-history-header";
import { PaymentHistoryMetrics } from "./components/payment-history-metrics";
import { PaymentHistoryTable } from "./components/payment-history-table";

export default function CustomerPaymentHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tabs for transaction table
  const [activeTab, setActiveTab] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const { getProfile } =
          await import("@/app/actions/customer/userprofile");

        let filterParam = undefined;
        if (activeTab === "Cards") filterParam = "card";
        if (activeTab === "Cash") filterParam = "cod";

        const [ordersRes, profileRes] = await Promise.all([
          getAllOrders(filterParam),
          getProfile(),
        ]);

        if (ordersRes.success && ordersRes.data?.data) {
          if (Array.isArray(ordersRes.data.data.orders)) {
            setOrders(ordersRes.data.data.orders);
            setCurrentPage(1);
          }
          if (ordersRes.data.data.summary) {
            setSummary(ordersRes.data.data.summary);
          }
        }

        if (profileRes.success) {
          setUserProfile(profileRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeTab]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (loading && orders.length === 0) return <PaymentHistorySkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 xl:p-10 transition-all font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <PaymentHistoryHeader
          orders={orders}
          summary={summary}
          userEmail={userProfile?.email || ""}
          userName={`${userProfile?.name || ""} ${userProfile?.lastName || ""}`.trim()}
        />

        <PaymentHistoryMetrics summary={summary} />

        <PaymentHistoryTable
          orders={orders}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          userEmail={userProfile?.email || ""}
          userName={`${userProfile?.name || ""} ${userProfile?.lastName || ""}`.trim()}
        />
      </div>
    </div>
  );
}
