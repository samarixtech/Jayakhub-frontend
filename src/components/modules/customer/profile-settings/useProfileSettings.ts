import { useState, useEffect, useTransition, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  getProfile,
  updateProfileAction,
} from "@/app/actions/customer/userprofile";
import { CustomerProfileData } from "@/types";

export function useProfileSettings() {
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [initialProfile, setInitialProfile] =
    useState<CustomerProfileData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeView, setActiveView] = useState<"profile" | "notifications">(
    "profile",
  );

  useEffect(() => {
    async function loadData() {
      const result = await getProfile();
      if (result.success) {
        const formattedProfile = {
          ...result.data,
          phone: result.data.phone
            ? result.data.phone.toString().startsWith("+")
              ? result.data.phone.toString()
              : `+${result.data.phone.toString()}`
            : "",
        };
        setProfile(formattedProfile);
        setInitialProfile(formattedProfile);
      }
    }
    loadData();
  }, []);

  const hasChanges = useMemo(() => {
    if (!profile || !initialProfile) return false;

    const fieldsChanged =
      profile.name !== initialProfile.name ||
      profile.lastName !== initialProfile.lastName ||
      profile.phone !== initialProfile.phone;

    return fieldsChanged || avatarFile !== null;
  }, [profile, initialProfile, avatarFile]);

  const handleCancel = () => {
    setProfile(initialProfile);
    setAvatarFile(null);
  };

  const updateProfile = (data: Partial<CustomerProfileData>) => {
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const handleSave = async () => {
    if (!profile) return;

    let avatarBase64: string | undefined;
    if (avatarFile) {
      avatarBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(avatarFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    }

    startTransition(async () => {
      const result = await updateProfileAction({
        name: profile.name,
        lastName: profile.lastName || undefined,
        phone: profile.phone.replace(/\D/g, "") || undefined,
        avatarBase64,
        avatarName: avatarFile?.name,
      });
      if (result.success) {
        toast.success("Profile updated!");
        // Force full page reload to update all UI elements globally
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

  return {
    isPending,
    profile,
    avatarFile,
    setAvatarFile,
    hasChanges,
    handleSave,
    handleCancel,
    updateProfile,
    activeView,
    setActiveView,
  };
}
