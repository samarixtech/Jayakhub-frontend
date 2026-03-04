import React from "react";
import { ArrowLeft, Download, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface StepBulkImportProps {
  onBack: () => void;
  onDownloadTemplate: () => void;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInputClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StepBulkImport: React.FC<StepBulkImportProps> = ({
  onBack,
  onDownloadTemplate,
  dragActive,
  onDrag,
  onDrop,
  onFileInputClick,
  inputRef,
  onFileChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between -mt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 px-0 -ml-2 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          variant="ghost"
          className="text-emerald-bg hover:text-emerald-bg-hover gap-2 font-medium"
          onClick={onDownloadTemplate}
        >
          <Download className="w-4 h-4" />
          Template
        </Button>
      </div>

      <div
        className={`
          border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors min-h-[300px] cursor-pointer
          ${dragActive ? "border-emerald-bg bg-emerald-50/50" : "border-gray-200 bg-gray-50/50 hover:border-emerald-bg"}
        `}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={onFileInputClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={onFileChange}
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
  );
};
