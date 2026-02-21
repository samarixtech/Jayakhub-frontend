"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  LocateFixed,
  Loader2,
  Check,
  ChevronDown,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getUserAddresses } from "@/app/actions/customer/address";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationSwitcherProps {
  currentAddress: string;
  onAddressChange: (address: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  isLoggedIn?: boolean;
  className?: string;
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
  className,
}) => {
  const router = useRouter();
  const tLocation = useTranslations("location.dropdown");
  const tCountries = useTranslations("countries");
  const isMobile = useIsMobile();

  // State for view mode
  const [view, setView] = useState<"list" | "map">("list");

  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  // State for map selection
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 33.3152,
    lng: 44.3661,
  }); // Default Baghdad
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [tempAddress, setTempAddress] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const params = useParams();

  const getCountryFromUrl = () => {
    const country = (params.country as string)?.toLowerCase();
    if (!country) return "Iraq, Baghdad";
    try {
      const name = tCountries(country);
      if (name === `countries.${country}`) return "Iraq, Baghdad";
      return name;
    } catch {
      return "Iraq, Baghdad";
    }
  };

  // Reset view when popover closes
  useEffect(() => {
    if (!isOpen) {
      setView("list");
      setTempAddress(null);
      setSelectedLocation(null);
    }
  }, [isOpen]);

  const getCurrentLocation = (updateUrl = true) => {
    if (!navigator.geolocation) {
      console.error("LocationSwitcher: Geolocation not supported");
      if (!detectedLocation) onAddressChange(getCountryFromUrl());
      return;
    }

    if (!isLoaded) {
      console.error("LocationSwitcher: Maps API not loaded");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = { lat: latitude, lng: longitude };

        setMapCenter(newPos);
        setSelectedLocation(newPos);

        if (updateUrl) {
          const params = new URLSearchParams(window.location.search);
          params.set("lat", latitude.toString());
          params.set("lng", longitude.toString());
          router.replace(`?${params.toString()}`);
        }

        if (mapRef) {
          mapRef.panTo(newPos);
        }

        if (onLocationChange) {
          onLocationChange(latitude, longitude);
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setDetectedLocation(address);
              setTempAddress(address);
              if (view === "list") {
                onAddressChange(address);
              }
            } else {
              console.error("Geocoder failed: " + status);
              if (!detectedLocation) onAddressChange(getCountryFromUrl());
            }
            setLoading(false);
          },
        );
      },
      (error) => {
        console.error("LocationSwitcher: Geolocation error:", error);
        if (!detectedLocation) onAddressChange(getCountryFromUrl());
        setLoading(false);
      },
    );
  };

  const autoDetectRef = React.useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (isLoaded && !autoDetectRef.current) {
      if (!lat || !lng) {
        console.log("LocationSwitcher: Auto-detecting location...");
        autoDetectRef.current = true;
        getCurrentLocation(true);
      } else {
        autoDetectRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPos = { lat, lng };

      setSelectedLocation(newPos);

      if (window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newPos }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setTempAddress(results[0].formatted_address);
          }
        });
      }
    }
  };

  const confirmLocation = () => {
    if (tempAddress) {
      onAddressChange(tempAddress);
    }
    if (selectedLocation && onLocationChange) {
      onLocationChange(selectedLocation.lat, selectedLocation.lng);
    }
    setIsOpen(false);
  };

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

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchAddresses();
    }
  }, [isOpen, isLoggedIn]);

  const TriggerButton = (
    <Button
      variant="outline"
      className={cn(
        "flex items-center justify-start min-w-[150px] sm:min-w-[180px] max-w-[200px] sm:max-w-sm h-10 bg-white border-none hover:bg-gray-50 text-gray-700 shadow-sm rounded-full gap-2 px-3 sm:px-4",
        className,
      )}
    >
      <MapPin className="w-5 h-5 text-emerald-bg shrink-0" />
      {currentAddress === "Iraq, Baghdad" ? (
        <Skeleton className="h-6 w-60 bg-white/20 rounded-full" />
      ) : (
        <span className="text-sm font-semibold truncate flex-1 text-left">
          {currentAddress}
        </span>
      )}
      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
    </Button>
  );

  const renderContent = () => (
    <>
      {view === "list" ? (
        <div className="flex flex-col h-full max-h-[80vh] sm:max-h-none">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            {isMobile && (
              <SheetHeader className="p-0 text-left mb-2">
                <SheetTitle className="text-sm font-bold text-gray-900">
                  {tLocation("title") || "Delivery Location"}
                </SheetTitle>
              </SheetHeader>
            )}
            {!isMobile && (
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {tLocation("title") || "Delivery Location"}
              </h3>
            )}
            <p className="text-xs text-gray-500">
              Select a saved address or use current location
            </p>
          </div>

          <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar flex-1">
            <Button
              onClick={() => {
                setView("map");
                if (!selectedLocation && !detectedLocation) {
                  getCurrentLocation(true);
                }
              }}
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-10 font-medium"
            >
              <LocateFixed className="w-4 h-4 mr-2" />
              Use Current Location / Map
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
                        if (
                          onLocationChange &&
                          addr.latitude &&
                          addr.longitude
                        ) {
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
                          <span className="font-bold truncate">
                            {addr.label}
                          </span>
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
        </div>
      ) : (
        <div className="flex flex-col h-full h-[80vh] sm:h-auto">
          <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("list")}
              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-bold text-gray-900">Select on Map</h3>
          </div>

          <div
            className={cn(
              "relative flex-1 p-2 bg-gray-100",
              isMobile ? "h-[350px]" : "h-[450px]",
            )}
            style={{
              minHeight: isMobile ? "350px" : "450px",
              height: isMobile ? "350px" : "450px",
            }}
          >
            {loadError ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-red-500 gap-2 p-4 text-center">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-medium">Map failed to load</p>
                <p className="text-xs opacity-75">{loadError.message}</p>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  minHeight: isMobile ? "350px" : "450px",
                  borderRadius: "0.75rem",
                }}
                center={mapCenter}
                zoom={13}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  gestureHandling: "cooperative",
                }}
                onLoad={(map: google.maps.Map) => setMapRef(map)}
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}

            <Button
              size="sm"
              className="absolute top-4 right-4 bg-white text-emerald-700 hover:bg-gray-50 shadow-md border py-0 h-9 px-4 rounded-full z-10"
              onClick={() => getCurrentLocation(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LocateFixed className="w-4 h-4" />
              )}
              <span className="ml-2 text-xs font-bold">Locate Me</span>
            </Button>
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            {tempAddress && (
              <p className="text-xs text-gray-500 mb-2 truncate px-1">
                {tempAddress}
              </p>
            )}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold shadow-emerald-200 shadow-md"
              disabled={!selectedLocation}
              onClick={confirmLocation}
            >
              Confirm Location
            </Button>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="p-0 rounded-t-2xl max-h-[90vh]">
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[450px] p-0 bg-white border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
      >
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
};

export default LocationSwitcher;
