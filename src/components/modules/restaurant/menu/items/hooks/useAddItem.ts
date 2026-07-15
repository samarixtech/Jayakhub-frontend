"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { bulkImportItemsAction } from "@/app/actions/restaurant/menu";
import { useRouter } from "next/navigation";
import { BulkImportItem } from "@/types";
import { useTranslations } from "next-intl";

export type Step = "selection" | "bulk-import" | "preview";

export const useAddItem = (
  onOpenChange: (open: boolean) => void,
  onImportSuccess?: () => void,
) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.addItemModal.toasts");
  const [step, setStep] = useState<Step>("selection");
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(() => {
        setStep("selection");
        setParsedData([]);
        setHeaders([]);
      }, 300);
    }
    onOpenChange(newOpen);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== "");
      if (lines.length < 2) {
        toast.error(t("csvEmpty"));
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const data = lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index]?.trim() || "";
        });
        return obj;
      });

      setHeaders(headers);
      setParsedData(data);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const groupedItems: Record<string, BulkImportItem> = {};

      parsedData.forEach((row) => {
        const name = row.name?.trim();
        if (!name) return;

        if (!groupedItems[name]) {
          // Map dietary type
          let dietaryType = "NON_VEG";
          const rawDiet = (
            row.dietryType ||
            row.dietaryType ||
            ""
          ).toUpperCase();
          if (rawDiet.includes("VEG") && !rawDiet.includes("NON"))
            dietaryType = "VEG";
          if (rawDiet.includes("VEGAN")) dietaryType = "VEGAN";

          groupedItems[name] = {
            name,
            description: row.description || "",
            category: row.category || "Uncategorized",
            dietaryType: dietaryType,
            basePrice: parseFloat(row.price) || 0,
            isAvailable: true,
            variations: [],
            itemImage:
              row.itemImage ||
              row.image ||
              row[
                Object.keys(row).find((k) =>
                  k.toLowerCase().includes("image"),
                ) as string
              ] ||
              undefined,
          };
        }

        // Handle variations
        const vGroup = row.variantGroup?.trim();
        const vOption = row.variantOption?.trim();
        const vPrice = parseFloat(row.variantPrice) || 0;

        if (vGroup && vOption) {
          let group = groupedItems[name].variations.find(
            (g) => g.groupName === vGroup,
          );
          if (!group) {
            group = { groupName: vGroup, options: [] };
            groupedItems[name].variations.push(group);
          }
          group.options.push({ name: vOption, price: vPrice });
        }
      });

      const itemsWithImages = Object.values(groupedItems);
      const items = itemsWithImages.map(({ itemImage, ...rest }) => rest);
      const itemImages = itemsWithImages.map((item) => item.itemImage || "");

      const payload = { items, itemImage: itemImages };

      if (payload.items.length === 0) {
        toast.error(t("noValidItems"));
        setIsLoading(false);
        return;
      }

      const result = await bulkImportItemsAction(payload);

      if (result.success) {
        toast.success(result.message);
        onImportSuccess?.();
        handleOpenChange(false);
        setParsedData([]);
        setStep("selection");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(t("importFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = () => {
    onOpenChange(false);
    router.push(`/restaurant/menu/items/new`);
  };

  return {
    step,
    setStep,
    dragActive,
    parsedData,
    headers,
    isLoading,
    inputRef,
    handleOpenChange,
    handleDrag,
    handleDrop,
    handleChange,
    handleImport,
    handleManualEntry,
    setParsedData,
  };
};
