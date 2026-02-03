"use client";

import React, { useState, useEffect } from "react";
import { Shapes, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerAction } from "@/hooks/use-server-action";
import {
  addCategoryAction,
  getAllCategoriesAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";
import { GlobalModal } from "@/components/common/GlobalModal";

export default function MenuCategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  // Legacy state - might be useful if categoryDocId is needed elsewhere, but seems unused now
  const [categoryDocId, setCategoryDocId] = useState<string | null>(null);

  // Create State
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Edit State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Actions
  const { execute: fetchCategories, isPending: isLoading } = useServerAction(
    getAllCategoriesAction,
    {
      onSuccess: (data: any) => {
        console.log("Categories Data Debug:", data);
        if (data && Array.isArray(data)) {
          // New API response: data is the array of categories
          setCategories(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          // Handle potential wrapper
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
      onSuccess: (data) => {
        toast.success("Category created");
        fetchCategories();
        resetCreate();
      },
      onError: (err) => console.error(err),
    },
  );

  const { execute: updateCategory, isPending: isUpdating } = useServerAction(
    updateCategoryAction,
    {
      onSuccess: (data) => {
        toast.success("Category updated");
        fetchCategories();
        setEditingIndex(null);
      },
      onError: (err) => console.error(err),
    },
  );

  const { execute: deleteCategory, isPending: isDeleting } = useServerAction(
    deleteCategoryAction,
    {
      onSuccess: (data) => {
        toast.success("Category deleted");
        fetchCategories();
        setIsDeleteModalOpen(false); // Close modal on success
      },
      onError: (err: any) =>
        toast.error(err.message || "Failed to delete category"),
    },
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handlers
  const handleCreateSubmit = async () => {
    if (!newCategoryName.trim()) return;

    // Create new document regardless of existing categories
    await addCategory({
      categoryName: newCategoryName,
    });
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

  const handleDeleteClick = (category: any) => {
    const categoryId = category.id || category._id;
    if (!categoryId) return;

    setDeleteId(categoryId);
    setDeleteName(category.categoryName || category.name);
    setIsDeleteModalOpen(true);
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      {/* Header Stats Section */}
      <div className="bg-[#E2F1E8] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#1F4D36]">
            <Shapes className="w-6 h-6" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-lg font-bold text-gray-900 mb-1"
            >
              Organize Your Menu
            </Typography>
            <Typography className="text-sm text-gray-600 max-w-md">
              Create categories to group your menu items.
            </Typography>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-16 w-24 rounded-xl" />
            <Skeleton className="h-16 w-24 rounded-xl" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
              <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
                {categories.length}
              </Typography>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Categories
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Create New Category Button / Form */}
      <div className="w-full">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#1F4D36] group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F4D36] group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-gray-500 font-medium group-hover:text-[#1F4D36]">
              Create New Category
            </span>
          </Button>
        ) : (
          <div className="w-full border-2 border-dashed border-[#1F4D36] rounded-2xl p-6 bg-gray-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Typography className="font-semibold text-center text-gray-700">
                Add New Category
              </Typography>
              <Input
                placeholder="e.g. Appetizers"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="bg-white"
                onKeyDown={(e) => e.key === "Enter" && handleCreateSubmit()}
              />
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleCreateSubmit}
                  disabled={isAdding || isUpdating || !newCategoryName}
                  className="bg-[#1F4D36] text-white"
                >
                  {isAdding || isUpdating ? "Saving..." : "Create Category"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetCreate}
                  disabled={isAdding || isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          : categories.map((category, index) => (
              <Card
                key={index}
                className="px-3 py-4 flex items-center justify-between border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="h-9"
                    />
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-[#1F4D36] shrink-0"
                      onClick={() => handleEditSubmit(index)}
                      disabled={isUpdating}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 shrink-0"
                      onClick={() => setEditingIndex(null)}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E2F1E8] rounded-lg flex items-center justify-center text-[#1F4D36] shrink-0">
                        <Shapes className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <Typography className="font-bold text-gray-900 leading-tight truncate">
                          {category.categoryName || category.name}
                        </Typography>
                        <Typography className="text-xs text-gray-400 font-medium mt-0.5">
                          0 items
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          startEdit(
                            index,
                            category.categoryName || category.name,
                          )
                        }
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        disabled={isUpdating}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(category)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        disabled={isUpdating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
      </div>

      <GlobalModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        trigger={null} // Controlled modal
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
}
