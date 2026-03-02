"use client";

import React, { useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

interface ItemImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
}

export const ItemImageUpload: React.FC<ItemImageUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageChange(file);
      }
    },
    [onImageChange],
  );

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-700">Item Image</Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${
          imagePreview
            ? "border-emerald-bg bg-white"
            : "border-gray-200 bg-gray-50 hover:border-emerald-bg hover:bg-emerald-50/30"
        }`}
      >
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(null);
                }}
                className="bg-red-500 text-white p-2 rounded-full transform hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => onImageChange(e.target.files?.[0] || null)}
            />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-bg mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <Typography className="text-sm font-medium text-gray-600">
              Click to upload or drag and drop
            </Typography>
            <Typography className="text-xs text-gray-400 mt-1">
              PNG, JPG or JPEG (max 2MB)
            </Typography>
          </label>
        )}
      </div>
    </div>
  );
};
