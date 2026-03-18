"use client";

import { useState, useEffect } from "react";
import { PaymentHistorySkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";
import { PaymentHistoryHeader } from "./components/payment-history-header";
import { PaymentHistoryMetrics } from "./components/payment-history-metrics";
import { PaymentHistoryTable } from "./components/payment-history-table";
import { usePagination } from "@/hooks/usePagination";

export default function CustomerPaymentHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tabs for transaction table
  const [activeTab, setActiveTab] = useState("All");

  // Pagination State
  const { page, limit, totalPages, totalCount, handlePageChange, handleLimitChange, updatePaginationMeta } = usePagination({ initialLimit: 10 });

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
          getAllOrders(page, limit, filterParam),
          getProfile(),
        ]);

        if (ordersRes.success && ordersRes.data) {
          if (Array.isArray(ordersRes.data)) {
            setOrders(ordersRes.data);
          }
          // The API structure for summary in getAllOrders changed to response.data.summary?
          // Wait, 'getAllOrders' returns { success: true, data: response.data.data, meta: response.data.meta }
          // The summary might be outside of the orders array. In the API response provided:
          // data: { summary: {...}, orders: [...] }
          // So if getAllOrders returns data = API.data 
          // Then data is { summary: {...}, orders: [...] }
          // wait, the previous code for CustomerOrderHistoryView checked responseData?.data?.orders or responseData?.orders.
          // Let's assume ordersRes.data has orders and summary.
          if (ordersRes.data.orders && Array.isArray(ordersRes.data.orders)) {
            setOrders(ordersRes.data.orders);
          }
          if (ordersRes.data.summary) {
            setSummary(ordersRes.data.summary);
          }
          
          if (ordersRes.meta) {
            updatePaginationMeta(ordersRes.meta);
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
  }, [activeTab, page, limit]);

  const startIndex = (page - 1) * limit;

  if (loading && orders.length === 0) return <PaymentHistorySkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-4 md:p-6 transition-all font-sans">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
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
          currentPage={page}
          setCurrentPage={handlePageChange}
          totalPages={totalPages}
          totalCount={totalCount}
          startIndex={startIndex}
          itemsPerPage={limit}
          userEmail={userProfile?.email || ""}
          userName={`${userProfile?.name || ""} ${userProfile?.lastName || ""}`.trim()}
        />
      </div>
    </div>
  );
}
