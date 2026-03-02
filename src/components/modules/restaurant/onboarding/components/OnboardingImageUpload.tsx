import React, { useRef } from "react";
import { ImageIcon, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

interface OnboardingImageUploadProps {
  label: string;
  preview: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  recommendedSize?: string;
  className?: string;
}

export const OnboardingImageUpload: React.FC<OnboardingImageUploadProps> = ({
  label,
  preview,
  onFileChange,
  onRemove,
  recommendedSize = "1200 x 400 px (3:1 ratio)",
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
        {preview ? (
          <>
            <Image
              width={400}
              height={400}
              src={preview}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="rounded-full"
                type="button"
              >
                <X className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">{label}</h3>
            <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-wider">
              {recommendedSize}
            </p>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-white hover:border-gray-300"
              onClick={() => inputRef.current?.click()}
            >
              Choose Image
            </Button>
          </>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-3 px-2">
        <Typography variant="h4" className="font-bold text-gray-800 text-sm">
          Tips for a great cover:
        </Typography>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Show your most popular dishes
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Use natural lighting
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Keep text to a minimum
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <XCircle className="w-4 h-4 text-red-500" />
            Avoid blurry or low-quality images
          </li>
        </ul>
      </div>
    </div>
  );
};
