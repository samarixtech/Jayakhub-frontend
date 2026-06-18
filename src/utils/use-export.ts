"use client";
import { useState } from "react";
import { getAuthToken } from "@/actions/ServerAction";
import { downloadFile } from "@/utils/handle-export";
import { toast } from "react-hot-toast";

interface UseExportOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useExport(options: UseExportOptions = {}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (
    endpoint: string,
    filename: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ) => {
    try {
      setIsExporting(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return false;
      }

      let finalEndpoint = endpoint;
      if (params) {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            urlParams.set(key, String(val));
          }
        });
        const qs = urlParams.toString();
        if (qs) {
          const separator = endpoint.includes("?") ? "&" : "?";
          finalEndpoint = `${endpoint}${separator}${qs}`;
        }
      }

      await downloadFile(finalEndpoint, token, filename);
      toast.success(options.successMessage || "Export completed successfully!");
      return true;
    } catch (error) {
      console.error("Export failed:", error);
      const fallbackMsg = options.errorMessage || "Failed to export. Please try again.";
      toast.error(error instanceof Error ? error.message : fallbackMsg);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
}
