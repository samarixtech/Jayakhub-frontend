"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import LocationPicker from "@/components/common/LocationPicker";

import { updateLocationAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function LocationView({ settings }: { settings: SettingsData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const profile = settings?.profile;
  const updateStatus = settings?.onboardingUpdate?.location || "none";
  const isPending = updateStatus === "pending";

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
        phone: profile.phone,
      });

      if (response.success) {
        toast.success(response.message || "Location update request submitted.");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update location.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Location & Contact</CardTitle>
        <CardDescription className="text-gray-500">
          Where customers can find your restaurant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {isPending && (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">
              Update Pending
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              YOUR CHANGES ARE SUBMITTED, WE ARE REVIEWING IT AND WILL APPROVE
              SHORTLY.
            </AlertDescription>
          </Alert>
        )}

        {/* Location Picker (Map + Address) */}
        <div
          className={`space-y-3 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
        >
          <Label className="text-sm font-medium text-foreground block">
            Restaurant Location <span className="text-red-500">*</span>
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
              isPending ? "opacity-60 pointer-events-none" : "space-y-1.5"
            }
          >
            <Label className="text-sm font-medium text-foreground block">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              defaultValue={profile?.phone || ""}
              className="bg-background"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground block">
              Email Address
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
        <Button disabled={loading || isPending} onClick={handeSave}>
          {loading ? "Saving..." : "Save Location"}
        </Button>
      </CardFooter>
    </Card>
  );
}
