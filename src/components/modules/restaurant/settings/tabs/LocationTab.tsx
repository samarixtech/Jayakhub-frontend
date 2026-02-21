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

export function LocationTab({ settings }: { settings: SettingsData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const profile = settings?.profile;
  const updateStatus = settings?.onboardingUpdate?.location || "none";
  const isPending = updateStatus === "pending";

  // Initialize state from settings
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
        phone: profile.phone, // Assuming phone is not editable here or taken from profile
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
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Location & Contact</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Where customers can find you.
        </p>
      </div>

      {isPending && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
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
        className={`mb-8 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      >
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
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
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            defaultValue={profile?.phone || ""}
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
            disabled={isPending} // Although pointer-events-none handles it, good for accessibility
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Email Address
          </Label>
          <Input
            defaultValue={profile?.restaurantEmail || ""}
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
            disabled
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/90"
          disabled={loading || isPending}
          onClick={handeSave}
        >
          {loading ? "Saving..." : "Save Location"}
        </Button>
      </div>
    </div>
  );
}
