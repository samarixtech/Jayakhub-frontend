"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import LocationPicker from "@/components/common/LocationPicker";
import { PhoneInput } from "@/components/ui/phone-input";

import { updateLocationAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function LocationView({ settings }: { settings: SettingsData | null }) {
  const t = useTranslations("RestaurantDashboard.Settings.location");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const profile = settings?.profile;
  const updateStatus = settings?.onboardingUpdate?.location || "none";
  const isPending = updateStatus === "pending";

  const [phone, setPhone] = useState(profile?.phone || "");

  // State from settings
  const [locationData, setLocationData] = useState({
    address: settings?.location?.address || "",
    latitude: parseFloat(settings?.location?.latitude || "0"),
    longitude: parseFloat(settings?.location?.longitude || "0"),
    city: "",
    country: settings?.location?.country || "",
  });

  const handleLocationChange = (loc: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    country?: string;
  }) => {
    setLocationData((prev) => ({
      ...prev,
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address,
      city: loc.city || prev.city,
      country: loc.country || prev.country,
    }));
  };

  const handeSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const response = await updateLocationAction({
        address: locationData.address,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        phone,
      });

      if (response.success) {
        toast.success(response.message || t("successMsg"));
        router.refresh();
      } else {
        toast.error(response.message || t("errorMsg"));
      }
    } catch (error) {
      toast.error(t("unexpectedErr"));
    } finally {
      setLoading(false);
    }
  };

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
      <CardContent className="space-y-8">

        {/* Location Picker (Map + Address) */}
        <div
          className={`space-y-3`}
        >
          <Label className="text-sm font-medium text-foreground block">
            {t("restaurantLocation")} <span className="text-red-500">*</span>
          </Label>

          <LocationPicker
            initialAddress={locationData.address}
            initialLocation={{
              lat: locationData.latitude,
              lng: locationData.longitude,
            }}
            onLocationChange={handleLocationChange}
            className="w-full"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className={
              "space-y-1.5"
            }
          >
            <Label className="text-sm font-medium text-foreground block">
              {t("phone")} <span className="text-red-500">*</span>
            </Label>
            <PhoneInput
              value={phone}
              onChange={(val) => setPhone(val || "")}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground block">
              {t("email")}
            </Label>
            <Input
              defaultValue={profile?.restaurantEmail || ""}
              className="bg-background"
              disabled
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border pt-6 mt-2">
        <Button disabled={loading} onClick={handeSave}>
          {loading ? t("saving") : t("saveBtn")}
        </Button>
      </CardFooter>
    </Card>
  );
}
