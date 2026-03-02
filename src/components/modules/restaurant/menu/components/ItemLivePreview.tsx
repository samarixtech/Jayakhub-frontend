import React from "react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Info } from "lucide-react";
import Image from "next/image";

interface ItemLivePreviewProps {
  formData: any;
  imagePreview: string | null;
}

export const ItemLivePreview: React.FC<ItemLivePreviewProps> = ({
  formData,
  imagePreview,
}) => {
  return (
    <div className="sticky top-24">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Typography className="font-bold text-gray-900">
          Live Preview
        </Typography>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-bg border-emerald-bg/20 text-[10px] py-0"
        >
          Customer View
        </Badge>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white group ring-1 ring-gray-100">
        <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon className="w-10 h-10 opacity-20" />
              <Typography className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                No Image
              </Typography>
            </div>
          )}
          {formData.dietaryType !== "None" && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg h-7 border border-white/50">
              <div
                className={`w-2.5 h-2.5 rounded-sm border-[1.5px] flex items-center justify-center ${
                  formData.dietaryType === "Veg"
                    ? "border-emerald-600"
                    : "border-red-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    formData.dietaryType === "Veg"
                      ? "bg-emerald-600"
                      : "bg-red-600"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  formData.dietaryType === "Veg"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {formData.dietaryType}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <Typography className="font-bold text-lg text-gray-900 leading-tight truncate">
                {formData.name || "Item Name"}
              </Typography>
              <Typography className="text-xs text-emerald-bg font-bold tracking-wide uppercase">
                {formData.category || "Uncategorized"}
              </Typography>
            </div>
            <Typography className="text-xl font-black text-gray-900 shrink-0">
              ${formData.basePrice || "0.00"}
            </Typography>
          </div>

          <Typography className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
            {formData.description ||
              "Enter a description to see how it looks here..."}
          </Typography>

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-400">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-tight">
                Available Instantly
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-bg flex items-center justify-center text-white shadow-lg shadow-emerald-bg/20">
              <Badge
                variant="secondary"
                className="bg-transparent border-none text-white p-0"
              >
                Add
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
        <Typography className="text-xs text-blue-600 leading-relaxed font-medium">
          💡 Pro-tip: Items with high-quality images and clear descriptions tend
          to get 40% more orders.
        </Typography>
      </div>
    </div>
  );
};
