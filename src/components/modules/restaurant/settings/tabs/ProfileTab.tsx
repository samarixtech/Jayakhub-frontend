import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "../types";

export function ProfileTab({
  settings,
  imageBaseUrl,
}: {
  settings: SettingsData | null;
  imageBaseUrl: string;
}) {
  const profile = settings?.profile;
  const [cuisines, setCuisines] = useState<string[]>(profile?.type || []);
  const [cuisineInput, setCuisineInput] = useState("");

  useEffect(() => {
    if (profile?.type) setCuisines(profile.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.type]);

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

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Restaurant Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Details visible to customers on your page.
        </p>
      </div>

      {/* Image Upload Areas */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Logo */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Logo
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer bg-gray-50/50 min-h-[140px]">
            {profile?.profileImage ? (
              <Image
                src={`${imageBaseUrl}${profile.profileImage}`}
                alt="Logo"
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-600">Upload Logo</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG up to 2MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Cover Image
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer bg-gray-50/50 min-h-[140px]">
            {profile?.bannerImage ? (
              <Image
                src={`${imageBaseUrl}${profile.bannerImage}`}
                alt="Cover"
                width={200}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Upload Cover
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  1200×400px recommended
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Name */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Restaurant Name <span className="text-red-500">*</span>
        </Label>
        <Input
          defaultValue={profile?.name || ""}
          className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Description
        </Label>
        <Textarea
          defaultValue={profile?.description || ""}
          rows={4}
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
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1.5"
            >
              {cuisine}
              <button
                onClick={() => removeCuisine(cuisine)}
                className="hover:text-red-500 transition-colors"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
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
          className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
      </div>
    </div>
  );
}
