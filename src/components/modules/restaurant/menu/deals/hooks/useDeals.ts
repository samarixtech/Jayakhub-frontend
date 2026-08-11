"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useServerAction } from "@/hooks/use-server-action";
import { getDealsAction, deleteDealAction, getDealStatsAction } from "@/app/actions/restaurant/menu";
import { DealCombo, DealItemSelection } from "../types/deals";
import { DealsStatsData } from "../components/DealsStats";

export function useDeals() {
  const router = useRouter();
  const t = useTranslations("RestaurantDashboard.Deals");
  const [deals, setDeals] = useState<DealCombo[]>([]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statsApiData, setStatsApiData] = useState<DealsStatsData | null>(null);

  const { execute: fetchStats } = useServerAction(getDealStatsAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      if (data) {
        setStatsApiData(data);
      }
    },
  });

  const { execute: executeDelete, isPending: isDeleting } = useServerAction(
    deleteDealAction,
    {
      onSuccess: () => {
        fetchDeals({
          search: searchQuery,
          dealType: typeFilter === "all" ? "" : typeFilter,
          status: statusFilter === "all" ? "" : statusFilter,
          limit: 50,
        });
        fetchStats();
        setDeleteId(null);
      },
    },
  );

  const { execute: fetchDeals, isPending: isLoading } = useServerAction(
    getDealsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        let rawDeals: any[] = [];
        if (Array.isArray(data)) {
          rawDeals = data;
        } else if (data?.data && Array.isArray(data.data)) {
          rawDeals = data.data;
        } else if (data?.items && Array.isArray(data.items)) {
          rawDeals = data.items;
        }

        if (rawDeals.length >= 0) {
          const normalized: DealCombo[] = rawDeals.map((deal: any) => {
            const items: DealItemSelection[] = (deal.items || []).map(
              (di: any) => ({
                itemId: di.itemId || di.item?.id || di.id,
                name: di.item?.name || di.name || t("common.itemFallback"),
                quantity: di.quantity || 1,
                unitPrice: Number(di.item?.basePrice || di.unitPrice || 0),
                category:
                  typeof di.item?.category === "string"
                    ? di.item?.category
                    : di.item?.category?.name || t("common.categoryFallback"),
                image: di.item?.image || "",
              }),
            );

            const origPrice = items.reduce(
              (sum, i) => sum + i.unitPrice * i.quantity,
              0,
            );
            const discountVal = Number(deal.discountValue || 0);
            const discType: "percentage" | "fixed" =
              deal.discountType === "percentage" ? "percentage" : "fixed";

            const discAmt =
              discType === "fixed"
                ? discountVal
                : origPrice > 0
                  ? (origPrice * discountVal) / 100
                  : 0;

            const cbPrice = Math.max(0, origPrice - discAmt);

            const discPct =
              discType === "percentage"
                ? discountVal
                : origPrice > 0
                  ? Math.round((discAmt / origPrice) * 100)
                  : 0;

            const now = new Date();
            const start = deal.startDate ? new Date(deal.startDate) : null;
            const end = deal.endDate ? new Date(deal.endDate) : null;

            let computedStatus: DealCombo["status"] = deal.isActive
              ? "active"
              : "inactive";
            if (deal.isActive && start && start > now) {
              computedStatus = "scheduled";
            } else if (end && end < now) {
              computedStatus = "expired";
            }

            const startFormatted = start
              ? start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "";
            const endFormatted = end
              ? end.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "";
            const schedStr =
              startFormatted && endFormatted
                ? `${startFormatted} - ${endFormatted}`
                : t("common.activeDealSchedule");

            return {
              id: deal.id || `deal-${Math.random()}`,
              title: deal.title || t("common.untitledDeal"),
              tagline:
                deal.description ||
                items.map((i) => `${i.quantity}x ${i.name}`).join(" + ") ||
                t("common.promotionalOffer"),
              description: deal.description || "",
              dealType: deal.dealType || "combo",
              status: computedStatus,
              image: deal.image || "",
              items,
              originalPrice: origPrice,
              comboPrice: cbPrice,
              discountAmount: discAmt,
              discountPercentage: discPct,
              discountType: discType,
              schedule: schedStr,
              badge: deal.badge || "",
              startDate: deal.startDate || "",
              endDate: deal.endDate || "",
              createdAt: deal.createdAt || "",
            };
          });
          setDeals(normalized);
        }
      },
      onError: () => {
        setDeals([]);
      },
    },
  );

  useEffect(() => {
    fetchDeals({
      search: searchQuery,
      dealType: typeFilter === "all" ? "" : typeFilter,
      status: statusFilter === "all" ? "" : statusFilter,
      limit: 50,
    });
    fetchStats();
  }, [fetchDeals, fetchStats, searchQuery, typeFilter, statusFilter]);

  // Toggle deal active status
  const toggleStatus = (id: string) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === id) {
          const nextStatus = deal.status === "active" ? "inactive" : "active";
          return { ...deal, status: nextStatus };
        }
        return deal;
      }),
    );
  };

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || deal.status === statusFilter;

      const matchesType = typeFilter === "all" || deal.dealType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [deals, searchQuery, statusFilter, typeFilter]);

  // Statistics calculation (API stats preferred, client fallback)
  const stats: DealsStatsData = useMemo(() => {
    if (statsApiData) {
      return statsApiData;
    }

    const total = deals.length;
    const active = deals.filter((d) => d.status === "active").length;
    const scheduled = deals.filter((d) => d.status === "scheduled").length;

    const avgDiscount =
      deals.length > 0
        ? Math.round(
            deals.reduce((acc, d) => acc + d.discountPercentage, 0) /
              deals.length,
          )
        : 0;

    const topDeal = deals.find((d) => d.badge === "BESTSELLER") || deals[0];

    return {
      totalDeals: total,
      activeDeals: active,
      scheduledPromos: scheduled,
      avgComboSavings: avgDiscount,
      topPerformingDeal: topDeal ? { id: topDeal.id, title: topDeal.title } : null,
    };
  }, [statsApiData, deals]);

  // Open builder for edit page
  const openEditBuilder = (deal: DealCombo) => {
    router.push(`/restaurant/menu/deals/${deal.id}/edit`);
  };

  // Open builder for new page
  const openNewBuilder = () => {
    router.push(`/restaurant/menu/deals/new`);
  };

  // Duplicate deal
  const duplicateDeal = (deal: DealCombo) => {
    const duplicated: DealCombo = {
      ...deal,
      id: `deal-${Date.now()}`,
      title: `${deal.title} (Copy)`,
      status: "inactive",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDeals((prev) => [duplicated, ...prev]);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!deleteId) return;
    executeDelete(deleteId);
  };

  return {
    deals: filteredDeals,
    allDeals: deals,
    isLoading,
    isDeleting,
    refetchDeals: fetchDeals,
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
    duplicateDeal,
    deleteId,
    setDeleteId,
    confirmDelete,
    toggleStatus,
    stats,
  };
}
