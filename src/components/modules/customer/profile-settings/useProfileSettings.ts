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
        setProfile(result.data);
        setInitialProfile(result.data);
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

  const handleSave = async () => {
    if (!profile) return;
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("lastName", profile.lastName || "");
    formData.append("phone", profile.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Profile updated!");
        setProfile(result.data.user);
        setInitialProfile(result.data.user);
        setAvatarFile(null);
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
    activeView,
    setActiveView,
  };
}
