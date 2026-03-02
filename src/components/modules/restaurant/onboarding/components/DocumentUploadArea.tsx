import React, { useRef } from "react";
import { FileText, CheckCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface DocumentUploadAreaProps {
  title: string;
  description: string;
  sub: string;
  file: { name: string } | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  themeColor?: "blue" | "emerald";
}

export const DocumentUploadArea: React.FC<DocumentUploadAreaProps> = ({
  title,
  description,
  sub,
  file,
  onFileChange,
  onRemove,
  themeColor = "blue",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-500",
      pnt: "text-blue-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
      pnt: "text-emerald-700",
    },
  }[themeColor];

  return (
    <div className="border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[320px]">
      <div
        className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-4 ${colors.text}`}
      >
        <FileText className="w-8 h-8" />
      </div>

      <Typography className="font-bold text-gray-900 mb-2">
        {description}
      </Typography>
      <Typography className="text-xs text-gray-400 max-w-[200px] mb-6">
        {sub}
      </Typography>

      {file ? (
        <div
          className={`w-full ${colors.bg} rounded-xl p-3 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <CheckCircle className={`w-5 h-5 ${colors.text} shrink-0`} />
            <span className={`text-sm font-medium ${colors.pnt} truncate`}>
              {file.name}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      )}

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*,.pdf"
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
      />

      <div className="flex gap-2 mt-8">
        {["No glare", "High quality", "Valid expiry"].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
