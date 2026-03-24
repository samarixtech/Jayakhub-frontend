"use client";
import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuVariants } from "../hooks/useMenuVariants";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { VariantsHeader } from "../components/VariantsHeader";
import { VariantGroupForm } from "../components/VariantGroupForm";
import { VariantGroupCard } from "../components/VariantGroupCard";

export default function MenuVariantsView() {
  const {
    variants,
    isCreating,
    setIsCreating,
    editingId,
    groupName,
    setGroupName,
    options,
    isLoadingVariants,
    isCreatingVariant,
    isUpdatingVariant,
    isDeletingVariant,
    deleteName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSaveGroup,
    handleEditGroup,
    handleDeleteClick,
    confirmDelete,
    resetForm,
  } = useMenuVariants();

  const t = useTranslations("RestaurantDashboard.Menu.VariantGroups.views");

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      <VariantsHeader
        groupsCount={variants.length}
        optionsCount={variants.reduce(
          (acc, curr) => acc + curr.options.length,
          0,
        )}
        isLoading={isLoadingVariants}
      />

      {!isCreating ? (
        <div className="w-full">
          <Button
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            variant="outline"
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#1F4D36] group transition-all cursor-pointer"
          >
            <Plus className="size-5 text-emerald-bg mb-2" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-500 font-medium group-hover:text-[#1F4D36]">
                {t("createNew")}
              </span>
              <span className="text-xs text-gray-400 font-normal">
                {t("createNewDesc")}
              </span>
            </div>
          </Button>
        </div>
      ) : (
        <VariantGroupForm
          groupName={groupName}
          setGroupName={setGroupName}
          options={options}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onOptionChange={handleOptionChange}
          onSave={handleSaveGroup}
          onCancel={resetForm}
          isSaving={isCreatingVariant || isUpdatingVariant}
          isEditing={!!editingId}
        />
      )}

      <div className="flex flex-col gap-4">
        {isLoadingVariants
          ? [1, 2].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))
          : variants.map((group) => (
              <VariantGroupCard
                key={group.id}
                group={group}
                onEdit={() => handleEditGroup(group)}
                onDelete={() => handleDeleteClick(group.id, group.name)}
                isDeleting={isDeletingVariant}
              />
            ))}

        {!isLoadingVariants && variants.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-400">
            <Typography className="text-sm">
              {t("noGroups")}
            </Typography>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={t("deleteTitle")}
        description={t("deleteDesc", { name: deleteName })}
        onConfirm={confirmDelete}
        isDeleting={isDeletingVariant}
      />
    </div>
  );
}
