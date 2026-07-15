import { useState, useRef, useEffect } from "react";
import { CustomerProfileData } from "@/types";
import { getKycStatus } from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";
import { KycRecord } from "../kyc/useKycVerification";

export function useSidebar(
  profile: CustomerProfileData,
  onAvatarChange: (file: File | null) => void,
) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kycRecords, setKycRecords] = useState<KycRecord[]>([]);

  const { execute: fetchStatus } = useServerAction(getKycStatus, {
    suppressSuccessToast: true,
    onSuccess: (data?: KycRecord[]) => {
      setKycRecords(Array.isArray(data) ? data : []);
    },
  });

  const kycSubmitted = kycRecords.length > 0;
  const hasRejectedKyc = kycRecords.some((d) => d.status === "rejected");

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const avatarSrc =
    preview ||
    profile.avatar ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop";

  return {
    fileInputRef,
    handleFile,
    avatarSrc,
    kycSubmitted,
    hasRejectedKyc,
  };
}
