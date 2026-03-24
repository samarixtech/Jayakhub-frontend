"use client";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuCategories } from "../hooks/useMenuCategories";
import { GlobalModal } from "@/components/common/GlobalModal";
import { CategoryStats } from "../components/CategoryStats";
import { AddCategoryCard } from "../components/AddCategoryCard";
import { CategoryCard } from "../components/CategoryCard";

export default function MenuCategoriesView() {
  const {
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
  } = useMenuCategories();

  const t = useTranslations("RestaurantDashboard.Menu.Categories.deleteModal");

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      <CategoryStats count={categories.length} isLoading={isLoading} />

      <div className="w-full">
        <AddCategoryCard
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onConfirm={handleCreateSubmit}
          onCancel={resetCreate}
          isSaving={isAdding}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          : categories.map((category, index) => (
              <CategoryCard
                key={category.id || category._id || index}
                category={category}
                isEditing={editingIndex === index}
                editValue={editCategoryName}
                onEditChange={setEditCategoryName}
                onStartEdit={() =>
                  startEdit(index, category.categoryName || category.name)
                }
                onCancelEdit={() => setEditingIndex(null)}
                onSaveEdit={() => handleEditSubmit(index)}
                onDelete={() => handleDeleteClick(category)}
                isUpdating={isUpdating}
              />
            ))}
      </div>

      <GlobalModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={t("title")}
        description={t("description", { name: deleteName })}
        trigger={null}
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? t("deleting") : t("deleteBtn")}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
}
