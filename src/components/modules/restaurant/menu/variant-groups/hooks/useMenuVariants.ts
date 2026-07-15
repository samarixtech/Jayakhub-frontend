"use client";

import { useState, useEffect } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createVariantGroupAction,
  getVariantGroupsAction,
  updateVariantGroupAction,
  deleteVariantGroupAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

const INITIAL_OPTIONS = [{ name: "", price: "0" }];

export const useMenuVariants = () => {
  const t = useTranslations("RestaurantDashboard.Menu.VariantGroups.toasts");
  const [variants, setVariants] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { execute: createVariant, isPending: isCreatingVariant } =
    useServerAction(createVariantGroupAction, {
      onSuccess: () => {
       
        fetchVariants();
        resetForm();
      },
    });

  const { execute: updateVariant, isPending: isUpdatingVariant } =
    useServerAction(updateVariantGroupAction, {
      onSuccess: () => {
       
        fetchVariants();
        resetForm();
      },
    });

  const { execute: deleteVariant, isPending: isDeletingVariant } =
    useServerAction(deleteVariantGroupAction, {
      onSuccess: () => {
       
        fetchVariants();
        setIsDeleteModalOpen(false);
      },
    });

  const { execute: fetchVariants, isPending: isLoadingVariants } =
    useServerAction(getVariantGroupsAction, {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const variantsData = data && data.data ? data.data : data;

        if (Array.isArray(variantsData)) {
          const formattedVariants = variantsData.map((v: any) => ({
            id: v.id || v._id,
            name: v.groupName,
            options: v.options.map((o: any) => ({
              name: o.name,
              price: Number(o.price) === 0 ? "Free" : `${o.price}`,
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

  const handleSaveGroup = async () => {
    if (!groupName) {
      toast.error(t("nameRequired"));
      return;
    }

    const apiOptions = options
      .filter((opt) => opt.name)
      .map((opt) => ({
        name: opt.name,
        price: Number(opt.price),
      }));

    if (editingId) {
      await updateVariant({
        id: editingId,
        groupName,
        options: apiOptions,
      });
    } else {
      await createVariant({
        groupName,
        options: apiOptions,
      });
    }
  };

  const handleEditGroup = (variant: any) => {
    setEditingId(variant.id);
    setGroupName(variant.name);
    setOptions(
      variant.options.map((opt: any) => ({
        name: opt.name,
        price: opt.isFree ? "0" : String(opt.price),
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

  return {
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
  };
};
