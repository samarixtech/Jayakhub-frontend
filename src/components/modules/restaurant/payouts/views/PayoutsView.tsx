"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import PayoutsStats from "../components/PayoutsStats";
import PayoutsTable from "../components/PayoutsTable";
import RequestPayoutModal from "../components/RequestPayoutModal";
import { usePayouts } from "../hooks/usePayouts";
import GlobalDateFilter from "@/components/modules/restaurant/layout/GlobalDateFilter";
import { useExport } from "@/utils/use-export";
import { useDateFilter } from "@/components/providers/DateFilterProvider";
import { usePlanAccess } from "@/hooks/use-plan-access";

const PayoutsView = () => {
  const t = useTranslations("RestaurantDashboard.Payouts");
  const { startDate, endDate } = useDateFilter();
  const { can } = usePlanAccess();
  const { isExporting, handleExport } = useExport({
    successMessage: "Payouts exported successfully!",
    errorMessage: "Failed to export payouts.",
  });
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

  const onExport = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `Payouts_${dateStr}.csv`;
    handleExport("payout/history/export", filename, {
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Page header with date filter + export */}
      <div className="flex justify-end items-center gap-3 pt-1">
        <GlobalDateFilter />
        <Button
          variant="outline"
          className="bg-[#346853] text-white hover:bg-[#2a5644] hover:text-white border-0 h-9 text-[13px]"
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <Download className="mr-2 w-4 h-4" />
          )}
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

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
          {can("instant_payouts") && (
            <Button
              onClick={() => setIsRequestModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              {t("requestBtn")}
            </Button>
          )}
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
