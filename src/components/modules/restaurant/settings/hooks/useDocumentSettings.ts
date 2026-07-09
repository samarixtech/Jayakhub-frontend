"use client";

import { useState } from "react";
import { SettingsData } from "@/types";
import { updateKycAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useDocumentSettings(settings: SettingsData | null) {
  const router = useRouter();
  const kyc = settings?.kyc || [];
  const updateStatus = settings?.onboardingUpdate?.kyc || "none";
  const isPending = updateStatus === "pending";

  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState("government_id");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", docType);
    formData.append("documentFile", file);

    try {
      const response = await updateKycAction(formData);
      if (response.success) {
        toast.success(response.message || "Document uploaded successfully.");
        setFile(null);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to upload document.");
      }
    } catch (error) {
      console.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (documentFile: string) => {
    window.open(documentFile, "_blank");
  };

  return {
    kyc,
    isPending,
    loading,
    docType,
    setDocType,
    file,
    handleFileChange,
    handleUpload,
    openDocument,
  };
}
