"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createVariantGroupAction,
  getVariantGroupsAction,
  updateVariantGroupAction,
  deleteVariantGroupAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";

const INITIAL_OPTIONS = [{ name: "", price: "0" }];

import { GlobalModal } from "@/components/common/GlobalModal";

export default function MenuVariantsView() {
  const [variants, setVariants] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [groupName, setGroupName] = useState("");
  const [options, setOptions] = useState(INITIAL_OPTIONS);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { execute: createVariant, isPending: isCreatingVariant } =
    useServerAction(createVariantGroupAction, {
      onSuccess: (data) => {
        toast.success("Variant group created");
        fetchVariants();
        resetForm();
      },
      onError: (error) => console.error(error),
    });

  const { execute: updateVariant, isPending: isUpdatingVariant } =
    useServerAction(updateVariantGroupAction, {
      onSuccess: (data) => {
        toast.success("Variant group updated");
        fetchVariants();
        resetForm();
      },
      onError: (error) => console.error(error),
    });

  const { execute: deleteVariant, isPending: isDeletingVariant } =
    useServerAction(deleteVariantGroupAction, {
      onSuccess: (data) => {
        toast.success("Variant group deleted");
        fetchVariants();
        setIsDeleteModalOpen(false);
      },
      onError: (error) => console.error(error),
    });

  const { execute: fetchVariants, isPending: isLoadingVariants } =
    useServerAction(getVariantGroupsAction, {
      onSuccess: (data: any) => {
        // Adjust for potential API response structure wrapper
        const variantsData = data && data.data ? data.data : data;

        if (Array.isArray(variantsData)) {
          const formattedVariants = variantsData.map((v: any) => ({
            id: v.id || v._id,
            name: v.groupName,
            options: v.options.map((o: any) => ({
              name: o.name,
              price: Number(o.price) === 0 ? "Free" : `+$${o.price}`,
              isFree: Number(o.price) === 0,
            })),
          }));
          setVariants(formattedVariants);
        }
      },
    });

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleAddOption = () => {
    setOptions([...options, { name: "", price: "0" }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (
    index: number,
    field: "name" | "price",
    value: string,
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      toast.error("Please enter a group name");
      return;
    }

    // Format options for API
    const apiOptions = options
      .filter((opt) => opt.name)
      .map((opt) => ({
        name: opt.name,
        price: Number(opt.price),
      }));

    if (editingId) {
      // Update logic using server action
      await updateVariant({
        id: editingId,
        groupName,
        options: apiOptions,
      });
    } else {
      // Create logic using server action
      await createVariant({
        groupName,
        options: apiOptions,
      });
    }
  };

  const handleEditGroup = (variant: any) => {
    setEditingId(variant.id);
    setGroupName(variant.name);
    // Parse prices back to numeric strings for inputs
    setOptions(
      variant.options.map((opt: any) => ({
        name: opt.name,
        price: opt.isFree ? "0" : opt.price.replace("+$", ""),
      })),
    );
    setIsCreating(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteVariant(deleteId);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setGroupName("");
    setOptions(INITIAL_OPTIONS);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      {/* Header Stats Section */}
      <div className="bg-[#E2F1E8] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#1F4D36]">
            <Sliders className="w-6 h-6 rotate-90" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-lg font-bold text-gray-900 mb-1"
            >
              Manage Your Item Variants
            </Typography>
            <Typography className="text-sm text-gray-600 max-w-md">
              Create reusable variant groups like sizes, spice levels, or
              add-ons. Apply them to multiple menu items for consistent pricing.
            </Typography>
          </div>
        </div>

        {isLoadingVariants ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-24 rounded-xl" />
            <Skeleton className="h-16 w-24 rounded-xl" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
              <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
                {variants.length}
              </Typography>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Groups
              </Typography>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm text-center min-w-[100px]">
              <Typography className="text-2xl font-bold text-[#1F4D36] block leading-none">
                {variants.reduce((acc, curr) => acc + curr.options.length, 0)}
              </Typography>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Options
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Toggle between Button and Form */}
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
                Create New Variant Group
              </span>
              <span className="text-xs text-gray-400 font-normal">
                Add sizes, toppings, spice levels and more
              </span>
            </div>
          </Button>
        </div>
      ) : (
        /* Create/Edit Group Form - Dashed Border */
        <div className="border border-dashed border-[#1F4D36] rounded-xl p-6 bg-[#F9FAFB] relative animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-6">
            {/* Group Name Input */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Group Name</Label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Size Options, Toppings"
                className="bg-white border-gray-200"
              />
            </div>

            {/* Options Input Row */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Options</Label>

              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    value={opt.name}
                    onChange={(e) =>
                      handleOptionChange(idx, "name", e.target.value)
                    }
                    placeholder="Option name"
                    className="bg-white border-gray-200 flex-1"
                  />
                  <div className="relative w-32 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <Input
                      value={opt.price}
                      type="number"
                      min="0"
                      onChange={(e) =>
                        handleOptionChange(idx, "price", e.target.value)
                      }
                      placeholder="0"
                      className="bg-white border-gray-200 pl-6 text-center"
                    />
                  </div>
                  {options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(idx)}
                      className="h-10 w-10 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                onClick={handleAddOption}
                variant="outline"
                className="mt-2 border-dashed border-[#1F4D36] text-[#1F4D36] hover:bg-[#1F4D36]/5 h-10 w-auto px-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-4">
              <Button
                onClick={handleCreateGroup}
                className="bg-[#1F4D36] hover:bg-[#183d2b] text-white px-6"
                disabled={isCreatingVariant || isUpdatingVariant}
              >
                {isCreatingVariant || isUpdatingVariant
                  ? "Saving..."
                  : editingId
                    ? "Update Group"
                    : "Create Group"}
              </Button>
              <Button
                onClick={resetForm}
                variant="ghost"
                className="text-gray-500 hover:text-gray-900"
                disabled={isCreatingVariant || isUpdatingVariant}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Variants List */}
      <div className="flex flex-col gap-4">
        {isLoadingVariants
          ? // Loading Skeleton
            [1, 2].map((i) => (
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
              <Card
                key={group.id}
                className="p-0 border-none shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300"
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[#1F4D36]">
                      <Sliders className="w-5 h-5 rotate-90" />
                    </div>
                    <div>
                      <Typography
                        variant="h4"
                        className="text-sm font-bold text-gray-900 leading-none mb-1"
                      >
                        {group.name}
                      </Typography>
                      <Typography className="text-xs text-gray-400 font-medium">
                        {group.options.length} options
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGroup(group)}
                      className="h-8 w-8 text-gray-400 hover:text-gray-900"
                      disabled={isDeletingVariant}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(group.id, group.name)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      disabled={isDeletingVariant}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white flex flex-wrap gap-4">
                  {group.options.map((opt: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center bg-gray-50 rounded-md px-3 py-2 text-sm font-medium text-gray-600 border border-gray-100"
                    >
                      <span className="mr-2">{opt.name}</span>
                      <span
                        className={`font-bold ${opt.isFree ? "text-[#1F4D36]" : "text-[#1F4D36]"}`}
                      >
                        {opt.price}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

        {!isLoadingVariants && variants.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-400">
            <Typography className="text-sm">
              No variant groups created yet.
            </Typography>
          </div>
        )}
      </div>

      <GlobalModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Variant Group"
        description={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        trigger={null}
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeletingVariant}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeletingVariant}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeletingVariant ? "Deleting..." : "Delete Group"}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
}
