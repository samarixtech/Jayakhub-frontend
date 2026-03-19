"use client";

import { useState, useEffect, useCallback } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { usePagination } from "@/hooks/usePagination";
import {
  getMenuItemsAction,
  getAllCategoriesAction,
  deleteMenuItemAction,
  updateMenuItemStatusAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";

export const useMenuItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFrontendPaginated, setIsFrontendPaginated] = useState(true);

  const { page, limit, totalPages, totalCount, handlePageChange, updatePaginationMeta } = usePagination({ initialLimit: 10 });

  const { execute: fetchCategories } = useServerAction(getAllCategoriesAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      const categoriesData = data && data.data ? data.data : data;
      if (Array.isArray(categoriesData)) {
        const categoryNames = categoriesData
          .map((cat: any) => cat.categoryName || cat.name)
          .filter(Boolean);
        setCategories(categoryNames);
      }
    },
  });

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

        if (meta && meta.totalPages) {
          setIsFrontendPaginated(false);
          updatePaginationMeta(meta);
        } else {
          setIsFrontendPaginated(true);
          updatePaginationMeta({
            page, // preserve current page state for frontend view
            limit: 10,
            totalCount: itemsData.length,
            totalPages: Math.ceil(itemsData.length / 10)
          });
        }
      },
    },
  );

  const fetchMenu = useCallback(() => {
    fetchMenuAction({ page, limit, search: searchQuery, category: selectedCategory });
  }, [fetchMenuAction, page, limit, searchQuery, selectedCategory]);

  // Debounce effect to auto-fetch menu upon query change or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMenu]);

  // Always reset to page 1 whenever search filters are actively altered
  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  // Baseline data fetch for supporting category modules organically 
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const { execute: deleteItem, isPending: isDeleting } = useServerAction(
    deleteMenuItemAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchMenu();
        toast.success("Item deleted successfully");
      },
      onError: (err) => toast.error(err || "Failed to delete item"),
    },
  );

  const { execute: updateStatus, isPending: isUpdatingStatus } = useServerAction(
    updateMenuItemStatusAction,
    {
      onSuccess: () => {
        fetchMenu();
      },
      onError: (err) => toast.error(err || "Failed to update status"),
    },
  );

  const confirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
    }
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, isAvailable: !currentStatus });
  };

  const dynamicFilters = [
    { label: "All Items", count: totalCount > items.length ? totalCount : items.length },
    ...categories.map((cat) => ({
      label: cat,
      count: isFrontendPaginated ? items.filter((i) => i.category === cat).length : 0, 
    })),
  ];

  const statsList = [
    { label: "Total Items", value: totalCount || items.length },
    { label: "Active", value: (isFrontendPaginated ? items : items).filter((i) => i.isAvailable).length },
    { label: "Inactive", value: (isFrontendPaginated ? items : items).filter((i) => !i.isAvailable).length },
    { label: "Categories", value: categories.length },
  ];

  // Frontend filtering logic fallback if backend isn't paginating and searching yet
  const postProcessedItems = isFrontendPaginated 
    ? items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Items" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : items;

  const finalPaginatedItems = isFrontendPaginated 
    ? postProcessedItems.slice((page - 1) * limit, page * limit)
    : items;

  // React to front-end filter bounds exclusively
  useEffect(() => {
    if (isFrontendPaginated) {
      updatePaginationMeta({
        page: 1,
        limit,
        totalCount: postProcessedItems.length,
        totalPages: Math.ceil(postProcessedItems.length / limit)
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
    confirmDelete,
    toggleStatus,
    filteredItems: finalPaginatedItems,
    dynamicFilters,
    stats: statsList,
    page,
    totalPages,
    handlePageChange
  };
};
