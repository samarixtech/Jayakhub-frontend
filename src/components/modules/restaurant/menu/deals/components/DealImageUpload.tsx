"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface DealImageUploadProps {
  imagePreview: string;
  onImageChange: (imageSrc: string) => void;
}

export function DealImageUpload({
  imagePreview,
  onImageChange,
}: DealImageUploadProps) {
  const t = useTranslations("RestaurantDashboard.Deals");
  const [isDragOver, setIsDragOver] = useState(false);

  // File to Base64/DataURL converter
  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [onImageChange],
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
        {t("imageUpload.label")}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative w-full aspect-[2.5/1] min-h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50/50 group",
          isDragOver
            ? "border-brand-orange bg-orange-50/20"
            : imagePreview
              ? "border-brand-orange/40"
              : "border-gray-200 hover:border-brand-orange/50 hover:bg-orange-50/10",
        )}
      >
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt={t("imageUpload.previewAlt")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs gap-3">
              <label className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer hover:bg-gray-100 transition-transform hover:scale-105">
                <span>{t("imageUpload.changePhoto")}</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => onImageChange("")}
                className="bg-red-600 text-white p-2.5 rounded-xl shadow-md hover:bg-red-700 transition-transform hover:scale-105 cursor-pointer"
                title={t("imageUpload.removePhotoTitle")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center text-brand-orange mb-3 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-6 h-6" />
            </div>
            <Typography className="text-sm font-bold text-gray-900">
              {t("imageUpload.clickToUpload")}
            </Typography>
            <Typography className="text-xs text-gray-400 mt-1">
              {t("imageUpload.supportHint")}
            </Typography>
          </label>
        )}
      </div>
    </div>
  );
}
