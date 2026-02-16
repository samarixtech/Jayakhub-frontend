import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "../types";

export function LocationTab({ settings }: { settings: SettingsData | null }) {
  const location = settings?.location;
  const profile = settings?.profile;

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Location & Contact</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Where customers can find you.
        </p>
      </div>

      {/* Address */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          defaultValue={location?.address || ""}
          className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            defaultValue={profile?.phone || ""}
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Email Address
          </Label>
          <Input
            defaultValue={profile?.email || ""}
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Website
        </Label>
        <Input
          placeholder="https://"
          className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Save Location
        </Button>
      </div>
    </div>
  );
}
