"use client";

import React, { useCallback } from "react";
import { X, Image as ImageIcon } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <ImageIcon className="w-5 h-5" />
        </div>
        <Typography className="font-semibold text-gray-900">
          Item Image
        </Typography>
      </div>

      <div className="space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative w-full aspect-video md:aspect-[2.5/1] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50/50 group ${
            imagePreview
              ? "border-emerald-500/50"
              : "border-gray-100 hover:border-emerald-500/50 hover:bg-emerald-50/10"
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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(null);
                  }}
                  className="bg-white/20 hover:bg-red-500 text-white p-3 rounded-full transform hover:scale-110 transition-all border border-white/30"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onImageChange(e.target.files?.[0] || null)}
              />
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-bg mb-4 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-7 h-7" />
              </div>
              <Typography className="text-sm font-bold text-gray-900">
                Click to upload or drag and drop
              </Typography>
              <Typography className="text-xs font-bold text-gray-400 mt-2">
                PNG, JPG up to 5MB • Recommended 800×600px
              </Typography>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
