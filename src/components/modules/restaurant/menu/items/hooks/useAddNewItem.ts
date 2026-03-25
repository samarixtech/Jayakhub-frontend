"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createItemAction,
  updateItemAction,
  getMenuItemByIdAction,
  getAllCategoriesAction,
  getVariantGroupsAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";

export const useAddNewItem = () => {
  const params = useParams();
  const itemId = (params.itemId || params.id) as string;
  const isEditMode = !!itemId;
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [variantGroups, setVariantGroups] = useState<any[]>([]);
  const [fetchedVariations, setFetchedVariations] = useState<any[]>([]);

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
        console.log("FETCH ITEM SUCCESS", data);

        const itemData = data?.item || data?.data?.item || data?.data || data;

        if (itemData && (itemData.name || itemData.category)) {
          // Normalize Dietary Type
          let normalizedDietaryType = "None";
          const rawType = (itemData.dietaryType || "").toUpperCase().trim();
          if (rawType === "VEG") normalizedDietaryType = "Veg";
          if (rawType === "NON_VEG" || rawType === "NON-VEG")
            normalizedDietaryType = "Non-Veg";

          // Extract IDs from Variant Groups
          const rawGroups = itemData.variantGroups || itemData.variations || [];
          const mappedGroups = Array.isArray(rawGroups)
            ? rawGroups
                .map((g: any) => (typeof g === "object" ? g.id || g._id : g))
                .filter(Boolean)
            : [];

          if (Array.isArray(rawGroups) && rawGroups.length > 0) {
            setFetchedVariations(rawGroups);
          }

          setFormData({
            name: itemData.name || "",
            description: itemData.description || "",
            category: itemData.category?._id || itemData.category?.id || itemData.categoryId || itemData.category || "",
            basePrice:
              itemData.basePrice?.toString() ||
              itemData.price?.toString() ||
              "",
            itemImage: itemData.itemImage || itemData.image || "",
            isAvailable: itemData.isAvailable ?? true,
            isVeg: itemData.isVeg ?? false,
            dietaryType: normalizedDietaryType as any,
            variantGroups: mappedGroups,
          });

          const imgToPreview = itemData.itemImage || itemData.image;
          if (imgToPreview) {
            setImagePreview(
              imgToPreview.startsWith("http")
                ? imgToPreview
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imgToPreview}`,
            );
          }
        } else {
          toast.error("Failed to load item details properly.");
        }
      },
      onError: (err) => {
        console.error("FETCH ITEM ERROR", err);
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

  useEffect(() => {
    if (fetchedVariations.length > 0 && variantGroups.length > 0) {
      if (
        !fetchedVariations.some((v) => typeof v === "string" || v.id || v._id)
      ) {
        const variationNames = fetchedVariations.map((v: any) =>
          v.name?.toLowerCase().trim(),
        );
        const matchedIds: string[] = [];

        variantGroups.forEach((vg) => {
          const hasMatch = vg.options?.some((opt: any) =>
            variationNames.includes(opt.name?.toLowerCase().trim()),
          );
          if (hasMatch) {
            matchedIds.push(vg.id || vg._id);
          }
        });

        if (matchedIds.length > 0) {
          setFormData((prev) => ({
            ...prev,
            variantGroups: Array.from(
              new Set([...prev.variantGroups, ...matchedIds]),
            ),
          }));
        }
        setFetchedVariations([]); // Run once
      }
    }
  }, [fetchedVariations, variantGroups]);

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
        submitData.append("variantGroups", JSON.stringify(value));

        const selectedGroupIds = value as string[];
        const selectedGroupObjs = variantGroups.filter((g) =>
          selectedGroupIds.includes(g.id || g._id),
        );
        const variationsPayload: any[] = [];

        selectedGroupObjs.forEach((g) => {
          g.options?.forEach((opt: any) => {
            variationsPayload.push({
              name: opt.name,
              additionalPrice:
                opt.isFree || opt.price === "Free"
                  ? 0
                  : Number(opt.price?.toString().replace(/[^0-9.]/g, "")) || 0,
            });
          });
        });

        submitData.append("variations", JSON.stringify(variationsPayload));
      } else if (key === "dietaryType") {
        const mappedType = value.toString().toUpperCase().replace("-", "_");
        submitData.append(key, mappedType);
      } else {
        submitData.append(key, value.toString());
      }
    });

    if (imageFile) {
      submitData.append("itemImage", imageFile);
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
