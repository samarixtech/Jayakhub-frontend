"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useServerAction } from "@/hooks/use-server-action";
import { getMenuItemsAction } from "@/app/actions/restaurant/menu";
import { MenuItemOption } from "../types/deals";

export function useDealMenuItems(
  searchQuery: string = "",
  selectedCategory: string = "all",
) {
  const t = useTranslations("RestaurantDashboard.Deals");
  const [items, setItems] = useState<MenuItemOption[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const { execute: fetchItems, isPending: isLoading } = useServerAction(
    getMenuItemsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        let rawItems: any[] = [];
        if (Array.isArray(data)) {
          rawItems = data;
        } else if (data?.items && Array.isArray(data.items)) {
          rawItems = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          rawItems = data.data;
        }

        if (rawItems.length > 0) {
          const normalized: MenuItemOption[] = rawItems.map((item: any) => {
            const rawBase = Number(item.basePrice || item.price || 0);
            const discountVal = Number(
              item.discount || item.discountAmount || 0,
            );
            const finalPrice =
              item.discountPrice !== undefined && item.discountPrice !== null
                ? Number(item.discountPrice)
                : item.discountedPrice !== undefined &&
                    item.discountedPrice !== null
                  ? Number(item.discountedPrice)
                  : discountVal > 0
                    ? Math.max(0, rawBase - discountVal)
                    : Number(item.sellingPrice || rawBase);

            return {
              id: item._id || item.id || `item-${Math.random()}`,
              name: item.name || item.itemName || t("detailsModal.unnamedItem"),
              category:
                typeof item.category === "string"
                  ? item.category
                  : item.category?.name || t("common.categoryFallback"),
              basePrice: finalPrice,
              image: item.image || item.imageUrl || "",
            };
          });
          setItems(normalized);

          const uniqueCats = Array.from(
            new Set(normalized.map((i) => i.category)),
          );
          setCategories(uniqueCats);
        } else {
          setItems([]);
          setCategories([]);
        }
      },
      onError: () => {
        setItems([]);
        setCategories([]);
      },
    },
  );

  useEffect(() => {
    fetchItems({
      search: searchQuery,
      category: selectedCategory === "all" ? "" : selectedCategory,
      limit: 50,
    });
  }, [fetchItems, searchQuery, selectedCategory]);

  return {
    items,
    categories,
    isLoading,
    refetch: fetchItems,
  };
}
