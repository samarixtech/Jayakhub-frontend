"use client";

import { useState, useEffect, useRef } from "react";
import { SettingsData } from "@/types";
import { useServerAction } from "@/hooks/use-server-action";
import { updateRestaurantProfileAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";

export function useProfileSettings(settings: SettingsData | null) {
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
        window.location.reload();
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

  const toCompressedBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const MAX_DIM = 1920;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width >= height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82).split(",")[1] ?? "");
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Restaurant Name is required");
      return;
    }

    let profileImageBase64 = "";
    let profileImageName = "";
    if (profileImageFile) {
      profileImageBase64 = await toCompressedBase64(profileImageFile);
      profileImageName = profileImageFile.name.replace(/\.[^.]+$/, ".jpg");
    }

    let bannerImageBase64 = "";
    let bannerImageName = "";
    if (bannerImageFile) {
      bannerImageBase64 = await toCompressedBase64(bannerImageFile);
      bannerImageName = bannerImageFile.name.replace(/\.[^.]+$/, ".jpg");
    }

    updateProfile({
      name,
      description,
      websiteUrl,
      type: cuisines,
      profileImageBase64,
      profileImageName,
      profileImageType: "image/jpeg",
      bannerImageBase64,
      bannerImageName,
      bannerImageType: "image/jpeg",
    });
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
