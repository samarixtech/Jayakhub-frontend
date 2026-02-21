"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageIcon, X, Upload, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "@/types";
import { useServerAction } from "@/hooks/use-server-action";
import { updateRestaurantProfileAction } from "@/app/actions/restaurant/settings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function ProfileTab({
  settings,
  imageBaseUrl,
}: {
  settings: SettingsData | null;
  imageBaseUrl: string;
}) {
  const router = useRouter();
  const profile = settings?.profile;

  // Form State
  const [name, setName] = useState(profile?.name || "");
  const [description, setDescription] = useState(profile?.description || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl || "");
  const [cuisines, setCuisines] = useState<string[]>(profile?.type || []);
  const [cuisineInput, setCuisineInput] = useState("");

  // File Upload State
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

  // Sync state with props when settings load
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setDescription(profile.description || "");
      setWebsiteUrl(profile.websiteUrl || "");
      setCuisines(profile.type || []);
    }
  }, [profile]);

  // Dirty State Check
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

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Restaurant Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Details visible to customers on your page.
        </p>
      </div>

      {/* Image Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Logo */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Logo
          </Label>
          <div
            onClick={() => profileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-gray-50/50 min-h-[160px] overflow-hidden"
          >
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => handleFileChange(e, "profile")}
            />

            {profileImagePreview || profile?.profileImage ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={
                    profileImagePreview ||
                    `${imageBaseUrl}${profile?.profileImage}`
                  }
                  alt="Logo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  Upload Logo
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Cover Image
          </Label>
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="group relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-gray-50/50 min-h-[160px] overflow-hidden"
          >
            <input
              type="file"
              ref={bannerInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => handleFileChange(e, "banner")}
            />

            {bannerImagePreview || profile?.bannerImage ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={
                    bannerImagePreview ||
                    `${imageBaseUrl}${profile?.bannerImage}`
                  }
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  Upload Cover
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  1200×400px recommended
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Restaurant Name */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Restaurant Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Royal Gourmet"
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>

        {/* Website URL */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Website URL
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="pl-9 h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Description
        </Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe your restaurant, styling, and ambiance..."
          className="border-gray-200 resize-none focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      {/* Cuisines */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Cuisines
        </Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {cuisines.map((cuisine) => (
            <Badge
              key={cuisine}
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1.5 shadow-sm"
            >
              {cuisine}
              <button
                onClick={() => removeCuisine(cuisine)}
                className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/50"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a cuisine (e.g. Kurdish, BBQ)"
            value={cuisineInput}
            onChange={(e) => setCuisineInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCuisine();
              }
            }}
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary flex-1"
          />
          <Button
            type="button"
            onClick={addCuisine}
            className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            ADD
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isDirty}
          className={`
            min-w-[140px] transition-all duration-300
            ${
              !isDirty || isPending
                ? "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            }
          `}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
