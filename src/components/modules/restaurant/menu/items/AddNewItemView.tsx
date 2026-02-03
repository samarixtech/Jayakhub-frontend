"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Image as ImageIcon, X, Trash2 } from "lucide-react";
import GlobalSelect from "@/components/common/GlobalSelect";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getAllCategoriesAction,
  getVariantGroupsAction,
  createItemAction,
  updateItemAction,
  getMenuItemsAction,
  getMenuItemByIdAction,
} from "@/app/actions/restaurant/menu";
import { toast } from "react-hot-toast";
import { useLocalizedRouter } from "@/hooks/use-localized-router";

interface AddNewItemViewProps {
  itemId?: string;
}

export default function AddNewItemView({ itemId }: AddNewItemViewProps) {
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [dietary, setDietary] = useState("none");
  const [image, setImage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedVariantGroup, setSelectedVariantGroup] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [variantGroups, setVariantGroups] = useState<any[]>([]);

  const handleAddVariantGroup = () => {
    if (!selectedVariantGroup) {
      console.warn("No variant group selected");
      return;
    }

    const groupToAdd = variantGroups.find(
      (g) => (g._id || g.id) === selectedVariantGroup,
    );

    if (!groupToAdd) {
      console.error("Group not found with ID:", selectedVariantGroup);
      return;
    }

    if (
      selectedGroups.some(
        (g) => (g._id || g.id) === (groupToAdd._id || groupToAdd.id),
      )
    ) {
      toast.error("Variant group already added");
      return;
    }

    setSelectedGroups([...selectedGroups, groupToAdd]);
    setSelectedVariantGroup("");
  };

  const handleRemoveVariantGroup = (id: string) => {
    setSelectedGroups(selectedGroups.filter((g) => (g._id || g.id) !== id));
  };

  // Fetch Data
  const { execute: fetchCategories } = useServerAction(getAllCategoriesAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      const categoriesData = data && data.data ? data.data : data;

      if (Array.isArray(categoriesData)) {
        const categoryNames = categoriesData
          .map((cat: any) => cat.categoryName || cat.name)
          .filter(Boolean);
        setCategories(categoryNames);
      } else {
        setCategories([]);
      }
    },
  });

  const { execute: fetchVariants } = useServerAction(getVariantGroupsAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      console.log("Fetched Variant Groups:", data);

      if (Array.isArray(data)) {
        setVariantGroups(data);
        return;
      }

      if (data && Array.isArray(data.data)) {
        setVariantGroups(data.data);
        return;
      }

      if (data && Array.isArray(data.variantGroups)) {
        setVariantGroups(data.variantGroups);
        return;
      }

      console.warn("Unexpected variant data structure:", data);
    },
    onError: (err) => console.error("Error fetching variants:", err),
  });

  useEffect(() => {
    fetchCategories();
    fetchVariants();
  }, []);

  const { execute: fetchItem } = useServerAction(getMenuItemByIdAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      console.log("Fetch Item RAW Response:", data);
      const responseData = data?.data || data;
      const itemToEdit = Array.isArray(responseData)
        ? responseData[0]
        : responseData;

      if (itemToEdit) {
        setName(itemToEdit.name);
        setDescription(itemToEdit.description || "");
        setPrice(String(itemToEdit.basePrice));
        setCategory(itemToEdit.category);
        setIsAvailable(itemToEdit.isAvailable !== false);

        const reverseDietaryMap: Record<string, string> = {
          NON_VEG: "none",
          VEG: "veg",
        };
        setDietary(reverseDietaryMap[itemToEdit.dietaryType] || "none");

        const img = itemToEdit.itemImage || itemToEdit.image;
        if (img) {
          const imgUrl = img.startsWith("http")
            ? img
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${img}`;
          setImage(imgUrl);
        }

        if (
          itemToEdit.variations &&
          Array.isArray(itemToEdit.variations) &&
          variantGroups.length > 0
        ) {
          const matchedGroups: any[] = [];
          const itemVariationNames = new Set(
            itemToEdit.variations.map((v: any) => v.name),
          );

          variantGroups.forEach((group) => {
            const hasMatch = group.options.some((opt: any) =>
              itemVariationNames.has(opt.name),
            );
            if (hasMatch) {
              matchedGroups.push(group);
            }
          });
          setSelectedGroups(matchedGroups);
        }
      } else {
        toast.error("Item not found");
        router.push("/restaurant/menu/items");
      }
    },
    onError: () => toast.error("Failed to fetch item details"),
  });

  useEffect(() => {
    fetchCategories();

    fetchVariants();
  }, []);

  useEffect(() => {
    if (itemId && variantGroups.length > 0) {
      fetchItem(itemId);
    }
  }, [itemId, variantGroups.length]);

  const router = useLocalizedRouter();

  const { execute: createItem, isPending: isCreating } = useServerAction(
    createItemAction,
    {
      onSuccess: () => {
        router.push("/restaurant/menu/items");
      },
      onError: (err: any) =>
        toast.error(err.message || "Failed to create item"),
    },
  );

  const { execute: updateItem, isPending: isUpdating } = useServerAction(
    updateItemAction,
    {
      onSuccess: () => {
        router.push("/restaurant/menu/items");
      },
      onError: (err: any) =>
        toast.error(err.message || "Failed to update item"),
    },
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (!name || !price || !category) {
      toast.error("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    const variations = selectedGroups.flatMap((group) =>
      group.options.map((opt: any) => ({
        name: opt.name,
        additionalPrice: Number(opt.price),
      })),
    );

    const dietaryMap: Record<string, string> = {
      none: "NON_VEG",
      veg: "VEG",
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("basePrice", price);
    formData.append("dietaryType", dietaryMap[dietary] || "NON_VEG");
    formData.append("category", category);
    formData.append("variations", JSON.stringify(variations));
    formData.append("isAvailable", String(isAvailable));

    if (imageFile) {
      formData.append("itemImage", imageFile);
    }

    if (itemId) {
      formData.append("id", itemId);
      await updateItem(formData);
    } else {
      await createItem(formData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <LocalizedLink href="/restaurant/menu/items">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </LocalizedLink>
        <Typography variant="h2" className="text-xl font-bold">
          {itemId ? "Edit Item" : "Add New Item"}
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-6">
            {/* Basic Info content  */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
                <Typography className="font-semibold text-lg">
                  Basic Information
                </Typography>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Typography className="text-sm font-medium text-gray-600">
                  {isAvailable ? "Available" : "Unavailable"}
                </Typography>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Chicken Shawarma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
              <div className="text-right text-xs text-gray-400">
                {name.length}/60
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="desc"
                placeholder="Describe your item to help customers..."
                className="h-32 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-400">
                {description.length}/200
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Base Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <GlobalSelect
                  value={category}
                  onChange={setCategory}
                  options={categories.map((c) => ({ label: c, value: c }))}
                  placeholder="Select category"
                />
              </div>
            </div>

            <div className="grid gap-2 max-w-[50%]">
              <Label>
                Dietary Type{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <GlobalSelect
                value={dietary}
                onChange={setDietary}
                options={[
                  { label: "None", value: "none" },
                  { label: "Vegan", value: "vegan" },
                  { label: "Vegetarian", value: "veg" },
                ]}
                placeholder="Select type"
              />
              <p className="text-xs text-gray-400">
                Dietary labels help customers filter items
              </p>
            </div>
          </Card>

          <Card className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <Typography className="font-semibold text-lg">
                Item Image
              </Typography>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              {image ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <Typography className="font-medium text-gray-900">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 5MB • Recommended 800x600px
                  </Typography>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <Typography className="font-semibold text-lg">
                Variant Groups
              </Typography>
            </div>

            <div className="flex flex-col gap-4">
              <Typography className="text-sm text-gray-400 font-normal">
                Add variant groups to this item (e.g., Sizes, Spices).
              </Typography>

              <div className="flex gap-2">
                <div className="flex-1">
                  <GlobalSelect
                    value={selectedVariantGroup}
                    onChange={setSelectedVariantGroup}
                    options={Array.from(
                      new Map(
                        variantGroups.map((group) => [
                          group._id || group.id,
                          group,
                        ]),
                      ).values(),
                    ).map((group) => ({
                      label: group.groupName,
                      value: group._id || group.id,
                    }))}
                    placeholder="Select a variant group..."
                  />
                </div>
                <Button
                  onClick={handleAddVariantGroup}
                  className="bg-[#1F4D36] hover:bg-[#183d2b] text-white px-6 h-11 font-medium"
                >
                  Add Group
                </Button>
              </div>

              <div
                className={`
                    w-full min-h-[80px] rounded-xl flex flex-col items-center justify-center p-4
                    ${selectedGroups.length === 0 ? "border-2 border-dashed border-gray-100" : "border border-gray-100 bg-white gap-2"}
                `}
              >
                {selectedGroups.length === 0 ? (
                  <Typography className="text-gray-300">
                    No variant groups added yet
                  </Typography>
                ) : (
                  selectedGroups.map((group, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#1F4D36] font-bold text-xs">
                          {group.options.length}
                        </div>
                        <div>
                          <Typography className="font-semibold text-gray-900 leading-tight">
                            {group.groupName}
                          </Typography>
                          <Typography className="text-xs text-gray-500">
                            {group.options
                              .map((opt: any) => opt.name)
                              .join(", ")}
                          </Typography>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8"
                        onClick={() =>
                          handleRemoveVariantGroup(group._id || group.id)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4 py-8">
            <Button variant="outline" className="h-12 px-8">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-12 px-8 bg-[#1F4D36] hover:bg-[#183d2b] text-white"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Saving..."
                : itemId
                  ? "Update Item"
                  : "Save Item"}
            </Button>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 text-gray-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <Typography className="text-sm font-medium">
                  Live Preview
                </Typography>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-sm mx-auto">
              {/* Preview Image Area */}
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Preview Content */}
              <div className="p-6">
                {category && (
                  <Badge
                    variant="secondary"
                    className="mb-2 bg-green-50 text-green-700 hover:bg-green-100 border-none uppercase text-[10px] tracking-wider font-bold px-2 py-0.5"
                  >
                    {category}
                  </Badge>
                )}
                <Typography className="font-bold text-xl text-gray-900 mb-1 leading-tight">
                  {name || "Item Name"}
                </Typography>
                <Typography className="font-bold text-2xl text-[#1F4D36] mb-3">
                  ${price || "0.00"}
                </Typography>
                {description.length > 0 && (
                  <Typography className="text-sm text-gray-500 line-clamp-2">
                    {description}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
