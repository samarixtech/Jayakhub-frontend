import { useState, useRef, useEffect } from "react";
import {
  uploadKycAction,
  getKycStatus,
} from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";

export interface KycRecord {
  documentType: string;
  status: "pending" | "verified" | "rejected";
  documentFile: string;
}

export function useKycVerification() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kycData, setKycData] = useState<KycRecord[]>([]);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { execute: fetchStatus, isPending: fetching } = useServerAction(
    getKycStatus,
    {
      suppressSuccessToast: true,
      onSuccess: (data?: KycRecord[]) => setKycData(data || []),
    },
  );

  const { execute: uploadFile, isPending: isUploading } = useServerAction(
    uploadKycAction,
    {
      onSuccess: () => {
        resetSelection();
        fetchStatus();
        window.location.reload();
      },
    },
  );

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSelectClick = (typeId: string) => {
    setActiveTypeId(typeId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setActiveTypeId(null);
    }
  };

  const handleFinalUpload = async () => {
    if (!selectedFile || !activeTypeId) return;

    // Read file as base64 on the client so the server action receives
    // a plain string — avoids Next.js Server Action multipart
    // deserialization failures on production hosting environments.
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve(dataUrl.split(",")[1] ?? "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(selectedFile);
    });

    uploadFile({
      documentType: activeTypeId,
      documentFile: base64,
      fileName: selectedFile.name,
      fileType: selectedFile.type || "image/jpeg",
    });
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setActiveTypeId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    kycData,
    activeTypeId,
    selectedFile,
    fetching,
    isUploading,
    handleSelectClick,
    handleFileChange,
    handleFinalUpload,
    resetSelection,
  };
}
