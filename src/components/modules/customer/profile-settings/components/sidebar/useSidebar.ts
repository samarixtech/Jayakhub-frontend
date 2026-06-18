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
  const [kycSubmitted, setKycSubmitted] = useState<boolean | null>(null);

  const { execute: fetchStatus } = useServerAction(getKycStatus, {
    suppressSuccessToast: true,
    onSuccess: (data?: KycRecord[]) => {
      setKycSubmitted(Array.isArray(data) && data.length > 0);
    },
  });

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
    (profile.avatar
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${profile.avatar}`
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop");

  return {
    fileInputRef,
    handleFile,
    avatarSrc,
    kycSubmitted,
  };
}
