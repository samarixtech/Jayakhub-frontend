"use client";
import React, { useState } from "react";
import { MapPin, LocateFixed, Loader2, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface LocationSwitcherProps {
  currentAddress: string;
  onAddressChange: (address: string) => void;
}

const LocationSwitcher: React.FC<LocationSwitcherProps> = ({
  currentAddress,
  onAddressChange,
}) => {
  const tLocation = useTranslations("location.dropdown");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onAddressChange("Geolocation not supported");
      return;
    }

    setLoading(true);
    onAddressChange("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const apiKey = "958d98442a434df9bcf5638fddd9088a";

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`,
          );
          const data = await res.json();

          if (data.results && data.results.length) {
            onAddressChange(data.results[0].formatted);
            setIsOpen(false); // Close on success
          }
        } catch {
          onAddressChange("Error fetching address");
        } finally {
          setLoading(false);
        }
      },
      () => {
        onAddressChange("Location permission denied");
        setLoading(false);
      },
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center w-full h-11 bg-white border-none hover:bg-gray-50 text-gray-700 shadow-sm rounded-full gap-2 px-4"
        >
          <MapPin className="w-5 h-5 text-emerald-bg shrink-0" />
          <span className="text-sm font-semibold truncate max-w-[200px]">
            {currentAddress}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[320px] p-4 bg-white/95 backdrop-blur-xl border-[#E2E8F0] rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">
              {tLocation("title") || "Delivery Location"}
            </h3>
            <p className="text-xs text-gray-500">
              Select a location to see accurate delivery times.
            </p>
          </div>

          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            className="w-full bg-emerald-bg hover:bg-emerald-bg-hover text-white font-bold rounded-xl gap-2 h-10 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            Use Current Location
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={tLocation("placeholder") || "Enter your area..."}
              className="pl-9 border-gray-200 focus:ring-emerald-bg focus:border-emerald-bg rounded-xl h-10"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Active Address
            </p>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              &quot;{currentAddress}&quot;
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSwitcher;
