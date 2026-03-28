"use client";
import { useTranslations } from "next-intl";
import { X, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "@/types";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { ProfileImageUpload } from "../components/ProfileImageUpload";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ProfileView({
  settings,
  imageBaseUrl,
}: {
  settings: SettingsData | null;
  imageBaseUrl: string;
}) {
  const {
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
  } = useProfileSettings(settings);

  const t = useTranslations("RestaurantDashboard.Settings.profile");

  if (!settings) {
    return <SettingsSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-gray-500">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileImageUpload
            label={t("logo")}
            subLabel={t("logoHint")}
            imagePreview={profileImagePreview}
            existingImage={profile?.profileImage}
            imageBaseUrl={imageBaseUrl}
            inputRef={profileInputRef}
            onChange={(e) => handleFileChange(e, "profile")}
          />

          <ProfileImageUpload
            label={t("cover")}
            subLabel={t("coverHint")}
            imagePreview={bannerImagePreview}
            existingImage={profile?.bannerImage}
            imageBaseUrl={imageBaseUrl}
            inputRef={bannerInputRef}
            onChange={(e) => handleFileChange(e, "banner")}
            isCover
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Restaurant Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground block">
              {t("name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="h-11 bg-background"
            />
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground block">
              {t("website")}
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder={t("websitePlaceholder")}
                className="pl-9 h-11 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground block">
            {t("description")}
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder={t("descriptionPlaceholder")}
            className="resize-none bg-background"
          />
        </div>

        {/* Cuisines */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground block">
            {t("cuisines")}
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
              placeholder={t("cuisinePlaceholder")}
              value={cuisineInput}
              onChange={(e) => setCuisineInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCuisine();
                }
              }}
              className="h-11 bg-background flex-1"
            />
            <Button
              type="button"
              onClick={addCuisine}
              className="h-11 px-6 font-medium"
            >
              {t("addBtn")}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6 border-t border-border mt-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isDirty}
          className={`
            min-w-[140px] transition-all duration-300
          `}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("saving")}
            </>
          ) : (
            t("saveBtn")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
