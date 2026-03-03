"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createItemAction,
  updateItemAction,
  getMenuItemByIdAction,
  getAllCategoriesAction,
  getVariantGroupsAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";
import { useLocalizedRouter } from "@/hooks/use-localized-router";

export const useAddNewItem = () => {
  const params = useParams();
  const itemId = (params.itemId || params.id) as string;
  const isEditMode = !!itemId;
  const router = useLocalizedRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [variantGroups, setVariantGroups] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    itemImage: "",
    isAvailable: true,
    isVeg: false,
    dietaryType: "None" as "Veg" | "Non-Veg" | "None",
    variantGroups: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // FETCH INITIAL DATA
  const { execute: fetchCategories } = useServerAction(getAllCategoriesAction, {
    suppressSuccessToast: true,
    onSuccess: (data) =>
      setCategories(Array.isArray(data) ? data : data.data || []),
  });

  const { execute: fetchVariantGroups } = useServerAction(
    getVariantGroupsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data) =>
        setVariantGroups(Array.isArray(data) ? data : data.data || []),
    },
  );

  const { execute: fetchItem, isPending: isFetchingItem } = useServerAction(
    getMenuItemByIdAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            basePrice: data.basePrice?.toString() || "",
            itemImage: data.itemImage || "",
            isAvailable: data.isAvailable ?? true,
            isVeg: data.isVeg ?? false,
            dietaryType: data.dietaryType || "None",
            variantGroups: data.variantGroups || [],
          });
          if (data.itemImage) {
            setImagePreview(
              data.itemImage.startsWith("http")
                ? data.itemImage
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${data.itemImage}`,
            );
          }
        }
      },
    },
  );

  useEffect(() => {
    fetchCategories();
    fetchVariantGroups();
    if (isEditMode) {
      fetchItem(itemId);
    }
  }, [itemId, isEditMode]);

  const { execute: createItem, isPending: isCreating } = useServerAction(
    createItemAction,
    {
      onSuccess: () => {
        toast.success("Item created successfully");
        router.push("/restaurant/menu/items");
      },
    },
  );

  const { execute: updateItem, isPending: isUpdating } = useServerAction(
    updateItemAction,
    {
      onSuccess: () => {
        toast.success("Item updated successfully");
        router.push("/restaurant/menu/items");
      },
    },
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(
        formData.itemImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${formData.itemImage}`
          : null,
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "variantGroups") {
        submitData.append(key, JSON.stringify(value));
      } else {
        submitData.append(key, value.toString());
      }
    });

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    if (isEditMode) {
      submitData.append("id", itemId);
      await updateItem(submitData);
    } else {
      await createItem(submitData);
    }
  };

  const toggleVariantGroup = (groupId: string) => {
    setFormData((prev) => {
      const exists = prev.variantGroups.includes(groupId);
      return {
        ...prev,
        variantGroups: exists
          ? prev.variantGroups.filter((id) => id !== groupId)
          : [...prev.variantGroups, groupId],
      };
    });
  };

  return {
    formData,
    isEditMode,
    categories,
    variantGroups,
    imagePreview,
    isFetchingItem,
    isSaving: isCreating || isUpdating,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    toggleVariantGroup,
    router,
  };
};
