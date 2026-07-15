"use client";

import { useState, useEffect } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import {
  addCategoryAction,
  getAllCategoriesAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export const useMenuCategories = () => {
  const t = useTranslations("RestaurantDashboard.Menu.Categories.toasts");
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { execute: fetchCategories, isPending: isLoading } = useServerAction(
    getAllCategoriesAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        if (data && Array.isArray(data)) {
          setCategories(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      },
    },
  );

  const { execute: addCategory, isPending: isAdding } = useServerAction(
    addCategoryAction,
    {
      onSuccess: () => {
        fetchCategories();
        resetCreate();
      },
    },
  );

  const { execute: updateCategory, isPending: isUpdating } = useServerAction(
    updateCategoryAction,
    {
      onSuccess: () => {
        fetchCategories();
        setEditingIndex(null);
      },
    },
  );

  const { execute: deleteCategory, isPending: isDeleting } = useServerAction(
    deleteCategoryAction,
    {
      onSuccess: () => {
        fetchCategories();
        setIsDeleteModalOpen(false);
      },
      onError: (err: any) =>
        toast.error(err.message || t("deleteFailed")),
    },
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateSubmit = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory({ categoryName: newCategoryName });
  };

  const handleEditSubmit = async (index: number) => {
    if (!editCategoryName.trim()) return;
    const category = categories[index];
    const categoryId = category.id || category._id;
    if (!categoryId) return;

    await updateCategory({
      id: categoryId,
      categoryName: editCategoryName,
    });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteCategory(deleteId);
  };

  const resetCreate = () => {
    setIsCreating(false);
    setNewCategoryName("");
  };

  const startEdit = (index: number, name: string) => {
    setEditingIndex(index);
    setEditCategoryName(name);
  };

  const handleDeleteClick = (category: any) => {
    const categoryId = category.id || category._id;
    if (!categoryId) return;
    setDeleteId(categoryId);
    setDeleteName(category.categoryName || category.name);
    setIsDeleteModalOpen(true);
  };

  return {
    categories,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    isCreating,
    setIsCreating,
    newCategoryName,
    setNewCategoryName,
    editingIndex,
    setEditingIndex,
    editCategoryName,
    setEditCategoryName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteName,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteClick,
    confirmDelete,
    resetCreate,
    startEdit,
  };
};
