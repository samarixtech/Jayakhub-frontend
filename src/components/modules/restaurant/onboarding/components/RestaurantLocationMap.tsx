"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Location {
  lat: number;
  lng: number;
}

interface RestaurantLocationMapProps {
  location?: Location;
  onLocationSelect: (loc: Location, address?: string) => void;
  className?: string;
}

const defaultCenter = {
  lat: 40.7128, // Default fallback New York
  lng: -74.006,
};

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

export default function RestaurantLocationMap({
  location,
  onLocationSelect,
  className = "h-[300px] w-full",
}: RestaurantLocationMapProps) {
  const t = useTranslations("Onboarding.locationMap");
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Ensure this is set
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    if (location) {
      setCenter(location);
    }
  }, [location]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getAddressFromCoords = useCallback((lat: number, lng: number) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        return results[0].formatted_address;
      } else {
        console.error("Geocoder failed due to: " + status);
        return undefined;
      }
    });
  }, []);

  const handleLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      const newLoc = { lat, lng };

      // Reverse Geocoding
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newLoc }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address;
            onLocationSelect(newLoc, address);
          } else {
            // Fallback without address
            onLocationSelect(newLoc);
          }
        });
      } else {
        onLocationSelect(newLoc);
      }
    },
    [onLocationSelect],
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleLocationUpdate(e.latLng.lat(), e.latLng.lng());
      }
    },
    [handleLocationUpdate],
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      toast.loading(t("locating"), { id: "locating" });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          handleLocationUpdate(pos.lat, pos.lng);
          map?.panTo(pos);
          toast.success(t("locationFound"), { id: "locating" });
        },
        () => {
          toast.error(t("geoServiceFailed"), {
            id: "locating",
          });
        },
      );
    } else {
      toast.error(t("geoNotSupported"), {
        id: "locating",
      });
    }
  };

  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (loadError) {
    return (
      <div
        className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center p-4 text-center`}
      >
        <div className="text-red-500">
          <p className="font-bold">{t("errorLoadingMaps")}</p>
          <p className="text-sm">{t("checkApiKey")}</p>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div
        className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center p-4 text-center`}
      >
        <div className="text-gray-500">
          <p className="font-bold">{t("mapsUnavailable")}</p>
          <p className="text-sm">{t("apiKeyMissing")}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}
      >
        <div className="animate-pulse flex flex-col items-center">
          <MapPin className="h-8 w-8 text-gray-300 mb-2" />
          <span className="text-gray-400 text-sm">{t("loadingMap")}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className} rounded-2xl overflow-hidden border border-gray-100 shadow-inner`}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {location && <Marker position={location} />}
      </GoogleMap>

      <Button
        type="button"
        size="sm"
        onClick={handleLocateMe}
        className="absolute top-4 right-4 bg-white text-emerald-700 hover:bg-gray-50 shadow-md border border-gray-200 z-10 font-bold gap-2"
      >
        <Crosshair className="h-4 w-4" /> {t("locateMe")}
      </Button>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 shadow-sm border border-gray-100 pointer-events-none">
        {t("clickToPin")}
      </div>
    </div>
  );
}
