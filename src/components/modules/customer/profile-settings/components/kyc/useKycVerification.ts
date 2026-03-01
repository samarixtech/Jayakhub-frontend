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
      onSuccess: (data: any) => setKycData(data),
    },
  );

  const { execute: uploadFile, isPending: isUploading } = useServerAction(
    uploadKycAction,
    {
      onSuccess: () => {
        resetSelection();
        fetchStatus();
      },
    },
  );

  useEffect(() => {
    fetchStatus();
  }, []);

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
    const formData = new FormData();
    formData.append("documentType", activeTypeId);
    formData.append("documentFile", selectedFile);
    uploadFile(formData);
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
