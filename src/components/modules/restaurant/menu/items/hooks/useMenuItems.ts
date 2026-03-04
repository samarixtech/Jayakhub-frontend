"use client";

import { useState, useEffect } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getMenuItemsAction,
  getAllCategoriesAction,
  deleteMenuItemAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";

export const useMenuItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const { execute: fetchMenu, isPending } = useServerAction(
    getMenuItemsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data) => {
        if (data && Array.isArray(data)) {
          setItems(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      },
    },
  );

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

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const confirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Items" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const dynamicFilters = [
    { label: "All Items", count: items.length },
    ...categories.map((cat) => ({
      label: cat,
      count: items.filter((i) => i.category === cat).length,
    })),
  ];

  const stats = [
    { label: "Total Items", value: items.length },
    { label: "Active", value: items.filter((i) => i.isAvailable).length },
    { label: "Inactive", value: items.filter((i) => !i.isAvailable).length },
    { label: "Categories", value: categories.length },
  ];

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
    fetchMenu,
    confirmDelete,
    filteredItems,
    dynamicFilters,
    stats,
  };
};
