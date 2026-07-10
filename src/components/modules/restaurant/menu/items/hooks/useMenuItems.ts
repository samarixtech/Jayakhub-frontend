"use client";
import { useState, useEffect, useCallback } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { usePagination } from "@/hooks/usePagination";
import {
  getMenuItemsAction,
  deleteMenuItemAction,
  updateMenuItemStatusAction,
  getMenuStatsAction,
} from "@/app/actions/restaurant/menu";

export const useMenuItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<
    { name: string; count: number }[]
  >([]);
  const [menuStats, setMenuStats] = useState({
    totalItems: 0,
    active: 0,
    inactive: 0,
    categories: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFrontendPaginated, setIsFrontendPaginated] = useState(true);

  const {
    page,
    limit,
    totalPages,
    totalCount,
    handlePageChange,
    updatePaginationMeta,
  } = usePagination({ initialLimit: 10 });

  const { execute: fetchMenuAction, isPending } = useServerAction(
    getMenuItemsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any, meta?: any) => {
        let itemsData = [] as any[];

        if (data && Array.isArray(data)) {
          itemsData = data;
        } else if (data && data.items && Array.isArray(data.items)) {
          itemsData = data.items;
        } else if (data && data.data && Array.isArray(data.data)) {
          itemsData = data.data;
        }

        setItems(itemsData);

        if (data && data.categoryType && Array.isArray(data.categoryType)) {
          setCategoryStats(data.categoryType);
        } else if (
          data &&
          data.data &&
          data.data.categoryType &&
          Array.isArray(data.data.categoryType)
        ) {
          setCategoryStats(data.data.categoryType);
        }

        if (meta && meta.totalPages) {
          setIsFrontendPaginated(false);
          updatePaginationMeta(meta);
        } else {
          setIsFrontendPaginated(true);
          updatePaginationMeta({
            page,
            limit: 10,
            totalCount: itemsData.length,
            totalPages: Math.ceil(itemsData.length / 10),
          });
        }
      },
    },
  );

  const fetchMenu = useCallback(() => {
    fetchMenuAction({
      page,
      limit,
      search: searchQuery,
      category: selectedCategory,
    });
  }, [fetchMenuAction, page, limit, searchQuery, selectedCategory]);

  const { execute: fetchMenuStatsAction } = useServerAction(getMenuStatsAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      setMenuStats({
        totalItems: data?.totalItems ?? 0,
        active: data?.active ?? 0,
        inactive: data?.inactive ?? 0,
        categories: data?.categories ?? 0,
      });
    },
  });

  const fetchMenuStats = useCallback(() => {
    fetchMenuStatsAction();
  }, [fetchMenuStatsAction]);

  // Debounce effect to auto-fetch menu upon query change or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMenu]);

  // Stats reflect the whole menu, not just the current page/filter — fetch
  // once on mount and refresh whenever an item/status mutation could change them.
  useEffect(() => {
    fetchMenuStats();
  }, []);

  // Always reset to page 1 whenever search filter altered
  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  }, [searchQuery, selectedCategory]);

  const { execute: deleteItem, isPending: isDeleting } = useServerAction(
    deleteMenuItemAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchMenu();
        fetchMenuStats();
      },
    },
  );

  const { execute: updateStatus, isPending: isUpdatingStatus } =
    useServerAction(updateMenuItemStatusAction, {
      onSuccess: () => {
        fetchMenu();
        fetchMenuStats();
      },
    });

  const confirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
    }
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, isAvailable: !currentStatus });
  };

  const dynamicFilters = [
    {
      label: "All Items",
      count: totalCount > items.length ? totalCount : items.length,
    },
    ...categoryStats.map((cat) => ({
      label: cat.name,
      count: cat.count,
    })),
  ];

  const statsList = [
    { label: "Total Items", value: menuStats.totalItems },
    { label: "Active", value: menuStats.active },
    { label: "Inactive", value: menuStats.inactive },
    { label: "Categories", value: menuStats.categories },
  ];

  const categories = categoryStats.map((c) => c.name);

  // Frontend filtering logic fallback if backend isn't paginating and searching yet
  const postProcessedItems = isFrontendPaginated
    ? items.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "All Items" ||
          item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : items;

  const finalPaginatedItems = isFrontendPaginated
    ? postProcessedItems.slice((page - 1) * limit, page * limit)
    : items;

  useEffect(() => {
    if (isFrontendPaginated) {
      updatePaginationMeta({
        page: 1,
        limit,
        totalCount: postProcessedItems.length,
        totalPages: Math.ceil(postProcessedItems.length / limit),
      });
    }
  }, [searchQuery, selectedCategory, items.length, isFrontendPaginated, limit]);

  return {
    items,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    deleteId,
    setDeleteId,
    isAddModalOpen,
    setIsAddModalOpen,
    isPending,
    isDeleting,
    isUpdatingStatus,
    fetchMenu,
    fetchMenuStats,
    confirmDelete,
    toggleStatus,
    filteredItems: finalPaginatedItems,
    dynamicFilters,
    stats: statsList,
    page,
    totalPages,
    totalCount,
    handlePageChange,
  };
};
