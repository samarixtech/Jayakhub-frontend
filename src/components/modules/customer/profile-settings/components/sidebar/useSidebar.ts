import { useState, useRef } from "react";
import { CustomerProfileData } from "@/types";

export function useSidebar(
  profile: CustomerProfileData,
  onAvatarChange: (file: File | null) => void,
) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };
}
