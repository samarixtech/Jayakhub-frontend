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
import { useTranslations } from "next-intl";

export const useAddNewItem = () => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.addNewItem.toasts");
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
    discount: "" as string,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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
            category:
              itemData.category?._id ||
              itemData.category?.id ||
              itemData.categoryId ||
              itemData.category ||
              "",
            basePrice:
              itemData.basePrice?.toString() ||
              itemData.price?.toString() ||
              "",
            itemImage: itemData.itemImage || itemData.image || "",
            isAvailable: itemData.isAvailable ?? true,
            isVeg: itemData.isVeg ?? false,
            dietaryType: normalizedDietaryType as any,
            variantGroups: mappedGroups,
            discount: itemData.discount?.toString() || "",
          });

          const imgToPreview = itemData.itemImage || itemData.image;
          if (imgToPreview) {
            setImagePreview(imgToPreview);
          }
        } else {
          toast.error(t("fetchFailed"));
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
        router.push("/restaurant/menu/items");
      },
    },
  );

  const { execute: updateItem, isPending: isUpdating } = useServerAction(
    updateItemAction,
    {
      onSuccess: () => {
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
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // The "X" button clears the image entirely — including a previously
      // saved one in edit mode — rather than reverting to it, so the user
      // can actually remove/replace it instead of it silently reappearing.
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, itemImage: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.basePrice) {
      toast.error(t("fillRequired"));
      return;
    }

    if (!imagePreview) {
      setImageError(true);
      toast.error(t("uploadImage"));
      return;
    }

    if (
      Number(formData.basePrice) < 0 ||
      (formData.discount && Number(formData.discount) < 0)
    ) {
      toast.error(t("negativePrice"));
      return;
    }

    if (
      formData.discount &&
      Number(formData.discount) > Number(formData.basePrice)
    ) {
      toast.error(t("discountExceeds"));
      return;
    }

    // Build variations payload from selected variant groups
    const selectedGroupObjs = variantGroups.filter((g) =>
      formData.variantGroups.includes(g.id || g._id),
    );
    const variationsPayload: { name: string; additionalPrice: number }[] = [];
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

    // Read and compress image as base64 on the client.
    // Compression is critical on Hostinger: nginx has a low client_max_body_size,
    // and an uncompressed PNG screenshot (2-5 MB → 3-7 MB base64) exceeds it,
    // causing a 413 before Next.js even sees the request.
    let imageBase64 = "";
    let imageName = "";
    let imageType = "image/jpeg";
    if (imageFile) {
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            const MAX_DIM = 1920;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width >= height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            resolve(dataUrl.split(",")[1] ?? "");
          };
          img.onerror = reject;
          img.src = ev.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      imageName = imageFile.name.replace(/\.[^.]+$/, ".jpg");
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      basePrice: formData.basePrice,
      itemImage: formData.itemImage,
      isAvailable: formData.isAvailable.toString(),
      isVeg: formData.isVeg.toString(),
      dietaryType:
        formData.dietaryType === "None"
          ? "NON_VEG"
          : formData.dietaryType.toUpperCase().replace("-", "_"),
      variantGroups: JSON.stringify(formData.variantGroups),
      variations: JSON.stringify(variationsPayload),
      discount: formData.discount ? Number(formData.discount).toString() : "0",
      imageBase64,
      imageName,
      imageType,
      ...(isEditMode ? { id: itemId } : {}),
    };

    if (isEditMode) {
      await updateItem(payload);
    } else {
      await createItem(payload);
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
    imageError,
    isFetchingItem,
    isSaving: isCreating || isUpdating,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    toggleVariantGroup,
    router,
  };
};
