"use client";

import { useState, useEffect, useRef } from "react";
import { SettingsData } from "@/types";
import { useServerAction } from "@/hooks/use-server-action";
import { updateRestaurantProfileAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useProfileSettings(settings: SettingsData | null) {
  const router = useRouter();
  const profile = settings?.profile;
  const [name, setName] = useState(profile?.name || "");
  const [description, setDescription] = useState(profile?.description || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl || "");
  const [cuisines, setCuisines] = useState<string[]>(profile?.type || []);
  const [cuisineInput, setCuisineInput] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null,
  );

  const [isDirty, setIsDirty] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setDescription(profile.description || "");
      setWebsiteUrl(profile.websiteUrl || "");
      setCuisines(profile.type || []);
    }
  }, [profile]);

  // State Check
  useEffect(() => {
    if (!profile) return;

    // Normalize values for comparison (handle null/undefined)
    const currentName = name.trim();
    const initialName = (profile.name || "").trim();
    const isNameChanged = currentName !== initialName;

    const currentDesc = description.trim();
    const initialDesc = (profile.description || "").trim();
    const isDescriptionChanged = currentDesc !== initialDesc;

    const currentUrl = websiteUrl.trim();
    const initialUrl = (profile.websiteUrl || "").trim();
    const isWebsiteUrlChanged = currentUrl !== initialUrl;

    // Array comparison for cuisines
    const currentCuisines = [...cuisines].sort();
    const initialCuisines = [...(profile.type || [])].sort();
    const isCuisinesChanged =
      currentCuisines.length !== initialCuisines.length ||
      !currentCuisines.every((val, index) => val === initialCuisines[index]);

    const isFileSelected = !!profileImageFile || !!bannerImageFile;

    setIsDirty(
      isNameChanged ||
        isDescriptionChanged ||
        isWebsiteUrlChanged ||
        isCuisinesChanged ||
        isFileSelected,
    );
  }, [
    name,
    description,
    websiteUrl,
    cuisines,
    profileImageFile,
    bannerImageFile,
    profile,
  ]);

  const { execute: updateProfile, isPending } = useServerAction(
    updateRestaurantProfileAction,
    {
      onSuccess: () => {
        // Clear file selections on success
        setProfileImageFile(null);
        setBannerImageFile(null);
        router.refresh();
      },
      onError: (err: any) => {
        const message =
          err?.message ||
          (typeof err === "string" ? err : "Failed to update profile");
        toast.error(message);
      },
    },
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileImageFile(file);
      setProfileImagePreview(previewUrl);
    } else {
      setBannerImageFile(file);
      setBannerImagePreview(previewUrl);
    }
  };

  const addCuisine = () => {
    const trimmed = cuisineInput.trim();
    if (trimmed && !cuisines.includes(trimmed)) {
      setCuisines([...cuisines, trimmed]);
      setCuisineInput("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    setCuisines(cuisines.filter((c) => c !== cuisine));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Restaurant Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("websiteUrl", websiteUrl);

    // Append cuisines
    cuisines.forEach((cuisine) => {
      formData.append("type", cuisine);
    });

    if (profileImageFile) {
      formData.append("profile", profileImageFile);
    }

    if (bannerImageFile) {
      formData.append("banner", bannerImageFile);
    }

    updateProfile(formData);
  };

  return {
    name,
    setName,
    description,
    setDescription,
    websiteUrl,
    setWebsiteUrl,
    cuisines,
    cuisineInput,
    setCuisineInput,
    addCuisine,
    removeCuisine,
    profileImagePreview,
    bannerImagePreview,
    profileInputRef,
    bannerInputRef,
    handleFileChange,
    isDirty,
    isPending,
    handleSubmit,
    profile,
  };
}
