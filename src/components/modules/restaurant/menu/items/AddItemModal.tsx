"use client";

import React, { useState, useRef } from "react";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { toast } from "react-hot-toast";
import { bulkImportItemsAction } from "@/app/actions/restaurant/menu";
import {
  Edit,
  FileSpreadsheet,
  ArrowLeft,
  Download,
  UploadCloud,
  FileWarning,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";
import { BulkImportItem } from "@/types/menu.types";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  onImportSuccess?: () => void;
}

type Step = "selection" | "bulk-import" | "preview";

export function AddItemModal({
  open,
  onOpenChange,
  trigger,
  onImportSuccess,
}: AddItemModalProps) {
  const [step, setStep] = useState<Step>("selection");
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { country, language } = useLocale();
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
      if (lines.length < 2) return;

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

  return (
    <GlobalModal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={step === "selection" ? "Add New Item" : "Bulk Import Items"}
      className="sm:max-w-4xl max-h-[90vh] flex flex-col"
    >
      {/* Selection Step */}
      {step === "selection" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div
            onClick={() => {
              onOpenChange(false);
              router.push(`/${country}/${language}/restaurant/menu/items/new`);
            }}
            className="flex flex-col items-center justify-center p-8 border rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all gap-4 group h-[250px]"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Edit className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-2">
              <Typography variant="h4" className="font-bold text-gray-900">
                Manual Entry
              </Typography>
              <Typography variant="p" className="text-gray-500 text-sm">
                Fill out a form to add a single item with full details.
              </Typography>
            </div>
          </div>

          <div
            onClick={() => setStep("bulk-import")}
            className="flex flex-col items-center justify-center p-8 border rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all gap-4 group h-[250px]"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-2">
              <Typography variant="h4" className="font-bold text-gray-900">
                Bulk Import
              </Typography>
              <Typography variant="p" className="text-gray-500 text-sm">
                Upload a CSV file to add multiple items at once.
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Step */}
      {step === "bulk-import" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between -mt-2">
            <Button
              variant="ghost"
              onClick={() => setStep("selection")}
              className="text-gray-500 hover:text-gray-900 px-0 -ml-2 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 gap-2 font-medium"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/menu_import_template.csv";
                link.setAttribute("download", "menu_import_template.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="w-4 h-4" />
              Template
            </Button>
          </div>

          <div
            className={`
              border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors min-h-[300px] cursor-pointer
              ${dragActive ? "border-emerald-500 bg-emerald-50/50" : "border-gray-200 bg-gray-50/50 hover:border-emerald-500"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleChange}
            />
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center space-y-1">
              <Typography className="font-bold text-gray-900 text-lg">
                Click or Drag CSV here
              </Typography>
              <Typography className="text-gray-500 text-sm">
                Supported formats: .csv
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <div className="space-y-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setStep("bulk-import");
                setParsedData([]);
              }}
              className="text-gray-500 hover:text-gray-900 px-0 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Typography variant="h4" className="font-bold text-gray-900">
              Preview ({parsedData.length} items)
            </Typography>
          </div>

          {/* TABLE CONTAINER: Desktop View */}
          <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-200">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 font-semibold whitespace-nowrap border-b bg-gray-50"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parsedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="bg-white hover:bg-emerald-50/30 transition-colors"
                    >
                      {headers.map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-gray-700"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARDS CONTAINER: Mobile View */}
          <div className="md:hidden space-y-3 overflow-y-auto max-h-[55vh] pb-4">
            {parsedData.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <FileWarning className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <Typography className="text-gray-500">
                  No data parsed
                </Typography>
              </div>
            ) : (
              parsedData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 shadow-sm space-y-2"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Row {rowIndex + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {headers.map((header, colIndex) => (
                      <div key={colIndex} className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          {header}
                        </span>
                        <span className="text-sm text-gray-900 font-medium truncate">
                          {row[header] || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-500"
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-bg hover:bg-emerald-bg-hover text-white px-8"
              disabled={isLoading}
              onClick={async () => {
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
                  const items = itemsWithImages.map(
                    ({ itemImage, ...rest }) => rest,
                  );
                  const itemImages = itemsWithImages.map(
                    (item) => item.itemImage || "",
                  );

                  const payload = { items, itemImage: itemImages };

                  console.log("PAYLOAD TO BE SENT:", payload);

                  if (payload.items.length === 0) {
                    toast.error("No valid items found to import");
                    setIsLoading(false);
                    return;
                  }

                  const result = await bulkImportItemsAction(payload);

                  if (result.success) {
                    toast.success(result.message);
                    onImportSuccess?.();
                    onOpenChange(false);
                    setParsedData([]);
                    setStep("selection");
                  } else {
                    toast.error(result.message);
                  }
                } catch (error) {
                  console.error("Import failed:", error);
                  toast.error("Failed to import items");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Import All
            </Button>
          </div>
        </div>
      )}
    </GlobalModal>
  );
}
