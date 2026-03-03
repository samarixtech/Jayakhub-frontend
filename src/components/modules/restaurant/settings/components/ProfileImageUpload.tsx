"use client";

import Image from "next/image";
import { Upload, ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  imagePreview: string | null;
  existingImage?: string | null;
  imageBaseUrl: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCover?: boolean;
}

export function ProfileImageUpload({
  label,
  subLabel,
  icon,
  imagePreview,
  existingImage,
  imageBaseUrl,
  inputRef,
  onChange,
  isCover = false,
}: ProfileImageUploadProps) {
  const displaySrc =
    imagePreview || (existingImage ? `${imageBaseUrl}${existingImage}` : null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
        {label}
      </Label>

      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[160px] overflow-hidden",
          "border-muted bg-muted/30 hover:border-primary/50 hover:bg-primary/5", // Using shadcn semantic colors
        )}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={onChange}
        />

        {displaySrc ? (
          <div
            className={cn(
              "relative rounded-lg overflow-hidden shadow-sm",
              isCover ? "w-full h-32" : "w-24 h-24",
            )}
          >
            <Image
              src={displaySrc}
              alt={label}
              fill
              className="object-cover"
              unoptimized={displaySrc.startsWith("blob:")} // Handle local previews
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {icon || <ImageIcon className="w-5 h-5 text-primary" />}
            </div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Upload {label.replace(" Image", "")}
            </p>
            {subLabel && (
              <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
