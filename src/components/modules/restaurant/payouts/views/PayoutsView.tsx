"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import PayoutsStats from "../components/PayoutsStats";
import PayoutsTable from "../components/PayoutsTable";
import RequestPayoutModal from "../components/RequestPayoutModal";
import { usePayouts } from "../hooks/usePayouts";

const PayoutsView = () => {
  const t = useTranslations("RestaurantDashboard.Payouts");
  const {
    stats,
    payouts,
    loading,
    isSubmitting,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    isRequestModalOpen,
    setIsRequestModalOpen,
    handlePayoutRequest,
  } = usePayouts();

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <PayoutsStats stats={stats} loading={loading} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{t("table.title")}</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                {totalCount} {t("table.recordsLabel")}
              </p>
            )}
          </div>
          <Button
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            {t("requestBtn")}
          </Button>
        </div>

        <PayoutsTable
          data={payouts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>

      <RequestPayoutModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handlePayoutRequest}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PayoutsView;
