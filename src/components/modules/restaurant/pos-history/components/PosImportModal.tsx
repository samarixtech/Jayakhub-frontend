"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  downloadPosOrdersTemplateAction,
  validatePosOrdersImportAction,
  commitPosOrdersImportAction,
} from "@/app/actions/restaurant/pos";

interface PosImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

interface ValidationData {
  totalRowsProcessed?: number;
  totalOrdersCreated?: number;
  totalRevenueImported?: number;
  dateRange?: {
    earliest?: string;
    latest?: string;
  };
  successCount?: number;
  failureCount?: number;
  errors?: Array<{ row?: number; message: string }>;
}

export default function PosImportModal({
  open,
  onOpenChange,
  onImportSuccess,
}: PosImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationData | null>(null);

  const resetState = () => {
    setFile(null);
    setIsValidating(false);
    setIsCommitting(false);
    setValidationResult(null);
  };

  const handleModalClose = (val: boolean) => {
    if (!val) resetState();
    onOpenChange(val);
  };

  const handleDownloadTemplate = async (format: "xlsx" | "csv" = "xlsx") => {
    setIsDownloadingTemplate(true);
    try {
      toast.loading(`Downloading ${format.toUpperCase()} template...`, { id: "template-download" });
      const res = await downloadPosOrdersTemplateAction(format, "line-items");
      if (res.success && res.data) {
        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: res.contentType || "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.filename || `pos-orders-template.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Template downloaded successfully!", { id: "template-download" });
      } else {
        toast.error(res.message || "Failed to download template", { id: "template-download" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to download template", { id: "template-download" });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidationResult(null);
    setIsValidating(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await validatePosOrdersImportAction(formData);
      if (res.success && res.data) {
        setValidationResult(res.data);
        toast.success("File extracted & validated successfully!");
      } else {
        toast.error(res.message || "Extraction failed. Please check the file format.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during extraction.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleCommitImport = async () => {
    if (!file) return;

    setIsCommitting(true);
    try {
      toast.loading("Importing orders into database...", { id: "commit-import" });
      const formData = new FormData();
      formData.append("file", file);

      const res = await commitPosOrdersImportAction(formData, false, true);
      if (res.success) {
        toast.success(
          res.message || `Successfully imported ${res.data?.totalOrdersCreated || 0} POS orders!`,
          { id: "commit-import" }
        );
        handleModalClose(false);
        if (onImportSuccess) onImportSuccess();
      } else {
        toast.error(res.message || "Import commit failed", { id: "commit-import" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Import commit error", { id: "commit-import" });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl border border-gray-100 shadow-2xl"
      >
        {/* Header with Top Right Template Download */}
        <DialogHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between gap-4 bg-gray-50/50 space-y-0">
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#FF6B35] shrink-0" />
              <span>Import POS Orders</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 mt-0.5">
              Upload historical POS orders (.csv, .xlsx, .json) safely.
            </DialogDescription>
          </div>

          {/* Top Right Template Download Link */}
          <div className="flex items-center gap-2 shrink-0 pr-6">
            <button
              onClick={() => handleDownloadTemplate("csv")}
              disabled={isDownloadingTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[12px] font-semibold text-gray-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              title="Download CSV Template"
            >
              {isDownloadingTemplate ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
              )}
              <span className="whitespace-nowrap">Template (.csv)</span>
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* File Upload Zone */}
          {!file && (
            <div className="relative border-2 border-dashed border-gray-200 hover:border-[#FF6B35]/50 rounded-2xl p-8 text-center bg-gray-50/30 hover:bg-[#FFF8F0]/30 transition-all group">
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] text-[#FF6B35] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">
                Click to upload or drag & drop file
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Supports CSV, Excel (.xlsx, .xls), or JSON (Max 20MB)
              </p>
            </div>
          )}

          {/* Extracting Loader State */}
          {isValidating && (
            <div className="border border-amber-100 bg-amber-50/40 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Extracting & Validating File...</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calculating order totals, line items, and schema compliance.
                </p>
              </div>
            </div>
          )}

          {/* Selected File & Extraction Results */}
          {file && !isValidating && (
            <div className="space-y-4">
              {/* Selected File Badge */}
              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 truncate max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetState}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                  title="Remove File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Extraction Summary Preview */}
              {validationResult && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Extraction Summary
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-1">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>Rows</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        {validationResult.totalRowsProcessed ?? "--"}
                      </p>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Orders</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        {validationResult.totalOrdersCreated ?? "--"}
                      </p>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Revenue</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        ${validationResult.totalRevenueImported?.toFixed(2) ?? "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Errors / Warnings list */}
                  {validationResult.errors && validationResult.errors.length > 0 && (
                    <div className="p-3.5 border border-red-200 bg-red-50/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Validation Warnings ({validationResult.errors.length})</span>
                      </div>
                      <ul className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto pl-5 list-disc">
                        {validationResult.errors.map((err, idx) => (
                          <li key={idx}>
                            {err.row ? `Row ${err.row}: ` : ""}
                            {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-row items-center justify-end gap-3">
          <button
            onClick={() => handleModalClose(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            Cancel
          </button>

          {file && !isValidating && (
            <button
              onClick={handleCommitImport}
              disabled={isCommitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isCommitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing Orders...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Import</span>
                </>
              )}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
