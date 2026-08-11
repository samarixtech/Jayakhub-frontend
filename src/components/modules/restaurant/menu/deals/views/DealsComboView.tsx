"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useDeals } from "../hooks/useDeals";
import { DealsStats } from "../components/DealsStats";
import { DealsFilters } from "../components/DealsFilters";
import { DealCard } from "../components/DealCard";
import { DealsTable } from "../components/DealsTable";
import { DealDetailsModal } from "../components/DealDetailsModal";

export default function DealsComboView() {
  const t = useTranslations("RestaurantDashboard.Deals");
  const {
    deals,
    isLoading,
    isDeleting,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    viewMode,
    setViewMode,
    openEditBuilder,
    openNewBuilder,
    deleteId,
    setDeleteId,
    confirmDelete,
    toggleStatus,
    stats,
  } = useDeals();

  const [selectedViewDealId, setSelectedViewDealId] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <DealsStats stats={stats} />

      <DealsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenBuilder={openNewBuilder}
      />

      {isLoading ? (
        <Card className="p-12 text-center rounded-2xl border border-gray-100 bg-white flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange mb-3" />
          <Typography className="text-sm font-bold text-gray-900">
            {t("comboView.fetching")}
          </Typography>
        </Card>
      ) : deals.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border-dashed border-gray-200 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <Typography className="text-base font-bold text-gray-900">
            {t("comboView.emptyTitle")}
          </Typography>
          <Typography className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            {t("comboView.emptyDescription")}
          </Typography>
          <Button
            onClick={openNewBuilder}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            {t("comboView.createFirst")}
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={openEditBuilder}
              onDelete={(id) => setDeleteId(id)}
              onToggleStatus={toggleStatus}
              onViewDetails={(id) => setSelectedViewDealId(id)}
            />
          ))}
        </div>
      ) : (
        <DealsTable
          deals={deals}
          onEdit={openEditBuilder}
          onDelete={(id) => setDeleteId(id)}
          onToggleStatus={toggleStatus}
          onViewDetails={(id) => setSelectedViewDealId(id)}
        />
      )}

      <DealDetailsModal
        dealId={selectedViewDealId}
        open={!!selectedViewDealId}
        onOpenChange={(open) => !open && setSelectedViewDealId(null)}
      />

      <DeleteConfirmationModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title={t("comboView.deleteModalTitle")}
        description={t("comboView.deleteModalDescription")}
      />
    </div>
  );
}
