import React, { useState, useEffect } from "react";
import { MapPin, LocateFixed, Loader2, Check, ChevronDown } from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getUserAddresses } from "@/app/actions/customer/address";
import { cn } from "@/lib/utils";

interface LocationSwitcherProps {
  currentAddress: string;
  onAddressChange: (address: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  isLoggedIn?: boolean;
}

interface Address {
  id: string;
  label: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  latitude: number | string;
  longitude: number | string;
}

const LocationSwitcher: React.FC<LocationSwitcherProps> = ({
  currentAddress,
  onAddressChange,
  onLocationChange,
  isLoggedIn = false,
}) => {
  const tLocation = useTranslations("location.dropdown");
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchAddresses();
    }
  }, [isOpen, isLoggedIn]);

  const fetchAddresses = async () => {
    setFetchingAddresses(true);
    try {
      const response = await getUserAddresses();
      if (response?.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onAddressChange("Geolocation not supported");
      return;
    }

    if (!isLoaded) {
      onAddressChange("Maps API not loaded");
      return;
    }

    setLoading(true);
    // onAddressChange("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setDetectedLocation(address);
              onAddressChange(address);
              // Pass lat/lng to parent
              if (onLocationChange) {
                onLocationChange(latitude, longitude);
              }
            } else {
              console.error("Geocoder failed: " + status);
              onAddressChange("Address not found");
            }
            setLoading(false);
          },
        );
      },
      (error) => {
        console.error("Geolocation error:", error);
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
          className="flex items-center justify-start min-w-[180px] max-w-sm h-11 bg-white border-none hover:bg-gray-50 text-gray-700 shadow-sm rounded-full gap-2 px-4"
        >
          <MapPin className="w-5 h-5 text-emerald-bg shrink-0" />
          <span className="text-sm font-semibold truncate flex-1 text-left">
            {currentAddress}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[360px] p-0 bg-white border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            {tLocation("title") || "Delivery Location"}
          </h3>
          <p className="text-xs text-gray-500">
            Select a saved address or use current location
          </p>
        </div>

        <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            variant="ghost"
            className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-10 font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4 mr-2" />
            )}
            Use Current Location
          </Button>

          {detectedLocation && (
            <>
              <div className="my-2 border-t border-gray-100" />
              <div className="space-y-1">
                <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">
                  Detected Location
                </p>
                <button
                  onClick={() => {
                    onAddressChange(detectedLocation);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-sm transition-all flex items-start gap-3 group",
                    currentAddress === detectedLocation
                      ? "bg-emerald-50 text-emerald-900"
                      : "hover:bg-gray-50 text-gray-700",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      currentAddress === detectedLocation
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500",
                    )}
                  >
                    <LocateFixed className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate">
                        Current Location
                      </span>
                      {currentAddress === detectedLocation && (
                        <Check className="w-4 h-4 text-emerald-600 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {detectedLocation}
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}

          <div className="my-2 border-t border-gray-100" />

          {fetchingAddresses ? (
            <div className="space-y-2 p-2">
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">
                Saved Addresses
              </p>
              {addresses.map((addr) => {
                const fullAddress = `${addr.streetAddress}, ${addr.city}`;
                const isActive = currentAddress === fullAddress;

                return (
                  <button
                    key={addr.id}
                    onClick={() => {
                      onAddressChange(fullAddress);
                      if (onLocationChange && addr.latitude && addr.longitude) {
                        onLocationChange(
                          Number(addr.latitude),
                          Number(addr.longitude),
                        );
                      }
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl text-sm transition-all flex items-start gap-3 group",
                      isActive
                        ? "bg-emerald-50 text-emerald-900"
                        : "hover:bg-gray-50 text-gray-700",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isActive
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500",
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate">{addr.label}</span>
                        {isActive && (
                          <Check className="w-4 h-4 text-emerald-600 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {fullAddress}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No saved addresses found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSwitcher;
